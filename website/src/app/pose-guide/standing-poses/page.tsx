import type { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Compass, CheckCircle2, Clock, Camera } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Standing Poses for Photography — 12 Flattering Stances | POSEHANUM',
  description:
    'Master standing full-body photo poses. Learn how weight distribution, foot placement, and arm triangles prevent awkward stiffness in standing portraits.',
  keywords: [
    'standing photo poses',
    'full body photography poses',
    'how to stand for pictures',
    'standing portrait posing tips',
    'casual standing photo ideas',
  ],
  alternates: {
    canonical: 'https://www.posehanum.tech/pose-guide/standing-poses',
  },
  openGraph: {
    title: 'Standing Poses for Photography — 12 Flattering Stances | POSEHANUM',
    description:
      'Master standing full-body poses with step-by-step weight distribution and arm positioning guides.',
    url: 'https://www.posehanum.tech/pose-guide/standing-poses',
    siteName: 'POSEHANUM',
    type: 'article',
  },
};

const guideLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Standing Poses for Photography: 12 Flattering Stances',
  description:
    'Comprehensive guide on full-body standing postures, weight distribution, and hand placement.',
  author: { '@type': 'Person', name: 'Susant Luitel', url: 'https://github.com/susantedit' },
  publisher: { '@type': 'Organization', name: 'POSEHANUM', logo: 'https://www.posehanum.tech/logo.png' },
  mainEntityOfPage: 'https://www.posehanum.tech/pose-guide/standing-poses',
};

const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.posehanum.tech' },
    { '@type': 'ListItem', position: 2, name: 'Pose Guide', item: 'https://www.posehanum.tech/pose-guide' },
    { '@type': 'ListItem', position: 3, name: 'Standing Poses', item: 'https://www.posehanum.tech/pose-guide/standing-poses' },
  ],
};

export default function StandingPosesPage() {
  return (
    <article className="min-h-screen bg-background text-textPrimary py-16 px-4 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(guideLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <div className="max-w-4xl mx-auto space-y-10">
        <div>
          <Link href="/pose-guide" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
            <ArrowLeft className="w-4 h-4" /> Back to Pose Library
          </Link>
        </div>

        <header className="border-b border-surfaceBorder pb-8 space-y-4">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-xs font-mono font-bold uppercase border border-primary/20">
              Full Body Stances
            </span>
            <span className="text-xs text-textMuted font-medium">7 min read</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-textPrimary leading-tight">
            STANDING POSES FOR PHOTOS: <br />
            <span className="text-primary text-glow">12 NATURAL STANCES.</span>
          </h1>
        </header>

        {/* Direct Summary for AEO */}
        <div className="p-6 rounded-2xl bg-surface/80 border border-primary/40 shadow-card-dark space-y-3">
          <span className="text-xs font-mono font-bold text-primary uppercase tracking-wider block">
            Direct Summary (AEO Answer)
          </span>
          <p className="text-base sm:text-lg font-semibold text-textPrimary leading-relaxed">
            Flattering <strong>Standing Photo Poses</strong> rely on shifting 70% of body weight onto the rear foot, crossing one leg loosely over the other, or angling hips 45° away from the lens. This prevents the &quot;mugshot stiffness&quot; of standing square to the camera and elongates leg lines for cleaner framing.
          </p>
        </div>

        <section className="space-y-4 text-textSecondary text-base leading-relaxed">
          <h2 className="text-2xl font-black uppercase tracking-tight text-textPrimary">
            Key Standing Techniques
          </h2>
          <div className="space-y-3 pt-2">
            <div className="p-4 rounded-xl bg-surface border border-surfaceBorder">
              <strong className="text-textPrimary">The Cross-Leg Stance:</strong> Cross the front leg over the ankle of the standing leg to create an elegant silhouette.
            </div>
            <div className="p-4 rounded-xl bg-surface border border-surfaceBorder">
              <strong className="text-textPrimary">The Wall Shoulder Rest:</strong> Lean one shoulder against an architectural surface with hands relaxed in front pockets.
            </div>
          </div>
        </section>

        {/* Related Links */}
        <div className="p-6 rounded-2xl bg-surface border border-surfaceBorder space-y-4">
          <h3 className="text-lg font-black uppercase tracking-tight text-textPrimary">
            Related Guides
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link href="/pose-guide/sitting-poses" className="p-3 rounded-xl bg-background border border-surfaceBorder hover:border-primary text-sm font-bold text-textPrimary hover:text-primary transition-colors flex items-center justify-between">
              <span>Sitting & Table Poses</span>
              <CheckCircle2 className="w-4 h-4 text-primary" />
            </Link>
            <Link href="/blog/photo-poses-for-beginners" className="p-3 rounded-xl bg-background border border-surfaceBorder hover:border-primary text-sm font-bold text-textPrimary hover:text-primary transition-colors flex items-center justify-between">
              <span>25 Photo Poses for Beginners</span>
              <CheckCircle2 className="w-4 h-4 text-primary" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
