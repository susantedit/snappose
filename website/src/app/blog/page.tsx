import type { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Sparkles, ArrowRight, ShieldCheck, Camera, Clock, User } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Photography & AI Pose Coaching Guides — POSEHANUM Blog',
  description:
    'Authoritative guides and tutorials on AI pose matching, pose scoring algorithms, solo creator photography, beginner posing techniques, and on-device privacy.',
  keywords: [
    'AI pose matching guide',
    'pose scoring tutorial',
    'photo poses for beginners',
    'how to take photos alone',
    'on-device AI camera privacy',
    'photography pose ideas',
  ],
  alternates: {
    canonical: 'https://www.posehanum.tech/blog',
  },
  openGraph: {
    title: 'Photography & AI Pose Coaching Guides — POSEHANUM Blog',
    description:
      'Authoritative guides on AI pose matching, pose scoring algorithms, solo photography, and privacy-first vision technology.',
    url: 'https://www.posehanum.tech/blog',
    siteName: 'POSEHANUM',
    type: 'website',
  },
};

const BLOG_ARTICLES = [
  {
    slug: 'what-is-ai-pose-matching',
    title: 'What Is AI Pose Matching? Computer Vision for Photography Explained',
    description:
      'Discover how real-time 33-landmark skeleton tracking and computer vision compare your live camera posture with professional reference photos.',
    category: 'Computer Vision',
    readTime: '6 min read',
    date: 'August 2026',
    author: 'Susant Luitel',
  },
  {
    slug: 'how-pose-scoring-works',
    title: 'How Pose Scoring Works: Inside 33-Landmark Vector Mathematics',
    description:
      'An in-depth technical breakdown of how POSEHANUM calculates sub-millimeter joint angles, angular deviations, and 0–100% alignment scores.',
    category: 'Algorithm & AI',
    readTime: '7 min read',
    date: 'August 2026',
    author: 'Susant Luitel',
  },
  {
    slug: 'photo-poses-for-beginners',
    title: '25 Best Photo Poses for Beginners: Easy Stances for Natural Photos',
    description:
      'Master natural weight distribution, relaxed hand placement, and confident shoulder angles with step-by-step beginner posing guides.',
    category: 'Photography Tips',
    readTime: '8 min read',
    date: 'August 2026',
    author: 'Susant Luitel',
  },
  {
    slug: 'how-to-take-better-photos-alone',
    title: 'How to Take Better Photos Alone: The Solo Creator’s Posing Guide',
    description:
      'Stop sprinting against camera timers. Learn how tripod setups, adaptive voice coaching, and hands-free auto capture revolutionize solo shoots.',
    category: 'Solo Creation',
    readTime: '7 min read',
    date: 'August 2026',
    author: 'Susant Luitel',
  },
  {
    slug: 'privacy-first-ai-photography',
    title: 'Privacy-First AI Photography: Why On-Device Processing Matters',
    description:
      'Why raw camera frames should never touch the cloud. A look into POSEHANUM’s 100% on-device neural vision architecture.',
    category: 'Privacy & Security',
    readTime: '5 min read',
    date: 'August 2026',
    author: 'Susant Luitel',
  },
  {
    slug: 'how-to-pose-for-photos',
    title: 'How to Pose for Photos: The Complete Visual Posture Handbook',
    description:
      'A masterclass on photo posing. Learn how to elongate posture, position hands naturally, control chin angles, and avoid stiffness.',
    category: 'Masterclass',
    readTime: '8 min read',
    date: 'August 2026',
    author: 'Susant Luitel',
  },
  {
    slug: 'pose-matching-vs-pose-estimation',
    title: 'AI Pose Matching vs. Pose Estimation: Key Architectural Differences',
    description:
      'A technical analysis distinguishing passive landmark detection from active real-time pose matching with closed-loop guidance.',
    category: 'Architecture',
    readTime: '7 min read',
    date: 'August 2026',
    author: 'Susant Luitel',
  },
];

const blogBreadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://www.posehanum.tech',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Blog & Educational Guides',
      item: 'https://www.posehanum.tech/blog',
    },
  ],
};

export default function BlogIndexPage() {
  return (
    <div className="min-h-screen bg-background text-textPrimary py-16 px-4 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogBreadcrumbLd) }}
      />

      <div className="max-w-5xl mx-auto space-y-12">
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <span className="text-xs font-mono font-bold text-textMuted uppercase">
            POSEHANUM Knowledge Base
          </span>
        </div>

        {/* Header */}
        <div className="border-b border-surfaceBorder pb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-bold uppercase tracking-wider mb-4 shadow-neon-lime">
            <BookOpen className="w-4 h-4" /> Photography & AI Vision Resource Hub
          </div>
          <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-textPrimary">
            GUIDES, TUTORIALS & <br />
            <span className="text-primary text-glow">AI POSING DEEP DIVES.</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-textSecondary max-w-3xl leading-relaxed">
            Authoritative technical guides, algorithmic explanations, and practical photography tutorials explaining how computer vision and pose coaching transform mobile photography.
          </p>
        </div>

        {/* Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {BLOG_ARTICLES.map((article) => (
            <Link
              key={article.slug}
              href={`/blog/${article.slug}`}
              className="group p-7 rounded-3xl bg-surface border border-surfaceBorder hover:border-primary/60 transition-all duration-300 shadow-card-dark flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-xs font-mono font-bold uppercase border border-primary/20">
                    {article.category}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-textMuted font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    {article.readTime}
                  </div>
                </div>

                <h2 className="text-xl font-black text-textPrimary group-hover:text-primary transition-colors uppercase tracking-tight leading-snug">
                  {article.title}
                </h2>
                <p className="mt-2.5 text-sm text-textSecondary leading-relaxed">
                  {article.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-surfaceBorder/60 flex items-center justify-between text-xs font-bold text-primary">
                <span>Read Full Guide</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
