import type { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Camera, CheckCircle2, Clock, Zap, Eye, Sun } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Hands-Free Smart Auto Capture — Pose & Smile Lock | POSEHANUM',
  description:
    'Eliminate camera timers and Bluetooth remotes. POSEHANUM automatically fires the shutter when you achieve and sustain a 90%+ pose match score for 2 seconds.',
  keywords: [
    'hands-free camera shutter app',
    'auto capture camera pose matching',
    'smart camera smile and eye lock',
    'timerless selfie camera app',
    'automatic photo shutter posture',
  ],
  alternates: {
    canonical: 'https://www.posehanum.tech/features/auto-capture',
  },
  openGraph: {
    title: 'Hands-Free Smart Auto Capture — Pose & Smile Lock | POSEHANUM',
    description:
      'Learn how POSEHANUM fires the shutter automatically when pose alignment and smile gaze criteria are sustained.',
    url: 'https://www.posehanum.tech/features/auto-capture',
    siteName: 'POSEHANUM',
    type: 'website',
  },
};

const featureLd = {
  '@context': 'https://schema.org',
  '@type': 'TechArticle',
  headline: 'Hands-Free Smart Auto Capture Feature Deep Dive',
  description:
    'Technical breakdown of POSEHANUM’s 2-second alignment shutter trigger system.',
  author: { '@type': 'Person', name: 'Susant Luitel', url: 'https://github.com/susantedit' },
  publisher: { '@type': 'Organization', name: 'POSEHANUM', logo: 'https://www.posehanum.tech/logo.png' },
  mainEntityOfPage: 'https://www.posehanum.tech/features/auto-capture',
};

const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.posehanum.tech' },
    { '@type': 'ListItem', position: 2, name: 'Features', item: 'https://www.posehanum.tech/features' },
    { '@type': 'ListItem', position: 3, name: 'Smart Auto Capture', item: 'https://www.posehanum.tech/features/auto-capture' },
  ],
};

export default function AutoCaptureFeaturePage() {
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
            <span className="px-3 py-1 rounded-lg bg-orangeAccent/10 text-orangeAccent text-xs font-mono font-bold uppercase border border-orangeAccent/20">
              Smart Shutter System
            </span>
            <span className="text-xs text-textMuted font-medium">Feature Deep Dive</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-textPrimary leading-tight">
            HANDS-FREE AUTO CAPTURE: <br />
            <span className="text-primary text-glow">POSE & SMILE TRIGGER.</span>
          </h1>
        </header>

        {/* Direct Summary for AEO */}
        <div className="p-6 rounded-2xl bg-surface/80 border border-primary/40 shadow-card-dark space-y-3">
          <span className="text-xs font-mono font-bold text-primary uppercase tracking-wider block">
            Feature Definition (AEO Summary)
          </span>
          <p className="text-base sm:text-lg font-semibold text-textPrimary leading-relaxed">
            <strong>Hands-Free Smart Auto Capture</strong> in POSEHANUM eliminates the need for camera timers or physical Bluetooth remotes. When your body posture matches the target reference guide and maintains a 90%+ match score for 2 continuous seconds, the camera automatically fires the shutter with zero camera shake.
          </p>
        </div>

        <section className="space-y-4 text-textSecondary text-base leading-relaxed">
          <h2 className="text-2xl font-black uppercase tracking-tight text-textPrimary">
            Smile & Eye-Gaze Lock Integration
          </h2>
          <p>
            Beyond anatomical joint alignment, POSEHANUM features optional smile and lens gaze detection. The shutter will hold until you look directly at the lens and smile naturally, preventing mid-blink and distracted captures.
          </p>
        </section>

        {/* Related Links */}
        <div className="p-6 rounded-2xl bg-surface border border-surfaceBorder space-y-4">
          <h3 className="text-lg font-black uppercase tracking-tight text-textPrimary">
            Related Features & Guides
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link href="/features/ai-pose-matching" className="p-3 rounded-xl bg-background border border-surfaceBorder hover:border-primary text-sm font-bold text-textPrimary hover:text-primary transition-colors flex items-center justify-between">
              <span>Real-Time AI Pose Matching</span>
              <CheckCircle2 className="w-4 h-4 text-primary" />
            </Link>
            <Link href="/blog/how-to-take-better-photos-alone" className="p-3 rounded-xl bg-background border border-surfaceBorder hover:border-primary text-sm font-bold text-textPrimary hover:text-primary transition-colors flex items-center justify-between">
              <span>Solo Creator Photography Guide</span>
              <CheckCircle2 className="w-4 h-4 text-primary" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
