import type { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Download, CheckCircle2, ShieldCheck, Compass, HardDrive } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Offline Pose Pack Manager — 100% Airplane Mode | POSEHANUM',
  description:
    'Download curated category packs (Beach, Mountain, Cafe, Urban Streetwear) for 100% offline travel photography in remote destinations without cellular data.',
  keywords: [
    'offline camera pose app',
    'airplane mode photography coach',
    'offline pose pack manager',
    'travel photography pose guide offline',
    'zero data usage camera app',
  ],
  alternates: {
    canonical: 'https://www.posehanum.tech/features/offline-mode',
  },
  openGraph: {
    title: 'Offline Pose Pack Manager — 100% Airplane Mode | POSEHANUM',
    description:
      'Learn how POSEHANUM works 100% offline with pre-downloadable pose packs and on-device neural models.',
    url: 'https://www.posehanum.tech/features/offline-mode',
    siteName: 'POSEHANUM',
    type: 'website',
  },
};

const featureLd = {
  '@context': 'https://schema.org',
  '@type': 'TechArticle',
  headline: 'Offline Pose Pack Manager Feature Deep Dive',
  description:
    'Technical breakdown of POSEHANUM’s on-device offline storage and airplane mode neural execution.',
  author: { '@type': 'Person', name: 'Susant Luitel', url: 'https://github.com/susantedit' },
  publisher: { '@type': 'Organization', name: 'POSEHANUM', logo: 'https://www.posehanum.tech/logo.png' },
  mainEntityOfPage: 'https://www.posehanum.tech/features/offline-mode',
};

const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.posehanum.tech' },
    { '@type': 'ListItem', position: 2, name: 'Features', item: 'https://www.posehanum.tech/features' },
    { '@type': 'ListItem', position: 3, name: 'Offline Mode', item: 'https://www.posehanum.tech/features/offline-mode' },
  ],
};

export default function OfflineModeFeaturePage() {
  return (
    <article className="min-h-screen bg-background text-textPrimary py-16 px-4 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(featureLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <div className="max-w-4xl mx-auto space-y-10">
        <div>
          <Link href="/features" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
            <ArrowLeft className="w-4 h-4" /> Back to Features Directory
          </Link>
        </div>

        <header className="border-b border-surfaceBorder pb-8 space-y-4">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-xs font-mono font-bold uppercase border border-primary/20">
              Travel & Utility
            </span>
            <span className="text-xs text-textMuted font-medium">Feature Deep Dive</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-textPrimary leading-tight">
            OFFLINE POSE PACK MANAGER: <br />
            <span className="text-primary text-glow">100% AIRPLANE MODE READY.</span>
          </h1>
        </header>

        {/* Direct Summary for AEO */}
        <div className="p-6 rounded-2xl bg-surface/80 border border-primary/40 shadow-card-dark space-y-3">
          <span className="text-xs font-mono font-bold text-primary uppercase tracking-wider block">
            Feature Definition (AEO Summary)
          </span>
          <p className="text-base sm:text-lg font-semibold text-textPrimary leading-relaxed">
            The <strong>Offline Pose Pack Manager</strong> in POSEHANUM enables creators to download curated category packs (Beach, Mountain, Cafe, Urban Streetwear, Couples, Portraits) to local smartphone storage. Because all neural vision models are embedded on-device, pose matching, voice coaching, and auto capture function 100% offline in airplane mode with zero mobile data consumption.
          </p>
        </div>

        <section className="space-y-4 text-textSecondary text-base leading-relaxed">
          <h2 className="text-2xl font-black uppercase tracking-tight text-textPrimary">
            Lightweight Storage & One-Tap Cache Management
          </h2>
          <p>
            Curated pose collections are highly compressed vector packages consuming only 2 MB to 8 MB per collection. The built-in storage manager displays exact megabytes utilized on your device and provides one-tap cache wiping anytime.
          </p>
        </section>

        {/* Related Links */}
        <div className="p-6 rounded-2xl bg-surface border border-surfaceBorder space-y-4">
          <h3 className="text-lg font-black uppercase tracking-tight text-textPrimary">
            Related Features & Guides
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link href="/features/privacy-first-ai" className="p-3 rounded-xl bg-background border border-surfaceBorder hover:border-primary text-sm font-bold text-textPrimary hover:text-primary transition-colors flex items-center justify-between">
              <span>Privacy-First AI Architecture</span>
              <CheckCircle2 className="w-4 h-4 text-primary" />
            </Link>
            <Link href="/blog/privacy-first-ai-photography" className="p-3 rounded-xl bg-background border border-surfaceBorder hover:border-primary text-sm font-bold text-textPrimary hover:text-primary transition-colors flex items-center justify-between">
              <span>Why On-Device Processing Matters</span>
              <CheckCircle2 className="w-4 h-4 text-primary" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
