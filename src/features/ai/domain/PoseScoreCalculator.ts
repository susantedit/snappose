/**
 * PoseScoreCalculator — pure TypeScript port of PoseMatcher.kt.
 *
 * Computes a 0–100 pose similarity score between user landmarks and a
 * reference skeleton using weighted angular distances across 7 body regions.
 *
 * Zero external dependencies — runs in Node (tests) and on-device identically.
 *
 * [Req 11, 47.3]
 */

import type { NormalisedLandmarks, PoseScore, GuidanceCue, Landmark, PoseLandmarks } from '../types';
import type { PoseMatchResult, ReferencePoseKey, RegionScores } from './types';
import type { ScoreCalculator } from './interfaces/ScoreCalculator';

// ---------------------------------------------------------------------------
// MediaPipe 33-landmark indices
// ---------------------------------------------------------------------------

export const LM = {
  NOSE: 0,
  LEFT_EYE_INNER: 1,
  LEFT_EYE: 2,
  LEFT_EYE_OUTER: 3,
  RIGHT_EYE_INNER: 4,
  RIGHT_EYE: 5,
  RIGHT_EYE_OUTER: 6,
  LEFT_EAR: 7,
  RIGHT_EAR: 8,
  MOUTH_LEFT: 9,
  MOUTH_RIGHT: 10,
  LEFT_SHOULDER: 11,
  RIGHT_SHOULDER: 12,
  LEFT_ELBOW: 13,
  RIGHT_ELBOW: 14,
  LEFT_WRIST: 15,
  RIGHT_WRIST: 16,
  LEFT_PINKY: 17,
  RIGHT_PINKY: 18,
  LEFT_INDEX: 19,
  RIGHT_INDEX: 20,
  LEFT_THUMB: 21,
  RIGHT_THUMB: 22,
  LEFT_HIP: 23,
  RIGHT_HIP: 24,
  LEFT_KNEE: 25,
  RIGHT_KNEE: 26,
  LEFT_ANKLE: 27,
  RIGHT_ANKLE: 28,
  LEFT_HEEL: 29,
  RIGHT_HEEL: 30,
  LEFT_FOOT_INDEX: 31,
  RIGHT_FOOT_INDEX: 32,
} as const;

// ---------------------------------------------------------------------------
// Regional weight configuration [Req 11.2]
// ---------------------------------------------------------------------------

export const REGION_WEIGHTS = {
  shoulders: 15,
  arms: 20,
  hands: 10,
  torso: 20,
  legs: 20,
  head: 10,
  feet: 5,
} as const;

// Validate weights sum to 100 at module load time
const _weightSum = Object.values(REGION_WEIGHTS).reduce((a, b) => a + b, 0);
if (_weightSum !== 100) {
  throw new Error(`Region weights must sum to 100, got ${_weightSum}`);
}

// ---------------------------------------------------------------------------
// Score coercion range (port of Kotlin coerceIn)
// ---------------------------------------------------------------------------

const SCORE_MIN = 0;
const SCORE_MAX = 98;

/** Auto-capture readiness threshold [Req 17.6] */
export const AUTO_CAPTURE_THRESHOLD = 94;

// Re-export for convenience
export type { ReferencePoseKey, PoseMatchResult } from './types';

// ---------------------------------------------------------------------------
// Vector math helpers (pure)
// ---------------------------------------------------------------------------

function vec2(a: Landmark, b: Landmark): [number, number] {
  return [b.x - a.x, b.y - a.y];
}

function dot2(u: [number, number], v: [number, number]): number {
  return u[0] * v[0] + u[1] * v[1];
}

function magnitude2(v: [number, number]): number {
  return Math.sqrt(v[0] * v[0] + v[1] * v[1]);
}

/**
 * Angle in radians between vectors formed by (a→b) and (b→c).
 * Returns 0 if any vector is degenerate (zero-length).
 */
export function angleBetween(a: Landmark, b: Landmark, c: Landmark): number {
  const u = vec2(a, b);
  const v = vec2(b, c);
  const magU = magnitude2(u);
  const magV = magnitude2(v);
  if (magU < 1e-9 || magV < 1e-9) return 0;
  const cosAngle = Math.max(-1, Math.min(1, dot2(u, v) / (magU * magV)));
  return Math.acos(cosAngle);
}

