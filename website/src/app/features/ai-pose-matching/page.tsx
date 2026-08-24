import type { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, CheckCircle2, Clock, Zap, Layers, Compass, HelpCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Real-Time AI Pose Matching — 60 FPS Camera Guidance | POSEHANUM',
  description:
    'Discover how POSEHANUM tracks 33 anatomical landmarks at 60 FPS on-device to compare live camera posture against curated reference guides in real time.',
  keywords: [
    'real time AI pose matching',
    'MediaPipe 33 keypoints camera',
    'live pose alignment score',
    'AI photography viewfinder guide',
    'on device pose tracking 60 FPS',
  ],
  alternates: {
    canonical: 'https://www.posehanum.tech/features/ai-pose-matching',
  },
  openGraph: {
    title: 'Real-Time AI Pose Matching — 60 FPS Camera Guidance | POSEHANUM',
    description:
      'Learn how POSEHANUM tracks 33 body keypoints on-device with sub-millimeter angular deviation scoring and real-time guidance.',
    url: 'https://www.posehanum.tech/features/ai-pose-matching',
    siteName: 'POSEHANUM',
    type: 'website',
  },
};

const featureLd = {
  '@context': 'https://schema.org',
  '@type': 'TechArticle',
  headline: 'Real-Time AI Pose Matching Feature Deep Dive',
  description:
    'Technical specification of POSEHANUM’s 60 FPS on-device 33-landmark pose matching architecture.',
  author: { '@type': 'Person', name: 'Susant Luitel', url: 'https://github.com/susantedit' },
  publisher: { '@type': 'Organization', name: 'POSEHANUM', logo: 'https://www.posehanum.tech/logo.png' },
  mainEntityOfPage: 'https://www.posehanum.tech/features/ai-pose-matching',
};

const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.posehanum.tech' },
    { '@type': 'ListItem', position: 2, name: 'Features', item: 'https://www.posehanum.tech/features' },
    { '@type': 'ListItem', position: 3, name: 'AI Pose Matching', item: 'https://www.posehanum.tech/features/ai-pose-matching' },
  ],
};

export default function AiPoseMatchingFeaturePage() {
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
              Core Neural Engine
            </span>
            <span className="text-xs text-textMuted font-medium">Feature Deep Dive</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-textPrimary leading-tight">
            REAL-TIME AI POSE MATCHING: <br />
            <span className="text-primary text-glow">60 FPS VIEWPORT GUIDANCE.</span>
          </h1>
        </header>

        {/* Direct Summary for AEO */}
        <div className="p-6 rounded-2xl bg-surface/80 border border-primary/40 shadow-card-dark space-y-3">
          <span className="text-xs font-mono font-bold text-primary uppercase tracking-wider block">
            Feature Definition (AEO Summary)
          </span>
          <p className="text-base sm:text-lg font-semibold text-textPrimary leading-relaxed">
            <strong>Real-Time AI Pose Matching</strong> in POSEHANUM processes live camera feeds at 60 FPS on-device using MediaPipe PoseLandmarker neural networks. It extracts 33 3D anatomical joint landmarks and compares them against target reference poses, rendering glowing color-coded skeleton feedback and a live 0–100% alignment score with sub-millimeter angular precision.
          </p>
        </div>

        <section className="space-y-4 text-textSecondary text-base leading-relaxed">
          <h2 className="text-2xl font-black uppercase tracking-tight text-textPrimary">
            How On-Device Vision Eliminates Cloud Latency
          </h2>
          <p>
            Unlike cloud-based computer vision APIs that introduce 300ms–800ms round-trip network lag, POSEHANUM executes inference locally on smartphone GPU shaders. This allows the viewfinder overlay to update seamlessly at 60 frames per second without frame drops, jitter, or privacy leakage.
          </p>
        </section>

        <section className="space-y-4 text-textSecondary text-base leading-relaxed">
          <h2 className="text-2xl font-black uppercase tracking-tight text-textPrimary">
            Dual Visual Feedback: Ghost Silhouette & Skia AR Bones
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-5 rounded-2xl bg-surface border border-surfaceBorder space-y-2">
              <h3 className="font-bold text-textPrimary text-base">Translucent Ghost Overlay</h3>
              <p className="text-sm">Renders a semi-transparent photographic silhouette of the target stance, helping you match your outer body contours naturally.</p>
            </div>
            <div className="p-5 rounded-2xl bg-surface border border-surfaceBorder space-y-2">
              <h3 className="font-bold text-textPrimary text-base">Glowing Skia AR Bones</h3>
              <p className="text-sm">Displays dynamic vector bone connections that shift from Orange (&lt;70%) to Cyan (70–89%) to Lime Green (≥90%) as joint angles align.</p>
            </div>
          </div>
        </section>

        {/* Related Links */}
        <div className="p-6 rounded-2xl bg-surface border border-surfaceBorder space-y-4">
          <h3 className="text-lg font-black uppercase tracking-tight text-textPrimary">
            Related Features & Guides
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link href="/features/pose-coaching" className="p-3 rounded-xl bg-background border border-surfaceBorder hover:border-primary text-sm font-bold text-textPrimary hover:text-primary transition-colors flex items-center justify-between">
              <span>Spoken Voice Audio Coach</span>
              <CheckCircle2 className="w-4 h-4 text-primary" />
            </Link>
            <Link href="/blog/how-pose-scoring-works" className="p-3 rounded-xl bg-background border border-surfaceBorder hover:border-primary text-sm font-bold text-textPrimary hover:text-primary transition-colors flex items-center justify-between">
              <span>How Pose Scoring Works (Math)</span>
              <CheckCircle2 className="w-4 h-4 text-primary" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
