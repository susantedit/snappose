/**
 * Abstract TTS voice coach interface.
 * [Req 47]
 */
export interface VoiceCoach {
  speak(instruction: string): void;
  stop(): void;
  isAvailable(): boolean;
}
