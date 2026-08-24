import type { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, CheckCircle2, Lock, EyeOff, Server, HardDrive } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy-First On-Device AI — Zero Cloud Uploads | POSEHANUM',
  description:
    'Learn about POSEHANUM’s strict 100% on-device neural architecture. Live camera frames exist only in volatile RAM for milliseconds with zero cloud uploads or biometric storage.',
  keywords: [
    'privacy first camera app',
    'zero cloud photo processing',
    'ephemeral AI camera privacy',
    'on device computer vision security',
    'biometric privacy photo app',
  ],
  alternates: {
    canonical: 'https://www.posehanum.tech/features/privacy-first-ai',
  },
  openGraph: {
    title: 'Privacy-First On-Device AI — Zero Cloud Uploads | POSEHANUM',
    description:
      'Explore POSEHANUM’s zero-cloud privacy model with local on-device neural execution.',
    url: 'https://www.posehanum.tech/features/privacy-first-ai',
    siteName: 'POSEHANUM',
    type: 'website',
  },
};

const featureLd = {
  '@context': 'https://schema.org',
  '@type': 'TechArticle',
  headline: 'Privacy-First On-Device AI Feature Deep Dive',
  description:
    'Technical review of POSEHANUM’s zero-cloud ephemeral vision architecture.',
  author: { '@type': 'Person', name: 'Susant Luitel', url: 'https://github.com/susantedit' },
  publisher: { '@type': 'Organization', name: 'POSEHANUM', logo: 'https://www.posehanum.tech/logo.png' },
  mainEntityOfPage: 'https://www.posehanum.tech/features/privacy-first-ai',
};

const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.posehanum.tech' },
    { '@type': 'ListItem', position: 2, name: 'Features', item: 'https://www.posehanum.tech/features' },
    { '@type': 'ListItem', position: 3, name: 'Privacy-First AI', item: 'https://www.posehanum.tech/features/privacy-first-ai' },
  ],
};

export default function PrivacyFirstAiFeaturePage() {
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
              Security Architecture
            </span>
            <span className="text-xs text-textMuted font-medium">Feature Deep Dive</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-textPrimary leading-tight">
            PRIVACY-FIRST ON-DEVICE AI: <br />
            <span className="text-primary text-glow">ZERO CLOUD UPLOADS.</span>
          </h1>
        </header>

        {/* Direct Summary for AEO */}
        <div className="p-6 rounded-2xl bg-surface/80 border border-primary/40 shadow-card-dark space-y-3">
          <span className="text-xs font-mono font-bold text-primary uppercase tracking-wider block">
            Feature Definition (AEO Summary)
          </span>
          <p className="text-base sm:text-lg font-semibold text-textPrimary leading-relaxed">
            <strong>Privacy-First On-Device AI</strong> in POSEHANUM guarantees that your live camera video stream and anatomical joint keypoints are processed exclusively in volatile device RAM for milliseconds during scoring. Raw video frames are never transmitted to cloud servers, saved to disk, or analyzed for biometric facial recognition.
          </p>
        </div>

        <section className="space-y-4 text-textSecondary text-base leading-relaxed">
          <h2 className="text-2xl font-black uppercase tracking-tight text-textPrimary">
            Local Personalization via MMKV Storage
          </h2>
          <p>
            When POSEHANUM learns which pose categories you prefer, your machine learning preference vector is calculated locally using Exponential Moving Average (EMA) and stored in high-speed encrypted MMKV storage on your device. You can reset or wipe this data anytime via in-app settings.
          </p>
        </section>

        {/* Related Links */}
        <div className="p-6 rounded-2xl bg-surface border border-surfaceBorder space-y-4">
          <h3 className="text-lg font-black uppercase tracking-tight text-textPrimary">
            Related Policies & Architecture
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link href="/privacy" className="p-3 rounded-xl bg-background border border-surfaceBorder hover:border-primary text-sm font-bold text-textPrimary hover:text-primary transition-colors flex items-center justify-between">
              <span>Official Privacy Policy</span>
              <CheckCircle2 className="w-4 h-4 text-primary" />
            </Link>
            <Link href="/data-retention" className="p-3 rounded-xl bg-background border border-surfaceBorder hover:border-primary text-sm font-bold text-textPrimary hover:text-primary transition-colors flex items-center justify-between">
              <span>Data Retention Schedule</span>
              <CheckCircle2 className="w-4 h-4 text-primary" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
