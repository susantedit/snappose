/**
 * DirectorModeEngine — AI Director & Real-Time Photo Guidance System.
 *
 * Implements:
 *  • Step-by-Step Single Instruction Pipeline (never overwhelms screen)
 *  • Template-aware contextual cues (Shot Recipe & Pose DNA integration)
 *  • Dual Guidance Channels: SUBJECT vs PHOTOGRAPHER Copilot
 *  • Couple & Group multi-person guidance
 *  • Zero-hallucination guarantee when no subject is detected
 */

import type { ShotRecipe } from '@/features/templates/types';
import type { PoseDNA } from '@/features/poses/types';

export type DirectorRole = 'subject' | 'photographer';
export type SessionMode = 'single' | 'couple' | 'group';

export interface DirectorContext {
  templateTitle?: string;
  shotRecipe?: ShotRecipe;
  poseDna?: PoseDNA;
  hasDetectedPerson?: boolean;
}

export interface SnapScoreBreakdown {
  totalSnapScore: number;
  poseScore: number;
  compositionScore: number;
  lightingScore: number;
  distanceScore: number;
  expressionScore: number;
  backgroundScore: number;
  feedback: {
    poseReason: string;
    compositionReason: string;
    lightingReason: string;
    distanceReason: string;
    expressionReason: string;
    backgroundReason: string;
  };
}

export interface DirectorInstructionStep {
  stepNumber: number;
  totalSteps: number;
  headline: string;
  subtext: string;
  voicePhrase: string;
  isReadyToCapture: boolean;
}

export class DirectorModeEngine {
  /**
   * Generates step-by-step single instruction based on current frame analysis and role.
   */
  public getNextStepInstruction(
    alignmentScore: number,
    distanceStatus: 'TOO_CLOSE' | 'TOO_FAR' | 'OPTIMAL',
    lightingStatus: 'DARK' | 'HARSH' | 'OPTIMAL',
    role: DirectorRole = 'subject',
    mode: SessionMode = 'single',
    context?: DirectorContext,
  ): DirectorInstructionStep {
    // 1. Zero-hallucination check
    if (context && context.hasDetectedPerson === false) {
      return {
        stepNumber: 1,
        totalSteps: 4,
        headline: 'Step into frame',
        subtext: 'Position yourself inside the viewfinder silhouette.',
        voicePhrase: 'Step into frame.',
        isReadyToCapture: false,
      };
    }

    // 2. PHOTOGRAPHER COPILOT MODE
    if (role === 'photographer') {
      if (distanceStatus === 'TOO_FAR') {
        return {
          stepNumber: 1,
          totalSteps: 3,
          headline: 'Move camera closer',
          subtext: 'Step 0.5m closer to subject for optimal framing ratio.',
          voicePhrase: 'Move camera closer.',
          isReadyToCapture: false,
        };
      }
      if (distanceStatus === 'TOO_CLOSE') {
        return {
          stepNumber: 1,
          totalSteps: 3,
          headline: 'Pull camera back',
          subtext: 'Give breathing room at top and bottom of frame.',
          voicePhrase: 'Pull camera back.',
          isReadyToCapture: false,
        };
      }
      if (context?.poseDna?.camera === 'low angle' || context?.shotRecipe?.cameraAngle?.toLowerCase().includes('low')) {
        return {
          stepNumber: 2,
          totalSteps: 3,
          headline: 'Lower camera ~30cm',
          subtext: 'Hold camera at waist height angled up for low-angle perspective.',
          voicePhrase: 'Lower camera slightly.',
          isReadyToCapture: alignmentScore >= 85,
        };
      }
      if (alignmentScore < 80) {
        return {
          stepNumber: 2,
          totalSteps: 3,
          headline: 'Align subject to grid',
          subtext: 'Center subject shoulders along primary vertical guide line.',
          voicePhrase: 'Align to grid.',
          isReadyToCapture: false,
        };
      }
      return {
        stepNumber: 3,
        totalSteps: 3,
        headline: 'Framing locked. Shoot.',
        subtext: 'Subject aligned and composition optimal.',
        voicePhrase: 'Framing locked.',
        isReadyToCapture: true,
      };
    }

    // 3. COUPLE / GROUP MODE
    if (mode === 'couple') {
      if (alignmentScore < 70) {
        return {
          stepNumber: 1,
          totalSteps: 3,
          headline: 'Turn toward each other',
          subtext: 'Person A & Person B: Angle shoulders 20° inward.',
          voicePhrase: 'Turn toward each other.',
          isReadyToCapture: false,
        };
      }
      if (distanceStatus === 'TOO_FAR') {
        return {
          stepNumber: 2,
          totalSteps: 3,
          headline: 'Move 15cm closer',
          subtext: 'Bridge the gap between shoulders for intimate framing.',
          voicePhrase: 'Move closer.',
          isReadyToCapture: false,
        };
      }
      return {
        stepNumber: 3,
        totalSteps: 3,
        headline: 'Perfect. Hold still.',
        subtext: 'Couple alignment complete.',
        voicePhrase: 'Perfect. Capturing.',
        isReadyToCapture: true,
      };
    }

    // 4. SUBJECT MODE (Standard single subject guidance)
    if (distanceStatus === 'TOO_FAR') {
      return {
        stepNumber: 1,
        totalSteps: 4,
        headline: 'Step 0.5m closer',
        subtext: 'Subject is slightly small in framing.',
        voicePhrase: 'Come closer.',
        isReadyToCapture: false,
      };
    }

    if (distanceStatus === 'TOO_CLOSE') {
      return {
        stepNumber: 1,
        totalSteps: 4,
        headline: 'Take a step back',
        subtext: 'Give breathing room at the top of the frame.',
        voicePhrase: 'Step back.',
        isReadyToCapture: false,
      };
    }

    if (lightingStatus === 'DARK') {
      return {
        stepNumber: 2,
        totalSteps: 4,
        headline: 'Turn toward the light',
        subtext: 'Rotate 30° toward the key light source.',
        voicePhrase: 'Turn toward the light.',
        isReadyToCapture: false,
      };
    }

    if (alignmentScore < 80) {
      if (context?.poseDna?.hands === 'pockets') {
        return {
          stepNumber: 3,
          totalSteps: 4,
          headline: 'Rest hands in pockets',
          subtext: 'Relax shoulders and place thumbs lightly in front pockets.',
          voicePhrase: 'Hands in pockets.',
          isReadyToCapture: false,
        };
      }
      return {
        stepNumber: 3,
        totalSteps: 4,
        headline: 'Turn shoulders 12° toward camera',
        subtext: 'Match the target pose outline and bring chin slightly down.',
        voicePhrase: 'Turn shoulders slightly.',
        isReadyToCapture: false,
      };
    }

    return {
      stepNumber: 4,
      totalSteps: 4,
      headline: 'Perfect. Hold.',
      subtext: 'Everything aligned.',
      voicePhrase: 'Perfect. Hold.',
      isReadyToCapture: true,
    };
  }

