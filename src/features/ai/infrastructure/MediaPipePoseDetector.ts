/**
 * MediaPipePoseDetector — React Native implementation of PoseDetector.
 *
 * Wraps the react-native-mediapipe (or vision-camera-pose-detection) bridge
 * to run MediaPipe Pose Landmarker on-device at 30–60 FPS.
 *
 * Design rules [Req 10, 47.3]:
 *  - Inference runs on a background JSI worklet thread — UI thread never blocked
 *  - Landmarks with visibility < 0.60 are still returned; callers filter them
 *  - On init failure: fall back gracefully (caller detects null from detect())
 *  - Paused within 200ms of backgrounding; resumed within 500ms of foregrounding
 *  - Fully offline — no network calls
 *  - Target: inference < 100ms per frame on Snapdragon 665-class device
 */

import type { PoseDetector } from '../domain/interfaces/PoseDetector';
import type { CameraFrame, LandmarkSet, Landmark } from '../types';
import { CrashlyticsService } from '@/services/firebase/crashlytics';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Minimum confidence to pass a landmark through. [Req 10.4] */
const CONFIDENCE_THRESHOLD = 0.60;

/** Pause scoring when overall body confidence drops below this. [Req 10.5] */
const PAUSE_CONFIDENCE_THRESHOLD = 0.45;

/** Max acceptable inference time before frame is skipped (ms). */
const INFERENCE_TIMEOUT_MS = 200;

/** Number of consecutive slow frames before inference thread is restarted. */
const MAX_CONSECUTIVE_DROPS = 10;

// ---------------------------------------------------------------------------
// Internal state types
// ---------------------------------------------------------------------------

type DetectorStatus = 'uninitialised' | 'ready' | 'paused' | 'failed';

interface InferenceResult {
  landmarks: LandmarkSet;
  inferenceMs: number;
}

// ---------------------------------------------------------------------------
// MediaPipePoseDetector
// ---------------------------------------------------------------------------

/**
 * Concrete PoseDetector backed by MediaPipe Pose Landmarker.
 *
 * Usage:
 * ```ts
 * const detector = new MediaPipePoseDetector();
 * await detector.initialise();
 * // In camera frame callback:
 * const landmarks = await detector.detect(frame);
 * // On screen unmount:
 * detector.destroy();
 * ```
 */
export class MediaPipePoseDetector implements PoseDetector {
  private _status: DetectorStatus = 'uninitialised';
  private _consecutiveDrops = 0;
  private _lastLandmarks: LandmarkSet | null = null;

  // ---------------------------------------------------------------------------
  // PoseDetector interface
  // ---------------------------------------------------------------------------

  /**
   * Initialise the MediaPipe Pose Landmarker model.
   * Must be called before `detect()`.
   * On failure, status is set to 'failed' and detect() will always return null.
   * [Req 10.9]
   */
  async initialise(): Promise<void> {
    try {
      await this._loadModel();
      this._status = 'ready';
      this._consecutiveDrops = 0;
    } catch (err) {
      this._status = 'failed';
      console.warn('[MediaPipePoseDetector] initialise failed:', err);
      CrashlyticsService.recordError(err, 'MediaPipeInitError');
    }
  }

  /**
   * Run pose detection on a camera frame.
   * Returns null if: uninitialised, paused, failed, or inference times out.
   * [Req 10.1, 10.6, 10.7]
   */
  async detect(frame: CameraFrame): Promise<LandmarkSet | null> {
    if (this._status !== 'ready') return null;

    const start = Date.now();
    try {
      const result = await this._runInference(frame);
      const elapsed = Date.now() - start;

      if (elapsed > INFERENCE_TIMEOUT_MS) {
        this._consecutiveDrops++;
        if (this._consecutiveDrops >= MAX_CONSECUTIVE_DROPS) {
          await this._restartInferenceThread();
        }
        // Return last known result for continuity
        return this._lastLandmarks;
      }

      this._consecutiveDrops = 0;
      this._lastLandmarks = result.landmarks;
      return result.landmarks;
    } catch {
      return this._lastLandmarks;
    }
  }

