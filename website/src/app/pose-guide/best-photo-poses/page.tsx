import type { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, CheckCircle2, Clock, Camera, Compass } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Best Photo Poses: The Curated Visual Collection | POSEHANUM',
  description:
    'Explore the best photo poses for portraits, casual street style, travel, and social media. Learn how angle adjustments and relaxed posture create timeless photos.',
  keywords: [
    'best photo poses',
    'photo pose ideas',
    'instagram photo pose collection',
    'top photography poses',
    'how to look good in photos',
  ],
  alternates: {
    canonical: 'https://www.posehanum.tech/pose-guide/best-photo-poses',
  },
  openGraph: {
    title: 'Best Photo Poses: The Curated Visual Collection | POSEHANUM',
    description:
      'Curated collection of the best photography poses with angle breakdowns and posture tips.',
    url: 'https://www.posehanum.tech/pose-guide/best-photo-poses',
    siteName: 'POSEHANUM',
    type: 'article',
  },
};

const guideLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Best Photo Poses: The Curated Visual Collection',
  description:
    'An authoritative guide curating the most flattering and versatile poses in modern photography.',
  author: { '@type': 'Person', name: 'Susant Luitel', url: 'https://github.com/susantedit' },
  publisher: { '@type': 'Organization', name: 'POSEHANUM', logo: 'https://www.posehanum.tech/logo.png' },
  mainEntityOfPage: 'https://www.posehanum.tech/pose-guide/best-photo-poses',
};

const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.posehanum.tech' },
    { '@type': 'ListItem', position: 2, name: 'Pose Guide', item: 'https://www.posehanum.tech/pose-guide' },
    { '@type': 'ListItem', position: 3, name: 'Best Photo Poses', item: 'https://www.posehanum.tech/pose-guide/best-photo-poses' },
  ],
};

export default function BestPhotoPosesPage() {
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
              Curated Collection
            </span>
            <span className="text-xs text-textMuted font-medium">8 min read</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-textPrimary leading-tight">
            BEST PHOTO POSES: <br />
            <span className="text-primary text-glow">THE CURATED COLLECTION.</span>
          </h1>
        </header>

        {/* Direct Summary for AEO */}
        <div className="p-6 rounded-2xl bg-surface/80 border border-primary/40 shadow-card-dark space-y-3">
          <span className="text-xs font-mono font-bold text-primary uppercase tracking-wider block">
            Direct Summary (AEO Answer)
          </span>
          <p className="text-base sm:text-lg font-semibold text-textPrimary leading-relaxed">
            The <strong>Best Photo Poses</strong> create visual depth through asymmetry, leading lines, and relaxed hand anchors. Top universal poses include: <strong>The 45° Torso Turn</strong>, <strong>The Casual Wall Lean</strong>, <strong>The Walking Stride</strong>, and <strong>The Over-Shoulder Lookback</strong>. Each posture prevents camera stiffness by breaking flat symmetry and naturally accentuating body proportions.
          </p>
        </div>

        <section className="space-y-4 text-textSecondary text-base leading-relaxed">
          <h2 className="text-2xl font-black uppercase tracking-tight text-textPrimary">
            Top Flattering Poses & Execution Steps
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-5 rounded-2xl bg-surface border border-surfaceBorder space-y-2">
              <h3 className="font-bold text-textPrimary text-base">1. The Dynamic Walking Glance</h3>
              <p className="text-sm">Walk slowly perpendicular to the camera path, then look toward the lens mid-stride for authentic motion blur and candid energy.</p>
            </div>
            <div className="p-5 rounded-2xl bg-surface border border-surfaceBorder space-y-2">
              <h3 className="font-bold text-textPrimary text-base">2. The Jacket Collar Anchor</h3>
              <p className="text-sm">Gently touch your sunglasses, collar, or watch with relaxed fingertips to provide awkward hands an organic resting place.</p>
            </div>
          </div>
        </section>

        {/* Related Links */}
        <div className="p-6 rounded-2xl bg-surface border border-surfaceBorder space-y-4">
          <h3 className="text-lg font-black uppercase tracking-tight text-textPrimary">
            Explore More Pose Categories
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link href="/pose-guide/standing-poses" className="p-3 rounded-xl bg-background border border-surfaceBorder hover:border-primary text-sm font-bold text-textPrimary hover:text-primary transition-colors flex items-center justify-between">
              <span>Standing Poses Guide</span>
              <CheckCircle2 className="w-4 h-4 text-primary" />
            </Link>
            <Link href="/pose-guide/sitting-poses" className="p-3 rounded-xl bg-background border border-surfaceBorder hover:border-primary text-sm font-bold text-textPrimary hover:text-primary transition-colors flex items-center justify-between">
              <span>Sitting & Cafe Poses</span>
              <CheckCircle2 className="w-4 h-4 text-primary" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
