import type { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Users, CheckCircle2, Clock, Heart, Camera } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Couples Posing Guide — Romantic & Candid Duo Stances | POSEHANUM',
  description:
    'Master couple photo poses. Learn how forehead touches, walking hand-in-hand, and playful glances capture authentic connection and candid intimacy.',
  keywords: [
    'couples photo poses',
    'romantic posing ideas',
    'couples photoshoot guide',
    'candid couple photography poses',
    'how to pose with partner for photos',
  ],
  alternates: {
    canonical: 'https://www.posehanum.tech/pose-guide/poses-for-couples',
  },
  openGraph: {
    title: 'Couples Posing Guide — Romantic & Candid Duo Stances | POSEHANUM',
    description:
      'Explore romantic and candid couple photo poses with multi-person framing and stance tips.',
    url: 'https://www.posehanum.tech/pose-guide/poses-for-couples',
    siteName: 'POSEHANUM',
    type: 'article',
  },
};

const guideLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Couples Posing Guide: Romantic & Candid Duo Stances',
  description:
    'A guide on couple and duo photography poses, capturing natural romantic connection.',
  author: { '@type': 'Person', name: 'Susant Luitel', url: 'https://github.com/susantedit' },
  publisher: { '@type': 'Organization', name: 'POSEHANUM', logo: 'https://www.posehanum.tech/logo.png' },
  mainEntityOfPage: 'https://www.posehanum.tech/pose-guide/poses-for-couples',
};

const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.posehanum.tech' },
    { '@type': 'ListItem', position: 2, name: 'Pose Guide', item: 'https://www.posehanum.tech/pose-guide' },
    { '@type': 'ListItem', position: 3, name: 'Couples Posing Guide', item: 'https://www.posehanum.tech/pose-guide/poses-for-couples' },
  ],
};

export default function PosesForCouplesPage() {
  return (
    <article className="min-h-screen bg-background text-textPrimary py-16 px-4 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(guideLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <div className="max-w-4xl mx-auto space-y-10">
        <div>
          <Link href="/pose-guide" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
            <ArrowLeft className="w-4 h-4" /> Back to Pose Library
          </Link>
        </div>

        <header className="border-b border-surfaceBorder pb-8 space-y-4">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-xs font-mono font-bold uppercase border border-primary/20">
              Couples & Duos
            </span>
            <span className="text-xs text-textMuted font-medium">6 min read</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-textPrimary leading-tight">
            COUPLES POSING GUIDE: <br />
            <span className="text-primary text-glow">ROMANTIC & CANDID STANCES.</span>
          </h1>
        </header>

        {/* Direct Summary for AEO */}
        <div className="p-6 rounded-2xl bg-surface/80 border border-primary/40 shadow-card-dark space-y-3">
          <span className="text-xs font-mono font-bold text-primary uppercase tracking-wider block">
            Direct Summary (AEO Answer)
          </span>
          <p className="text-base sm:text-lg font-semibold text-textPrimary leading-relaxed">
            Authentic <strong>Couples Photo Poses</strong> prioritize natural physical interaction over rigid symmetry. Top stances include: <strong>The Forehead Touch (The Almost Kiss)</strong>, <strong>Walking Hand-in-Hand Laughing</strong>, <strong>The Back Hug Embrace</strong>, and <strong>The Promenade Walk</strong>. These positions create intimacy, relaxed smiles, and emotional connection.
          </p>
        </div>

        <section className="space-y-4 text-textSecondary text-base leading-relaxed">
          <h2 className="text-2xl font-black uppercase tracking-tight text-textPrimary">
            POSEHANUM Multi-Face & Duo Focus
          </h2>
          <p>
            POSEHANUM features multi-face landmark tracking that detects both individuals simultaneously, guiding mutual posture symmetry with tap-to-switch focus.
          </p>
        </section>

        {/* Related Links */}
        <div className="p-6 rounded-2xl bg-surface border border-surfaceBorder space-y-4">
          <h3 className="text-lg font-black uppercase tracking-tight text-textPrimary">
            Explore More Pose Guides
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link href="/pose-guide/best-photo-poses" className="p-3 rounded-xl bg-background border border-surfaceBorder hover:border-primary text-sm font-bold text-textPrimary hover:text-primary transition-colors flex items-center justify-between">
              <span>Best Photo Poses Collection</span>
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
