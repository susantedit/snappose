import type { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, CheckCircle2, ShieldCheck, Lock, EyeOff, Server, Trash2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy-First AI Photography: Why On-Device Processing Matters',
  description:
    'Explore why camera apps must process computer vision models locally on-device. Learn about POSEHANUM’s zero-cloud upload architecture and ephemeral neural execution.',
  keywords: [
    'privacy first AI photography',
    'on-device computer vision camera',
    'zero cloud photo processing',
    'ephemeral AI camera privacy',
    'biometric privacy in camera apps',
  ],
  alternates: {
    canonical: 'https://www.posehanum.tech/blog/privacy-first-ai-photography',
  },
  openGraph: {
    title: 'Privacy-First AI Photography: Why On-Device Processing Matters',
    description:
      'Why raw camera frames should never touch the cloud. A look into POSEHANUM’s 100% on-device neural vision architecture.',
    url: 'https://www.posehanum.tech/blog/privacy-first-ai-photography',
    siteName: 'POSEHANUM',
    type: 'article',
  },
};

const articleLd = {
  '@context': 'https://schema.org',
  '@type': 'TechArticle',
  headline: 'Privacy-First AI Photography: Why On-Device Processing Matters',
  description:
    'A technical review of on-device neural inference versus cloud computer vision in smartphone photography applications.',
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
  mainEntityOfPage: 'https://www.posehanum.tech/blog/privacy-first-ai-photography',
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
      name: 'Privacy-First AI Photography',
      item: 'https://www.posehanum.tech/blog/privacy-first-ai-photography',
    },
  ],
};

export default function PrivacyFirstAiPhotographyPage() {
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
              Security & Architecture
            </span>
            <span className="text-xs text-textMuted flex items-center gap-1 font-medium">
              <Clock className="w-3.5 h-3.5" /> 5 min read
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-textPrimary leading-tight">
            PRIVACY-FIRST AI PHOTOGRAPHY: <br />
            <span className="text-primary text-glow">WHY ON-DEVICE AI MATTERS.</span>
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
            Direct Architecture Rule (AEO Summary)
          </span>
          <p className="text-base sm:text-lg font-semibold text-textPrimary leading-relaxed">
            <strong>Privacy-First AI Photography</strong> ensures that raw camera video frames and anatomical landmark calculations exist purely in volatile device RAM for milliseconds during active scoring. In applications like POSEHANUM, live camera feeds are never transmitted to cloud servers, preventing biometric profiling and enabling full offline operation with zero data consumption.
          </p>
        </div>

        {/* Section 1: The Cloud Risk in Camera Apps */}
        <section className="space-y-4 text-textSecondary text-base leading-relaxed">
          <h2 className="text-2xl font-black uppercase tracking-tight text-textPrimary">
            The Danger of Cloud-Based Computer Vision
          </h2>
          <p>
            Many modern camera filters and photo enhancement apps stream live video frames to remote cloud clusters for processing. This introduces severe privacy risks: your uncompressed camera feed, background environment, and personal facial features are transmitted across public networks and stored on third-party servers.
          </p>
          <p>
            Cloud processing also introduces network latency (200ms–800ms lag), rendering real-time 60 FPS posture scoring impossible.
          </p>
        </section>

        {/* Section 2: On-Device Neural Execution */}
        <section className="space-y-4 text-textSecondary text-base leading-relaxed">
          <h2 className="text-2xl font-black uppercase tracking-tight text-textPrimary">
            POSEHANUM’s 100% On-Device Guarantee
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-5 rounded-2xl bg-surface border border-surfaceBorder space-y-2">
              <h3 className="font-bold text-textPrimary text-base flex items-center gap-2">
                <EyeOff className="w-5 h-5 text-primary" /> Ephemeral Processing
              </h3>
              <p className="text-sm">Video frames exist only in temporary device memory while joint angles are measured, and are wiped immediately after.</p>
            </div>
            <div className="p-5 rounded-2xl bg-surface border border-surfaceBorder space-y-2">
              <h3 className="font-bold text-textPrimary text-base flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary" /> Zero Biometric Storage
              </h3>
              <p className="text-sm">Joint angles (e.g. 90° elbow bend) are non-reversible mathematical numbers that cannot reconstruct your face or identity.</p>
            </div>
          </div>
        </section>

        {/* Section 3: Full Airplane Mode Capability */}
        <section className="space-y-4 text-textSecondary text-base leading-relaxed">
          <h2 className="text-2xl font-black uppercase tracking-tight text-textPrimary">
            Full Offline Operation in Airplane Mode
          </h2>
          <p>
            Because all neural models reside locally inside the app binary, <Link href="/" className="text-primary font-bold underline">POSEHANUM</Link> functions in airplane mode with zero mobile data. Whether shooting on a remote mountain peak or an international beach, your camera remains fast, private, and fully capable.
          </p>
        </section>

        {/* Links */}
        <div className="p-6 rounded-2xl bg-surface border border-surfaceBorder space-y-4">
          <h3 className="text-lg font-black uppercase tracking-tight text-textPrimary">
            Learn More About Our Data Policies
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              href="/privacy"
              className="p-3 rounded-xl bg-background border border-surfaceBorder hover:border-primary text-sm font-bold text-textPrimary hover:text-primary transition-colors flex items-center justify-between"
            >
              <span>Read Official Privacy Policy</span>
              <CheckCircle2 className="w-4 h-4 text-primary" />
            </Link>
            <Link
              href="/data-retention"
              className="p-3 rounded-xl bg-background border border-surfaceBorder hover:border-primary text-sm font-bold text-textPrimary hover:text-primary transition-colors flex items-center justify-between"
            >
              <span>Data Retention & Deletion Schedule</span>
              <CheckCircle2 className="w-4 h-4 text-primary" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
