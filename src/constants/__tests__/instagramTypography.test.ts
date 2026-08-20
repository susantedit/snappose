/**
 * instagramTypography.test.ts — Verification of the Instagram August 2026 Typography System.
 */

import { InstagramFonts, StoryTextStyles, InstagramFontStyle } from '../instagramTypography';
import { lightTheme, darkTheme } from '../theme';

describe('Instagram August 2026 Typography System', () => {
  describe('1. Core Brand Typefaces', () => {
    it('defines Instagram Sans with modern geometric grotesk properties', () => {
      expect(InstagramFonts.sans).toBeDefined();
      expect(InstagramFonts.sans.fontWeight).toBe('600');
      expect(InstagramFonts.sans.letterSpacing).toBe(-0.2);
    });

    it('defines Instagram Sans Headline with bold title proportions', () => {
      expect(InstagramFonts.sansHeadline).toBeDefined();
      expect(InstagramFonts.sansHeadline.fontWeight).toBe('800');
    });

    it('defines Instagram Pen hand-drawn handwriting font', () => {
      expect(InstagramFonts.pen).toBeDefined();
      expect(InstagramFonts.pen.fontFamily).toBeDefined();
    });

    it('defines Instagram Mono clean monospace font', () => {
      expect(InstagramFonts.mono).toBeDefined();
      expect(InstagramFonts.mono.letterSpacing).toBe(0.5);
    });
  });

  describe('2. Stories & Reels Text Styles Suite', () => {
    const requiredStyles: InstagramFontStyle[] = [
      'classic',
      'modern',
      'neon',
      'typewriter',
      'strong',
      'signature',
      'editor',
      'bubble',
      'deco',
      'poster',
      'squeeze',
      'rosalia',
    ];

    it.each(requiredStyles)('contains styling configuration for %s style', (styleName) => {
      const config = StoryTextStyles[styleName];
      expect(config).toBeDefined();
      expect(config.textStyle).toBeDefined();
      expect(config.textStyle.fontSize).toBeGreaterThan(12);
    });

    it('configures sticker background for Typewriter, Strong, Bubble, and Poster', () => {
      expect(StoryTextStyles.typewriter.containerStyle?.backgroundColor).toBeDefined();
      expect(StoryTextStyles.strong.containerStyle?.backgroundColor).toBe('#000000');
      expect(StoryTextStyles.bubble.containerStyle?.borderRadius).toBe(20);
      expect(StoryTextStyles.poster.containerStyle?.backgroundColor).toBe('#E1306C');
    });

    it('configures glowing shadow effects for Neon style', () => {
      expect(StoryTextStyles.neon.textStyle.textShadowRadius).toBe(12);
      expect(StoryTextStyles.neon.textStyle.textShadowColor).toContain('255, 45, 85');
    });
  });

  describe('3. Integration into Theme System', () => {
    it('exposes instagramFonts and storyTextStyles on lightTheme and darkTheme', () => {
      expect(lightTheme.instagramFonts).toBe(InstagramFonts);
      expect(darkTheme.instagramFonts).toBe(InstagramFonts);
      expect(lightTheme.storyTextStyles).toBe(StoryTextStyles);
      expect(darkTheme.storyTextStyles).toBe(StoryTextStyles);
    });
  });
});
