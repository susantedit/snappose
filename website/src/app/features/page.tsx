import type { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Mic, Camera, ShieldCheck, Download, Sliders, Layers, ArrowRight, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'POSEHANUM App Features — AI Camera & Pose Coaching Toolkit',
  description:
    'Explore the complete feature suite of POSEHANUM: real-time 33-landmark skeleton matching, 650+ scenario spoken voice coaching, hands-free auto-capture, and 100% on-device privacy.',
  keywords: [
    'POSEHANUM features',
    'AI pose matching features',
    'camera pose coach capabilities',
    'hands free auto shutter',
    'offline pose pack manager',
  ],
  alternates: {
    canonical: 'https://www.posehanum.tech/features',
  },
  openGraph: {
    title: 'POSEHANUM App Features — AI Camera & Pose Coaching Toolkit',
    description:
      'Explore all features: 33-point skeleton matching, spoken voice coaching, hands-free auto-capture, and offline mode.',
    url: 'https://www.posehanum.tech/features',
    siteName: 'POSEHANUM',
    type: 'website',
  },
};

const FEATURE_LIST = [
  {
    slug: 'ai-pose-matching',
    title: 'Real-Time AI Pose Matching',
    description: 'Track 33 anatomical 3D landmarks at 60 FPS on-device with dynamic color alignment scores (0–100%).',
    icon: Sparkles,
    badge: 'Core Vision Engine',
  },
  {
    slug: 'pose-coaching',
    title: 'Spoken Voice Audio Coach',
    description: '650+ scenario audio coaching engine whispering posture micro-adjustments directly into earbuds or speaker.',
    icon: Mic,
    badge: 'Audio AI',
  },
  {
    slug: 'auto-capture',
    title: 'Hands-Free Smart Auto Capture',
    description: 'Automatically fires the shutter when a 90%+ match score is sustained for 2 seconds with smile lock.',
    icon: Camera,
    badge: 'Smart Shutter',
  },
  {
    slug: 'offline-mode',
    title: '100% Offline Pose Pack Manager',
    description: 'Download curated category packs (Beach, Mountain, Streetwear, Cafe) for full airplane mode shoots.',
    icon: Download,
    badge: 'Travel Ready',
  },
  {
    slug: 'privacy-first-ai',
    title: 'On-Device Ephemeral Privacy',
    description: 'Zero cloud uploads. Video frames exist only in volatile RAM for milliseconds during scoring.',
    icon: ShieldCheck,
    badge: 'Zero Cloud',
  },
  {
    slug: 'pose-score',
    title: 'Sub-Millimeter Pose Scoring',
    description: 'Calculates joint vector cosine similarity and angular deviation to grade anatomical accuracy.',
    icon: Sliders,
    badge: 'Vector Math',
  },
  {
    slug: 'templates',
    title: 'Custom Ghost & Silhouette Overlays',
    description: 'Extract 33 skeleton keypoints from any gallery photo to create reusable translucent ghost guides.',
    icon: Layers,
    badge: 'Creator Studio',
  },
];

const featuresBreadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.posehanum.tech' },
    { '@type': 'ListItem', position: 2, name: 'Features', item: 'https://www.posehanum.tech/features' },
  ],
};

export default function FeaturesDirectoryPage() {
  return (
    <main className="min-h-screen bg-background text-textPrimary py-16 px-4 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(featuresBreadcrumbLd) }}
      />

      <div className="max-w-5xl mx-auto space-y-12">
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Homepage
          </Link>
          <span className="text-xs font-mono font-bold text-textMuted uppercase">
            POSEHANUM Feature Architecture
          </span>
        </div>

        {/* Header */}
        <header className="border-b border-surfaceBorder pb-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-bold uppercase tracking-wider mb-2 shadow-neon-lime">
            <Sparkles className="w-4 h-4" /> Complete Capability Matrix
          </div>
          <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-textPrimary">
            AI CAMERA & POSE COACHING <br />
            <span className="text-primary text-glow">FEATURE DIRECTORY.</span>
          </h1>
          <p className="text-base sm:text-lg text-textSecondary max-w-3xl leading-relaxed">
            Discover how POSEHANUM integrates on-device neural computer vision, spoken audio guidance, and hands-free shutter execution to elevate smartphone photography.
          </p>
        </header>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {FEATURE_LIST.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link
                key={feature.slug}
                href={`/features/${feature.slug}`}
                className="group p-7 rounded-3xl bg-surface border border-surfaceBorder hover:border-primary/60 transition-all duration-300 shadow-card-dark flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-xs font-mono font-bold uppercase border border-primary/20">
                      {feature.badge}
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-surfaceBorder/60 group-hover:bg-primary/20 text-primary flex items-center justify-center transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <h2 className="text-xl font-black text-textPrimary group-hover:text-primary transition-colors uppercase tracking-tight leading-snug">
                    {feature.title}
                  </h2>
                  <p className="mt-2.5 text-sm text-textSecondary leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-surfaceBorder/60 flex items-center justify-between text-xs font-bold text-primary">
                  <span>Explore Feature Deep Dive</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
