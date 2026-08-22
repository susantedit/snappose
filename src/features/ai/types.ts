/**
 * AI feature types — shared across domain, infrastructure, and hooks.
 * [Req 10, 11, 47]
 */

export interface Landmark {
  x: number;
  y: number;
  z: number;
  visibility: number;
}

/** Exactly 33 MediaPipe Pose landmarks. */
export type PoseLandmarks = [
  Landmark, Landmark, Landmark, Landmark, Landmark,
  Landmark, Landmark, Landmark, Landmark, Landmark,
  Landmark, Landmark, Landmark, Landmark, Landmark,
  Landmark, Landmark, Landmark, Landmark, Landmark,
  Landmark, Landmark, Landmark, Landmark, Landmark,
  Landmark, Landmark, Landmark, Landmark, Landmark,
  Landmark, Landmark, Landmark,
];

export interface NormalisedLandmarks {
  landmarks: PoseLandmarks;
  /** Shoulder-to-hip distance used as scale reference. */
  referenceScale: number;
}

export interface PoseScore {
  /** 0–100 integer. */
  total: number;
  regional: {
    shoulders: number;
    arms: number;
    hands: number;
    torso: number;
    legs: number;
    head: number;
    feet: number;
  };
}

export type GuidanceCue =
  | 'Move Right'
  | 'Move Left'
  | 'Move Closer'
  | 'Move Back'
  | 'Straighten Up'
  | 'Raise your left arm.'
  | 'Raise your right arm.'
  | 'Look toward the camera.'
  | 'Perfect!'
  | 'Smile.'
  | 'Hold still.'
  | 'Adjusting';

export interface CameraFrame {
  data?: Uint8Array;
  width?: number;
  height?: number;
  timestamp?: number;
  landmarks?: Landmark[];
  personCount?: number;
}

export type LandmarkSet = PoseLandmarks;

export interface ParseError {
  kind: 'ParseError';
  message: string;
}

export type ParseResult<T> = T | ParseError;

export function isParseError(r: ParseResult<unknown>): r is ParseError {
  return (r as ParseError).kind === 'ParseError';
}