/**
 * Convert angular error (radians) to a 0–100 segment score.
 * Uses a Gaussian decay curve so small natural deviations (0–15°) score well,
 * while large angular errors (45–90°+) drop sharply to prevent false matches.
 */
function angularErrorToScore(errorRad: number): number {
  const normalized = Math.min(errorRad / (Math.PI / 2), 1.0);
  const score = Math.round(100 * Math.exp(-2.8 * normalized * normalized));
  return Math.max(0, Math.min(100, score));
}


/**
 * Average angular error for a list of joint triples.
 * Skips any landmark with visibility < 0.60 (confidence threshold) [Req 10.4].
 */
function regionScore(
  userLm: Landmark[] | readonly Landmark[],
  refLm: Landmark[] | readonly Landmark[],
  triples: [number, number, number][],
): number {
  let total = 0;
  let count = 0;
  for (const [a, b, c] of triples) {
    const uA = userLm[a];
    const uB = userLm[b];
    const uC = userLm[c];
    if (!uA || !uB || !uC) continue;
    // Skip low-confidence landmarks
    if ((uA.visibility ?? 1) < 0.5 || (uB.visibility ?? 1) < 0.5 || (uC.visibility ?? 1) < 0.5) continue;

    // Joint interior angle
    const refAngle = angleBetween(refLm[a], refLm[b], refLm[c]);
    const userAngle = angleBetween(uA, uB, uC);
    const jointError = Math.abs(refAngle - userAngle);
    const jointScore = angularErrorToScore(jointError);

    // Segment orientation angles (a->b and b->c)
    const refOri1 = Math.atan2(refLm[b].y - refLm[a].y, refLm[b].x - refLm[a].x);
    const userOri1 = Math.atan2(uB.y - uA.y, uB.x - uA.x);
    let diff1 = Math.abs(refOri1 - userOri1);
    if (diff1 > Math.PI) diff1 = 2 * Math.PI - diff1;

    const refOri2 = Math.atan2(refLm[c].y - refLm[b].y, refLm[c].x - refLm[b].x);
    const userOri2 = Math.atan2(uC.y - uB.y, uC.x - uB.x);
    let diff2 = Math.abs(refOri2 - userOri2);
    if (diff2 > Math.PI) diff2 = 2 * Math.PI - diff2;

    const oriScore = (angularErrorToScore(diff1) + angularErrorToScore(diff2)) / 2;

    total += 0.5 * jointScore + 0.5 * oriScore;
    count++;
  }
  return count === 0 ? 0 : Math.round(total / count);
}

// ---------------------------------------------------------------------------
// Joint triple definitions per region
// ---------------------------------------------------------------------------

const SHOULDER_TRIPLES: [number, number, number][] = [
  [LM.LEFT_HIP, LM.LEFT_SHOULDER, LM.RIGHT_SHOULDER],
  [LM.RIGHT_HIP, LM.RIGHT_SHOULDER, LM.LEFT_SHOULDER],
  [LM.LEFT_SHOULDER, LM.RIGHT_SHOULDER, LM.RIGHT_HIP],
];

const ARM_TRIPLES: [number, number, number][] = [
  [LM.LEFT_SHOULDER, LM.LEFT_ELBOW, LM.LEFT_WRIST],
  [LM.RIGHT_SHOULDER, LM.RIGHT_ELBOW, LM.RIGHT_WRIST],
  [LM.LEFT_HIP, LM.LEFT_SHOULDER, LM.LEFT_ELBOW],
  [LM.RIGHT_HIP, LM.RIGHT_SHOULDER, LM.RIGHT_ELBOW],
];

const HAND_TRIPLES: [number, number, number][] = [
  [LM.LEFT_ELBOW, LM.LEFT_WRIST, LM.LEFT_INDEX],
  [LM.RIGHT_ELBOW, LM.RIGHT_WRIST, LM.RIGHT_INDEX],
  [LM.LEFT_ELBOW, LM.LEFT_WRIST, LM.LEFT_THUMB],
  [LM.RIGHT_ELBOW, LM.RIGHT_WRIST, LM.RIGHT_THUMB],
];

