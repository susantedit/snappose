import { VoiceCoachService } from '../VoiceCoachService';

describe('VoiceCoachService', () => {
  let coach: VoiceCoachService;

  beforeEach(() => {
    coach = new VoiceCoachService();
    // Simulate available
    (coach as any)._isAvailable = true;
  });

  it('suppresses speech when enabled is false', () => {
    coach.setEnabled(false);
    expect(coach.isEnabled).toBe(false);

    coach.speak('Raise your left arm.');
    expect((coach as any)._lastInstruction).toBeNull();
  });

  it('respects rate limit of at least 2000ms between instructions', () => {
    coach.speak('Raise your left arm.');
    expect((coach as any)._lastInstruction).toBe('Raise your left arm.');

    // Immediate second speak call with different text should be throttled
    coach.speak('Lower your right arm.');
    expect((coach as any)._lastInstruction).toBe('Raise your left arm.');
  });

  it('never speaks identical instruction consecutively even after 2s', () => {
    coach.speak('Raise your left arm.');

    // Fast-forward time
    (coach as any)._lastSpokenAt = Date.now() - 3000;

    // Same instruction -> should be ignored
    coach.speak('Raise your left arm.');
    expect((coach as any)._lastInstruction).toBe('Raise your left arm.');
  });

  it('allows different instruction after interval has passed', () => {
    coach.speak('Raise your left arm.');

    (coach as any)._lastSpokenAt = Date.now() - 3000;

    coach.speak('Perfect!');
    expect((coach as any)._lastInstruction).toBe('Perfect!');
  });
});
