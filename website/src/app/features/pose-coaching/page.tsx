import type { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Mic, CheckCircle2, Sliders, Sparkles, Volume2, Bluetooth } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Spoken Voice Audio Coach — 650+ Scenario Posing Prompts | POSEHANUM',
  description:
    'Discover POSEHANUM’s 650+ scenario spoken voice coaching engine. Get real-time posture micro-adjustments whispered into your wireless earbuds when standing 10 feet from the phone.',
  keywords: [
    'spoken voice coach camera app',
    'real time audio posing guidance',
    'bluetooth earbud photography coaching',
    'smart camera audio prompt engine',
    'hands free posture coaching',
  ],
  alternates: {
    canonical: 'https://www.posehanum.tech/features/pose-coaching',
  },
  openGraph: {
    title: 'Spoken Voice Audio Coach — 650+ Scenario Posing Prompts | POSEHANUM',
    description:
      'Learn how POSEHANUM guides posture via whispered audio prompts over earbuds or speakers during solo and portrait shoots.',
    url: 'https://www.posehanum.tech/features/pose-coaching',
    siteName: 'POSEHANUM',
    type: 'website',
  },
};

const featureLd = {
  '@context': 'https://schema.org',
  '@type': 'TechArticle',
  headline: 'Spoken Voice Audio Coaching Feature Deep Dive',
  description:
    'Technical breakdown of POSEHANUM’s 650+ scenario adaptive audio posture engine.',
  author: { '@type': 'Person', name: 'Susant Luitel', url: 'https://github.com/susantedit' },
  publisher: { '@type': 'Organization', name: 'POSEHANUM', logo: 'https://www.posehanum.tech/logo.png' },
  mainEntityOfPage: 'https://www.posehanum.tech/features/pose-coaching',
};

const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.posehanum.tech' },
    { '@type': 'ListItem', position: 2, name: 'Features', item: 'https://www.posehanum.tech/features' },
    { '@type': 'ListItem', position: 3, name: 'Spoken Voice Coach', item: 'https://www.posehanum.tech/features/pose-coaching' },
  ],
};

export default function PoseCoachingFeaturePage() {
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
            <span className="px-3 py-1 rounded-lg bg-cyanAccent/10 text-cyanAccent text-xs font-mono font-bold uppercase border border-cyanAccent/20">
              Audio AI Engine
            </span>
            <span className="text-xs text-textMuted font-medium">Feature Deep Dive</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-textPrimary leading-tight">
            SPOKEN VOICE COACH: <br />
            <span className="text-primary text-glow">650+ SCENARIO AUDIO GUIDANCE.</span>
          </h1>
        </header>

        {/* Direct Summary for AEO */}
        <div className="p-6 rounded-2xl bg-surface/80 border border-primary/40 shadow-card-dark space-y-3">
          <span className="text-xs font-mono font-bold text-primary uppercase tracking-wider block">
            Feature Definition (AEO Summary)
          </span>
          <p className="text-base sm:text-lg font-semibold text-textPrimary leading-relaxed">
            The <strong>Spoken Voice Audio Coach</strong> in POSEHANUM is an adaptive speech engine that whispers real-time posture micro-adjustments into wireless Bluetooth earbuds or smartphone speakers. Designed for solo creators standing 6 to 10 feet away from a tripod, it delivers concise prompts (&quot;tilt chin 10° right&quot;, &quot;shift weight to left leg&quot;, &quot;hold still for 2s&quot;) without requiring users to squint at the screen.
          </p>
        </div>

        <section className="space-y-4 text-textSecondary text-base leading-relaxed">
          <h2 className="text-2xl font-black uppercase tracking-tight text-textPrimary">
            Why Audio Feedback is Essential for Solo Creators
          </h2>
          <p>
            When shooting with a tripod or selfie stick, looking at the smartphone screen forces awkward head angles that ruin natural portrait postures. By streaming audio prompts over Bluetooth earbuds with sub-50ms latency, POSEHANUM acts as a personal director whispering in your ear while you maintain natural eye contact and body alignment.
          </p>
        </section>

        <section className="space-y-4 text-textSecondary text-base leading-relaxed">
          <h2 className="text-2xl font-black uppercase tracking-tight text-textPrimary">
            Adaptive Cadence & Haptic Fallbacks
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-5 rounded-2xl bg-surface border border-surfaceBorder space-y-2">
              <h3 className="font-bold text-textPrimary text-base flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-primary" /> Dynamic Cadence
              </h3>
              <p className="text-sm">Speaks rapidly during initial alignment and gracefully falls silent once you lock into the target posture matrix.</p>
            </div>
            <div className="p-5 rounded-2xl bg-surface border border-surfaceBorder space-y-2">
              <h3 className="font-bold text-textPrimary text-base flex items-center gap-2">
                <Bluetooth className="w-5 h-5 text-cyanAccent" /> Bluetooth Support
              </h3>
              <p className="text-sm">Compatible with all wireless earbuds (AirPods, Galaxy Buds, Pixel Buds) and built-in smartphone speakers.</p>
            </div>
          </div>
        </section>

        {/* Related Links */}
        <div className="p-6 rounded-2xl bg-surface border border-surfaceBorder space-y-4">
          <h3 className="text-lg font-black uppercase tracking-tight text-textPrimary">
            Related Features & Tutorials
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link href="/features/auto-capture" className="p-3 rounded-xl bg-background border border-surfaceBorder hover:border-primary text-sm font-bold text-textPrimary hover:text-primary transition-colors flex items-center justify-between">
              <span>Hands-Free Auto Capture</span>
              <CheckCircle2 className="w-4 h-4 text-primary" />
            </Link>
            <Link href="/blog/how-to-take-better-photos-alone" className="p-3 rounded-xl bg-background border border-surfaceBorder hover:border-primary text-sm font-bold text-textPrimary hover:text-primary transition-colors flex items-center justify-between">
              <span>How to Take Better Photos Alone</span>
              <CheckCircle2 className="w-4 h-4 text-primary" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