const TORSO_TRIPLES: [number, number, number][] = [
  [LM.LEFT_SHOULDER, LM.LEFT_HIP, LM.RIGHT_HIP],
  [LM.RIGHT_SHOULDER, LM.RIGHT_HIP, LM.LEFT_HIP],
  [LM.LEFT_SHOULDER, LM.RIGHT_SHOULDER, LM.RIGHT_HIP],
  [LM.LEFT_HIP, LM.RIGHT_HIP, LM.RIGHT_SHOULDER],
];

const LEG_TRIPLES: [number, number, number][] = [
  [LM.LEFT_HIP, LM.LEFT_KNEE, LM.LEFT_ANKLE],
  [LM.RIGHT_HIP, LM.RIGHT_KNEE, LM.RIGHT_ANKLE],
  [LM.LEFT_SHOULDER, LM.LEFT_HIP, LM.LEFT_KNEE],
  [LM.RIGHT_SHOULDER, LM.RIGHT_HIP, LM.RIGHT_KNEE],
];

const HEAD_TRIPLES: [number, number, number][] = [
  [LM.LEFT_SHOULDER, LM.NOSE, LM.RIGHT_SHOULDER],
  [LM.LEFT_EAR, LM.NOSE, LM.RIGHT_EAR],
  [LM.LEFT_SHOULDER, LM.LEFT_EAR, LM.NOSE],
  [LM.RIGHT_SHOULDER, LM.RIGHT_EAR, LM.NOSE],
];

const FEET_TRIPLES: [number, number, number][] = [
  [LM.LEFT_KNEE, LM.LEFT_ANKLE, LM.LEFT_HEEL],
  [LM.RIGHT_KNEE, LM.RIGHT_ANKLE, LM.RIGHT_HEEL],
  [LM.LEFT_ANKLE, LM.LEFT_HEEL, LM.LEFT_FOOT_INDEX],
  [LM.RIGHT_ANKLE, LM.RIGHT_HEEL, LM.RIGHT_FOOT_INDEX],
];

// ---------------------------------------------------------------------------
// computePoseScore — main scoring function
// ---------------------------------------------------------------------------

/**
 * Compute weighted pose match score.
 *
 * @param user - Normalised user landmarks
 * @param reference - Normalised reference pose landmarks
 * @returns PoseScore with total ∈ [0, 100] and per-region breakdown
 *
 * Correctness invariants [Req 11]:
 *   - total ∈ [0, 100] always
 *   - when user === reference (within fp tolerance), total ≥ 95
 *   - when no user or wrong pose, score accurately reflects divergence (0..40)
 */
