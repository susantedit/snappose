/**
 * POSEHANUM — Central Brand Configuration & Design Constants
 *
 * Source of truth for all brand names, taglines, positioning,
 * URLs, support endpoints, and store listings.
 */

export const BRAND_CONFIG = {
  name: 'POSEHANUM',
  shortName: 'POSEHANUM',
  productName: 'POSEHANUM AI Pose Coach',
  categoryPositioning: 'AI Photography & Pose Assistant',
  meaning: '"Hanum" is inspired by the Nepali expression for "let\'s do/take it." POSEHANUM = "Let\'s take the pose / Let\'s capture the shot."',
  primaryTagline: 'Pose Garौँ. Perfect Shot Lिऔँ.',
  englishTagline: "Let's Pose. Let's Capture.",
  secondaryTagline: 'Pose Smarter. Capture Better.',
  promise: 'POSEHANUM guides you from "How should I pose?" to "That\'s the shot."',
  version: '1.0.0',
  buildNumber: 1,

  urls: {
    website: 'https://posehanum.app',
    privacyPolicy: 'https://posehanum.app/privacy',
    termsOfService: 'https://posehanum.app/terms',
    googlePlay: 'https://play.google.com/store/apps/details?id=com.example.snappose',
    feedbackEmail: 'susantedit@gmail.com',
  },

  creator: {
    name: 'Susant Luitel',
    alias: 'Kantaraj Luitel',
    email: 'susantedit@gmail.com',
    links: {
      github: 'https://github.com/susantedit',
      instagram: 'https://instagram.com/susantgamerz',
      facebook: 'https://facebook.com/Kantaraj.Luitel',
      linkedin: 'https://linkedin.com/in/kantaraj-luitel',
      pinterest: 'https://pinterest.com/susantluitel',
      tiktok: 'https://tiktok.com/@vortexeditz34',
      x: 'https://x.com/Susantedit',
      reddit: 'https://reddit.com/user/Successful-Twist2608',
      codepen: 'https://codepen.io/susant-gamerz',
      whatsapp: 'https://wa.me/9779708838261',
    },
  },

  colors: {
    cream: '#F6F1E7',
    olive: '#65744A',
    lime: '#B7FF00',
    cyan: '#00D9FF',
    orange: '#FF8A00',
    dark: '#181818',
  },
} as const;

export type BrandConfig = typeof BRAND_CONFIG;
