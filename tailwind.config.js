/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // ----------------------------------------------------------------
        // Snap Pose Design Tokens — brand / backgrounds
        // ----------------------------------------------------------------
        'sp-cream': '#F6F1E7',
        'sp-olive': '#65744A',
        'sp-olive-dark': '#4F5B38',
        'sp-dark-accent': '#7E9261',
        'sp-dark': '#181818',
        'sp-charcoal': '#2C2C2C',

        // Surfaces
        'sp-surface': '#FFFFFF',
        'sp-surface-dark': '#1E1E1E',
        'sp-card': '#FFFFFF',
        'sp-dark-card': '#242424',

        // Borders / dividers
        'sp-border': '#E8E3D8',
        'sp-border-dark': '#333333',
        'sp-divider': '#E7DFD5',

        // ----------------------------------------------------------------
        // Text
        // ----------------------------------------------------------------
        'sp-text-primary': '#2B241F',
        'sp-text-secondary': '#756B63',
        'sp-text-disabled': '#C7C1B8',
        'sp-disabled': '#C7C1B8',

        // ----------------------------------------------------------------
        // Pose score colours
        // ----------------------------------------------------------------
        'score-red': '#F44336',
        'score-orange': '#FF8A00',
        'score-green': '#4CAF50',
        'score-dark-green': '#2E7D32',

        // ----------------------------------------------------------------
        // Semantic
        // ----------------------------------------------------------------
        'sp-error': '#F44336',
        'sp-warning': '#FFB300',
        'sp-success': '#4CAF50',
        'sp-info': '#2196F3',

        // ----------------------------------------------------------------
        // Gradient stops (for bg-* utilities on gradient anchors)
        // ----------------------------------------------------------------
        'sp-gradient-warm-start': '#F6F1E7',
        'sp-gradient-warm-end': '#ECE4D4',
        'sp-gradient-olive-start': '#65744A',
        'sp-gradient-olive-end': '#4F5B38',
        'sp-gradient-gold-start': '#D6B76A',
        'sp-gradient-gold-end': '#C9A04F',
      },

      // ------------------------------------------------------------------
      // Font families — Inter weights with system fallback
      // ------------------------------------------------------------------
      fontFamily: {
        'inter': ['Inter_400Regular', 'sans-serif'],
        'inter-medium': ['Inter_500Medium', 'sans-serif'],
        'inter-semibold': ['Inter_600SemiBold', 'sans-serif'],
        'inter-bold': ['Inter_700Bold', 'sans-serif'],
      },

      // ------------------------------------------------------------------
      // Spacing extras
      // ------------------------------------------------------------------
      spacing: {
        '18': '72px',
        '14': '56px',
      },

      // ------------------------------------------------------------------
      // Border radius — matches BorderRadius in designTokens.ts
      // ------------------------------------------------------------------
      borderRadius: {
        'sp-sm': '8px',
        'sp-md': '16px',
        'sp-lg': '24px',
        'sp-card': '24px',
        'sp-button': '18px',
        'sp-bottom-sheet': '32px',
        // Legacy aliases kept for backward compat
        'sp': '16px',
        'sp-old-lg': '20px',
      },

      // ------------------------------------------------------------------
      // Animation / transition durations — matches AnimationDurations
      // ------------------------------------------------------------------
      transitionDuration: {
        'sp-quick': '120ms',
        'sp-medium': '220ms',
        'sp-long': '350ms',
        'sp-hero': '450ms',
        'sp-splash': '400ms',
      },
      animationDuration: {
        'sp-quick': '120ms',
        'sp-medium': '220ms',
        'sp-long': '350ms',
        'sp-hero': '450ms',
        'sp-splash': '400ms',
      },
    },
  },
  plugins: [],
};
