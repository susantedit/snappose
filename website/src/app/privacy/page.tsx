import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Lock, EyeOff, Server, Trash2, Mail } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy — POSEHANUM',
  description: 'Learn how POSEHANUM protects your privacy with 100% on-device AI pose processing, zero camera frame uploads, and complete user data control.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background text-textPrimary py-16 px-4 sm:px-6 lg:px-8">
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
            <ShieldCheck className="w-4 h-4" /> Privacy-First Architecture
          </div>
          <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-textPrimary">
            Privacy Policy
          </h1>
          <p className="mt-2 text-textSecondary text-sm">
            Last Updated: August 17, 2026 • Effective Date: August 17, 2026
          </p>
          <p className="mt-4 text-base text-textSecondary leading-relaxed">
            Welcome to <strong>POSEHANUM</strong> (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;). This Privacy Policy explains how our mobile application and related web services access, process, store, and protect your personal information in compliance with the Google Play Developer Program Policies, GDPR, CCPA, and international data protection standards.
          </p>
        </div>

        {/* Section 1: Core Privacy Guarantee */}
        <section className="space-y-4">
          <h2 className="text-2xl font-black uppercase tracking-tight text-primary flex items-center gap-2">
            <EyeOff className="w-6 h-6" /> 1. On-Device Camera & Vision Privacy Guarantee
          </h2>
          <div className="p-6 rounded-2xl bg-surface/60 border border-surfaceBorder space-y-3 text-textSecondary text-sm sm:text-base leading-relaxed">
            <p>
              <strong>Zero Camera Frame Cloud Uploads:</strong> When you open the POSEHANUM camera, live video frames are processed 100% locally on your smartphone&apos;s GPU and neural accelerator. 
            </p>
            <p>
              <strong>Ephemeral Processing:</strong> Live video frames and 33-point anatomical pose landmarks exist in temporary volatile device memory only for the fractional milliseconds needed to compute alignment scores. Raw camera video frames are <em>never</em> recorded, transmitted, or stored on remote servers.
            </p>
            <p>
              <strong>Biometric Data Exemption:</strong> POSEHANUM calculates relative joint angles (e.g. elbow angle, shoulder alignment) strictly for pose guidance. We do NOT extract, store, or transmit unique facial recognition templates, iris scans, or biometric identifiers.
            </p>
          </div>
        </section>

        {/* Section 2: Data We Access and Collect */}
        <section className="space-y-4">
          <h2 className="text-2xl font-black uppercase tracking-tight text-textPrimary flex items-center gap-2">
            <Server className="w-6 h-6 text-primary" /> 2. Data Categories & Collection
          </h2>
          <div className="space-y-4 text-textSecondary text-sm sm:text-base">
            <div className="p-4 rounded-xl bg-surface border border-surfaceBorder">
              <h3 className="font-bold text-textPrimary text-base">A. Photos & User Media</h3>
              <p className="mt-1">
                Captured photos and uploaded custom pose images remain stored on your physical device. We do not upload your photo gallery to external servers.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-surface border border-surfaceBorder">
              <h3 className="font-bold text-textPrimary text-base">B. On-Device Personalization Vector</h3>
              <p className="mt-1">
                To recommend poses you like, the app maintains an on-device preference vector based on poses you favorite, capture, or skip. This machine learning profile stays 100% on your device and can be wiped instantly at any time via Settings &rarr; Privacy &rarr; Reset Personalization.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-surface border border-surfaceBorder">
              <h3 className="font-bold text-textPrimary text-base">C. Account Information (Optional)</h3>
              <p className="mt-1">
                If you choose to sign in via Google or Email, we process your user ID, email address, and display name through Firebase Authentication for cloud bookmark synchronization. Anonymous guest use is fully supported without providing any personal identifiers.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-surface border border-surfaceBorder">
              <h3 className="font-bold text-textPrimary text-base">D. Crash & Performance Diagnostics</h3>
              <p className="mt-1">
                We use Firebase Crashlytics to receive anonymized crash stack traces and device model identifiers to fix software bugs and improve app stability.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Third-Party SDKs and Processors */}
        <section className="space-y-4">
          <h2 className="text-2xl font-black uppercase tracking-tight text-textPrimary flex items-center gap-2">
            <Lock className="w-6 h-6 text-primary" /> 3. Third-Party Service Providers
          </h2>
          <p className="text-textSecondary text-sm sm:text-base leading-relaxed">
            We partner with trusted service providers who adhere to rigorous privacy standards:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-textSecondary text-sm sm:text-base">
            <li><strong>Google Firebase:</strong> Authentication and Crashlytics crash reporting.</li>
            <li><strong>Google AdMob:</strong> Monetization ads (with full ad suppression during active camera sessions).</li>
            <li><strong>Google Play In-App Billing:</strong> Secure payment processing for Pro subscriptions.</li>
          </ul>
        </section>

        {/* Section 4: Data Retention & User Rights */}
        <section className="space-y-4">
          <h2 className="text-2xl font-black uppercase tracking-tight text-textPrimary flex items-center gap-2">
            <Trash2 className="w-6 h-6 text-primary" /> 4. Your Rights: Export & Permanent Deletion
          </h2>
          <div className="p-6 rounded-2xl bg-surface/60 border border-surfaceBorder space-y-4 text-textSecondary text-sm sm:text-base">
            <p>
              In accordance with GDPR, CCPA, and Google Play Data Safety policies, you have complete control over your personal data:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Data Export:</strong> Export your full personal data bundle in standardized JSON format anytime via <em>Settings &rarr; Privacy & Data Controls &rarr; Export My Data</em>.</li>
              <li><strong>In-App Account & Data Deletion:</strong> Instantly wipe your account, favorites, custom poses, attempt history, and personalization profile via <em>Settings &rarr; Privacy & Data Controls &rarr; Delete Account & All Data</em>.</li>
              <li><strong>Web Deletion Portal:</strong> If you uninstalled the app, you can submit an account deletion request online at <Link href="/delete-account" className="text-primary underline">posehanum.app/delete-account</Link>.</li>
            </ul>
          </div>
        </section>

        {/* Section 5: Children's Privacy */}
        <section className="space-y-4">
          <h2 className="text-2xl font-black uppercase tracking-tight text-textPrimary">
            5. Children&apos;s Privacy
          </h2>
          <p className="text-textSecondary text-sm sm:text-base leading-relaxed">
            POSEHANUM does not knowingly collect personal identifiable information from children under the age of 13. If you believe a child has provided us with personal data, please contact us immediately for prompt deletion.
          </p>
        </section>

        {/* Section 6: Contact & Privacy Officer */}
        <section className="space-y-4 border-t border-surfaceBorder pt-8">
          <h2 className="text-2xl font-black uppercase tracking-tight text-textPrimary flex items-center gap-2">
            <Mail className="w-6 h-6 text-primary" /> 6. Contact & Privacy Inquiries
          </h2>
          <p className="text-textSecondary text-sm sm:text-base">
            For questions regarding this Privacy Policy, your data rights, or compliance inquiries, please contact:
          </p>
          <div className="p-4 rounded-xl bg-surface border border-surfaceBorder text-sm text-textSecondary space-y-1">
            <p><strong>Developer:</strong> Susant Luitel (Kantaraj Luitel)</p>
            <p><strong>App:</strong> POSEHANUM</p>
            <p><strong>Privacy Contact Email:</strong> <a href="mailto:susantedit@gmail.com" className="text-primary underline">susantedit@gmail.com</a></p>
            <p><strong>Website:</strong> <a href="https://posehanum.app" className="text-primary underline">https://posehanum.app</a></p>
          </div>
        </section>
      </div>
    </div>
  );
}
