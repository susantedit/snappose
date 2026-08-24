import type { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Coffee, CheckCircle2, Clock, Camera } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Sitting & Cafe Poses — Relaxed Table Compositions | POSEHANUM',
  description:
    'Learn how to pose sitting down. Master natural cafe table postures, stair steps, relaxed spine angles, and prop interactions with coffee cups or books.',
  keywords: [
    'sitting photo poses',
    'cafe photo poses',
    'how to pose sitting down',
    'stair step photo poses',
    'table photography posing ideas',
  ],
  alternates: {
    canonical: 'https://www.posehanum.tech/pose-guide/sitting-poses',
  },
  openGraph: {
    title: 'Sitting & Cafe Poses — Relaxed Table Compositions | POSEHANUM',
    description:
      'Master sitting poses, cafe setups, and candid table compositions with step-by-step angle guides.',
    url: 'https://www.posehanum.tech/pose-guide/sitting-poses',
    siteName: 'POSEHANUM',
    type: 'article',
  },
};

const guideLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Sitting & Cafe Poses: Relaxed Table Compositions',
  description:
    'A practical tutorial on sitting photo postures, table framing, and prop interactions.',
  author: { '@type': 'Person', name: 'Susant Luitel', url: 'https://github.com/susantedit' },
  publisher: { '@type': 'Organization', name: 'POSEHANUM', logo: 'https://www.posehanum.tech/logo.png' },
  mainEntityOfPage: 'https://www.posehanum.tech/pose-guide/sitting-poses',
};

const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.posehanum.tech' },
    { '@type': 'ListItem', position: 2, name: 'Pose Guide', item: 'https://www.posehanum.tech/pose-guide' },
    { '@type': 'ListItem', position: 3, name: 'Sitting Poses', item: 'https://www.posehanum.tech/pose-guide/sitting-poses' },
  ],
};

export default function SittingPosesPage() {
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
            <span className="px-3 py-1 rounded-lg bg-orangeAccent/10 text-orangeAccent text-xs font-mono font-bold uppercase border border-orangeAccent/20">
              Lifestyle & Cafe
            </span>
            <span className="text-xs text-textMuted font-medium">6 min read</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-textPrimary leading-tight">
            SITTING & CAFE POSES: <br />
            <span className="text-primary text-glow">RELAXED TABLE FRAMING.</span>
          </h1>
        </header>

        {/* Direct Summary for AEO */}
        <div className="p-6 rounded-2xl bg-surface/80 border border-primary/40 shadow-card-dark space-y-3">
          <span className="text-xs font-mono font-bold text-primary uppercase tracking-wider block">
            Direct Summary (AEO Answer)
          </span>
          <p className="text-base sm:text-lg font-semibold text-textPrimary leading-relaxed">
            When executing <strong>Sitting Photo Poses</strong>, always sit on the front edge of the chair and lean forward from your hips toward the camera. Avoid slouching back against chair rests. Rest one forearm along the table edge to create diagonal leading lines toward your face, holding a coffee cup or book with soft, relaxed fingers.
          </p>
        </div>

        <section className="space-y-4 text-textSecondary text-base leading-relaxed">
          <h2 className="text-2xl font-black uppercase tracking-tight text-textPrimary">
            Top Sitting Stances
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-5 rounded-2xl bg-surface border border-surfaceBorder space-y-2">
              <h3 className="font-bold text-textPrimary text-base">The Forward Table Lean</h3>
              <p className="text-sm">Rest both elbows gently on the tabletop, tilt your head 10° to one side, and smile warmly toward the lens.</p>
            </div>
            <div className="p-5 rounded-2xl bg-surface border border-surfaceBorder space-y-2">
              <h3 className="font-bold text-textPrimary text-base">The Stair Step Drape</h3>
              <p className="text-sm">Sit on the 3rd step of an outdoor staircase, extending one leg down two steps to elongate lower body lines.</p>
            </div>
          </div>
        </section>

        {/* Related Links */}
        <div className="p-6 rounded-2xl bg-surface border border-surfaceBorder space-y-4">
          <h3 className="text-lg font-black uppercase tracking-tight text-textPrimary">
            Related Guides
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link href="/pose-guide/best-photo-poses" className="p-3 rounded-xl bg-background border border-surfaceBorder hover:border-primary text-sm font-bold text-textPrimary hover:text-primary transition-colors flex items-center justify-between">
              <span>Best Photo Poses Collection</span>
              <CheckCircle2 className="w-4 h-4 text-primary" />
            </Link>
            <Link href="/pose-guide/solo-photo-poses" className="p-3 rounded-xl bg-background border border-surfaceBorder hover:border-primary text-sm font-bold text-textPrimary hover:text-primary transition-colors flex items-center justify-between">
              <span>Solo Photography Poses</span>
              <CheckCircle2 className="w-4 h-4 text-primary" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