  /**
   * Release all camera and model resources.
   * Must be called when camera screen is unmounted or backgrounded. [Req 10.8]
   */
  destroy(): void {
    this._status = 'uninitialised';
    this._lastLandmarks = null;
    this._consecutiveDrops = 0;
    this._teardownModel();
  }

  // ---------------------------------------------------------------------------
  // Lifecycle controls (called by camera store)
  // ---------------------------------------------------------------------------

  /** Pause inference within 200ms of app backgrounding. [Req 10.8] */
  pause(): void {
    if (this._status === 'ready') {
      this._status = 'paused';
    }
  }

  /** Resume inference within 500ms of app foregrounding. [Req 10.8] */
  resume(): void {
    if (this._status === 'paused') {
      this._status = 'ready';
    }
  }

  get status(): DetectorStatus {
    return this._status;
  }

  // ---------------------------------------------------------------------------
  // Private implementation
  // ---------------------------------------------------------------------------

  /**
   * Load the MediaPipe Pose Landmarker WASM/TFLite model from the app bundle.
   *
   * In production this calls the native bridge. In the stub phase (before the
   * native module is wired) it simulates a 300ms load time so UI integration
   * can proceed without the native module being available.
   */
  private async _loadModel(): Promise<void> {
    // TODO (Task 16): Replace stub with real react-native-mediapipe initialisation:
    //   const { PoseLandmarker } = await import('@mediapipe/tasks-vision');
    //   this._landmarker = await PoseLandmarker.createFromOptions(wasmFileset, {
    //     baseOptions: { modelAssetPath: 'pose_landmarker_lite.task' },
    //     runningMode: 'VIDEO',
    //     numPoses: 1,
    //     minPoseDetectionConfidence: CONFIDENCE_THRESHOLD,
    //     minPosePresenceConfidence: CONFIDENCE_THRESHOLD,
    //     minTrackingConfidence: CONFIDENCE_THRESHOLD,
    //   });
    await new Promise((r) => setTimeout(r, 50)); // stub
  }

  /**
   * Run a single inference pass and return landmarks.
   * Production implementation uses the native JSI worklet bridge.
   */
  private async _runInference(frame: CameraFrame): Promise<InferenceResult> {
    // TODO (Task 16): Replace stub with real frame processing:
    //   const result = await this._landmarker.detectForVideo(frame.data, frame.timestamp);
    //   return { landmarks: mapToLandmarkSet(result.worldLandmarks[0]), inferenceMs: ... };
    const stubLandmarks = buildStubLandmarks();
    return { landmarks: stubLandmarks, inferenceMs: 25 };
  }

  /** Restart the inference thread after too many consecutive drops. */
  private async _restartInferenceThread(): Promise<void> {
    this._consecutiveDrops = 0;
    this._teardownModel();
    try {
      await this._loadModel();
      this._status = 'ready';
    } catch {
      this._status = 'failed';
    }
  }

  private _teardownModel(): void {
    // TODO (Task 16): this._landmarker?.close();
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Build 33 stub landmarks (all at centre with full visibility).
 * Replaced by real MediaPipe output once native bridge is wired.
 */
function buildStubLandmarks(): LandmarkSet {
  const stub: Landmark = { x: 0.5, y: 0.5, z: 0, visibility: 0.9 };
  return Array.from({ length: 33 }, () => ({ ...stub })) as LandmarkSet;
}

/**
 * Map raw MediaPipe NormalizedLandmark[] to our typed LandmarkSet.
 * (Used when real bridge is wired in production.)
 */
export function mapMediaPipeLandmarks(
  raw: Array<{ x: number; y: number; z: number; visibility?: number }>,
): LandmarkSet | null {
  if (!raw || raw.length < 33) return null;
  const mapped = raw.slice(0, 33).map((lm) => ({
    x: lm.x,
    y: lm.y,
    z: lm.z,
    visibility: lm.visibility ?? 0,
  }));
  return mapped as LandmarkSet;
}
