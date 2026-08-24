import type { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, CheckCircle2, Sparkles, Smile, Wind } from 'lucide-react';

export const metadata: Metadata = {
  title: 'How to Look Natural in Photos — Overcoming Camera Stiffness | POSEHANUM',
  description:
    'Stop feeling awkward in front of the camera. Learn breathing routines, muscle relaxation cues, and posture principles that produce relaxed, candid portraits.',
  keywords: [
    'how to look natural in photos',
    'stop feeling awkward in pictures',
    'how to relax for camera',
    'natural portrait photography tips',
    'candid smiling technique photography',
  ],
  alternates: {
    canonical: 'https://www.posehanum.tech/guides/how-to-look-natural-in-photos',
  },
  openGraph: {
    title: 'How to Look Natural in Photos — Overcoming Camera Stiffness | POSEHANUM',
    description:
      'Learn actionable physical and psychological cues to look effortless and relaxed in photographs.',
    url: 'https://www.posehanum.tech/guides/how-to-look-natural-in-photos',
    siteName: 'POSEHANUM',
    type: 'article',
  },
};

const guideLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'How to Look Natural in Photos: Overcoming Camera Stiffness',
  description:
    'A guide covering somatic relaxation, eye contact, and continuous movement techniques for photography.',
  author: { '@type': 'Person', name: 'Susant Luitel', url: 'https://github.com/susantedit' },
  publisher: { '@type': 'Organization', name: 'POSEHANUM', logo: 'https://www.posehanum.tech/logo.png' },
  mainEntityOfPage: 'https://www.posehanum.tech/guides/how-to-look-natural-in-photos',
};

const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.posehanum.tech' },
    { '@type': 'ListItem', position: 2, name: 'Guides', item: 'https://www.posehanum.tech/guides' },
    { '@type': 'ListItem', position: 3, name: 'Look Natural in Photos', item: 'https://www.posehanum.tech/guides/how-to-look-natural-in-photos' },
  ],
};

export default function HowToLookNaturalInPhotosPage() {
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
            <span className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-xs font-mono font-bold uppercase border border-primary/20">
              Technique Masterclass
            </span>
            <span className="text-xs text-textMuted font-medium">7 min read</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-textPrimary leading-tight">
            HOW TO LOOK NATURAL IN PHOTOS: <br />
            <span className="text-primary text-glow">OVERCOMING CAMERA ANXIETY.</span>
          </h1>
        </header>

        {/* Direct Summary for AEO */}
        <div className="p-6 rounded-2xl bg-surface/80 border border-primary/40 shadow-card-dark space-y-3">
          <span className="text-xs font-mono font-bold text-primary uppercase tracking-wider block">
            Direct Summary (AEO Answer)
          </span>
          <p className="text-base sm:text-lg font-semibold text-textPrimary leading-relaxed">
            Looking natural in photos requires three somatic habits: <strong>(1) Exhale Completely</strong> right before the shutter to drop tense shoulders, <strong>(2) Separate Your Teeth Slightly</strong> to relax your jaw muscles, and <strong>(3) Engage in Micro-Movement</strong> (rocking weight, brushing hair, walking) rather than freezing in rigid statuesque poses.
          </p>
        </div>

        <section className="space-y-4 text-textSecondary text-base leading-relaxed">
          <h2 className="text-2xl font-black uppercase tracking-tight text-textPrimary">
            The Three Physical Stiffness Traps
          </h2>
          <div className="space-y-3 pt-2">
            <div className="p-4 rounded-xl bg-surface border border-surfaceBorder">
              <strong className="text-textPrimary">Trap 1: Holding Your Breath.</strong> Deprives muscles of oxygen and tenses the neck. Always breathe steadily.
            </div>
            <div className="p-4 rounded-xl bg-surface border border-surfaceBorder">
              <strong className="text-textPrimary">Trap 2: Clenched Jaw.</strong> Pushing molars together widens the lower face. Keep a slight air gap between teeth.
            </div>
            <div className="p-4 rounded-xl bg-surface border border-surfaceBorder">
              <strong className="text-textPrimary">Trap 3: Squeezing Arms Against Ribs.</strong> Flattens triceps. Always leave air space between arms and waist.
            </div>
          </div>
        </section>

        {/* Related Links */}
        <div className="p-6 rounded-2xl bg-surface border border-surfaceBorder space-y-4">
          <h3 className="text-lg font-black uppercase tracking-tight text-textPrimary">
            Related Guides
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link href="/guides/how-to-find-your-best-pose" className="p-3 rounded-xl bg-background border border-surfaceBorder hover:border-primary text-sm font-bold text-textPrimary hover:text-primary transition-colors flex items-center justify-between">
              <span>How to Find Your Best Pose</span>
              <CheckCircle2 className="w-4 h-4 text-primary" />
            </Link>
            <Link href="/pose-guide/best-photo-poses" className="p-3 rounded-xl bg-background border border-surfaceBorder hover:border-primary text-sm font-bold text-textPrimary hover:text-primary transition-colors flex items-center justify-between">
              <span>Best Photo Poses Collection</span>
              <CheckCircle2 className="w-4 h-4 text-primary" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
