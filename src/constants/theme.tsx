/**
 * Snap Pose theme system.
 *
 * • Light / dark / system modes backed by MMKV key `theme`
 * • 200 ms cross-fade overlay on theme change
 * • Exports ThemeProvider, useTheme, lightTheme, darkTheme
 *
 * [Req 32]
 */
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { StyleSheet, useColorScheme, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { mmkv } from '@/database/mmkv/mmkvClient';
import { MMKV_KEYS } from '@/database/mmkv/keys';
import { AnimationDurations, Colors } from './designTokens';
import { InstagramFonts, StoryTextStyles, type InstagramFontStyle } from './instagramTypography';
export type { InstagramFontStyle };

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ThemeMode = 'light' | 'dark' | 'system';

/** Font-family token set. Values are Inter weight names or undefined (system). */
export interface FontFamily {
  regular: string | undefined;
  medium: string | undefined;
  semiBold: string | undefined;
  bold: string | undefined;
}

export interface Theme {
  mode: 'light' | 'dark';
  colors: {
    background: string;
    surface: string;
    cardBackground: string;
    border: string;
    divider: string;
    textPrimary: string;
    textSecondary: string;
    textDisabled: string;
    textInverse: string;
    olive: string;
    oliveDark: string;
    accent: string;
    tabBar: string;
    tabBarBorder: string;
    statusBar: 'light' | 'dark';
  };
  /** Inter weight font families (undefined → system sans-serif). */
  fontFamily: FontFamily;
  /** Instagram 2026 Typography Suite (Sans, Pen, Mono). */
  instagramFonts: typeof InstagramFonts;
  /** 13 Instagram Stories & Reels Style Presets. */
  storyTextStyles: typeof StoryTextStyles;
}

// ---------------------------------------------------------------------------
// Font families — updated by useInterFont when fonts load
// ---------------------------------------------------------------------------

/**
 * Default font families before Inter loads (system sans-serif).
 * useInterFont updates this once fonts are ready.
 */
export let resolvedFontFamily: FontFamily = {
  regular: undefined,
  medium: undefined,
  semiBold: undefined,
  bold: undefined,
};

// ---------------------------------------------------------------------------
// Static theme objects
// ---------------------------------------------------------------------------

export const lightTheme: Theme = {
  mode: 'light',
  colors: {
    background: Colors.cream,
    surface: Colors.surface,
    cardBackground: Colors.cardBackground,
    border: Colors.border,
    divider: Colors.divider,
    textPrimary: Colors.textPrimary,
    textSecondary: Colors.textSecondary,
    textDisabled: Colors.textDisabled,
    textInverse: Colors.textInverse,
    olive: Colors.olive,
    oliveDark: Colors.oliveDark,
    accent: Colors.olive,
    tabBar: 'rgba(246,241,231,0.85)',
    tabBarBorder: 'rgba(232,227,216,0.6)',
    statusBar: 'dark',
  },
  fontFamily: resolvedFontFamily,
  instagramFonts: InstagramFonts,
  storyTextStyles: StoryTextStyles,
};

export const darkTheme: Theme = {
  mode: 'dark',
  colors: {
    background: Colors.dark,
    surface: Colors.surfaceDark,
    cardBackground: Colors.darkCardBackground,
    border: Colors.borderDark,
    divider: Colors.borderDark,
    textPrimary: Colors.textInverse,
    textSecondary: '#D1D1D6', // Lightened high-contrast grey (WCAG AA compliant)
    textDisabled: '#7A7A80',
    textInverse: Colors.textPrimary,
    olive: Colors.olive,
    oliveDark: Colors.oliveDark,
    accent: Colors.darkAccent,
    tabBar: 'rgba(24,24,24,0.85)',
    tabBarBorder: 'rgba(51,51,51,0.6)',
    statusBar: 'light',
  },
  fontFamily: resolvedFontFamily,
  instagramFonts: InstagramFonts,
  storyTextStyles: StoryTextStyles,
};

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

export interface ThemeContextValue {
  theme: Theme;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

/**
 * Wraps children with the current theme and renders a full-screen cross-fade
 * overlay (pointerEvents="none") that animates during theme changes.
 *
 * Cross-fade sequence:
 *   1. Fade overlay IN  (0→1, `AnimationDurations.quick` = 100 ms)
 *   2. Swap active theme state
 *   3. Fade overlay OUT (1→0, `AnimationDurations.quick` = 100 ms)
 *   Total ≈ 200 ms
 *
 * [Req 32]
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();

  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    const stored = mmkv.getString(MMKV_KEYS.THEME) as ThemeMode | undefined;
    return stored ?? 'system';
  });

  const resolvedMode: 'light' | 'dark' =
    themeMode === 'system' ? (systemScheme ?? 'light') : themeMode;

  const [activeTheme, setActiveTheme] = useState<Theme>(
    resolvedMode === 'dark' ? darkTheme : lightTheme,
  );

  // Track the colour the overlay should flash — the *next* theme's background
  const overlayColorRef = useRef<string>(Colors.cream);

  /** Shared value for cross-fade overlay opacity (0 = hidden, 1 = fully visible). */
  const fadeOpacity = useSharedValue(0);

  const setThemeMode = useCallback(
    (mode: ThemeMode) => {
      const nextResolvedMode: 'light' | 'dark' =
        mode === 'system' ? (systemScheme ?? 'light') : mode;
      const nextTheme = nextResolvedMode === 'dark' ? darkTheme : lightTheme;

      // Choose overlay colour = next theme background so the fade looks seamless
      overlayColorRef.current = nextTheme.colors.background;

      // Step 1 — fade IN
      const halfDuration = AnimationDurations.quick; // 120 ms each half ≈ 240 ms total
      fadeOpacity.value = withTiming(1, { duration: halfDuration }, (finished) => {
        if (finished) {
          // Step 2 — swap theme (runs on JS thread via runOnJS pattern-free setter)
          // We use a React.startTransition-safe approach: schedule on next tick
          fadeOpacity.value = withTiming(0, { duration: halfDuration });
        }
      });

      // Swap state immediately when fade starts — visually hidden by overlay
      setActiveTheme(nextTheme);
      setThemeModeState(mode);
      mmkv.set(MMKV_KEYS.THEME, mode);
    },
    [fadeOpacity, systemScheme],
  );

  // Re-resolve when system scheme changes and mode is 'system'
  useEffect(() => {
    if (themeMode === 'system') {
      setActiveTheme(systemScheme === 'dark' ? darkTheme : lightTheme);
    }
  }, [systemScheme, themeMode]);

  const overlayAnimatedStyle = useAnimatedStyle(() => ({
    opacity: fadeOpacity.value,
  }));

  // Memoize the context value so consumers (every screen, tab bar, cards)
  // don't re-render on unrelated ThemeProvider re-renders.
  const contextValue = useMemo<ThemeContextValue>(
    () => ({ theme: activeTheme, themeMode, setThemeMode }),
    [activeTheme, themeMode, setThemeMode],
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      <View style={styles.container}>
        {children}
        {/* Cross-fade overlay — renders above children, never intercepts touches */}
        <Animated.View
          style={[
            styles.overlay,
            overlayAnimatedStyle,
            { backgroundColor: overlayColorRef.current },
          ]}
          pointerEvents="none"
        />
      </View>
    </ThemeContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Returns the current theme and a setter for theme mode.
 * Must be used within ThemeProvider.
 */
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return ctx;
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
  },
});
