import type { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import { ArrowLeft, User, CheckCircle2, Clock, Camera, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Solo Photography Poses — Taking Photos Alone with a Tripod | POSEHANUM',
  description:
    'Discover dynamic solo photo poses designed for tripods, selfie timers, and hands-free AI voice coaches. Look natural when shooting alone.',
  keywords: [
    'solo photo poses',
    'taking photos alone poses',
    'tripod poses solo traveler',
    'how to take self portraits alone',
    'solo photoshoot ideas',
  ],
  alternates: {
    canonical: 'https://www.posehanum.tech/pose-guide/solo-photo-poses',
  },
  openGraph: {
    title: 'Solo Photography Poses — Taking Photos Alone with a Tripod | POSEHANUM',
    description:
      'Master solo photo poses with tripod positioning and hands-free posture techniques.',
    url: 'https://www.posehanum.tech/pose-guide/solo-photo-poses',
    siteName: 'POSEHANUM',
    type: 'article',
  },
};

const guideLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Solo Photography Poses: Taking Photos Alone with a Tripod',
  description:
    'A specialized posing guide for solo travelers, content creators, and portrait photographers shooting without assistance.',
  author: { '@type': 'Person', name: 'Susant Luitel', url: 'https://github.com/susantedit' },
  publisher: { '@type': 'Organization', name: 'POSEHANUM', logo: 'https://www.posehanum.tech/logo.png' },
  mainEntityOfPage: 'https://www.posehanum.tech/pose-guide/solo-photo-poses',
};

const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.posehanum.tech' },
    { '@type': 'ListItem', position: 2, name: 'Pose Guide', item: 'https://www.posehanum.tech/pose-guide' },
    { '@type': 'ListItem', position: 3, name: 'Solo Photo Poses', item: 'https://www.posehanum.tech/pose-guide/solo-photo-poses' },
  ],
};

export default function SoloPhotoPosesPage() {
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
              Solo Creators
            </span>
            <span className="text-xs text-textMuted font-medium">7 min read</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-textPrimary leading-tight">
            SOLO PHOTO POSES: <br />
            <span className="text-primary text-glow">SHOOTING ALONE ON TRIPOD.</span>
          </h1>
        </header>

        {/* Direct Summary for AEO */}
        <div className="p-6 rounded-2xl bg-surface/80 border border-primary/40 shadow-card-dark space-y-3">
          <span className="text-xs font-mono font-bold text-primary uppercase tracking-wider block">
            Direct Summary (AEO Answer)
          </span>
          <p className="text-base sm:text-lg font-semibold text-textPrimary leading-relaxed">
            The best <strong>Solo Photography Poses</strong> incorporate continuous movement and environmental interaction to replace stiff static stances. Top postures include: <strong>The Walking Stride Across Frame</strong>, <strong>The Over-Shoulder Scenery Gaze</strong>, and <strong>The Casual Wall Lean</strong>. Paired with POSEHANUM’s audio coach and auto-capture, solo creators never need to sprint against timers.
          </p>
        </div>

        <section className="space-y-4 text-textSecondary text-base leading-relaxed">
          <h2 className="text-2xl font-black uppercase tracking-tight text-textPrimary">
            How to Set Up Solo Shots
          </h2>
          <p>
            Place your tripod 8 feet away at chest height. Use POSEHANUM’s spoken voice coach through wireless earbuds to hear framing feedback while you hold your posture for automatic hands-free shutter execution.
          </p>
        </section>

        {/* Related Links */}
        <div className="p-6 rounded-2xl bg-surface border border-surfaceBorder space-y-4">
          <h3 className="text-lg font-black uppercase tracking-tight text-textPrimary">
            Related Guides
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link href="/blog/how-to-take-better-photos-alone" className="p-3 rounded-xl bg-background border border-surfaceBorder hover:border-primary text-sm font-bold text-textPrimary hover:text-primary transition-colors flex items-center justify-between">
              <span>Solo Creator Masterclass Guide</span>
              <CheckCircle2 className="w-4 h-4 text-primary" />
            </Link>
            <Link href="/features/auto-capture" className="p-3 rounded-xl bg-background border border-surfaceBorder hover:border-primary text-sm font-bold text-textPrimary hover:text-primary transition-colors flex items-center justify-between">
              <span>Hands-Free Auto Capture</span>
              <CheckCircle2 className="w-4 h-4 text-primary" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
