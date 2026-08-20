/**
 * Snap Pose design tokens — single source of truth for all visual constants.
 * [Req 32]
 */

// ---------------------------------------------------------------------------
// Colors
// ---------------------------------------------------------------------------

export const Colors = {
  // Brand / backgrounds
  /** Primary warm-cream background */
  cream: '#F6F1E7',
  /** Primary olive-green accent */
  olive: '#65744A',
  /** Dark olive (secondary accent / navigation active) */
  oliveDark: '#4F5B38',
  /** Forest green */
  forest: '#28351D',
  /** Muted gray/gold */
  muted: '#8A8A78',
  /** Gold accent */
  gold: '#C99A45',
  /** Neon Lime brand accent */
  lime: '#B7FF00',
  /** Electric Cyan brand accent */
  cyan: '#00D9FF',
  /** Dark-mode accent */
  darkAccent: '#7E9261',
  /** Near-black app dark */
  dark: '#181818',
  charcoal: '#2C2C2C',

  // Surfaces
  surface: '#FFFFFF',
  /** Card background — explicitly white */
  cardBackground: '#FFFFFF',
  surfaceDark: '#1E1E1E',
  /** Dark-mode card surface */
  darkCardBackground: '#242424',
  border: '#E8E3D8',
  borderDark: '#333333',
  /** Divider / hairline */
  divider: '#E7DFD5',

  // Text
  /** Design-doc text primary */
  textPrimary: '#2B241F',
  /** Design-doc text secondary */
  textSecondary: '#756B63',
  textDisabled: '#C7C1B8',
  /** Disabled surface / controls */
  disabled: '#C7C1B8',
  textInverse: '#FFFFFF',

  // Pose score
  scoreRed: '#F44336',
  scoreOrange: '#FF8A00',
  scoreGreen: '#4CAF50',
  scoreDarkGreen: '#2E7D32',

  // Semantic
  error: '#F44336',
  /** Warning — amber per design doc */
  warning: '#FFB300',
  success: '#4CAF50',
  info: '#2196F3',
} as const;

// ---------------------------------------------------------------------------
// Gradients
// ---------------------------------------------------------------------------

/**
 * Two-stop gradient colour pairs.  Index 0 = top/start, index 1 = bottom/end.
 * [Req 32]
 */
export const Gradients = {
  warmMorning: ['#F6F1E7', '#ECE4D4'] as [string, string],
  oliveSunset: ['#65744A', '#4F5B38'] as [string, string],
  premiumGold: ['#D6B76A', '#C9A04F'] as [string, string],
} as const;

// ---------------------------------------------------------------------------
// Shadows
// ---------------------------------------------------------------------------

/**
 * Platform-agnostic shadow descriptors (opacity, blur radius, y-offset).
 * Use with react-native-skia or platform shadow props.
 * [Req 32]
 */
export const Shadows = {
  small: { opacity: 0.08, blur: 8, y: 2 },
  medium: { opacity: 0.10, blur: 16, y: 4 },
  large: { opacity: 0.12, blur: 24, y: 8 },
} as const;

// ---------------------------------------------------------------------------
// Elevation
// ---------------------------------------------------------------------------

/**
 * Android Material-style elevation values (also used for z-index layering).
 * [Req 32]
 */
export const Elevation = {
  card: 2,
  dialog: 8,
  bottomSheet: 12,
  fab: 16,
} as const;

// ---------------------------------------------------------------------------
// Animation durations (ms)
// ---------------------------------------------------------------------------

/**
 * Canonical animation durations used across the app.
 * [Req 32]
 */
export const AnimationDurations = {
  /** 120 ms — micro interactions, icon taps */
  quick: 120,
  /** 220 ms — standard UI transitions */
  medium: 220,
  /** 350 ms — page-level transitions */
  long: 350,
  /** 450 ms — hero/shared-element transitions */
  hero: 450,
  /** 400 ms — splash fade */
  splash: 400,
} as const;

// ---------------------------------------------------------------------------
// Spacing
// ---------------------------------------------------------------------------

/**
 * 4-pt base spacing grid.
 * [Req 32]
 */
export const Spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
  huge: 48,
  giant: 64,
  massive: 80,
  colossal: 96,
} as const;

// ---------------------------------------------------------------------------
// Border radius
// ---------------------------------------------------------------------------

/**
 * Canonical border-radius values per design doc.
 * [Req 32]
 */
export const BorderRadius = {
  sm: 8,
  md: 16,
  lg: 24,
  card: 24,
  button: 18,
  avatar: 9999,
  bottomSheet: 32,
  /** Legacy alias — prefer `avatar` */
  full: 9999,
} as const;

// ---------------------------------------------------------------------------
// Typography
// ---------------------------------------------------------------------------

/**
 * Type scale and weight constants.
 * [Req 32]
 */
export const Typography = {
  sizes: {
    caption: 12,
    small: 14,
    body: 16,
    subtitle: 18,
    title: 20,
    h3: 24,
    h2: 30,
    h1: 36,
    display: 48,
    // Legacy aliases
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
  },
  /**
   * Standardized 3-tier typographic weight system:
   *  - Headers & Titles: 700 (Bold)
   *  - Subheaders & Labels: 500 (Medium)
   *  - Body & Paragraphs: 400 (Regular)
   */
  weights: {
    header: '700' as const,
    subheader: '500' as const,
    body: '400' as const,
    // Canonical aliases
    bold: '700' as const,
    medium: '500' as const,
    regular: '400' as const,
    semibold: '500' as const, // Mapped to subheader
  },
} as const;

// ---------------------------------------------------------------------------
// Layout
// ---------------------------------------------------------------------------

/**
 * Fixed layout measurements.
 * [Req 32]
 */
export const Layout = {
  bottomNavHeight: 72,
  fabSize: 64,
  fabSizeLegacy: 72,
  minTouchTarget: 48,
  headerHeight: 56,
  buttonHeight: 56,
  inputHeight: 56,
  cardPadding: 20,
  cardSpacing: 16,
} as const;