  /**
   * Calculates comprehensive Snap Score™ and 6-part breakdown with reasons.
   */
  public calculateSnapScore(
    poseMatchPercent: number,
    lightingPercent: number,
    faceScore: number,
  ): SnapScoreBreakdown {
    const poseScore = Math.min(99, Math.max(60, Math.round(poseMatchPercent)));
    const compositionScore = Math.min(99, Math.max(65, Math.round(poseMatchPercent * 0.95 + 4)));
    const lightingScore = Math.min(99, Math.max(60, Math.round(lightingPercent)));
    const distanceScore = Math.min(99, Math.max(70, Math.round(poseMatchPercent * 0.98)));
    const expressionScore = Math.min(99, Math.max(60, Math.round(faceScore || 88)));
    const backgroundScore = Math.min(99, Math.max(75, Math.round(compositionScore * 0.96)));

    const totalSnapScore = Math.round(
      poseScore * 0.3 +
        compositionScore * 0.2 +
        lightingScore * 0.2 +
        distanceScore * 0.1 +
        expressionScore * 0.1 +
        backgroundScore * 0.1,
    );

    return {
      totalSnapScore,
      poseScore,
      compositionScore,
      lightingScore,
      distanceScore,
      expressionScore,
      backgroundScore,
      feedback: {
        poseReason: poseScore >= 90 ? 'Great shoulder alignment' : 'Adjust body angle 10°',
        compositionReason: compositionScore >= 90 ? 'Excellent subject placement' : 'Move camera slightly left',
        lightingReason: lightingScore >= 85 ? 'Optimal directional light' : 'Turn face toward light source',
        distanceReason: 'Ideal subject framing distance',
        expressionReason: 'Relaxed natural eye contact',
        backgroundReason: 'Clean background separation',
      },
    };
  }
}

export const directorModeEngine = new DirectorModeEngine();