export function computePoseScore(
  user: NormalisedLandmarks | PoseLandmarks | Landmark[],
  reference: NormalisedLandmarks | PoseLandmarks | Landmark[] | ReferencePoseKey,
): PoseScore & PoseMatchResult & { overallScore: number; regionalScores: RegionScores; primaryGuidanceCue: string | null } {
  const uLm = Array.isArray(user) ? user : user.landmarks;
  const rObj = typeof reference === 'string' ? getReferenceSkeletonForKey(reference as ReferencePoseKey) : reference;
  const rLm = Array.isArray(rObj) ? rObj : rObj.landmarks;

  if (!uLm || uLm.length < 33 || !rLm || rLm.length < 33) {
    const zeroRegional: RegionScores = { shoulders: 0, arms: 0, hands: 0, torso: 0, legs: 0, head: 0, feet: 0 };
    return {
      total: 0,
      score: 0,
      overallScore: 0,
      regional: zeroRegional,
      regionScores: zeroRegional,
      regionalScores: zeroRegional,
      guidanceCue: 'Step into the frame',
      primaryGuidanceCue: 'Step into the frame',
      isAutoCaptureReady: false,
    };
  }

  // Validate presence of core body joints
  const visibleCount = uLm.filter((lm) => (lm.visibility ?? 1) >= 0.5).length;
  if (visibleCount < 12) {
    const zeroRegional: RegionScores = { shoulders: 0, arms: 0, hands: 0, torso: 0, legs: 0, head: 0, feet: 0 };
    return {
      total: 0,
      score: 0,
      overallScore: 0,
      regional: zeroRegional,
      regionScores: zeroRegional,
      regionalScores: zeroRegional,
      guidanceCue: 'Full body not detected',
      primaryGuidanceCue: 'Full body not detected',
      isAutoCaptureReady: false,
    };
  }

  const shoulders = regionScore(uLm, rLm, SHOULDER_TRIPLES);
  const arms = regionScore(uLm, rLm, ARM_TRIPLES);
  const hands = regionScore(uLm, rLm, HAND_TRIPLES);
  const torso = regionScore(uLm, rLm, TORSO_TRIPLES);
  const legs = regionScore(uLm, rLm, LEG_TRIPLES);
  const head = regionScore(uLm, rLm, HEAD_TRIPLES);
  const feet = regionScore(uLm, rLm, FEET_TRIPLES);

  const weighted =
    (shoulders * REGION_WEIGHTS.shoulders +
      arms * REGION_WEIGHTS.arms +
      hands * REGION_WEIGHTS.hands +
      torso * REGION_WEIGHTS.torso +
      legs * REGION_WEIGHTS.legs +
      head * REGION_WEIGHTS.head +
      feet * REGION_WEIGHTS.feet) /
    100;

  // Strict score calculation without artificial inflated minimum
  const total = Math.round(Math.max(SCORE_MIN, Math.min(SCORE_MAX, weighted)));
  const guidanceCue = deriveGuidanceCue(total, user);
  const isAutoCapture = isAutoCaptureReady(total);
  const regional: RegionScores = { shoulders, arms, hands, torso, legs, head, feet };

  return {
    total,
    score: total,
    overallScore: total,
    regional,
    regionScores: regional,
    regionalScores: regional,
    guidanceCue,
    primaryGuidanceCue: guidanceCue,
    isAutoCaptureReady: isAutoCapture,
  };
}

/**
 * Evaluate pose match and return complete PoseMatchResult.
 * Port of PoseMatcher.kt `evaluatePose()`.
 *
 * @param user - Normalised user landmarks
 * @param reference - Normalised reference pose landmarks
 * @returns Complete PoseMatchResult with score, guidance cue, auto-capture readiness, and regional breakdown
 *
 * [Req 11, 47.3]
 */
export function evaluatePose(
  user: NormalisedLandmarks | PoseLandmarks,
  reference: NormalisedLandmarks | PoseLandmarks | ReferencePoseKey,
): PoseMatchResult {
  const result = computePoseScore(user, reference);
  return {
    score: result.score,
    guidanceCue: result.guidanceCue,
    isAutoCaptureReady: result.isAutoCaptureReady,
    regionScores: result.regionScores,
  };
}

// ---------------------------------------------------------------------------
// Guidance cue logic
// ---------------------------------------------------------------------------

/**
 * Derive the single highest-priority guidance cue from score and landmark
 * geometry. Returns null when pose is perfect (score ≥ AUTO_CAPTURE_THRESHOLD).
 *
 * [Req 12.3, Req 13.4]
 */
