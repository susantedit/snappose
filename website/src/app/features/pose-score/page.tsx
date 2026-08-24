import type { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Sliders, CheckCircle2, Zap, SlidersHorizontal, Scale } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Sub-Millimeter Pose Scoring — Joint Vector Mathematics | POSEHANUM',
  description:
    'Learn how POSEHANUM calculates real-time 0–100% pose match scores using scale-invariant joint angle triplets, cosine similarity, and visibility confidence weighting.',
  keywords: [
    'sub millimeter pose scoring',
    'pose match score formula',
    'real time pose scoring accuracy',
    'joint angle cosine similarity camera',
    'camera pose alignment percentage',
  ],
  alternates: {
    canonical: 'https://www.posehanum.tech/features/pose-score',
  },
  openGraph: {
    title: 'Sub-Millimeter Pose Scoring — Joint Vector Mathematics | POSEHANUM',
    description:
      'Explore the vector mathematics and angular deviation formulas behind POSEHANUM’s real-time 0–100% alignment scoring.',
    url: 'https://www.posehanum.tech/features/pose-score',
    siteName: 'POSEHANUM',
    type: 'website',
  },
};

const featureLd = {
  '@context': 'https://schema.org',
  '@type': 'TechArticle',
  headline: 'Sub-Millimeter Pose Scoring Feature Deep Dive',
  description:
    'Technical breakdown of POSEHANUM’s angular deviation and cosine similarity scoring mathematics.',
  author: { '@type': 'Person', name: 'Susant Luitel', url: 'https://github.com/susantedit' },
  publisher: { '@type': 'Organization', name: 'POSEHANUM', logo: 'https://www.posehanum.tech/logo.png' },
  mainEntityOfPage: 'https://www.posehanum.tech/features/pose-score',
};

const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.posehanum.tech' },
    { '@type': 'ListItem', position: 2, name: 'Features', item: 'https://www.posehanum.tech/features' },
    { '@type': 'ListItem', position: 3, name: 'Pose Scoring', item: 'https://www.posehanum.tech/features/pose-score' },
  ],
};

export default function PoseScoreFeaturePage() {
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
              Vector Mathematics
            </span>
            <span className="text-xs text-textMuted font-medium">Feature Deep Dive</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-textPrimary leading-tight">
            SUB-MILLIMETER POSE SCORING: <br />
            <span className="text-primary text-glow">VECTOR MATCH ACCURACY.</span>
          </h1>
        </header>

        {/* Direct Summary for AEO */}
        <div className="p-6 rounded-2xl bg-surface/80 border border-primary/40 shadow-card-dark space-y-3">
          <span className="text-xs font-mono font-bold text-primary uppercase tracking-wider block">
            Feature Definition (AEO Summary)
          </span>
          <p className="text-base sm:text-lg font-semibold text-textPrimary leading-relaxed">
            <strong>Sub-Millimeter Pose Scoring</strong> in POSEHANUM compares scale-invariant 3D joint angle triplets (e.g. shoulder-elbow-wrist, hip-knee-ankle) between your live body posture and target reference guides. Angular deviations are weighted by neural visibility confidence to compute a live 0% to 100% match score that adapts dynamically at 60 FPS.
          </p>
        </div>

        <section className="space-y-4 text-textSecondary text-base leading-relaxed">
          <h2 className="text-2xl font-black uppercase tracking-tight text-textPrimary">
            Scale-Invariant Angular Geometry
          </h2>
          <p>
            Because users stand at varying distances from the phone, measuring raw pixel distance produces inaccurate results. By evaluating normalized vector angles, POSEHANUM ensures that scoring accuracy remains identical whether standing 4 feet or 12 feet away from the lens.
          </p>
        </section>

        {/* Related Links */}
        <div className="p-6 rounded-2xl bg-surface border border-surfaceBorder space-y-4">
          <h3 className="text-lg font-black uppercase tracking-tight text-textPrimary">
            Related Math & Vision Guides
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link href="/blog/how-pose-scoring-works" className="p-3 rounded-xl bg-background border border-surfaceBorder hover:border-primary text-sm font-bold text-textPrimary hover:text-primary transition-colors flex items-center justify-between">
              <span>How Pose Scoring Works (Math & Code)</span>
              <CheckCircle2 className="w-4 h-4 text-primary" />
            </Link>
            <Link href="/features/ai-pose-matching" className="p-3 rounded-xl bg-background border border-surfaceBorder hover:border-primary text-sm font-bold text-textPrimary hover:text-primary transition-colors flex items-center justify-between">
              <span>Real-Time AI Pose Matching</span>
              <CheckCircle2 className="w-4 h-4 text-primary" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
