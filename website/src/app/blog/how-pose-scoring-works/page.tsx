import type { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, CheckCircle2, Sliders, ShieldCheck, Zap } from 'lucide-react';

export const metadata: Metadata = {
  title: 'How Pose Scoring Works: Inside 33-Landmark Vector Mathematics',
  description:
    'Discover the vector mathematics, angular deviation formulas, and confidence weighting that power POSEHANUM’s real-time 0–100% pose alignment score.',
  keywords: [
    'how pose scoring works',
    'pose score algorithm',
    'pose matching math formula',
    'MediaPipe landmark angles',
    'AI pose alignment accuracy',
  ],
  alternates: {
    canonical: 'https://www.posehanum.tech/blog/how-pose-scoring-works',
  },
  openGraph: {
    title: 'How Pose Scoring Works: Inside 33-Landmark Vector Mathematics',
    description:
      'An in-depth technical breakdown of how POSEHANUM calculates sub-millimeter joint angles, angular deviations, and 0–100% alignment scores.',
    url: 'https://www.posehanum.tech/blog/how-pose-scoring-works',
    siteName: 'POSEHANUM',
    type: 'article',
  },
};

const articleLd = {
  '@context': 'https://schema.org',
  '@type': 'TechArticle',
  headline: 'How Pose Scoring Works: Inside 33-Landmark Vector Mathematics',
  description:
    'A technical explanation of joint vector angle comparison, visibility weighting, and real-time pose score calculation in POSEHANUM.',
  author: {
    '@type': 'Person',
    name: 'Susant Luitel',
    url: 'https://github.com/susantedit',
  },
  publisher: {
    '@type': 'Organization',
    name: 'POSEHANUM',
    logo: 'https://www.posehanum.tech/logo.png',
  },
  mainEntityOfPage: 'https://www.posehanum.tech/blog/how-pose-scoring-works',
};

const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.posehanum.tech' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://www.posehanum.tech/blog' },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'How Pose Scoring Works',
      item: 'https://www.posehanum.tech/blog/how-pose-scoring-works',
    },
  ],
};

