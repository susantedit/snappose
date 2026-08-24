import type { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, CheckCircle2, Sparkles, Camera, Compass } from 'lucide-react';

export const metadata: Metadata = {
  title: '25 Best Photo Poses for Beginners: Easy Stances for Natural Photos',
  description:
    'Master natural standing poses, relaxed sitting postures, and casual street photography stances with step-by-step weight distribution and hand placement guides.',
  keywords: [
    'photo poses for beginners',
    'easy poses for photos',
    'how to pose naturally in pictures',
    'standing poses for photography',
    'portrait posing guide beginners',
  ],
  alternates: {
    canonical: 'https://www.posehanum.tech/blog/photo-poses-for-beginners',
  },
  openGraph: {
    title: '25 Best Photo Poses for Beginners: Easy Stances for Natural Photos',
    description:
      'Master natural weight distribution, relaxed hand placement, and confident shoulder angles with step-by-step beginner posing guides.',
    url: 'https://www.posehanum.tech/blog/photo-poses-for-beginners',
    siteName: 'POSEHANUM',
    type: 'article',
  },
};

const articleLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: '25 Best Photo Poses for Beginners: Easy Stances for Natural Photos',
  description:
    'Practical beginner photography posing guide covering standing stances, cafe sits, and relaxed weight balance.',
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
  mainEntityOfPage: 'https://www.posehanum.tech/blog/photo-poses-for-beginners',
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
      name: '25 Best Photo Poses for Beginners',
      item: 'https://www.posehanum.tech/blog/photo-poses-for-beginners',
    },
  ],
};

export default function PhotoPosesForBeginnersPage() {
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
            <span className="px-3 py-1 rounded-lg bg-orangeAccent/10 text-orangeAccent text-xs font-mono font-bold uppercase border border-orangeAccent/20">
              Photography Tutorial
            </span>
            <span className="text-xs text-textMuted flex items-center gap-1 font-medium">
              <Clock className="w-3.5 h-3.5" /> 8 min read
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-textPrimary leading-tight">
            25 BEST PHOTO POSES FOR BEGINNERS: <br />
            <span className="text-primary text-glow">HOW TO POSE NATURALLY.</span>
          </h1>

          <div className="flex items-center gap-3 pt-2 text-xs text-textSecondary font-medium">
            <span>By <strong>Susant Luitel (Kantaraj)</strong></span>
            <span>•</span>
            <span>Published August 2026</span>
          </div>
        </header>

        {/* Quick Answer Summary for AEO */}
        <div className="p-6 rounded-2xl bg-surface/80 border border-primary/40 shadow-card-dark space-y-3">
          <span className="text-xs font-mono font-bold text-primary uppercase tracking-wider block">
            Direct Posing Rule (AEO Summary)
          </span>
          <p className="text-base sm:text-lg font-semibold text-textPrimary leading-relaxed">
            The foundation of natural photography posing for beginners relies on three rules: <strong>(1) Asymmetric Weight Distribution</strong> (shift 70% of your weight to your back leg), <strong>(2) Create Triangles</strong> with your arms and legs to add depth, and <strong>(3) Avoid Squaring Directly with the Lens</strong> by angling your shoulders 30° to 45° away from the camera.
          </p>
        </div>

        {/* Section 1: Foundational Stances */}
        <section className="space-y-4 text-textSecondary text-base leading-relaxed">
          <h2 className="text-2xl font-black uppercase tracking-tight text-textPrimary">
            1. Essential Standing Stances
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-5 rounded-2xl bg-surface border border-surfaceBorder space-y-2">
              <h3 className="font-bold text-textPrimary text-base">The Urban Wall Lean</h3>
              <p className="text-sm">Rest one shoulder casually against a textured wall with your outer foot crossed loosely in front. Keep one hand in a pocket.</p>
            </div>
            <div className="p-5 rounded-2xl bg-surface border border-surfaceBorder space-y-2">
              <h3 className="font-bold text-textPrimary text-base">The Dynamic Stride</h3>
              <p className="text-sm">Take a deliberate step toward or across the camera path. Mid-motion captures create authentic kinetic energy in candid shots.</p>
            </div>
            <div className="p-5 rounded-2xl bg-surface border border-surfaceBorder space-y-2">
              <h3 className="font-bold text-textPrimary text-base">The Over-Shoulder Glance</h3>
              <p className="text-sm">Turn your torso 45° away from the camera and look gently back over your lead shoulder toward the lens.</p>
            </div>
            <div className="p-5 rounded-2xl bg-surface border border-surfaceBorder space-y-2">
              <h3 className="font-bold text-textPrimary text-base">The Jacket / Collar Adjust</h3>
              <p className="text-sm">Gives awkward hands an immediate purpose: gently hold your lapel, sunglasses, or watch with relaxed fingers.</p>
            </div>
          </div>
        </section>

        {/* Section 2: Sitting & Cafe Poses */}
        <section className="space-y-4 text-textSecondary text-base leading-relaxed">
          <h2 className="text-2xl font-black uppercase tracking-tight text-textPrimary">
            2. Relaxed Sitting & Table Compositions
          </h2>
          <p>
            Sitting poses provide natural structure. Lean forward from the hips rather than slouching your lower back. Rest one forearm along the table edge to create diagonal leading lines toward your face.
          </p>
        </section>

        {/* Section 3: Using POSEHANUM AI Guides */}
        <section className="space-y-4 text-textSecondary text-base leading-relaxed">
          <h2 className="text-2xl font-black uppercase tracking-tight text-textPrimary">
            3. How POSEHANUM AI Accelerates Beginner Posing
          </h2>
          <p>
            Instead of memorizing 25 poses, <Link href="/" className="text-primary font-bold underline">POSEHANUM</Link> projects translucent ghost silhouettes and 33-point AR bone lines directly over your camera feed. Real-time audio coaching guides your chin, shoulders, and hips until your match score hits 90%+, firing the shutter hands-free.
          </p>
        </section>

        {/* Related Internal Links */}
        <div className="p-6 rounded-2xl bg-surface border border-surfaceBorder space-y-4">
          <h3 className="text-lg font-black uppercase tracking-tight text-textPrimary">
            Recommended Guides
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              href="/blog/how-to-take-better-photos-alone"
              className="p-3 rounded-xl bg-background border border-surfaceBorder hover:border-primary text-sm font-bold text-textPrimary hover:text-primary transition-colors flex items-center justify-between"
            >
              <span>How to Take Better Photos Alone</span>
              <CheckCircle2 className="w-4 h-4 text-primary" />
            </Link>
            <Link
              href="/#categories"
              className="p-3 rounded-xl bg-background border border-surfaceBorder hover:border-primary text-sm font-bold text-textPrimary hover:text-primary transition-colors flex items-center justify-between"
            >
              <span>Explore 15 Pose Category Collections</span>
              <CheckCircle2 className="w-4 h-4 text-primary" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
