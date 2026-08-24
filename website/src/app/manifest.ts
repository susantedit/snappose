import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'POSEHANUM — AI Pose Coach & Photography Assistant',
    short_name: 'POSEHANUM',
    description:
      'Pose Garौँ. Perfect Shot Lिऔँ. Real-time AI pose matching, AR skeleton guidance, voice coaching, and smart auto capture.',
    start_url: '/',
    display: 'standalone',
    background_color: '#070A08',
    theme_color: '#B7FF00',
    icons: [
      {
        src: '/icon.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
