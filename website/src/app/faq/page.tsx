import type { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import { ArrowLeft, HelpCircle, Sparkles, Compass, ShieldCheck } from 'lucide-react';
import { FAQSection } from '@/sections/FAQSection';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions (FAQ) — Knowledge Base | POSEHANUM',
  description:
    'Comprehensive answers to all questions regarding POSEHANUM AI pose matching, spoken voice coaching, hands-free auto capture, privacy model, and offline packs.',
  keywords: [
    'POSEHANUM FAQ',
    'AI pose matching questions',
    'camera pose coach questions',
    'POSEHANUM privacy policy FAQ',
    'how to use POSEHANUM',
  ],
  alternates: {
    canonical: 'https://www.posehanum.tech/faq',
  },
  openGraph: {
    title: 'Frequently Asked Questions (FAQ) — Knowledge Base | POSEHANUM',
    description:
      'Browse answers to common questions about pose matching, privacy, offline packs, and auto capture.',
    url: 'https://www.posehanum.tech/faq',
    siteName: 'POSEHANUM',
    type: 'website',
  },
};

const faqBreadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.posehanum.tech' },
    { '@type': 'ListItem', position: 2, name: 'FAQ', item: 'https://www.posehanum.tech/faq' },
  ],
};

export default function FaqDirectoryPage() {
  return (
    <main className="min-h-screen bg-background text-textPrimary py-16 px-4 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqBreadcrumbLd) }}
      />

      <div className="max-w-5xl mx-auto space-y-12">
        <div className="flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
            <ArrowLeft className="w-4 h-4" /> Back to Homepage
          </Link>
          <span className="text-xs font-mono font-bold text-textMuted uppercase">
            Knowledge Center
          </span>
        </div>

        <FAQSection />
      </div>
    </main>
  );
}
