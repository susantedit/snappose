import type { Metadata } from 'next';
import './globals.css';

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
  metadataBase: new URL('https://posehanum.app'),
  openGraph: {
    title: 'POSEHANUM — AI Pose Coach & Photography Assistant',
    description:
      'Pose Garौँ. Perfect Shot Lिऔँ. POSEHANUM turns your phone into a real-time AI photography assistant with live pose matching and voice coaching.',
    url: 'https://posehanum.app',
    siteName: 'POSEHANUM',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
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
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareApplication',
      '@id': 'https://posehanum.app/#software',
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
      '@id': 'https://posehanum.app/#app',
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
      '@id': 'https://posehanum.app/#organization',
      name: 'POSEHANUM',
      url: 'https://posehanum.app',
      logo: 'https://posehanum.app/logo.png',
      founder: {
        '@type': 'Person',
        name: 'Susant Luitel',
        url: 'https://github.com/susantedit',
      },
      sameAs: [
        'https://github.com/susantedit',
        'https://www.youtube.com/@developersusant',
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
      '@id': 'https://posehanum.app/#website',
      url: 'https://posehanum.app',
      name: 'POSEHANUM',
      description: 'Pose Garौँ. Perfect Shot Lिऔँ. (Let\'s Pose. Let\'s Capture.)',
      publisher: {
        '@id': 'https://posehanum.app/#organization',
      },
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
