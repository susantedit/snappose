/**
 * PoseRemixEngine — Procedural Variation & Pose Remix Generator.
 *
 * Transforms a base Pose into distinct variations (Walking, Hands in Pockets,
 * Looking Away, Sitting, Lower Camera Angle, Side Profile) with modified Pose DNA.
 */

import type { Pose, PoseDNA } from '../types';

export type RemixType =
  | 'walking'
  | 'hands_in_pockets'
  | 'looking_away'
  | 'seated'
  | 'low_angle'
  | 'close_portrait';

export interface PoseRemixOption {
  type: RemixType;
  label: string;
  description: string;
  icon: string;
}

export const REMIX_OPTIONS: PoseRemixOption[] = [
  {
    type: 'walking',
    label: 'Dynamic Walk',
    description: 'Adds natural stride motion & subtle arm swing.',
    icon: 'footprints',
  },
  {
    type: 'hands_in_pockets',
    label: 'Hands in Pockets',
    description: 'Casual thumb-in-pocket posture.',
    icon: 'fashion',
  },
  {
    type: 'looking_away',
    label: 'Candid Look Away',
    description: 'Turn head 30° off-camera for effortless vibe.',
    icon: 'eye',
  },
  {
    type: 'seated',
    label: 'Seated Variation',
    description: 'Adapt posture for chair, ledge, or ground.',
    icon: 'sitting',
  },
  {
    type: 'low_angle',
    label: 'Low Angle Hero',
    description: 'Camera at waist height looking up.',
    icon: 'arrowUp',
  },
  {
    type: 'close_portrait',
    label: 'Close Portrait',
    description: 'Medium framing focused on shoulders and face.',
    icon: 'portrait',
  },
];

export interface CustomRemixOptions {
  hands?: PoseDNA['hands'];
  stance?: PoseDNA['legs'];
  shoulders?: string;
  head?: PoseDNA['head'];
  expression?: string;
  cameraAngle?: PoseDNA['camera'];
  distance?: string;
  bodyOrientation?: PoseDNA['body'];
  energy?: PoseDNA['energy'];
  framing?: PoseDNA['framing'];
}

export class PoseRemixEngine {
  public remixPose(basePose: Pose, remixType: RemixType): Pose {
    const remixedId = `${basePose.id}_remix_${remixType}`;

    let titleSuffix = '';
    let instructionMod = '';
    let dnaMod: Partial<PoseDNA> = {};

    switch (remixType) {
      case 'walking':
        titleSuffix = '(Walking Stride)';
        instructionMod = 'Step forward naturally with your left leg while maintaining torso alignment.';
        dnaMod = { legs: 'walking', motionLevel: 'subtle motion' };
        break;
      case 'hands_in_pockets':
        titleSuffix = '(Hands in Pockets)';
        instructionMod = 'Rest your thumbs lightly inside your front pockets while relaxing your shoulders.';
        dnaMod = { hands: 'pockets', energy: 'relaxed' };
        break;
      case 'looking_away':
        titleSuffix = '(Candid Look Away)';
        instructionMod = 'Turn your gaze 30° off-camera toward an environmental focal point.';
        dnaMod = { head: 'looking away', energy: 'minimal' };
        break;
      case 'seated':
        titleSuffix = '(Seated Pose)';
        instructionMod = 'Sit comfortably on a ledge or chair, leaning slightly forward with elbows on knees.';
        dnaMod = { body: 'seated', legs: 'offset stance' };
        break;
      case 'low_angle':
        titleSuffix = '(Low Angle Perspective)';
        instructionMod = 'Hold camera at waist level angled upward to elongate proportions.';
        dnaMod = { camera: 'low angle', framing: 'full body' };
        break;
      case 'close_portrait':
        titleSuffix = '(Close-up Framing)';
        instructionMod = 'Frame from chest up, keeping shoulder angle sharp and gaze direct.';
        dnaMod = { framing: 'close up', camera: 'eye level' };
        break;
    }

    return {
      ...basePose,
      id: remixedId,
      title: `${basePose.title} ${titleSuffix}`,
      description: `${basePose.description} — Remixed variation: ${instructionMod}`,
      instructions: [instructionMod, ...(basePose.instructions || [])],
      tips: [`Remix Tip: ${instructionMod}`, ...(basePose.tips || [])],
      poseDna: basePose.poseDna ? { ...basePose.poseDna, ...dnaMod } : undefined,
    };
  }

  public remixCustom(basePose: Pose, options: CustomRemixOptions): Pose {
    const remixedId = `${basePose.id}_custom_remix_${Date.now()}`;
    const dnaMod: Partial<PoseDNA> = {
      ...(options.hands ? { hands: options.hands } : {}),
      ...(options.stance ? { legs: options.stance } : {}),
      ...(options.head ? { head: options.head } : {}),
      ...(options.cameraAngle ? { camera: options.cameraAngle } : {}),
      ...(options.distance ? { distance: options.distance } : {}),
      ...(options.bodyOrientation ? { body: options.bodyOrientation } : {}),
      ...(options.energy ? { energy: options.energy } : {}),
      ...(options.framing ? { framing: options.framing } : {}),
    };

    return {
      ...basePose,
      id: remixedId,
      title: `${basePose.title} (Custom Remix)`,
      description: `${basePose.description} — Custom variation with modified angles and posture.`,
      poseDna: basePose.poseDna ? { ...basePose.poseDna, ...dnaMod } : undefined,
    };
  }
}

export const poseRemixEngine = new PoseRemixEngine();
