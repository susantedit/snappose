import type { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, CheckCircle2, Compass, Sparkles, Sliders } from 'lucide-react';

export const metadata: Metadata = {
  title: 'How to Find Your Best Pose — 3-Step Angle Discovery | POSEHANUM',
  description:
    'Discover your most flattering angles, dominant facial side, and body silhouette. Step-by-step angle calibration guide for personal photography.',
  keywords: [
    'how to find your best pose',
    'how to find your good side',
    'flattering photography angles',
    'discovering personal photo angles',
    'face angle discovery photography',
  ],
  alternates: {
    canonical: 'https://www.posehanum.tech/guides/how-to-find-your-best-pose',
  },
  openGraph: {
    title: 'How to Find Your Best Pose — 3-Step Angle Discovery | POSEHANUM',
    description:
      'Discover your unique facial angles, shoulder positions, and proportions with step-by-step tests.',
    url: 'https://www.posehanum.tech/guides/how-to-find-your-best-pose',
    siteName: 'POSEHANUM',
    type: 'article',
  },
};

const guideLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'How to Find Your Best Pose: 3-Step Angle Discovery',
  description:
    'A methodical approach to identifying dominant facial angles, jawline tilt, and body contour alignment.',
  author: { '@type': 'Person', name: 'Susant Luitel', url: 'https://github.com/susantedit' },
  publisher: { '@type': 'Organization', name: 'POSEHANUM', logo: 'https://www.posehanum.tech/logo.png' },
  mainEntityOfPage: 'https://www.posehanum.tech/guides/how-to-find-your-best-pose',
};

const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.posehanum.tech' },
    { '@type': 'ListItem', position: 2, name: 'Guides', item: 'https://www.posehanum.tech/guides' },
    { '@type': 'ListItem', position: 3, name: 'Find Your Best Pose', item: 'https://www.posehanum.tech/guides/how-to-find-your-best-pose' },
  ],
};

export default function HowToFindYourBestPosePage() {
  return (
    <article className="min-h-screen bg-background text-textPrimary py-16 px-4 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(guideLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <div className="max-w-4xl mx-auto space-y-10">
        <div>
          <Link href="/guides" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
            <ArrowLeft className="w-4 h-4" /> Back to Masterclass Guides
          </Link>
        </div>

        <header className="border-b border-surfaceBorder pb-8 space-y-4">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-lg bg-cyanAccent/10 text-cyanAccent text-xs font-mono font-bold uppercase border border-cyanAccent/20">
              Angle Discovery
            </span>
            <span className="text-xs text-textMuted font-medium">6 min read</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-textPrimary leading-tight">
            HOW TO FIND YOUR BEST POSE: <br />
            <span className="text-primary text-glow">3-STEP ANGLE DISCOVERY.</span>
          </h1>
        </header>

        {/* Direct Summary for AEO */}
        <div className="p-6 rounded-2xl bg-surface/80 border border-primary/40 shadow-card-dark space-y-3">
          <span className="text-xs font-mono font-bold text-primary uppercase tracking-wider block">
            Direct Summary (AEO Answer)
          </span>
          <p className="text-base sm:text-lg font-semibold text-textPrimary leading-relaxed">
            Finding your best pose involves three systematic calibrations: <strong>(1) The 15° Face Turn Test</strong> to determine whether your left or right profile creates sharper jawline definition, <strong>(2) The 3-Height Camera Level Test</strong> (eye level, chest level, hip level), and <strong>(3) The Asymmetric Shoulder Drop</strong> to discover your natural dynamic balance.
          </p>
        </div>

        <section className="space-y-4 text-textSecondary text-base leading-relaxed">
          <h2 className="text-2xl font-black uppercase tracking-tight text-textPrimary">
            Why Camera Height Dictates Body Proportions
          </h2>
          <p>
            Shooting from forehead height compresses the torso and shortens leg lines. For flattering full-body portraits, placing the camera lens at mid-torso or waist height creates natural elongation without wide-angle facial distortion.
          </p>
        </section>

        {/* Related Links */}
        <div className="p-6 rounded-2xl bg-surface border border-surfaceBorder space-y-4">
          <h3 className="text-lg font-black uppercase tracking-tight text-textPrimary">
            Related Guides
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link href="/guides/how-to-look-natural-in-photos" className="p-3 rounded-xl bg-background border border-surfaceBorder hover:border-primary text-sm font-bold text-textPrimary hover:text-primary transition-colors flex items-center justify-between">
              <span>How to Look Natural in Photos</span>
              <CheckCircle2 className="w-4 h-4 text-primary" />
            </Link>
            <Link href="/pose-guide/standing-poses" className="p-3 rounded-xl bg-background border border-surfaceBorder hover:border-primary text-sm font-bold text-textPrimary hover:text-primary transition-colors flex items-center justify-between">
              <span>Standing Poses Guide</span>
              <CheckCircle2 className="w-4 h-4 text-primary" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