export function deriveGuidanceCue(
  score: number,
  user: NormalisedLandmarks | PoseLandmarks | Landmark[],
): GuidanceCue | null {
  if (score >= AUTO_CAPTURE_THRESHOLD) return null;

  const lm = Array.isArray(user) ? user : user.landmarks;
  if (!lm || lm.length < 25) return 'Adjusting';

  const leftShoulder = lm[LM.LEFT_SHOULDER];
  const rightShoulder = lm[LM.RIGHT_SHOULDER];
  const leftHip = lm[LM.LEFT_HIP];
  const rightHip = lm[LM.RIGHT_HIP];
  const nose = lm[LM.NOSE];

  if (!leftShoulder || !rightShoulder || !leftHip || !rightHip || !nose) {
    return 'Adjusting';
  }

  // Compute horizontal centre of body (midpoint of hips)
  const hipMidX = (leftHip.x + rightHip.x) / 2;
  const shoulderMidX = (leftShoulder.x + rightShoulder.x) / 2;
  const bodyMidX = (hipMidX + shoulderMidX) / 2;

  // Horizontal offset from frame centre (normalised coords, 0.5 = centre)
  const horizontalOffset = bodyMidX - 0.5;

  // Vertical: check if body top (shoulders) is too low
  const shoulderMidY = (leftShoulder.y + rightShoulder.y) / 2;

  // Shoulder-to-hip distance as scale proxy
  const hipMidY = (leftHip.y + rightHip.y) / 2;
  const bodyHeight = Math.abs(hipMidY - shoulderMidY);

  // ── Priority order ──────────────────────────────────────────────────────
  // 1. Move left/right if body is offset from centre by > 15%
  if (horizontalOffset > 0.15) return 'Move Right';
  if (horizontalOffset < -0.15) return 'Move Left';

  // 2. Distance: too close (body height > 80% of frame) or too far (< 25%)
  if (bodyHeight > 0.80) return 'Move Back';
  if (bodyHeight < 0.25) return 'Move Closer';

  // 3. Body not upright: shoulder mid Y should be above hip mid Y
  if (shoulderMidY > hipMidY + 0.05) return 'Straighten Up';

  // 4. Head/eye direction — if nose is significantly off-centre
  if (nose.visibility >= 0.6 && Math.abs(nose.x - 0.5) > 0.20) {
    return 'Look toward the camera.';
  }

  // 5. Generic adjusting prompt
  return 'Adjusting';
}

// ---------------------------------------------------------------------------
// isAutoCaptureReady
// ---------------------------------------------------------------------------

/**
 * Returns true when score meets the auto-capture threshold.
 * Mirrors Kotlin `isAutoCaptureReady` boolean property.
 * [Req 17.1, Req 11]
 */
export function isAutoCaptureReady(score: number, threshold = AUTO_CAPTURE_THRESHOLD): boolean {
  return score >= threshold;
}

// ---------------------------------------------------------------------------
// Reference skeleton factory
// ---------------------------------------------------------------------------

export type BuiltReferenceSkeleton = PoseLandmarks & {
  landmarks: PoseLandmarks;
  referenceScale: number;
};

/**
 * Build a plausible normalised reference skeleton for the given pose key.
 * Coordinates are normalised (0–1 range, body-centred).
 *
 * These are design-time approximations that will be replaced by real
 * landmark JSON loaded from downloaded pose packs (Task 29/33).
 */
export function getReferenceSkeletonForKey(key: ReferencePoseKey): BuiltReferenceSkeleton {
  switch (key) {
    case 'OVER_SHOULDER':
      return buildOverShoulderSkeleton();
    case 'WALKING_CASUAL':
      return buildWalkingCasualSkeleton();
    case 'SEATED_CAFE':
      return buildSeatedCafeSkeleton();
    case 'MIRROR_SELFIE':
      return buildMirrorSelfieSkeleton();
    case 'COUPLE_EMBRACE':
      return buildCoupleEmbraceSkeleton();
    default:
      return buildStandingNeutralSkeleton();
  }
}

// ---------------------------------------------------------------------------
// Private skeleton builders
// ---------------------------------------------------------------------------

/** Create a Landmark with default full visibility. */
function lm(x: number, y: number, z = 0, visibility = 1.0): Landmark {
  return { x, y, z, visibility };
}

function makeSkeleton(landmarks: Landmark[], referenceScale = 0.33): BuiltReferenceSkeleton {
  const arr = [...landmarks] as BuiltReferenceSkeleton;
  arr.landmarks = arr as unknown as PoseLandmarks;
  arr.referenceScale = referenceScale;
  return arr;
}

