/**
 * VoiceCoachService — on-device TTS voice coaching.
 *
 * Uses expo-speech for on-device Android/iOS TTS with web browser synthesis fallback.
 */

import type { VoiceCoach } from './interfaces/VoiceCoach';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Minimum gap between spoken instructions (ms). */
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

  async initialise(): Promise<void> {
    try {
      const Speech = await import('expo-speech');
      if (Speech && typeof Speech.speak === 'function') {
        this._isAvailable = true;
      } else if (typeof (globalThis as any).speechSynthesis !== 'undefined') {
        this._isAvailable = true;
      } else {
        this._isAvailable = true;
      }
    } catch {
      if (typeof (globalThis as any).speechSynthesis !== 'undefined') {
        this._isAvailable = true;
      } else {
        this._isAvailable = false;
      }
    }
  }

  /**
   * Speak an instruction.
   */
  speak(instruction: string, forced = false): void {
    if (!this._enabled) return;

    const now = Date.now();
    if (!forced && now - this._lastSpokenAt < MIN_INSTRUCTION_INTERVAL_MS) return;
    if (!forced && instruction === this._lastInstruction) return;

    this._lastInstruction = instruction;
    this._lastSpokenAt = now;

    // Fire-and-forget
    this._speakAsync(instruction).catch(() => {});
  }

  /**
   * Stop any in-progress speech immediately.
   */
  stop(): void {
    this._speakStop().catch(() => {});
    this._lastInstruction = null;
  }

  /** Returns true if TTS initialised successfully. */
  isAvailable(): boolean {
    return this._isAvailable || typeof (globalThis as any).speechSynthesis !== 'undefined';
  }

  // ---------------------------------------------------------------------------
  // Settings integration
  // ---------------------------------------------------------------------------

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
    try {
      const Speech = await import('expo-speech');
      if (Speech && typeof Speech.speak === 'function') {
        Speech.speak(text, {
          language: 'en-US',
          pitch: 1.0,
          rate: 0.95,
        });
        return;
      }
    } catch {}

    const g = globalThis as any;
    if (typeof g.speechSynthesis !== 'undefined' && typeof g.SpeechSynthesisUtterance !== 'undefined') {
      try {
        g.speechSynthesis.cancel();
        const utterance = new g.SpeechSynthesisUtterance(text);
        utterance.rate = 0.95;
        utterance.pitch = 1.0;
        utterance.lang = 'en-US';
        g.speechSynthesis.speak(utterance);
      } catch {}
    }
  }

  private async _speakStop(): Promise<void> {
    try {
      const Speech = await import('expo-speech');
      if (Speech && typeof Speech.stop === 'function') {
        Speech.stop();
      }
    } catch {}

    const g = globalThis as any;
    if (typeof g.speechSynthesis !== 'undefined') {
      try {
        g.speechSynthesis.cancel();
      } catch {}
    }
  }
}

// ---------------------------------------------------------------------------
// Singleton factory
// ---------------------------------------------------------------------------

let _instance: VoiceCoachService | null = null;

export function getVoiceCoachService(): VoiceCoachService {
  if (!_instance) {
    _instance = new VoiceCoachService();
  }
  return _instance;
}
