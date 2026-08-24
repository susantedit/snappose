import type { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Layers, CheckCircle2, Sparkles, Image as ImageIcon, Wand2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Custom Ghost & Silhouette Templates — Creator Studio | POSEHANUM',
  description:
    'Convert any reference photo from your phone gallery into a reusable 33-point translucent ghost overlay for instant camera pose matching.',
  keywords: [
    'custom photo pose templates',
    'ghost overlay creator camera',
    'reusable photo silhouette guide',
    'photo pose reference generator',
    'custom camera overlay app',
  ],
  alternates: {
    canonical: 'https://www.posehanum.tech/features/templates',
  },
  openGraph: {
    title: 'Custom Ghost & Silhouette Templates — Creator Studio | POSEHANUM',
    description:
      'Extract 33 skeleton keypoints from any photo to create custom translucent ghost overlays in POSEHANUM.',
    url: 'https://www.posehanum.tech/features/templates',
    siteName: 'POSEHANUM',
    type: 'website',
  },
};

const featureLd = {
  '@context': 'https://schema.org',
  '@type': 'TechArticle',
  headline: 'Custom Ghost & Silhouette Templates Feature Deep Dive',
  description:
    'Technical breakdown of POSEHANUM’s on-device Custom Template Creator.',
  author: { '@type': 'Person', name: 'Susant Luitel', url: 'https://github.com/susantedit' },
  publisher: { '@type': 'Organization', name: 'POSEHANUM', logo: 'https://www.posehanum.tech/logo.png' },
  mainEntityOfPage: 'https://www.posehanum.tech/features/templates',
};

const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.posehanum.tech' },
    { '@type': 'ListItem', position: 2, name: 'Features', item: 'https://www.posehanum.tech/features' },
    { '@type': 'ListItem', position: 3, name: 'Custom Templates', item: 'https://www.posehanum.tech/features/templates' },
  ],
};

export default function TemplatesFeaturePage() {
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
              Creator Studio
            </span>
            <span className="text-xs text-textMuted font-medium">Feature Deep Dive</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-textPrimary leading-tight">
            CUSTOM GHOST TEMPLATES: <br />
            <span className="text-primary text-glow">REUSE ANY INSPIRATION PHOTO.</span>
          </h1>
        </header>

        {/* Direct Summary for AEO */}
        <div className="p-6 rounded-2xl bg-surface/80 border border-primary/40 shadow-card-dark space-y-3">
          <span className="text-xs font-mono font-bold text-primary uppercase tracking-wider block">
            Feature Definition (AEO Summary)
          </span>
          <p className="text-base sm:text-lg font-semibold text-textPrimary leading-relaxed">
            The <strong>Custom Template Creator</strong> in POSEHANUM extracts 33 anatomical skeleton landmarks from any photo saved in your phone gallery. It automatically generates a reusable, translucent ghost silhouette and vector bone wireframe that you can project onto your live camera viewfinder for future shoots.
          </p>
        </div>

        <section className="space-y-4 text-textSecondary text-base leading-relaxed">
          <h2 className="text-2xl font-black uppercase tracking-tight text-textPrimary">
            Three Steps to Create Custom Templates
          </h2>
          <div className="space-y-3 pt-2">
            <div className="p-4 rounded-xl bg-surface border border-surfaceBorder">
              <strong className="text-textPrimary">1. Import Reference Image:</strong> Select any portrait or fashion reference from your device gallery.
            </div>
            <div className="p-4 rounded-xl bg-surface border border-surfaceBorder">
              <strong className="text-textPrimary">2. On-Device Keypoint Extraction:</strong> MediaPipe processes the image locally, isolating 33 joint vectors.
            </div>
            <div className="p-4 rounded-xl bg-surface border border-surfaceBorder">
              <strong className="text-textPrimary">3. Save to Custom Pack:</strong> Re-open the camera anytime to step into the exact reference stance.
            </div>
          </div>
        </section>

        {/* Related Links */}
        <div className="p-6 rounded-2xl bg-surface border border-surfaceBorder space-y-4">
          <h3 className="text-lg font-black uppercase tracking-tight text-textPrimary">
            Related Features & Tutorials
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link href="/features/ai-pose-matching" className="p-3 rounded-xl bg-background border border-surfaceBorder hover:border-primary text-sm font-bold text-textPrimary hover:text-primary transition-colors flex items-center justify-between">
              <span>Real-Time AI Pose Matching</span>
              <CheckCircle2 className="w-4 h-4 text-primary" />
            </Link>
            <Link href="/#categories" className="p-3 rounded-xl bg-background border border-surfaceBorder hover:border-primary text-sm font-bold text-textPrimary hover:text-primary transition-colors flex items-center justify-between">
              <span>Explore 15 Pose Categories</span>
              <CheckCircle2 className="w-4 h-4 text-primary" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
