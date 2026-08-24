import type { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, CheckCircle2, Camera, Compass, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'How to Pose for Photos: The Complete Visual Posture Handbook',
  description:
    'A masterclass on photo posing. Learn how to elongate posture, position hands naturally, control chin angles, and avoid stiffness in smartphone portraits.',
  keywords: [
    'how to pose for photos',
    'photo posing techniques',
    'how to look natural in pictures',
    'posing tips for photography',
    'full body posing guide',
  ],
  alternates: {
    canonical: 'https://www.posehanum.tech/blog/how-to-pose-for-photos',
  },
  openGraph: {
    title: 'How to Pose for Photos: The Complete Visual Posture Handbook',
    description:
      'Master natural weight distribution, relaxed hand placement, and confident shoulder angles with step-by-step visual posing guides.',
    url: 'https://www.posehanum.tech/blog/how-to-pose-for-photos',
    siteName: 'POSEHANUM',
    type: 'article',
  },
};

const articleLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'How to Pose for Photos: The Complete Visual Posture Handbook',
  description:
    'Comprehensive practical tutorial on mastering human posture, joint micro-angles, and facial expression control in photography.',
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
  mainEntityOfPage: 'https://www.posehanum.tech/blog/how-to-pose-for-photos',
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
      name: 'How to Pose for Photos',
      item: 'https://www.posehanum.tech/blog/how-to-pose-for-photos',
    },
  ],
};

export default function HowToPoseForPhotosPage() {
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
            <span className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-xs font-mono font-bold uppercase border border-primary/20">
              Masterclass Tutorial
            </span>
            <span className="text-xs text-textMuted flex items-center gap-1 font-medium">
              <Clock className="w-3.5 h-3.5" /> 8 min read
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-textPrimary leading-tight">
            HOW TO POSE FOR PHOTOS: <br />
            <span className="text-primary text-glow">THE VISUAL POSTURE HANDBOOK.</span>
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
            Posing for photos naturally requires controlling four anatomical axes: <strong>(1) Spine Elongation</strong> without tensing the trapezius muscles, <strong>(2) 45° Torso Rotation</strong> relative to the camera lens to create flattering shadows and depth, <strong>(3) Asymmetric Limb Triangles</strong> to break static vertical lines, and <strong>(4) Relaxed Hand Anchors</strong> (pockets, lapels, accessories).
          </p>
        </div>

        {/* Section 1: The Core Anatomical Rules */}
        <section className="space-y-4 text-textSecondary text-base leading-relaxed">
          <h2 className="text-2xl font-black uppercase tracking-tight text-textPrimary">
            1. The Four Golden Rules of Flattering Posture
          </h2>
          <div className="space-y-4 pt-2">
            <div className="p-5 rounded-2xl bg-surface border border-surfaceBorder space-y-2">
              <h3 className="font-bold text-textPrimary text-base">Rule 1: Never Stand Flat-Footed</h3>
              <p className="text-sm">Place 70% of your body weight on your rear foot. This naturally drops one hip slightly, creating the classic classical &quot;contrapposto&quot; curve that brings dynamic grace to standing portraits.</p>
            </div>
            <div className="p-5 rounded-2xl bg-surface border border-surfaceBorder space-y-2">
              <h3 className="font-bold text-textPrimary text-base">Rule 2: Push the Chin Forward and Down</h3>
              <p className="text-sm">To eliminate unflattering double chins and accentuate the jawline, extend your forehead slightly forward toward the lens and tilt your chin downward by 5 to 10 degrees.</p>
            </div>
            <div className="p-5 rounded-2xl bg-surface border border-surfaceBorder space-y-2">
              <h3 className="font-bold text-textPrimary text-base">Rule 3: Create Negative Space Around the Waist</h3>
              <p className="text-sm">Pressing arms flat against your ribcage makes upper arms look twice as wide. Always leave a gap between your elbows and torso by resting hands on hips or in pockets.</p>
            </div>
          </div>
        </section>

        {/* Section 2: How AI Replaces Guesswork */}
        <section className="space-y-4 text-textSecondary text-base leading-relaxed">
          <h2 className="text-2xl font-black uppercase tracking-tight text-textPrimary">
            2. How POSEHANUM AI Guides Live Alignment
          </h2>
          <p>
            Instead of trying to remember these rules mentally, <Link href="/" className="text-primary font-bold underline">POSEHANUM</Link> uses real-time 33-point keypoint tracking. As you move, glowing wireframe bones indicate exact angular deviation, while the spoken audio coach advises: &quot;tilt chin 5°&quot;, &quot;drop right shoulder&quot;, &quot;shift weight back&quot;.
          </p>
        </section>

        {/* Related Internal Links */}
        <div className="p-6 rounded-2xl bg-surface border border-surfaceBorder space-y-4">
          <h3 className="text-lg font-black uppercase tracking-tight text-textPrimary">
            Explore Related Posing Deep Dives
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              href="/blog/photo-poses-for-beginners"
              className="p-3 rounded-xl bg-background border border-surfaceBorder hover:border-primary text-sm font-bold text-textPrimary hover:text-primary transition-colors flex items-center justify-between"
            >
              <span>25 Photo Poses for Beginners</span>
              <CheckCircle2 className="w-4 h-4 text-primary" />
            </Link>
            <Link
              href="/blog/how-to-take-better-photos-alone"
              className="p-3 rounded-xl bg-background border border-surfaceBorder hover:border-primary text-sm font-bold text-textPrimary hover:text-primary transition-colors flex items-center justify-between"
            >
              <span>How to Take Better Photos Alone</span>
              <CheckCircle2 className="w-4 h-4 text-primary" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
