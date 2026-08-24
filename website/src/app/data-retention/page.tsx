import type { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, Database, Trash2, ShieldCheck, Mail } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Data Retention & Deletion Schedule — POSEHANUM AI Camera',
  description: 'Detailed Data Retention Policy and storage schedules for POSEHANUM in compliance with GDPR, CCPA, and Google Play policies.',
  keywords: ['POSEHANUM data retention', 'data deletion schedule', 'GDPR compliance'],
  alternates: {
    canonical: 'https://www.posehanum.tech/data-retention',
  },
  openGraph: {
    title: 'Data Retention & Deletion Schedule — POSEHANUM AI Camera',
    description: 'Detailed Data Retention Policy and storage schedules for POSEHANUM in compliance with GDPR, CCPA, and Google Play policies.',
    url: 'https://www.posehanum.tech/data-retention',
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
      name: 'Data Retention Schedule',
      item: 'https://www.posehanum.tech/data-retention',
    },
  ],
};

export default function DataRetentionPage() {
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
            <Clock className="w-4 h-4" /> Transparency & Retention
          </div>
          <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-textPrimary">
            Data Retention & Deletion Schedule
          </h1>
          <p className="mt-2 text-textSecondary text-sm">
            Last Updated: August 17, 2026 • Effective Date: August 17, 2026
          </p>
          <p className="mt-4 text-base text-textSecondary leading-relaxed">
            This schedule transparently outlines the exact storage locations, retention periods, and deletion mechanisms for every data type handled by POSEHANUM.
          </p>
        </div>

        {/* Schedule Table */}
        <section className="space-y-6">
          <div className="overflow-x-auto rounded-2xl border border-surfaceBorder bg-surface/50">
            <table className="w-full text-left text-sm text-textSecondary">
              <thead className="bg-surface text-xs uppercase font-bold text-textPrimary border-b border-surfaceBorder">
                <tr>
                  <th className="p-4">Data Type</th>
                  <th className="p-4">Storage Location</th>
                  <th className="p-4">Retention Period</th>
                  <th className="p-4">Deletion Trigger</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surfaceBorder">
                <tr>
                  <td className="p-4 font-bold text-textPrimary">Live Camera Frames</td>
                  <td className="p-4">Volatile GPU Memory (RAM)</td>
                  <td className="p-4 text-emerald-400 font-semibold">0 seconds (Ephemeral)</td>
                  <td className="p-4">Instant release after frame score calculation</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-textPrimary">Captured Photos</td>
                  <td className="p-4">Device Photo Gallery</td>
                  <td className="p-4">User-controlled</td>
                  <td className="p-4">Manual user deletion or gallery clear</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-textPrimary">Attempt Match Scores</td>
                  <td className="p-4">Local MMKV Database</td>
                  <td className="p-4">Until user clear</td>
                  <td className="p-4">Settings &rarr; Delete History or Delete Account</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-textPrimary">Custom Uploaded Poses</td>
                  <td className="p-4">Local App Sandbox</td>
                  <td className="p-4">Until user clear</td>
                  <td className="p-4">Settings &rarr; Delete Custom Poses</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-textPrimary">Personalization ML Profile</td>
                  <td className="p-4">Local MMKV Sandbox</td>
                  <td className="p-4">Until reset or 90-day decay</td>
                  <td className="p-4">Settings &rarr; Reset Personalization</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-textPrimary">Notification History</td>
                  <td className="p-4">Local MMKV Sandbox</td>
                  <td className="p-4">30 Days rolling window</td>
                  <td className="p-4">Settings &rarr; Reset Notification History</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-textPrimary">Firebase Auth Account</td>
                  <td className="p-4">Google Firebase Auth Server</td>
                  <td className="p-4">Account Lifetime</td>
                  <td className="p-4">In-App Delete Account or Web Request</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-textPrimary">Crash Reports & Diagnostics</td>
                  <td className="p-4">Google Firebase Crashlytics</td>
                  <td className="p-4">90 Days (Anonymized)</td>
                  <td className="p-4">Automatic 90-day purge by Google Cloud</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section: Permanent Deletion Methods */}
        <section className="space-y-4">
          <h2 className="text-2xl font-black uppercase tracking-tight text-primary flex items-center gap-2">
            <Trash2 className="w-6 h-6" /> Deletion Request Workflows
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-6 rounded-2xl bg-surface border border-surfaceBorder space-y-2">
              <h3 className="font-bold text-textPrimary text-base">In-App Immediate Wipe</h3>
              <p className="text-sm text-textSecondary">
                Open POSEHANUM &rarr; Settings &rarr; Privacy & Data Controls &rarr; Delete Account & All Data. All local databases, cached images, and cloud credentials are deleted immediately.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-surface border border-surfaceBorder space-y-2">
              <h3 className="font-bold text-textPrimary text-base">Web Request Portal</h3>
              <p className="text-sm text-textSecondary">
                If you have uninstalled the application, submit your deletion request online at <Link href="/delete-account" className="text-primary underline">www.posehanum.tech/delete-account</Link> for permanent cloud purge.
              </p>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="space-y-4 border-t border-surfaceBorder pt-8">
          <h2 className="text-2xl font-black uppercase tracking-tight text-textPrimary flex items-center gap-2">
            <Mail className="w-6 h-6 text-primary" /> Privacy Officer Contact
          </h2>
          <p className="text-textSecondary text-sm sm:text-base">
            For questions or requests regarding data retention, email: <a href="mailto:susantedit@gmail.com" className="text-primary underline">susantedit@gmail.com</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
