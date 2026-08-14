import { AutoCaptureEngine, evaluateGates, type AutoCaptureGates } from '../AutoCaptureEngine';

describe('AutoCaptureEngine', () => {
  const perfectGates: AutoCaptureGates = {
    poseScore: 96,
    faceDetected: true,
    eyesVisible: true,
    cameraStable: true,
    lightingScore: 70,
    smileDetected: true,
  };

  it('evaluateGates returns true when all conditions are met', () => {
    const result = evaluateGates(perfectGates, { threshold: 95, smileRequired: false });
    expect(result).toBe(true);
  });

  it('evaluateGates requires smile when smileRequired is true', () => {
    const withoutSmile = { ...perfectGates, smileDetected: false };
    expect(evaluateGates(withoutSmile, { threshold: 95, smileRequired: true })).toBe(false);
    expect(evaluateGates(perfectGates, { threshold: 95, smileRequired: true })).toBe(true);
  });

  it('evaluates false when lighting score < 50', () => {
    const poorLighting = { ...perfectGates, lightingScore: 45 };
    expect(evaluateGates(poorLighting, { threshold: 95, smileRequired: false })).toBe(false);
  });

  it('evaluates false when camera is unstable', () => {
    const unstable = { ...perfectGates, cameraStable: false };
    expect(evaluateGates(unstable, { threshold: 95, smileRequired: false })).toBe(false);
  });

  it('state machine transitions to counting on valid gates and cancels when broken', () => {
    const engine = new AutoCaptureEngine({ threshold: 95, smileRequired: false });
    expect(engine.state.phase).toBe('idle');

    // Valid frame -> counting begins
    const countingState = engine.tick(perfectGates);
    expect(countingState.phase).toBe('counting');

    // Broken stability -> cancels to idle
    const brokenState = engine.tick({ ...perfectGates, cameraStable: false });
    expect(brokenState.phase).toBe('idle');
  });

  it('triggers onCapture callback and increments captureCount when countdown finishes', () => {
    const engine = new AutoCaptureEngine({ threshold: 95, smileRequired: false });
    let captured = false;
    engine.onCapture(() => {
      captured = true;
    });

    engine.tick(perfectGates);

    // Fast-forward countdown start time to simulate 3.5s elapsed
    (engine as any)._countdownStart = Date.now() - 3500;

    engine.tick(perfectGates);
    expect(captured).toBe(true);
    expect(engine.captureCount).toBe(1);
    expect(engine.state.phase).toBe('cooldown');
  });
});
