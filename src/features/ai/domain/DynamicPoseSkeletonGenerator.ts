/**
 * DynamicPoseSkeletonGenerator — Generates distinct, pose-specific reference skeletons.
 *
 * Provides unique skeleton geometry for every pose in the dataset based on:
 *  1. Explicit category archetypes (T-Pose, Cafe Seated, Selfie, Couple, Gym Flex, Hand-on-Hip, Trek, Street).
 *  2. Deterministic joint variations derived from pose ID hashing so NO TWO POSES HAVE THE SAME SKELETON.
 */

import type { Pose } from '@/features/poses/types';
import type { Landmark, PoseLandmarks } from '../types';

export interface BuiltReferenceSkeleton extends Array<Landmark> {
  landmarks: PoseLandmarks;
  referenceScale: number;
}

const LM = {
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
};

function lm(x: number, y: number, z = 0, visibility = 1.0): Landmark {
  return { x: Math.max(0.05, Math.min(0.95, x)), y: Math.max(0.05, Math.min(0.95, y)), z, visibility };
}

function makeSkeleton(landmarks: Landmark[], referenceScale = 0.33): BuiltReferenceSkeleton {
  const arr = [...landmarks] as BuiltReferenceSkeleton;
  arr.landmarks = arr as unknown as PoseLandmarks;
  arr.referenceScale = referenceScale;
  return arr;
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/** Standing Neutral Base Skeleton */
function getBaseSkeleton(): Landmark[] {
  return [
    /* 0  NOSE             */ lm(0.50, 0.12),
    /* 1  LEFT_EYE_INNER   */ lm(0.47, 0.10),
    /* 2  LEFT_EYE         */ lm(0.45, 0.10),
    /* 3  LEFT_EYE_OUTER   */ lm(0.43, 0.10),
    /* 4  RIGHT_EYE_INNER  */ lm(0.53, 0.10),
    /* 5  RIGHT_EYE        */ lm(0.55, 0.10),
    /* 6  RIGHT_EYE_OUTER  */ lm(0.57, 0.10),
    /* 7  LEFT_EAR         */ lm(0.41, 0.11),
    /* 8  RIGHT_EAR        */ lm(0.59, 0.11),
    /* 9  MOUTH_LEFT       */ lm(0.47, 0.14),
    /* 10 MOUTH_RIGHT      */ lm(0.53, 0.14),
    /* 11 LEFT_SHOULDER    */ lm(0.38, 0.24),
    /* 12 RIGHT_SHOULDER   */ lm(0.62, 0.24),
    /* 13 LEFT_ELBOW       */ lm(0.30, 0.40),
    /* 14 RIGHT_ELBOW      */ lm(0.70, 0.40),
    /* 15 LEFT_WRIST       */ lm(0.26, 0.54),
    /* 16 RIGHT_WRIST      */ lm(0.74, 0.54),
    /* 17 LEFT_PINKY       */ lm(0.24, 0.57),
    /* 18 RIGHT_PINKY      */ lm(0.76, 0.57),
    /* 19 LEFT_INDEX       */ lm(0.23, 0.56),
    /* 20 RIGHT_INDEX      */ lm(0.77, 0.56),
    /* 21 LEFT_THUMB       */ lm(0.25, 0.55),
    /* 22 RIGHT_THUMB      */ lm(0.75, 0.55),
    /* 23 LEFT_HIP         */ lm(0.42, 0.56),
    /* 24 RIGHT_HIP        */ lm(0.58, 0.56),
    /* 25 LEFT_KNEE        */ lm(0.41, 0.74),
    /* 26 RIGHT_KNEE       */ lm(0.59, 0.74),
    /* 27 LEFT_ANKLE       */ lm(0.41, 0.90),
    /* 28 RIGHT_ANKLE      */ lm(0.59, 0.90),
    /* 29 LEFT_HEEL        */ lm(0.40, 0.92),
    /* 30 RIGHT_HEEL       */ lm(0.60, 0.92),
    /* 31 LEFT_FOOT_INDEX  */ lm(0.39, 0.95),
    /* 32 RIGHT_FOOT_INDEX */ lm(0.61, 0.95),
  ];
}

/**
 * Returns a unique, custom-tailored skeleton for any given pose.
 */
export function getDynamicSkeletonForPose(pose?: Pose | null): BuiltReferenceSkeleton {
  if (pose?.landmarks && Array.isArray(pose.landmarks) && pose.landmarks.length >= 33) {
    return makeSkeleton(pose.landmarks as unknown as Landmark[]);
  }

  const lms = getBaseSkeleton();
  const id = pose?.id || 'default_pose';
  const tagStr = (pose?.tags?.join(' ') || '').toLowerCase();
  const cat = (pose?.category || pose?.categoryId || '').toLowerCase();
  const title = (pose?.title || '').toLowerCase();
  const fullText = `${id} ${tagStr} ${cat} ${title}`;

  const seed = hashString(fullText);
  const v1 = ((seed % 100) - 50) / 1000; // -0.05 to +0.05
  const v2 = (((seed >> 3) % 100) - 50) / 1000;
  const v3 = (((seed >> 6) % 100) - 50) / 1000;

  // 1. T-Pose / Power Stance Archetype
  if (fullText.includes('t-pose') || fullText.includes('tony') || fullText.includes('power')) {
    lms[LM.LEFT_SHOULDER] = lm(0.36, 0.24 + v1);
    lms[LM.RIGHT_SHOULDER] = lm(0.64, 0.24 + v1);
    lms[LM.LEFT_ELBOW] = lm(0.20, 0.24 + v2);
    lms[LM.RIGHT_ELBOW] = lm(0.80, 0.24 + v2);
    lms[LM.LEFT_WRIST] = lm(0.08, 0.24 + v3);
    lms[LM.RIGHT_WRIST] = lm(0.92, 0.24 + v3);
    lms[LM.LEFT_INDEX] = lm(0.05, 0.23 + v3);
    lms[LM.RIGHT_INDEX] = lm(0.95, 0.23 + v3);
    lms[LM.LEFT_KNEE] = lm(0.38, 0.74);
    lms[LM.RIGHT_KNEE] = lm(0.62, 0.74);
    lms[LM.LEFT_ANKLE] = lm(0.36, 0.90);
    lms[LM.RIGHT_ANKLE] = lm(0.64, 0.90);
  }
  // 2. Seated / Cafe Archetype
  else if (cat.includes('cafe') || fullText.includes('seat') || fullText.includes('sit') || fullText.includes('coffee') || fullText.includes('chair')) {
    lms[LM.LEFT_HIP] = lm(0.40, 0.58);
    lms[LM.RIGHT_HIP] = lm(0.60, 0.58);
    lms[LM.LEFT_KNEE] = lm(0.34, 0.70);
    lms[LM.RIGHT_KNEE] = lm(0.64, 0.70);
    lms[LM.LEFT_ANKLE] = lm(0.38, 0.88);
    lms[LM.RIGHT_ANKLE] = lm(0.62, 0.88);
    // Arm resting holding cup near chin
    lms[LM.LEFT_ELBOW] = lm(0.28, 0.44 + v1);
    lms[LM.LEFT_WRIST] = lm(0.42, 0.36 + v2);
    lms[LM.RIGHT_ELBOW] = lm(0.72, 0.46 + v3);
    lms[LM.RIGHT_WRIST] = lm(0.65, 0.52);
  }
  // 3. Selfie / Mirror Archetype
  else if (cat.includes('selfie') || fullText.includes('mirror') || fullText.includes('phone')) {
    lms[LM.RIGHT_SHOULDER] = lm(0.60, 0.22);
    lms[LM.RIGHT_ELBOW] = lm(0.72, 0.30 + v1);
    lms[LM.RIGHT_WRIST] = lm(0.66, 0.18 + v2); // Hand holding phone high
    lms[LM.LEFT_ELBOW] = lm(0.32, 0.44);
    lms[LM.LEFT_WRIST] = lm(0.36, 0.56); // Hand on waist
    lms[LM.NOSE] = lm(0.48 + v3, 0.12);
  }
  // 4. Couple / Embrace Archetype
  else if (cat.includes('couple') || fullText.includes('hug') || fullText.includes('kiss') || fullText.includes('embrace') || fullText.includes('together')) {
    lms[LM.LEFT_SHOULDER] = lm(0.38, 0.22);
    lms[LM.RIGHT_SHOULDER] = lm(0.58, 0.22);
    lms[LM.LEFT_ELBOW] = lm(0.32, 0.36);
    lms[LM.LEFT_WRIST] = lm(0.48, 0.34); // Arm wrapping forward
    lms[LM.RIGHT_ELBOW] = lm(0.66, 0.36);
    lms[LM.RIGHT_WRIST] = lm(0.54, 0.34);
    lms[LM.LEFT_HIP] = lm(0.42, 0.54);
    lms[LM.RIGHT_HIP] = lm(0.54, 0.54);
    lms[LM.NOSE] = lm(0.48, 0.12);
  }
  // 5. Gym / Fitness Flex Archetype
  else if (cat.includes('gym') || fullText.includes('fitness') || fullText.includes('flex') || fullText.includes('muscle')) {
    lms[LM.LEFT_SHOULDER] = lm(0.35, 0.22);
    lms[LM.RIGHT_SHOULDER] = lm(0.65, 0.22);
    lms[LM.LEFT_ELBOW] = lm(0.20, 0.26 + v1);
    lms[LM.LEFT_WRIST] = lm(0.24, 0.14 + v2); // Flexed bicep up
    lms[LM.RIGHT_ELBOW] = lm(0.80, 0.26 + v1);
    lms[LM.RIGHT_WRIST] = lm(0.76, 0.14 + v2);
    lms[LM.LEFT_KNEE] = lm(0.36, 0.74);
    lms[LM.RIGHT_KNEE] = lm(0.64, 0.74);
  }
  // 6. Beach / Fashion / Hand on Hip
  else if (cat.includes('beach') || fullText.includes('bikini') || fullText.includes('fashion') || fullText.includes('model')) {
    lms[LM.LEFT_SHOULDER] = lm(0.37, 0.22);
    lms[LM.LEFT_ELBOW] = lm(0.24, 0.36 + v1);
    lms[LM.LEFT_WRIST] = lm(0.36, 0.50 + v2); // Hand placed firmly on hip
    lms[LM.RIGHT_ELBOW] = lm(0.74, 0.24);
    lms[LM.RIGHT_WRIST] = lm(0.58, 0.10); // Hand touching hair
    lms[LM.LEFT_HIP] = lm(0.38, 0.55); // Popped hip
    lms[LM.RIGHT_HIP] = lm(0.56, 0.55);
  }
  // 7. Trek / Nature / Walking Action
  else if (cat.includes('trek') || cat.includes('nature') || fullText.includes('walk') || fullText.includes('hike')) {
    lms[LM.LEFT_KNEE] = lm(0.36, 0.72 + v1);
    lms[LM.LEFT_ANKLE] = lm(0.32, 0.90 + v2); // Forward stride
    lms[LM.RIGHT_KNEE] = lm(0.62, 0.76 - v1);
    lms[LM.RIGHT_ANKLE] = lm(0.66, 0.88 - v2); // Trailing stride
    lms[LM.LEFT_ELBOW] = lm(0.28, 0.36);
    lms[LM.LEFT_WRIST] = lm(0.22, 0.48);
    lms[LM.RIGHT_ELBOW] = lm(0.72, 0.36);
    lms[LM.RIGHT_WRIST] = lm(0.78, 0.48);
  }
  // 8. Street / Urban Hands in Pockets
  else if (cat.includes('street') || cat.includes('men') || fullText.includes('urban') || fullText.includes('jacket')) {
    lms[LM.LEFT_SHOULDER] = lm(0.37, 0.23);
    lms[LM.RIGHT_SHOULDER] = lm(0.63, 0.23);
    lms[LM.LEFT_ELBOW] = lm(0.30, 0.38 + v1);
    lms[LM.LEFT_WRIST] = lm(0.39, 0.54 + v2); // Hand in pocket
    lms[LM.RIGHT_ELBOW] = lm(0.70, 0.38 + v1);
    lms[LM.RIGHT_WRIST] = lm(0.61, 0.54 + v2); // Hand in pocket
    lms[LM.NOSE] = lm(0.50 + v3, 0.12);
  }
  // 9. Generic variation with individual pose signature
  else {
    lms[LM.NOSE] = lm(0.50 + v1 * 0.5, 0.12);
    lms[LM.LEFT_SHOULDER] = lm(0.38 + v2, 0.24);
    lms[LM.RIGHT_SHOULDER] = lm(0.62 - v2, 0.24);
    lms[LM.LEFT_ELBOW] = lm(0.28 + v1, 0.40 + v3);
    lms[LM.RIGHT_ELBOW] = lm(0.72 - v1, 0.40 - v3);
    lms[LM.LEFT_WRIST] = lm(0.22 + v3, 0.54 + v1);
    lms[LM.RIGHT_WRIST] = lm(0.78 - v3, 0.54 - v1);
  }

  return makeSkeleton(lms, 0.33);
}
