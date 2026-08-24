import type { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText, Scale, Camera, AlertTriangle, Mail } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service — POSEHANUM AI Camera & Pose Coach',
  description: 'Terms of Service, acceptable use policy, subscription terms, and user guidelines for POSEHANUM.',
  keywords: ['POSEHANUM terms of service', 'AI pose coach terms', 'photography app terms'],
  alternates: {
    canonical: 'https://www.posehanum.tech/terms',
  },
  openGraph: {
    title: 'Terms of Service — POSEHANUM AI Camera & Pose Coach',
    description: 'Terms of Service, acceptable use policy, subscription terms, and user guidelines for POSEHANUM.',
    url: 'https://www.posehanum.tech/terms',
    siteName: 'POSEHANUM',
    type: 'article',
  },
};

const breadcrumbLd = {
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
      name: 'Terms of Service',
      item: 'https://www.posehanum.tech/terms',
    },
  ],
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background text-textPrimary py-16 px-4 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Navigation */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>

        {/* Header */}
        <div className="border-b border-surfaceBorder pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-bold uppercase tracking-wider mb-4">
            <Scale className="w-4 h-4" /> Legal Terms & Conditions
          </div>
          <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-textPrimary">
            Terms of Service
          </h1>
          <p className="mt-2 text-textSecondary text-sm">
            Last Updated: August 17, 2026 • Effective Date: August 17, 2026
          </p>
        </div>

        {/* Section 1: Acceptance */}
        <section className="space-y-4">
          <h2 className="text-2xl font-black uppercase tracking-tight text-primary flex items-center gap-2">
            <FileText className="w-6 h-6" /> 1. Acceptance of Terms
          </h2>
          <p className="text-textSecondary text-sm sm:text-base leading-relaxed">
            By downloading, installing, accessing, or using the <strong>POSEHANUM</strong> mobile application or website (&ldquo;Service&rdquo;), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the application.
          </p>
        </section>

        {/* Section 2: User Content & Ownership */}
        <section className="space-y-4">
          <h2 className="text-2xl font-black uppercase tracking-tight text-textPrimary flex items-center gap-2">
            <Camera className="w-6 h-6 text-primary" /> 2. User Content & Photo Ownership
          </h2>
          <div className="p-6 rounded-2xl bg-surface/60 border border-surfaceBorder space-y-3 text-textSecondary text-sm sm:text-base leading-relaxed">
            <p>
              <strong>You Retain 100% Ownership:</strong> All photographs captured with POSEHANUM and any custom reference photos you upload belong exclusively to you. POSEHANUM claims no copyright, ownership, or intellectual property rights over your user-created images.
            </p>
            <p>
              <strong>Local Processing:</strong> Your images are processed on your local device hardware. We do not claim licenses to use or sell your personal photos.
            </p>
          </div>
        </section>

        {/* Section 3: Safety & Physical Guidance Disclaimer */}
        <section className="space-y-4">
          <h2 className="text-2xl font-black uppercase tracking-tight text-textPrimary flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-primary" /> 3. Physical Posing Safety Disclaimer
          </h2>
          <div className="p-6 rounded-2xl bg-surface/60 border border-surfaceBorder space-y-3 text-textSecondary text-sm sm:text-base leading-relaxed">
            <p>
              POSEHANUM provides photography pose inspiration and general posture guidance. You are solely responsible for ensuring your physical safety, balance, and spatial awareness while posing.
            </p>
            <p>
              Do NOT attempt hazardous poses near ledges, cliffs, active roadways, or in unsafe environments. POSEHANUM is not liable for physical injury, property damage, or accidents resulting from attempts to recreate photography reference poses.
            </p>
          </div>
        </section>

        {/* Section 4: Subscriptions & Billing */}
        <section className="space-y-4">
          <h2 className="text-2xl font-black uppercase tracking-tight text-textPrimary">
            4. Pro Subscriptions & Google Play Billing
          </h2>
          <p className="text-textSecondary text-sm sm:text-base leading-relaxed">
            POSEHANUM offers optional Pro subscription plans. All in-app payments, recurring subscriptions, and billing transactions are processed securely through Google Play Billing. You can manage or cancel your subscription at any time directly in your Google Play Store Account settings.
          </p>
        </section>

        {/* Section 5: Termination & Deletion */}
        <section className="space-y-4">
          <h2 className="text-2xl font-black uppercase tracking-tight text-textPrimary">
            5. Account Deletion & Termination
          </h2>
          <p className="text-textSecondary text-sm sm:text-base leading-relaxed">
            You may terminate these terms at any time by uninstalling the application and deleting your account via <em>Settings &rarr; Privacy & Data Controls &rarr; Delete Account</em> or online at <Link href="/delete-account" className="text-primary underline">www.posehanum.tech/delete-account</Link>.
          </p>
        </section>

        {/* Section 6: Contact */}
        <section className="space-y-4 border-t border-surfaceBorder pt-8">
          <h2 className="text-2xl font-black uppercase tracking-tight text-textPrimary flex items-center gap-2">
            <Mail className="w-6 h-6 text-primary" /> 6. Contact Information
          </h2>
          <p className="text-textSecondary text-sm sm:text-base">
            For questions regarding these Terms of Service, please contact <a href="mailto:susantedit@gmail.com" className="text-primary underline">susantedit@gmail.com</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
