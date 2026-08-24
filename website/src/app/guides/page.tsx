import type { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Sparkles, ArrowRight, Camera, User, Sliders } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Photography & AI Camera Masterclass Guides | POSEHANUM',
  description:
    'Step-by-step masterclasses on looking natural in photos, finding your best angles, solo creator photography, and using AI pose matching.',
  keywords: [
    'photography masterclass guides',
    'how to look natural in photos',
    'how to find your best pose',
    'AI camera posing tutorials',
  ],
  alternates: {
    canonical: 'https://www.posehanum.tech/guides',
  },
  openGraph: {
    title: 'Photography & AI Camera Masterclass Guides | POSEHANUM',
    description:
      'Step-by-step guides to mastering natural posture, flattering angles, and AI-assisted camera tools.',
    url: 'https://www.posehanum.tech/guides',
    siteName: 'POSEHANUM',
    type: 'website',
  },
};

const MASTERCLASS_GUIDES = [
  {
    slug: 'how-to-look-natural-in-photos',
    title: 'How to Look Natural in Photos: Overcoming Camera Anxiety',
    description: 'Practical breathing techniques, muscle relaxation cues, and posture principles that eliminate camera stiffness.',
    category: 'Technique',
  },
  {
    slug: 'how-to-find-your-best-pose',
    title: 'How to Find Your Best Pose: 3-Step Angle Discovery Guide',
    description: 'Learn how to identify your dominant facial side, flattering chin angles, and body proportions.',
    category: 'Discovery',
  },
];

const guidesBreadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.posehanum.tech' },
    { '@type': 'ListItem', position: 2, name: 'Guides', item: 'https://www.posehanum.tech/guides' },
  ],
};

export default function GuidesIndexPage() {
  return (
    <main className="min-h-screen bg-background text-textPrimary py-16 px-4 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(guidesBreadcrumbLd) }} />

      <div className="max-w-5xl mx-auto space-y-12">
        <div className="flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
            <ArrowLeft className="w-4 h-4" /> Back to Homepage
          </Link>
          <span className="text-xs font-mono font-bold text-textMuted uppercase">
            Masterclass Center
          </span>
        </div>

        <header className="border-b border-surfaceBorder pb-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-bold uppercase tracking-wider mb-2 shadow-neon-lime">
            <BookOpen className="w-4 h-4" /> Photography Masterclass Series
          </div>
          <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-textPrimary">
            PHOTOGRAPHY & AI CAMERA <br />
            <span className="text-primary text-glow">MASTERCLASS GUIDES.</span>
          </h1>
          <p className="text-base sm:text-lg text-textSecondary max-w-3xl leading-relaxed">
            In-depth tutorials providing actionable posture blueprints, angle adjustments, and technical camera workflows.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {MASTERCLASS_GUIDES.map((guide) => (
            <Link
              key={guide.slug}
              href={`/guides/${guide.slug}`}
              className="group p-7 rounded-3xl bg-surface border border-surfaceBorder hover:border-primary/60 transition-all duration-300 shadow-card-dark flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-xs font-mono font-bold uppercase border border-primary/20">
                    {guide.category}
                  </span>
                </div>

                <h2 className="text-xl font-black text-textPrimary group-hover:text-primary transition-colors uppercase tracking-tight leading-snug">
                  {guide.title}
                </h2>
                <p className="mt-2.5 text-sm text-textSecondary leading-relaxed">
                  {guide.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-surfaceBorder/60 flex items-center justify-between text-xs font-bold text-primary">
                <span>Read Masterclass</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