export default function HowPoseScoringWorksPage() {
  return (
    <article className="min-h-screen bg-background text-textPrimary py-16 px-4 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <div className="max-w-4xl mx-auto space-y-10">
        {/* Navigation */}
        <div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Guides & Blog
          </Link>
        </div>

        {/* Header */}
        <header className="border-b border-surfaceBorder pb-8 space-y-4">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-lg bg-cyanAccent/10 text-cyanAccent text-xs font-mono font-bold uppercase border border-cyanAccent/20">
              Algorithms & Mathematics
            </span>
            <span className="text-xs text-textMuted flex items-center gap-1 font-medium">
              <Clock className="w-3.5 h-3.5" /> 7 min read
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-textPrimary leading-tight">
            HOW POSE SCORING WORKS: <br />
            <span className="text-primary text-glow">INSIDE THE MATH & FORMULAS.</span>
          </h1>

          <div className="flex items-center gap-3 pt-2 text-xs text-textSecondary font-medium">
            <span>By <strong>Susant Luitel (Kantaraj)</strong></span>
            <span>•</span>
            <span>Published August 2026</span>
          </div>
        </header>

        {/* Quick Answer Block for AEO */}
        <div className="p-6 rounded-2xl bg-surface/80 border border-primary/40 shadow-card-dark space-y-3">
          <span className="text-xs font-mono font-bold text-primary uppercase tracking-wider block">
            Direct Summary (AEO Answer)
          </span>
          <p className="text-base sm:text-lg font-semibold text-textPrimary leading-relaxed">
            <strong>Pose Scoring</strong> in POSEHANUM calculates the cosine similarity and angular difference between 3D vector triplets formed by anatomical keypoints (such as shoulder-elbow-wrist or hip-knee-ankle). Deviations between live camera coordinates and reference matrices are normalized, weighted by joint visibility confidence, and aggregated into a real-time 0% to 100% alignment score at 60 FPS.
          </p>
        </div>

        {/* Section 1: Joint Vector Formation */}
        <section className="space-y-4 text-textSecondary text-base leading-relaxed">
          <h2 className="text-2xl font-black uppercase tracking-tight text-textPrimary">
            1. Extracting Joint Angle Triplets
          </h2>
          <p>
            Rather than relying on absolute pixel positions (which vary with distance and screen resolution), POSEHANUM evaluates scale-invariant <em>relative joint angles</em>. For any three connected keypoints $A$, $B$, and $C$ (where $B$ is the vertex joint, e.g. the elbow):
          </p>
          <div className="p-4 rounded-xl bg-surface font-mono text-xs sm:text-sm text-textPrimary border border-surfaceBorder overflow-x-auto space-y-1">
            <p>{'u_vec = Point_A - Point_B,  v_vec = Point_C - Point_B'}</p>
            <p>{'cos(θ) = (u_vec · v_vec) / (||u_vec|| * ||v_vec||)'}</p>
            <p>{'θ = arccos(clamp(cos(θ), -1.0, 1.0)) * (180 / π)'}</p>
          </div>
        </section>

        {/* Section 2: The Aggregate Scoring Equation */}
        <section className="space-y-4 text-textSecondary text-base leading-relaxed">
          <h2 className="text-2xl font-black uppercase tracking-tight text-textPrimary">
            2. The Normalized Scoring Equation
          </h2>
          <p>
            The aggregate score compares N critical joint angles between the live user posture and the target reference:
          </p>
          <div className="p-4 rounded-xl bg-surface font-mono text-xs sm:text-sm text-primary border border-primary/30 overflow-x-auto">
            <p>{'Score = 100 * (1.0 - (Σ w_i * (|θ_user_i - θ_target_i| / 180°)) / (Σ w_i))'}</p>
          </div>
          <p>
            Where $w_i$ represents the visibility confidence score provided by the neural model. If a limb is occluded behind the torso, its weight decreases automatically to prevent false penalties.
          </p>
        </section>

        {/* Section 3: Color Feedback Thresholds */}
        <section className="space-y-4 text-textSecondary text-base leading-relaxed">
          <h2 className="text-2xl font-black uppercase tracking-tight text-textPrimary">
            3. Dynamic Visual Thresholds & Auto Shutter Lock
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-surface border border-primary space-y-1">
              <span className="text-primary font-mono font-black text-sm uppercase">≥ 90% Match</span>
              <p className="text-xs font-bold text-textPrimary">Lime Green (Locked)</p>
              <p className="text-xs text-textSecondary">Triggers 2-second hold countdown for auto capture.</p>
            </div>
            <div className="p-4 rounded-2xl bg-surface border border-cyanAccent space-y-1">
              <span className="text-cyanAccent font-mono font-black text-sm uppercase">70% – 89% Match</span>
              <p className="text-xs font-bold text-textPrimary">Cyan (Minor Shift)</p>
              <p className="text-xs text-textSecondary">Whispers targeted audio prompt (e.g. &quot;tilt chin 5°&quot;).</p>
            </div>
            <div className="p-4 rounded-2xl bg-surface border border-orangeAccent space-y-1">
              <span className="text-orangeAccent font-mono font-black text-sm uppercase">&lt; 70% Match</span>
              <p className="text-xs font-bold text-textPrimary">Orange (Realign)</p>
              <p className="text-xs text-textSecondary">Guides baseline stance and body direction.</p>
            </div>
          </div>
        </section>

        {/* Related Internal Links */}
        <div className="p-6 rounded-2xl bg-surface border border-surfaceBorder space-y-4">
          <h3 className="text-lg font-black uppercase tracking-tight text-textPrimary">
            Explore More Architecture & Guides
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              href="/blog/what-is-ai-pose-matching"
              className="p-3 rounded-xl bg-background border border-surfaceBorder hover:border-primary text-sm font-bold text-textPrimary hover:text-primary transition-colors flex items-center justify-between"
            >
              <span>What Is AI Pose Matching?</span>
              <CheckCircle2 className="w-4 h-4 text-primary" />
            </Link>
            <Link
              href="/blog/privacy-first-ai-photography"
              className="p-3 rounded-xl bg-background border border-surfaceBorder hover:border-primary text-sm font-bold text-textPrimary hover:text-primary transition-colors flex items-center justify-between"
            >
              <span>Privacy-First On-Device AI Architecture</span>
              <CheckCircle2 className="w-4 h-4 text-primary" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