/** Standing-neutral T-pose as a starting template. */
function buildStandingNeutralSkeleton(): BuiltReferenceSkeleton {
  const landmarks: Landmark[] = [
    /* 0  NOSE             */ lm(0.50, 0.08),
    /* 1  LEFT_EYE_INNER   */ lm(0.47, 0.06),
    /* 2  LEFT_EYE         */ lm(0.45, 0.06),
    /* 3  LEFT_EYE_OUTER   */ lm(0.43, 0.06),
    /* 4  RIGHT_EYE_INNER  */ lm(0.53, 0.06),
    /* 5  RIGHT_EYE        */ lm(0.55, 0.06),
    /* 6  RIGHT_EYE_OUTER  */ lm(0.57, 0.06),
    /* 7  LEFT_EAR         */ lm(0.41, 0.07),
    /* 8  RIGHT_EAR        */ lm(0.59, 0.07),
    /* 9  MOUTH_LEFT       */ lm(0.47, 0.10),
    /* 10 MOUTH_RIGHT      */ lm(0.53, 0.10),
    /* 11 LEFT_SHOULDER    */ lm(0.38, 0.22),
    /* 12 RIGHT_SHOULDER   */ lm(0.62, 0.22),
    /* 13 LEFT_ELBOW       */ lm(0.25, 0.38),
    /* 14 RIGHT_ELBOW      */ lm(0.75, 0.38),
    /* 15 LEFT_WRIST       */ lm(0.15, 0.52),
    /* 16 RIGHT_WRIST      */ lm(0.85, 0.52),
    /* 17 LEFT_PINKY       */ lm(0.13, 0.55),
    /* 18 RIGHT_PINKY      */ lm(0.87, 0.55),
    /* 19 LEFT_INDEX       */ lm(0.12, 0.54),
    /* 20 RIGHT_INDEX      */ lm(0.88, 0.54),
    /* 21 LEFT_THUMB       */ lm(0.14, 0.53),
    /* 22 RIGHT_THUMB      */ lm(0.86, 0.53),
    /* 23 LEFT_HIP         */ lm(0.42, 0.55),
    /* 24 RIGHT_HIP        */ lm(0.58, 0.55),
    /* 25 LEFT_KNEE        */ lm(0.41, 0.73),
    /* 26 RIGHT_KNEE       */ lm(0.59, 0.73),
    /* 27 LEFT_ANKLE       */ lm(0.41, 0.88),
    /* 28 RIGHT_ANKLE      */ lm(0.59, 0.88),
    /* 29 LEFT_HEEL        */ lm(0.40, 0.90),
    /* 30 RIGHT_HEEL       */ lm(0.60, 0.90),
    /* 31 LEFT_FOOT_INDEX  */ lm(0.39, 0.93),
    /* 32 RIGHT_FOOT_INDEX */ lm(0.61, 0.93),
  ] as Landmark[];
  return makeSkeleton(landmarks, 0.33);
}

/** Over-shoulder glance: torso slightly turned, head turned to look back. */
function buildOverShoulderSkeleton(): BuiltReferenceSkeleton {
  const base = buildStandingNeutralSkeleton();
  const lms = [...base];
  // Turn torso slightly right → shift left shoulder forward
  lms[LM.LEFT_SHOULDER] = lm(0.42, 0.22);
  lms[LM.RIGHT_SHOULDER] = lm(0.64, 0.22);
  // Turn head left (nose points slightly left)
  lms[LM.NOSE] = lm(0.43, 0.08);
  // Arms slightly bent downward at sides
  lms[LM.LEFT_ELBOW] = lm(0.30, 0.40);
  lms[LM.RIGHT_ELBOW] = lm(0.72, 0.40);
  lms[LM.LEFT_WRIST] = lm(0.28, 0.56);
  lms[LM.RIGHT_WRIST] = lm(0.74, 0.56);
  return makeSkeleton(lms, 0.33);
}

