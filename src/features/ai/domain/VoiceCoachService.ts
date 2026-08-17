/**
 * VoiceCoachService — on-device TTS voice coaching.
 *
 * Uses expo-speech for on-device Android TTS — no network required.
 *
 * Rules [Req 13]:
 *  - Max 1 instruction per 2 seconds
 *  - Never repeat an identical instruction consecutively
 *  - Silenced immediately when voiceGuidanceEnabled = false
 *  - Respects device volume without modifying system settings
 *  - On TTS init failure: continues silently, logs to Crashlytics
 *
 * [Req 13, 47.3]
 */

import type { VoiceCoach } from './interfaces/VoiceCoach';
import { CrashlyticsService } from '@/services/firebase/crashlytics';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type VoiceInstruction =
  | "Raise your left arm."
  | "Raise your right arm."
  | "Move slightly backward."
  | "Move slightly forward."
  | "Look toward the camera."
  | "Perfect!"
  | "Smile."
  | "Hold still."
  | "Step into the frame."
  | "Lower your left arm."
  | "Lower your right arm."
  | string; // allow arbitrary instructions

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Minimum gap between spoken instructions (ms). [Req 13.2] */
const MIN_INSTRUCTION_INTERVAL_MS = 2000;

// ---------------------------------------------------------------------------
// VoiceCoachService
// ---------------------------------------------------------------------------

export class VoiceCoachService implements VoiceCoach {
  private _isAvailable = false;
  private _lastInstruction: string | null = null;
  private _lastSpokenAt = 0;
  private _enabled = true;

  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------

  /**
   * Initialise the TTS engine.
   * Called once when camera screen mounts.
   * On failure: marks unavailable, continues silently. [Req 13.8]
   */
  async initialise(): Promise<void> {
    try {
      // Dynamic import so the module isn't loaded until needed
      const Speech = await import('expo-speech');
      // expo-speech is always available on Android — no init call needed
      this._isAvailable = true;
      void Speech; // suppress unused warning
    } catch (err) {
      this._isAvailable = false;
      console.warn('[VoiceCoachService] TTS init failed — continuing silently:', err);
      CrashlyticsService.recordError(err, 'VoiceCoachInitError');
    }
  }

  /**
   * Speak an instruction.
   *
   * Guards:
   *  - Service not available → noop
   *  - Voice guidance disabled → noop
   *  - Same instruction as last → noop (no consecutive repeats) [Req 13.3]
   *  - Within 2s of last instruction → noop [Req 13.2]
   */
  speak(instruction: string): void {
    if (!this._isAvailable) return;
    if (!this._enabled) return;

    const now = Date.now();
    if (now - this._lastSpokenAt < MIN_INSTRUCTION_INTERVAL_MS) return;
    if (instruction === this._lastInstruction) return;

    this._lastInstruction = instruction;
    this._lastSpokenAt = now;

    // Fire-and-forget — errors caught silently
    this._speakAsync(instruction).catch(() => {/* silent */});
  }

  /**
   * Stop any in-progress speech immediately.
   * Called when voice guidance is disabled or screen unmounts.
   */
  stop(): void {
    this._speakStop().catch(() => {/* silent */});
    this._lastInstruction = null;
  }

  /** Returns true if TTS initialised successfully. */
  isAvailable(): boolean {
    return this._isAvailable;
  }

  // ---------------------------------------------------------------------------
  // Settings integration
  // ---------------------------------------------------------------------------

  /**
   * Enable or disable voice guidance.
   * When disabled, stops current speech immediately. [Req 13.6]
   */
  setEnabled(enabled: boolean): void {
    if (!enabled && this._enabled) {
      this.stop();
    }
    this._enabled = enabled;
  }

  get enabled(): boolean {
    return this._enabled;
  }

  get isEnabled(): boolean {
    return this._enabled;
  }

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  private async _speakAsync(text: string): Promise<void> {
    const { speak } = await import('expo-speech');
    speak(text, {
      language: 'en-US',
      pitch: 1.0,
      rate: 0.95, // slightly slower for clarity
    });
  }

  private async _speakStop(): Promise<void> {
    const { stop } = await import('expo-speech');
    stop();
  }
}

// ---------------------------------------------------------------------------
// Singleton factory
// ---------------------------------------------------------------------------

let _instance: VoiceCoachService | null = null;

/** Returns the shared VoiceCoachService instance. */
export function getVoiceCoachService(): VoiceCoachService {
  if (!_instance) {
    _instance = new VoiceCoachService();
  }
  return _instance;
}
