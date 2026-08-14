/**
 * useInterFont — loads Inter font weights via expo-font.
 *
 * • If @expo-google-fonts/inter is available, loads the four standard weights.
 * • If the package is absent or loading fails, falls back to system sans-serif
 *   (returns fontsLoaded: true immediately so the app renders without blocking).
 *
 * [Req 32]
 */
import { useEffect, useState } from 'react';
import * as Font from 'expo-font';

// Font family name constants matching the weight files in @expo-google-fonts/inter
export const INTER_FONTS = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semiBold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
} as const;

export interface UseInterFontResult {
  /** True once fonts are loaded OR after graceful fallback to system font. */
  fontsLoaded: boolean;
  /** Non-null when a font-load error occurred (app continues with system font). */
  fontError: Error | null;
  /**
   * Resolved font family names to pass into Text / StyleSheet.
   * Undefined values mean "use system default".
   */
  fontFamily: {
    regular: string | undefined;
    medium: string | undefined;
    semiBold: string | undefined;
    bold: string | undefined;
  };
}

/**
 * Attempt to require @expo-google-fonts/inter font assets.
 * Returns null if the package is not installed.
 */
function tryRequireInterAssets(): Record<string, number> | null {
  try {
    // Dynamic require so the module is optional — no compile-time dependency.
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const pkg = require('@expo-google-fonts/inter');
    return {
      [INTER_FONTS.regular]: pkg.Inter_400Regular,
      [INTER_FONTS.medium]: pkg.Inter_500Medium,
      [INTER_FONTS.semiBold]: pkg.Inter_600SemiBold,
      [INTER_FONTS.bold]: pkg.Inter_700Bold,
    };
  } catch {
    return null;
  }
}

/**
 * Hook that loads Inter font weights and returns load status.
 *
 * Usage:
 * ```tsx
 * const { fontsLoaded, fontError, fontFamily } = useInterFont();
 * ```
 *
 * [Req 32]
 */
export function useInterFont(): UseInterFontResult {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [fontError, setFontError] = useState<Error | null>(null);
  const [fontFamily, setFontFamily] = useState<UseInterFontResult['fontFamily']>({
    regular: undefined,
    medium: undefined,
    semiBold: undefined,
    bold: undefined,
  });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const assets = tryRequireInterAssets();

      if (!assets) {
        // Package not installed — use system font immediately
        if (!cancelled) {
          setFontsLoaded(true);
        }
        return;
      }

      try {
        await Font.loadAsync(assets);
        if (!cancelled) {
          setFontFamily({
            regular: INTER_FONTS.regular,
            medium: INTER_FONTS.medium,
            semiBold: INTER_FONTS.semiBold,
            bold: INTER_FONTS.bold,
          });
          setFontsLoaded(true);
        }
      } catch (err) {
        // Font load failed — fall back to system sans-serif gracefully
        if (!cancelled) {
          setFontError(err instanceof Error ? err : new Error(String(err)));
          setFontsLoaded(true); // allow app to continue
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return { fontsLoaded, fontError, fontFamily };
}
