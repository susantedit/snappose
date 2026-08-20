import { PoseRemixEngine, REMIX_OPTIONS } from '../PoseRemixEngine';
import type { Pose } from '../../types';

describe('PoseRemixEngine', () => {
  const engine = new PoseRemixEngine();

  const basePose: Pose = {
    id: 'base_pose_01',
    title: 'Standard Standing Pose',
    description: 'A classic upright portrait pose',
    category: 'fashion',
    difficulty: 'easy',
    thumbnail: 'https://example.com/thumb.jpg',
    landmarks: [],
    instructions: ['Stand straight', 'Look at lens'],
    tips: ['Keep chin relaxed'],
    poseDna: {
      body: 'straight',
      head: 'forward',
      hands: 'relaxed',
      legs: 'straight',
      camera: 'eye level',
      distance: '2m',
      framing: 'full body',
      energy: 'confident',
      light: 'soft directional',
      environment: 'studio',
      difficulty: 'easy',
      style: 'minimal',
      motionLevel: 'static',
    },
  };

  it('provides all 6 standard remix options', () => {
    expect(REMIX_OPTIONS.length).toBe(6);
    expect(REMIX_OPTIONS.map((o) => o.type)).toEqual([
      'walking',
      'hands_in_pockets',
      'looking_away',
      'seated',
      'low_angle',
      'close_portrait',
    ]);
  });

  it('generates walking remix variation with modified DNA', () => {
    const remixed = engine.remixPose(basePose, 'walking');
    expect(remixed.id).toContain('base_pose_01_remix_walking');
    expect(remixed.title).toContain('(Walking Stride)');
    expect(remixed.poseDna?.legs).toBe('walking');
    expect(remixed.poseDna?.motionLevel).toBe('subtle motion');
  });

  it('generates hands in pockets remix variation', () => {
    const remixed = engine.remixPose(basePose, 'hands_in_pockets');
    expect(remixed.poseDna?.hands).toBe('pockets');
    expect(remixed.poseDna?.energy).toBe('relaxed');
  });

  it('generates custom fine-grained attribute remixes', () => {
    const remixed = engine.remixCustom(basePose, {
      hands: 'on hips',
      head: 'tilted left',
      cameraAngle: 'low angle',
      energy: 'dramatic',
    });
    expect(remixed.title).toContain('(Custom Remix)');
    expect(remixed.poseDna?.hands).toBe('on hips');
    expect(remixed.poseDna?.head).toBe('tilted left');
    expect(remixed.poseDna?.camera).toBe('low angle');
    expect(remixed.poseDna?.energy).toBe('dramatic');
  });
});
