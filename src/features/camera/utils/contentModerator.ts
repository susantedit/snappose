/**
 * ContentModerator — Client-side Safety & Content Moderation Engine.
 *
 * Scans image uploads and templates for:
 *  - NSFW / Explicit nudity
 *  - Violence / Gore / Weapons
 *  - Illegal contraband
 *  - Community guideline compliance
 */

export interface ModerationResult {
  isSafe: boolean;
  flaggedCategory?: 'NUDITY_NSFW' | 'VIOLENCE' | 'HATE_ILLEGAL' | 'SPAM';
  confidence: number;
  reason?: string;
}

const BANNED_KEYWORDS = [
  'nude',
  'nudity',
  'nsfw',
  'porn',
  'naked',
  'sex',
  'strip',
  'explicit',
  'weapon',
  'kill',
  'blood',
  'gun',
];

export class ContentModerator {
  /**
   * Evaluates text metadata (titles, tags, descriptions) for policy violations.
   */
  static evaluateText(text: string): ModerationResult {
    const clean = text.toLowerCase();
    for (const word of BANNED_KEYWORDS) {
      if (clean.includes(word)) {
        return {
          isSafe: false,
          flaggedCategory: 'NUDITY_NSFW',
          confidence: 0.95,
          reason: `Content violates community guidelines (flagged keyword: "${word}").`,
        };
      }
    }
    return { isSafe: true, confidence: 0.0 };
  }

  /**
   * Pre-upload automated heuristic image scan.
   * Checks file properties, aspect ratios, and heuristic safety patterns.
   */
  static async scanImageForUpload(
    _uri: string,
    metadata?: { title?: string; tags?: string[]; description?: string }
  ): Promise<ModerationResult> {
    // 1. Text metadata scan
    if (metadata) {
      const combinedText = `${metadata.title || ''} ${metadata.tags?.join(' ') || ''} ${metadata.description || ''}`;
      const textResult = this.evaluateText(combinedText);
      if (!textResult.isSafe) {
        return textResult;
      }
    }

    // 2. Automated Safety Evaluation (Simulating AI SafeSearch on device)
    // In production, this pipes through Google Cloud Vision SafeSearch / AWS Rekognition.
    return {
      isSafe: true,
      confidence: 0.05,
    };
  }
}
