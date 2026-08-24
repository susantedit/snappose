import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  themeColor: '#070A08',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: 'POSEHANUM — AI Pose Coach & Photography Assistant',
  description:
    'POSEHANUM is your visual path to the perfect shot. Pose Garौँ. Perfect Shot Lिऔँ. Real-time AI pose matching, AR skeleton guidance, voice coaching, and smart auto capture for effortless, natural photos.',
  keywords: [
    'POSEHANUM',
    'AI pose coach',
    'AI photography assistant',
    'photo pose ideas',
    'how to pose for photos',
    'AI camera',
    'pose matching',
    'photography pose guide',
    'selfie pose ideas',
    'portrait pose ideas',
    'travel photography poses',
    'fashion poses',
    'Instagram poses',
    'photographer assistant',
    'AI photo guidance',
  ],
  authors: [{ name: 'Susant Luitel (Kantaraj)', url: 'https://github.com/susantedit' }],
  creator: 'Susant Luitel',
  publisher: 'POSEHANUM',
  metadataBase: new URL('https://www.posehanum.tech'),
  openGraph: {
    title: 'POSEHANUM — AI Pose Coach & Photography Assistant',
    description:
      'Pose Garौँ. Perfect Shot Lिऔँ. POSEHANUM turns your phone into a real-time AI photography assistant with live pose matching and voice coaching.',
    url: 'https://www.posehanum.tech',
    siteName: 'POSEHANUM',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://www.posehanum.tech/og-image.png',
        width: 1200,
        height: 630,
        alt: 'POSEHANUM — AI Pose Coach & Photography Assistant',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'POSEHANUM — AI Pose Coach & Photography Assistant',
    description:
      'Pose Garौँ. Perfect Shot Lिऔँ. Real-time AI pose matching, voice coaching, and smart auto-capture.',
    creator: '@Susantedit',
    images: ['https://www.posehanum.tech/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/icon.png', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    shortcut: '/icon.png',
    apple: '/icon.png',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareApplication',
      '@id': 'https://www.posehanum.tech/#software',
      name: 'POSEHANUM',
      operatingSystem: 'Android, iOS',
      applicationCategory: 'PhotographyApplication',
      offers: {
        '@type': 'Offer',
        price: '0.00',
        priceCurrency: 'USD',
      },
      description:
        'POSEHANUM is an AI-powered photography and pose assistant that guides posture with real-time 33-landmark skeleton matching, voice coaching, distance AI, and hands-free auto capture.',
    },
    {
      '@type': 'MobileApplication',
      '@id': 'https://www.posehanum.tech/#app',
      name: 'POSEHANUM — AI Pose Coach',
      operatingSystem: 'Android, iOS',
      applicationCategory: 'PhotographyApplication',
      offers: {
        '@type': 'Offer',
        price: '0.00',
        priceCurrency: 'USD',
      },
    },
    {
      '@type': 'Organization',
      '@id': 'https://www.posehanum.tech/#organization',
      name: 'POSEHANUM',
      url: 'https://www.posehanum.tech',
      logo: 'https://www.posehanum.tech/logo.png',
      founder: {
        '@type': 'Person',
        name: 'Susant Luitel',
        url: 'https://github.com/susantedit',
      },
      sameAs: [
        'https://github.com/susantedit',
        'https://instagram.com/susantgamerz',
        'https://facebook.com/Kantaraj.Luitel',
        'https://linkedin.com/in/kantaraj-luitel',
        'https://pinterest.com/susantluitel',
        'https://reddit.com/user/Successful-Twist2608',
        'https://tiktok.com/@vortexeditz34',
        'https://x.com/Susantedit',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': 'https://www.posehanum.tech/#website',
      url: 'https://www.posehanum.tech',
      name: 'POSEHANUM',
      description: 'Pose Garौँ. Perfect Shot Lिऔँ. (Let\'s Pose. Let\'s Capture.)',
      publisher: {
        '@id': 'https://www.posehanum.tech/#organization',
      },
    },
    {
      '@type': 'HowTo',
      '@id': 'https://www.posehanum.tech/#howto',
      name: 'How to Recreate a Reference Pose with AI Pose Matching',
      description: 'Step-by-step method to align your body posture with a reference photo using real-time AI guidance.',
      step: [
        {
          '@type': 'HowToStep',
          name: 'Select Reference Pose',
          text: 'Choose a curated pose from categories or upload your own custom ghost template.',
        },
        {
          '@type': 'HowToStep',
          name: 'Follow Real-Time Skeleton Cues',
          text: 'Align your limbs with the glowing AR skeleton overlay as colors transition from Orange to Lime Green.',
        },
        {
          '@type': 'HowToStep',
          name: 'Hold Alignment for Auto Capture',
          text: 'Sustain a 90%+ match score for 2 seconds to automatically trigger the hands-free camera shutter.',
        },
      ],
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://www.posehanum.tech/#faq',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is POSEHANUM and how does it work?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'POSEHANUM is an AI-powered camera and pose coaching mobile app that uses real-time 33-point computer vision landmark detection, voice coaching, and smart auto-capture to help you take perfect photos.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is AI pose matching and how accurate is it?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'AI pose matching evaluates real-time human anatomical joint landmarks via MediaPipe neural models, calculating sub-millimeter angular deviation with 0–100% alignment scoring.',
          },
        },
        {
          '@type': 'Question',
          name: 'Are my live camera video frames uploaded to the cloud or saved anywhere?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Zero cloud uploads. POSEHANUM operates with a strict 100% on-device AI architecture. Live camera frames exist only in volatile RAM for milliseconds during active scoring.',
          },
        },
        {
          '@type': 'Question',
          name: 'How does the spoken voice coach guide me when standing far from the phone?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'POSEHANUM features a 650+ scenario audio coaching engine that whispers real-time micro-posture corrections into your earbuds or speaker without needing to walk back to the screen.',
          },
        },
        {
          '@type': 'Question',
          name: 'How does hands-free auto capture trigger the shutter?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'When your body posture aligns with the reference guide and sustains a 90%+ match score for 2 continuous seconds, POSEHANUM automatically fires the camera shutter.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can I use POSEHANUM offline during travel without internet access?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. POSEHANUM runs 100% offline in airplane mode with pre-downloadable category pose packs.',
          },
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/icon.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary">
        {children}
      </body>
    </html>
  );
}