/** Walking casual: mid-stride, arms swung, slight forward lean. */
function buildWalkingCasualSkeleton(): BuiltReferenceSkeleton {
  const base = buildStandingNeutralSkeleton();
  const lms = [...base];
  // Legs in mid-stride
  lms[LM.LEFT_KNEE] = lm(0.38, 0.70);
  lms[LM.RIGHT_KNEE] = lm(0.61, 0.75);
  lms[LM.LEFT_ANKLE] = lm(0.36, 0.85);
  lms[LM.RIGHT_ANKLE] = lm(0.62, 0.90);
  // Arms swung — left arm forward, right arm back
  lms[LM.LEFT_ELBOW] = lm(0.32, 0.36);
  lms[LM.LEFT_WRIST] = lm(0.30, 0.48);
  lms[LM.RIGHT_ELBOW] = lm(0.70, 0.42);
  lms[LM.RIGHT_WRIST] = lm(0.72, 0.58);
  return makeSkeleton(lms, 0.33);
}

/** Seated cafe: hips high, knees bent at ~90°, torso upright. */
function buildSeatedCafeSkeleton(): BuiltReferenceSkeleton {
  const base = buildStandingNeutralSkeleton();
  const lms = [...base];
  // Seated hips
  lms[LM.LEFT_HIP] = lm(0.42, 0.52);
  lms[LM.RIGHT_HIP] = lm(0.58, 0.52);
  // Knees bent horizontally forward (90° joint angle: thigh horizontal)
  lms[LM.LEFT_KNEE] = lm(0.26, 0.54);
  lms[LM.RIGHT_KNEE] = lm(0.74, 0.54);
  // Ankles dropped vertically below knees
  lms[LM.LEFT_ANKLE] = lm(0.26, 0.80);
  lms[LM.RIGHT_ANKLE] = lm(0.74, 0.80);
  // Arms: one hand on table (wrist low), one on knee
  lms[LM.LEFT_ELBOW] = lm(0.30, 0.38);
  lms[LM.LEFT_WRIST] = lm(0.28, 0.50);
  lms[LM.RIGHT_ELBOW] = lm(0.70, 0.38);
  lms[LM.RIGHT_WRIST] = lm(0.72, 0.50);
  return makeSkeleton(lms, 0.30);
}

/** Mirror selfie: phone arm raised, slight body turn, looking at camera. */
function buildMirrorSelfieSkeleton(): BuiltReferenceSkeleton {
  const base = buildStandingNeutralSkeleton();
  const lms = [...base];
  // Right arm raised and extended for phone
  lms[LM.RIGHT_ELBOW] = lm(0.78, 0.24);
  lms[LM.RIGHT_WRIST] = lm(0.82, 0.14);
  lms[LM.RIGHT_INDEX] = lm(0.84, 0.11);
  // Left arm relaxed at side
  lms[LM.LEFT_ELBOW] = lm(0.30, 0.42);
  lms[LM.LEFT_WRIST] = lm(0.32, 0.56);
  // Slight body turn left
  lms[LM.LEFT_SHOULDER] = lm(0.40, 0.22);
  lms[LM.RIGHT_SHOULDER] = lm(0.63, 0.21);
  return makeSkeleton(lms, 0.33);
}

/** Couple embrace: standing close together, arms around each other. */
function buildCoupleEmbraceSkeleton(): BuiltReferenceSkeleton {
  const base = buildStandingNeutralSkeleton();
  const lms = [...base];
  // Arms wrapped inward
  lms[LM.LEFT_ELBOW] = lm(0.55, 0.34);
  lms[LM.LEFT_WRIST] = lm(0.65, 0.30);
  lms[LM.RIGHT_ELBOW] = lm(0.45, 0.34);
  lms[LM.RIGHT_WRIST] = lm(0.35, 0.30);
  // Head tilted slightly
  lms[LM.NOSE] = lm(0.48, 0.08);
  return makeSkeleton(lms, 0.33);
}

// ---------------------------------------------------------------------------
// PoseScoreCalculator class (implements ScoreCalculator interface)
// ---------------------------------------------------------------------------

/**
 * Concrete ScoreCalculator implementation.
 * Wraps the pure `computePoseScore` function for DI usage.
 * [Req 47.3]
 */
export class PoseScoreCalculator implements ScoreCalculator {
  compute(user: NormalisedLandmarks, reference: NormalisedLandmarks): PoseScore {
    return computePoseScore(user, reference);
  }
}
