import { DirectorModeEngine } from '../DirectorModeEngine';

describe('DirectorModeEngine', () => {
  const engine = new DirectorModeEngine();

  describe('Subject Mode Guidance', () => {
    it('instructs subject to step into frame when no person is detected', () => {
      const step = engine.getNextStepInstruction(0, 'OPTIMAL', 'OPTIMAL', 'subject', 'single', {
        hasDetectedPerson: false,
      });
      expect(step.headline).toBe('Step into frame');
      expect(step.isReadyToCapture).toBe(false);
    });

    it('instructs subject to step back when too close', () => {
      const step = engine.getNextStepInstruction(85, 'TOO_CLOSE', 'OPTIMAL', 'subject', 'single');
      expect(step.headline).toBe('Take a step back');
      expect(step.voicePhrase).toBe('Step back.');
    });

    it('instructs subject to step closer when too far', () => {
      const step = engine.getNextStepInstruction(85, 'TOO_FAR', 'OPTIMAL', 'subject', 'single');
      expect(step.headline).toBe('Step 0.5m closer');
    });

    it('guides shoulder alignment when alignment score is below threshold', () => {
      const step = engine.getNextStepInstruction(75, 'OPTIMAL', 'OPTIMAL', 'subject', 'single');
      expect(step.headline).toContain('Turn shoulders');
    });

    it('signals capture ready when alignment is solid and distance is optimal', () => {
      const step = engine.getNextStepInstruction(92, 'OPTIMAL', 'OPTIMAL', 'subject', 'single');
      expect(step.isReadyToCapture).toBe(true);
      expect(step.headline).toBe('Perfect. Hold.');
    });
  });

  describe('Photographer Mode Guidance', () => {
    it('instructs photographer to move camera closer when subject is too far', () => {
      const step = engine.getNextStepInstruction(85, 'TOO_FAR', 'OPTIMAL', 'photographer', 'single');
      expect(step.headline).toBe('Move camera closer');
      expect(step.voicePhrase).toBe('Move camera closer.');
    });

    it('instructs photographer to lower camera when shot recipe calls for low angle', () => {
      const step = engine.getNextStepInstruction(88, 'OPTIMAL', 'OPTIMAL', 'photographer', 'single', {
        hasDetectedPerson: true,
        poseDna: {
          camera: 'low angle',
          body: 'standing',
          head: 'forward',
          hands: 'relaxed',
          legs: 'straight',
          distance: '2m',
          framing: 'full body',
          energy: 'confident',
          light: 'soft',
          environment: 'street',
          difficulty: 'easy',
          style: 'fashion',
          motionLevel: 'static',
        },
      });
      expect(step.headline).toContain('Lower camera');
    });
  });

  describe('SnapScore Calculations', () => {
    it('computes realistic 6-part score breakdown', () => {
      const breakdown = engine.calculateSnapScore(92, 88, 90);
      expect(breakdown.totalSnapScore).toBeGreaterThan(80);
      expect(breakdown.poseScore).toBe(92);
      expect(breakdown.feedback.poseReason).toBeDefined();
      expect(breakdown.feedback.lightingReason).toBeDefined();
    });
  });
});
