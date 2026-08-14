import type { CameraFrame, LandmarkSet } from '../../types';

/**
 * Abstract AI engine interface.
 * [Req 47] — adapter-gated; swap MediaPipe implementation without touching app code.
 */
export interface PoseDetector {
  initialise(): Promise<void>;
  detect(frame: CameraFrame): Promise<LandmarkSet | null>;
  destroy(): void;
}
