import type { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, CheckCircle2, ShieldCheck, Camera, Layers, Clock, User, HelpCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'What Is AI Pose Matching? Real-Time Camera Pose Guidance Explained',
  description:
    'Learn how AI pose matching uses 33-point computer vision landmarks to compare live body posture with reference photos in real time for effortless photography.',
  keywords: [
    'what is AI pose matching',
    'AI pose detection photography',
    'real-time pose tracking app',
    'MediaPipe skeleton matching',
    'how to recreate reference poses',
  ],
  alternates: {
    canonical: 'https://www.posehanum.tech/blog/what-is-ai-pose-matching',
  },
  openGraph: {
    title: 'What Is AI Pose Matching? Real-Time Camera Pose Guidance Explained',
    description:
      'Discover how real-time 33-landmark skeleton tracking and computer vision compare your live camera posture with professional reference photos.',
    url: 'https://www.posehanum.tech/blog/what-is-ai-pose-matching',
    siteName: 'POSEHANUM',
    type: 'article',
  },
};

const articleLd = {
  '@context': 'https://schema.org',
  '@type': 'TechArticle',
  headline: 'What Is AI Pose Matching? Real-Time Camera Pose Guidance Explained',
  description:
    'A comprehensive technical and practical guide to how AI pose matching uses computer vision to guide human posture in photography.',
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
  mainEntityOfPage: 'https://www.posehanum.tech/blog/what-is-ai-pose-matching',
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
      name: 'What Is AI Pose Matching?',
      item: 'https://www.posehanum.tech/blog/what-is-ai-pose-matching',
    },
  ],
};

export default function WhatIsAiPoseMatchingPage() {
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
              Computer Vision & AI
            </span>
            <span className="text-xs text-textMuted flex items-center gap-1 font-medium">
              <Clock className="w-3.5 h-3.5" /> 6 min read
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-textPrimary leading-tight">
            WHAT IS AI POSE MATCHING? <br />
            <span className="text-primary text-glow">REAL-TIME CAMERA GUIDANCE.</span>
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
            <strong>AI Pose Matching</strong> is an on-device computer vision technology that tracks real-time human anatomical joint landmarks and compares the user&apos;s live posture against a target reference photo. By calculating angular differences across 33 keypoints at 60 FPS, the system provides live alignment scores (0–100%), spoken coaching cues, and hands-free auto capture when the posture is achieved.
          </p>
        </div>

        {/* Section 1: The Posing Problem */}
        <section className="space-y-4 text-textSecondary text-base leading-relaxed">
          <h2 className="text-2xl font-black uppercase tracking-tight text-textPrimary">
            The Fundamental Problem with Traditional Photo Posing
          </h2>
          <p>
            Almost everyone has saved inspiring reference photos on Instagram or Pinterest only to feel awkward and stiff when attempting to recreate them in front of a smartphone camera. Without an experienced photographer guiding your posture, it is nearly impossible to know whether your shoulders are square, your chin is tilted correctly, or your weight is distributed naturally.
          </p>
          <p>
            Traditional camera apps offer static grid lines or countdown timers, but neither provides intelligent feedback on what your body is actually doing in the frame.
          </p>
        </section>

        {/* Section 2: How MediaPipe 33-Landmark Tracking Works */}
        <section className="space-y-4 text-textSecondary text-base leading-relaxed">
          <h2 className="text-2xl font-black uppercase tracking-tight text-textPrimary">
            How 33-Point Skeleton Landmark Detection Works
          </h2>
          <p>
            Modern AI pose matching applications like <Link href="/" className="text-primary font-bold underline">POSEHANUM</Link> leverage optimized MediaPipe PoseLandmarker neural networks. The model executes directly on your smartphone’s GPU, identifying 33 distinct anatomical 3D coordinates:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-textPrimary font-medium">
            <li><strong>Craniofacial Coordinates (0–10):</strong> Nose, inner/outer eye corners, ears, mouth boundaries for head tilt and gaze vector tracking.</li>
            <li><strong>Upper Extremities (11–22):</strong> Left and right shoulder joints, elbow angles, wrists, pinkies, index fingers, and thumbs.</li>
            <li><strong>Core & Lower Extremities (23–32):</strong> Hips, knees, ankles, heels, and foot index points for stance balance and weight distribution.</li>
          </ul>
        </section>

        {/* Section 3: Dual Ghost & Skia Overlay */}
        <section className="space-y-4 text-textSecondary text-base leading-relaxed">
          <h2 className="text-2xl font-black uppercase tracking-tight text-textPrimary">
            Dual Ghost Silhouettes vs. AR Vector Wireframes
          </h2>
          <p>
            To guide the user without obstructing the viewfinder, POSEHANUM introduces two visual rendering modes:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-5 rounded-2xl bg-surface border border-surfaceBorder space-y-2">
              <h3 className="font-bold text-textPrimary text-base">1. Translucent Ghost Overlay</h3>
              <p className="text-sm">Renders a semi-transparent photographic silhouette of the target stance, allowing you to match your physical outline directly with the guide.</p>
            </div>
            <div className="p-5 rounded-2xl bg-surface border border-surfaceBorder space-y-2">
              <h3 className="font-bold text-textPrimary text-base">2. Skia AR Wireframe</h3>
              <p className="text-sm">Draws glowing vector bone connections that shift from Orange to Cyan to Lime Green as individual joint angles achieve alignment.</p>
            </div>
          </div>
        </section>

        {/* Section 4: Hands-Free Capture Integration */}
        <section className="space-y-4 text-textSecondary text-base leading-relaxed">
          <h2 className="text-2xl font-black uppercase tracking-tight text-textPrimary">
            Closing the Loop: Spoken Audio & Hands-Free Capture
          </h2>
          <p>
            Visual feedback alone is insufficient when standing 8 feet away on a tripod. AI pose matching bridges this gap with an <Link href="/#ai-coach" className="text-primary font-bold underline">adaptive audio coach</Link> that whispers concise micro-adjustments into your wireless earbuds. Once a 90%+ match score is sustained for 2 seconds, the shutter triggers automatically.
          </p>
        </section>

        {/* Related Guides / Internal Linking */}
        <div className="p-6 rounded-2xl bg-surface border border-surfaceBorder space-y-4">
          <h3 className="text-lg font-black uppercase tracking-tight text-textPrimary">
            Related Technical & Posing Guides
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              href="/blog/how-pose-scoring-works"
              className="p-3 rounded-xl bg-background border border-surfaceBorder hover:border-primary text-sm font-bold text-textPrimary hover:text-primary transition-colors flex items-center justify-between"
            >
              <span>How Pose Scoring Works (Math & Code)</span>
              <CheckCircle2 className="w-4 h-4 text-primary" />
            </Link>
            <Link
              href="/blog/photo-poses-for-beginners"
              className="p-3 rounded-xl bg-background border border-surfaceBorder hover:border-primary text-sm font-bold text-textPrimary hover:text-primary transition-colors flex items-center justify-between"
            >
              <span>25 Best Photo Poses for Beginners</span>
              <CheckCircle2 className="w-4 h-4 text-primary" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
