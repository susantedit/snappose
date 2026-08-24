import type { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Compass, Sparkles, ArrowRight, Camera, Users, User, Coffee, Smile } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Photography Pose Guide & Visual Reference Library | POSEHANUM',
  description:
    'Explore curated pose guides for standing postures, sitting cafe stances, solo creator setups, and romantic couples photography.',
  keywords: [
    'photo pose guide library',
    'best poses for photography',
    'standing photo pose ideas',
    'sitting photo poses',
    'poses for couples photography',
  ],
  alternates: {
    canonical: 'https://www.posehanum.tech/pose-guide',
  },
  openGraph: {
    title: 'Photography Pose Guide & Visual Reference Library | POSEHANUM',
    description:
      'Explore curated visual pose collections: Standing, Sitting, Solo Creator, and Couples stances.',
    url: 'https://www.posehanum.tech/pose-guide',
    siteName: 'POSEHANUM',
    type: 'website',
  },
};

const POSE_GUIDES = [
  {
    slug: 'best-photo-poses',
    title: 'Best Photo Poses: The Curated Visual Collection',
    description: 'The definitive collection of timeless, flattering photo poses for portraits, streetwear, and travel.',
    icon: Sparkles,
    category: 'Essential',
  },
  {
    slug: 'standing-poses',
    title: 'Standing Poses for Photography: 12 Flattering Stances',
    description: 'Master weight shifting, wall leans, walking motion, and relaxed hand placement for standing shots.',
    icon: Compass,
    category: 'Full Body',
  },
  {
    slug: 'sitting-poses',
    title: 'Sitting & Cafe Poses: Relaxed Table Compositions',
    description: 'Learn how to sit naturally, lean forward from the hips, and use mugs or books to create candid depth.',
    icon: Coffee,
    category: 'Lifestyle',
  },
  {
    slug: 'solo-photo-poses',
    title: 'Solo Photography Poses: Taking Photos Alone on a Tripod',
    description: 'Dynamic stances designed specifically for self-timers, tripods, and hands-free camera coaching.',
    icon: User,
    category: 'Solo Creators',
  },
  {
    slug: 'poses-for-couples',
    title: 'Couples Posing Guide: Romantic & Candid Duo Stances',
    description: 'Forehead touches, walking hand-in-hand, and playful glances that capture authentic connection.',
    icon: Users,
    category: 'Couples & Duos',
  },
];

const poseGuideBreadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.posehanum.tech' },
    { '@type': 'ListItem', position: 2, name: 'Pose Guide', item: 'https://www.posehanum.tech/pose-guide' },
  ],
};

export default function PoseGuideIndexPage() {
  return (
    <main className="min-h-screen bg-background text-textPrimary py-16 px-4 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(poseGuideBreadcrumbLd) }} />

      <div className="max-w-5xl mx-auto space-y-12">
        <div className="flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
            <ArrowLeft className="w-4 h-4" /> Back to Homepage
          </Link>
          <span className="text-xs font-mono font-bold text-textMuted uppercase">
            Visual Posing Library
          </span>
        </div>

        <header className="border-b border-surfaceBorder pb-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-bold uppercase tracking-wider mb-2 shadow-neon-lime">
            <Compass className="w-4 h-4" /> Comprehensive Visual Pose Library
          </div>
          <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-textPrimary">
            PHOTOGRAPHY POSE GUIDES & <br />
            <span className="text-primary text-glow">VISUAL STANCE COLLECTIONS.</span>
          </h1>
          <p className="text-base sm:text-lg text-textSecondary max-w-3xl leading-relaxed">
            Browse practical guides and posture tutorials designed to help you look natural, confident, and relaxed in every photo.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {POSE_GUIDES.map((guide) => {
            const Icon = guide.icon;
            return (
              <Link
                key={guide.slug}
                href={`/pose-guide/${guide.slug}`}
                className="group p-7 rounded-3xl bg-surface border border-surfaceBorder hover:border-primary/60 transition-all duration-300 shadow-card-dark flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-xs font-mono font-bold uppercase border border-primary/20">
                      {guide.category}
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-surfaceBorder/60 group-hover:bg-primary/20 text-primary flex items-center justify-center transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <h2 className="text-xl font-black text-textPrimary group-hover:text-primary transition-colors uppercase tracking-tight leading-snug">
                    {guide.title}
                  </h2>
                  <p className="mt-2.5 text-sm text-textSecondary leading-relaxed">
                    {guide.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-surfaceBorder/60 flex items-center justify-between text-xs font-bold text-primary">
                  <span>View Full Posing Guide</span>
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
