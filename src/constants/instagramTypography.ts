/**
 * Instagram Typography System (August 2026 Brand Refresh).
 *
 * Implements the Instagram typography suite:
 *  • Instagram Sans (Primary Brand & UI Headline)
 *  • Instagram Pen (Hand-drawn handwriting typeface)
 *  • Instagram Mono (Monospace typeface)
 *
 * Plus the 13 Instagram Stories & Reels text styles:
 *  1. Classic    2. Modern     3. Neon        4. Typewriter   5. Strong
 *  6. Signature  7. Editor     8. Bubble      9. Deco        10. Poster
 * 11. Squeeze   12. Rosalia   13. Instagram Pen
 */

import { Platform, TextStyle } from 'react-native';

export type InstagramFontStyle =
  | 'sans'
  | 'sansHeadline'
  | 'pen'
  | 'mono'
  | 'classic'
  | 'modern'
  | 'neon'
  | 'typewriter'
  | 'strong'
  | 'signature'
  | 'editor'
  | 'bubble'
  | 'deco'
  | 'poster'
  | 'squeeze'
  | 'rosalia';

export const InstagramFonts = {
  sans: {
    fontFamily: Platform.select({
      ios: 'System',
      android: 'sans-serif',
      default: 'sans-serif',
    }),
    fontWeight: '600' as const,
    letterSpacing: -0.2,
  },
  sansHeadline: {
    fontFamily: Platform.select({
      ios: 'System',
      android: 'sans-serif-medium',
      default: 'sans-serif',
    }),
    fontWeight: '800' as const,
    letterSpacing: -0.5,
  },
  pen: {
    fontFamily: Platform.select({
      ios: 'Snell Roundhand',
      android: 'casual',
      default: 'cursive',
    }),
    fontWeight: '500' as const,
    letterSpacing: 0.2,
  },
  mono: {
    fontFamily: Platform.select({
      ios: 'Courier',
      android: 'monospace',
      default: 'monospace',
    }),
    fontWeight: '500' as const,
    letterSpacing: 0.5,
  },
};

/**
 * 13 Instagram Story & Reel Style Presets with exact typography, container styling & shadows.
 */
export const StoryTextStyles: Record<
  InstagramFontStyle,
  {
    textStyle: TextStyle;
    containerStyle?: {
      backgroundColor?: string;
      paddingHorizontal?: number;
      paddingVertical?: number;
      borderRadius?: number;
    };
  }
> = {
  sans: {
    textStyle: {
      ...InstagramFonts.sans,
      fontSize: 16,
      color: '#FFFFFF',
    },
  },
  sansHeadline: {
    textStyle: {
      ...InstagramFonts.sansHeadline,
      fontSize: 22,
      color: '#FFFFFF',
    },
  },
  pen: {
    textStyle: {
      ...InstagramFonts.pen,
      fontSize: 20,
      color: '#FFFFFF',
      fontStyle: 'italic',
    },
  },
  mono: {
    textStyle: {
      ...InstagramFonts.mono,
      fontSize: 15,
      color: '#FFFFFF',
    },
  },
  classic: {
    textStyle: {
      fontFamily: Platform.select({ ios: 'System', android: 'sans-serif', default: 'sans-serif' }),
      fontWeight: '600',
      fontSize: 18,
      color: '#FFFFFF',
      textAlign: 'center',
    },
  },
  modern: {
    textStyle: {
      fontFamily: Platform.select({ ios: 'System', android: 'sans-serif-light', default: 'sans-serif' }),
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: 3.5,
      fontSize: 16,
      color: '#FFFFFF',
      textAlign: 'center',
    },
  },
  neon: {
    textStyle: {
      fontFamily: Platform.select({ ios: 'System', android: 'casual', default: 'sans-serif' }),
      fontWeight: '700',
      fontSize: 20,
      color: '#FFFFFF',
      textShadowColor: 'rgba(255, 45, 85, 0.9)',
      textShadowOffset: { width: 0, height: 0 },
      textShadowRadius: 12,
      fontStyle: 'italic',
    },
  },
  typewriter: {
    textStyle: {
      fontFamily: Platform.select({ ios: 'Courier', android: 'monospace', default: 'monospace' }),
      fontWeight: '600',
      fontSize: 16,
      color: '#000000',
      letterSpacing: 0.5,
    },
    containerStyle: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
    },
  },
  strong: {
    textStyle: {
      fontFamily: Platform.select({ ios: 'System', android: 'sans-serif-black', default: 'sans-serif' }),
      fontWeight: '900',
      fontSize: 20,
      color: '#FFFFFF',
      textTransform: 'uppercase',
      letterSpacing: -0.5,
    },
    containerStyle: {
      backgroundColor: '#000000',
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 6,
    },
  },
  signature: {
    textStyle: {
      fontFamily: Platform.select({ ios: 'Snell Roundhand', android: 'casual', default: 'cursive' }),
      fontSize: 22,
      fontWeight: '600',
      color: '#FFFFFF',
    },
  },
  editor: {
    textStyle: {
      fontFamily: Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' }),
      fontSize: 18,
      fontWeight: '500',
      fontStyle: 'italic',
      color: '#FFFFFF',
      letterSpacing: 0.3,
    },
  },
  bubble: {
    textStyle: {
      fontFamily: Platform.select({ ios: 'System', android: 'sans-serif-medium', default: 'sans-serif' }),
      fontWeight: '800',
      fontSize: 17,
      color: '#000000',
      letterSpacing: 0.2,
    },
    containerStyle: {
      backgroundColor: '#FFFFFF',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
    },
  },
  deco: {
    textStyle: {
      fontFamily: Platform.select({ ios: 'Optima', android: 'sans-serif-condensed', default: 'sans-serif' }),
      fontSize: 19,
      fontWeight: '700',
      letterSpacing: 2.0,
      textTransform: 'uppercase',
      color: '#F4D03F',
    },
  },
  poster: {
    textStyle: {
      fontFamily: Platform.select({ ios: 'Impact', android: 'sans-serif-black', default: 'sans-serif' }),
      fontSize: 24,
      fontWeight: '900',
      textTransform: 'uppercase',
      color: '#FFFFFF',
      letterSpacing: -0.8,
    },
    containerStyle: {
      backgroundColor: '#E1306C', // Instagram Gradient Pink
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
    },
  },
  squeeze: {
    textStyle: {
      fontFamily: Platform.select({ ios: 'System', android: 'sans-serif-condensed', default: 'sans-serif' }),
      fontSize: 22,
      fontWeight: '900',
      letterSpacing: -1.2,
      textTransform: 'uppercase',
      color: '#FFFFFF',
    },
  },
  rosalia: {
    textStyle: {
      fontFamily: Platform.select({ ios: 'Chalkboard SE', android: 'casual', default: 'cursive' }),
      fontSize: 21,
      fontWeight: '700',
      color: '#FFFFFF',
      textShadowColor: 'rgba(0, 0, 0, 0.8)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 4,
    },
  },
};
