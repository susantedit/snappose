/**
 * AutoCaptureEngine — pure domain implementation.
 *
 * Implements the multi-gate auto-capture logic:
 *   pose_score ≥ threshold AND face_detected AND eyes_visible
 *   AND camera_stable AND lighting_score ≥ 50 [AND smile (optional)]
 *
 * Countdown: 3s Reanimated ring (3→2→1→Capture).
 * Cancels immediately if any gate drops below threshold.
 *
 * Correctness properties [Req 17]:
 *   - Gate conjunction: fires iff ALL gates true simultaneously
 *   - Countdown cancellation: never fires if score drops during countdown
 *   - Threshold boundary: fires at score === t, not at t-1
 *
 * Zero external dependencies — pure TypeScript.
 * [Req 17, 47.3]
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface AutoCaptureGates {
  /** Pose similarity score 0–100. */
  poseScore: number;
  /** Whether a face is detected by MediaPipe. */
  faceDetected: boolean;
  /** Whether both eyes are visible/open. */
  eyesVisible: boolean;
  /** Whether the camera is stable (gyroscope delta < 2°/300ms). */
  cameraStable: boolean;
  /** Lighting quality score 0–100; must be ≥ 50. */
  lightingScore: number;
  /** Optional smile gate — only evaluated when smileRequired = true. */
  smileDetected?: boolean;
}

export interface AutoCaptureConfig {
  /** Pose score threshold; default 95, range 80–99. [Req 17.6] */
  threshold: number;
  /** Whether smile detection is required as an additional gate. [Req 16.5] */
  smileRequired: boolean;
}

export type CountdownState =
  | { phase: 'idle' }
  | { phase: 'counting'; remaining: 3 | 2 | 1 }
  | { phase: 'capturing' }
  | { phase: 'cooldown' };

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const DEFAULT_THRESHOLD = 95;
const LIGHTING_MINIMUM = 50;
/** Cooldown after capture before next countdown can start (ms). */
const CAPTURE_COOLDOWN_MS = 3000;
/** Countdown step duration (ms). */
const COUNTDOWN_STEP_MS = 1000;

// ---------------------------------------------------------------------------
// AutoCaptureEngine
// ---------------------------------------------------------------------------

/**
 * Stateful engine that manages the auto-capture countdown.
 *
 * Call `tick(gates)` on every frame (30–60 FPS) to drive the state machine.
 * The engine emits `onCapture()` when countdown completes and all gates pass.
 */
export class AutoCaptureEngine {
  private _config: AutoCaptureConfig;
  private _state: CountdownState = { phase: 'idle' };
  private _countdownStart = 0;
  private _cooldownStart = 0;
  private _captureCount = 0;

  // Callbacks
  private _onCountdownChange: ((state: CountdownState) => void) | null = null;
  private _onCapture: (() => void) | null = null;

  constructor(config: Partial<AutoCaptureConfig> = {}) {
    this._config = {
      threshold: config.threshold ?? DEFAULT_THRESHOLD,
      smileRequired: config.smileRequired ?? false,
    };
  }

  // ---------------------------------------------------------------------------
  // Configuration
  // ---------------------------------------------------------------------------

  updateConfig(config: Partial<AutoCaptureConfig>): void {
    this._config = { ...this._config, ...config };
  }

  get config(): Readonly<AutoCaptureConfig> {
    return this._config;
  }

  // ---------------------------------------------------------------------------
  // Callbacks
  // ---------------------------------------------------------------------------

  onCountdownChange(cb: (state: CountdownState) => void): void {
    this._onCountdownChange = cb;
  }

  onCapture(cb: () => void): void {
    this._onCapture = cb;
  }

  // ---------------------------------------------------------------------------
  // Core: tick — call on every camera frame
  // ---------------------------------------------------------------------------

  /**
   * Drive the auto-capture state machine with current gate values.
   * Call this on every analysed camera frame (30–60 FPS).
   *
   * Returns the current CountdownState after processing.
   */
  tick(gates: AutoCaptureGates): CountdownState {
    const now = Date.now();
    const allGatesPass = this._evaluateGates(gates);

    switch (this._state.phase) {
      case 'idle': {
        if (allGatesPass) {
          this._transition({ phase: 'counting', remaining: 3 });
          this._countdownStart = now;
        }
        break;
      }

      case 'counting': {
        if (!allGatesPass) {
          // Any gate drop → cancel countdown [Req 17.3]
          this._transition({ phase: 'idle' });
          break;
        }

        const elapsed = now - this._countdownStart;
        const step = Math.floor(elapsed / COUNTDOWN_STEP_MS);

        if (step >= 3) {
          // All 3 steps passed — capture! [Req 17.4]
          this._captureCount++;
          this._transition({ phase: 'capturing' });
          this._onCapture?.();
          // Start cooldown
          this._cooldownStart = now;
          this._transition({ phase: 'cooldown' });
        } else {
          const remaining = (3 - step) as 3 | 2 | 1;
          if (remaining !== this._state.remaining) {
            this._transition({ phase: 'counting', remaining });
          }
        }
        break;
      }

      case 'capturing': {
        // Immediately move to cooldown (transition happens in 'counting' case above)
        break;
      }

      case 'cooldown': {
        if (now - this._cooldownStart >= CAPTURE_COOLDOWN_MS) {
          this._transition({ phase: 'idle' });
        }
        break;
      }
    }

    return this._state;
  }

  // ---------------------------------------------------------------------------
  // State inspection
  // ---------------------------------------------------------------------------

  get state(): CountdownState {
    return this._state;
  }

  get captureCount(): number {
    return this._captureCount;
  }

  reset(): void {
    this._transition({ phase: 'idle' });
    this._countdownStart = 0;
    this._cooldownStart = 0;
  }

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  /**
   * Evaluate ALL gates simultaneously.
   * Returns true iff every required gate passes.
   * [Req 17.1 — gate conjunction invariant]
   */
  private _evaluateGates(gates: AutoCaptureGates): boolean {
    if (gates.poseScore < this._config.threshold) return false;
    if (!gates.faceDetected) return false;
    if (!gates.eyesVisible) return false;
    if (!gates.cameraStable) return false;
    if (gates.lightingScore < LIGHTING_MINIMUM) return false;
    if (this._config.smileRequired && !gates.smileDetected) return false;
    return true;
  }

  private _transition(next: CountdownState): void {
    this._state = next;
    this._onCountdownChange?.(next);
  }
}

// ---------------------------------------------------------------------------
// Pure gate evaluation (no state — for unit/PBT tests)
// ---------------------------------------------------------------------------

/**
 * Stateless gate evaluation.
 * Exposed for property-based testing without needing an engine instance.
 * [Req 17 — gate conjunction invariant]
 */
export function evaluateGates(
  gates: AutoCaptureGates,
  config: AutoCaptureConfig,
): boolean {
  if (gates.poseScore < config.threshold) return false;
  if (!gates.faceDetected) return false;
  if (!gates.eyesVisible) return false;
  if (!gates.cameraStable) return false;
  if (gates.lightingScore < LIGHTING_MINIMUM) return false;
  if (config.smileRequired && !gates.smileDetected) return false;
  return true;
}
