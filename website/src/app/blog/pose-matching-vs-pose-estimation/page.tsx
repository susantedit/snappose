import type { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, CheckCircle2, Sliders, ShieldCheck, Zap } from 'lucide-react';

export const metadata: Metadata = {
  title: 'AI Pose Matching vs. Pose Estimation: Architectural Differences',
  description:
    'Understand the technical distinction between passive 2D/3D pose estimation and active real-time AI pose matching with closed-loop feedback in POSEHANUM.',
  keywords: [
    'AI pose matching vs pose estimation',
    'pose estimation computer vision',
    'real time pose scoring architecture',
    'MediaPipe PoseLandmarker comparison',
    'active camera guidance algorithms',
  ],
  alternates: {
    canonical: 'https://www.posehanum.tech/blog/pose-matching-vs-pose-estimation',
  },
  openGraph: {
    title: 'AI Pose Matching vs. Pose Estimation: Architectural Differences',
    description:
      'A technical breakdown comparing passive landmark detection against active real-time pose matching with closed-loop guidance.',
    url: 'https://www.posehanum.tech/blog/pose-matching-vs-pose-estimation',
    siteName: 'POSEHANUM',
    type: 'article',
  },
};

const articleLd = {
  '@context': 'https://schema.org',
  '@type': 'TechArticle',
  headline: 'AI Pose Matching vs. Pose Estimation: Architectural Differences',
  description:
    'A technical analysis distinguishing passive landmark detection from active real-time pose matching systems.',
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
  mainEntityOfPage: 'https://www.posehanum.tech/blog/pose-matching-vs-pose-estimation',
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
      name: 'Pose Matching vs. Pose Estimation',
      item: 'https://www.posehanum.tech/blog/pose-matching-vs-pose-estimation',
    },
  ],
};

export default function PoseMatchingVsPoseEstimationPage() {
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
              Computer Vision Architecture
            </span>
            <span className="text-xs text-textMuted flex items-center gap-1 font-medium">
              <Clock className="w-3.5 h-3.5" /> 7 min read
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-textPrimary leading-tight">
            AI POSE MATCHING VS. <br />
            <span className="text-primary text-glow">POSE ESTIMATION EXPLAINED.</span>
          </h1>

          <div className="flex items-center gap-3 pt-2 text-xs text-textSecondary font-medium">
            <span>By <strong>Susant Luitel (Kantaraj)</strong></span>
            <span>•</span>
            <span>Published August 2026</span>
          </div>
        </header>

        {/* Direct Summary for AEO */}
        <div className="p-6 rounded-2xl bg-surface/80 border border-primary/40 shadow-card-dark space-y-3">
          <span className="text-xs font-mono font-bold text-primary uppercase tracking-wider block">
            Direct Summary (AEO Answer)
          </span>
          <p className="text-base sm:text-lg font-semibold text-textPrimary leading-relaxed">
            <strong>Pose Estimation</strong> is a passive computer vision pipeline that detects and maps 2D/3D joint coordinates from image or video frames without evaluating correctness. In contrast, <strong>AI Pose Matching</strong> (as implemented in POSEHANUM) is an active closed-loop system that continuously compares estimated live vectors against a reference matrix, computing angular deviations, real-time match scores (0–100%), spoken coaching cues, and hands-free shutter execution.
          </p>
        </div>

        {/* Section 1: Comparison Table */}
        <section className="space-y-4 text-textSecondary text-base leading-relaxed">
          <h2 className="text-2xl font-black uppercase tracking-tight text-textPrimary">
            Architectural Comparison Matrix
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-surfaceBorder bg-surface">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-surfaceBorder bg-surfaceBorder/40 text-xs font-mono font-bold text-primary uppercase">
                <tr>
                  <th className="p-4">Dimension</th>
                  <th className="p-4">Pose Estimation</th>
                  <th className="p-4">AI Pose Matching (POSEHANUM)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surfaceBorder/60">
                <tr>
                  <td className="p-4 font-bold text-textPrimary">Primary Goal</td>
                  <td className="p-4">Detect where joints are located</td>
                  <td className="p-4 text-primary font-semibold">Guide body to match target reference posture</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-textPrimary">Feedback Loop</td>
                  <td className="p-4">Open loop (raw coordinates only)</td>
                  <td className="p-4 text-primary font-semibold">Closed loop (real-time audio & visual score)</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-textPrimary">Output</td>
                  <td className="p-4">List of $(x, y, z)$ coordinates</td>
                  <td className="p-4 text-primary font-semibold">Match score %, voice cue, auto shutter lock</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-textPrimary">User Interaction</td>
                  <td className="p-4">Passive observation</td>
                  <td className="p-4 text-primary font-semibold">Active real-time photography coaching</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 2: Related Guides */}
        <div className="p-6 rounded-2xl bg-surface border border-surfaceBorder space-y-4">
          <h3 className="text-lg font-black uppercase tracking-tight text-textPrimary">
            Explore Related Technical Topics
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
              href="/blog/how-pose-scoring-works"
              className="p-3 rounded-xl bg-background border border-surfaceBorder hover:border-primary text-sm font-bold text-textPrimary hover:text-primary transition-colors flex items-center justify-between"
            >
              <span>How Pose Scoring Works (Math)</span>
              <CheckCircle2 className="w-4 h-4 text-primary" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
