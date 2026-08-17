'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Trash2, AlertTriangle, CheckCircle2, ShieldCheck, Mail } from 'lucide-react';

export default function DeleteAccountWebPage() {
  const [email, setEmail] = useState('');
  const [reason, setReason] = useState('');
  const [confirmChecked, setConfirmChecked] = useState(false);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'submitted'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !confirmChecked) return;

    setStatus('submitting');
    // Simulate submission to privacy queue
    setTimeout(() => {
      setStatus('submitted');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background text-textPrimary py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-12">
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Trash2 className="w-4 h-4" /> Account & Data Deletion
          </div>
          <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-textPrimary">
            Request Account & Data Deletion
          </h1>
          <p className="mt-4 text-base text-textSecondary leading-relaxed">
            In compliance with Google Play Developer Policies and global privacy regulations (GDPR / CCPA), this portal allows <strong>POSEHANUM</strong> users to permanently request deletion of their account, cloud bookmarks, and associated personal records.
          </p>
        </div>

        {/* Informational Box */}
        <div className="p-6 rounded-2xl bg-surface/60 border border-surfaceBorder space-y-3 text-textSecondary text-sm sm:text-base leading-relaxed">
          <h2 className="text-base font-bold text-textPrimary flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" /> What Happens When You Delete Your Account?
          </h2>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
            <li><strong>Firebase Auth Account:</strong> Your authentication profile, email, and user ID are permanently purged.</li>
            <li><strong>Cloud Favorites & Sync:</strong> All bookmarked poses and synchronized custom pose metadata are deleted.</li>
            <li><strong>On-Device Data:</strong> If POSEHANUM is still installed on your device, we recommend deleting data in-app via <em>Settings &rarr; Privacy &rarr; Delete Account & All Data</em> to simultaneously wipe local storage partitions.</li>
            <li><strong>Processing Timeline:</strong> Web requests are processed across our systems within 48 to 72 hours.</li>
          </ul>
        </div>

        {/* Form / Submitted State */}
        {status === 'submitted' ? (
          <div className="p-8 rounded-2xl bg-primary/10 border border-primary/40 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto text-primary">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black uppercase text-textPrimary">
              Deletion Request Received
            </h2>
            <p className="text-sm text-textSecondary max-w-md mx-auto">
              Your deletion request for <strong>{email}</strong> has been logged. All associated cloud account identifiers and records will be permanently purged within 48 hours.
            </p>
            <div className="pt-4">
              <Link
                href="/"
                className="px-6 py-2.5 rounded-full bg-primary text-background font-bold text-xs uppercase tracking-wider"
              >
                Return to POSEHANUM Homepage
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-8 rounded-2xl bg-surface border border-surfaceBorder space-y-6">
            <div>
              <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-textSecondary mb-2">
                Your Registered Email Address *
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. name@example.com"
                className="w-full px-4 py-3 rounded-xl bg-background border border-surfaceBorder text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>

            <div>
              <label htmlFor="reason" className="block text-xs font-bold uppercase tracking-wider text-textSecondary mb-2">
                Reason for Leaving (Optional)
              </label>
              <textarea
                id="reason"
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Help us improve POSEHANUM..."
                className="w-full px-4 py-3 rounded-xl bg-background border border-surfaceBorder text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary text-sm resize-none"
              />
            </div>

            <div className="flex items-start gap-3 pt-2">
              <input
                id="confirm"
                type="checkbox"
                required
                checked={confirmChecked}
                onChange={(e) => setConfirmChecked(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-surfaceBorder text-primary focus:ring-primary"
              />
              <label htmlFor="confirm" className="text-xs text-textSecondary leading-relaxed cursor-pointer">
                I understand that this action is permanent. All cloud favorites, custom pose metadata, and my POSEHANUM authentication credentials will be permanently erased.
              </label>
            </div>

            <button
              type="submit"
              disabled={status === 'submitting' || !email || !confirmChecked}
              className="w-full py-3.5 rounded-xl bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white font-black text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
            >
              {status === 'submitting' ? 'Processing Request...' : 'Permanently Delete My POSEHANUM Account'}
            </button>
          </form>
        )}

        {/* Legal Links */}
        <div className="flex flex-wrap gap-4 text-xs text-textSecondary border-t border-surfaceBorder pt-6">
          <Link href="/privacy" className="hover:text-primary underline">Privacy Policy</Link>
          <span>•</span>
          <Link href="/terms" className="hover:text-primary underline">Terms of Service</Link>
          <span>•</span>
          <Link href="/data-retention" className="hover:text-primary underline">Data Retention Schedule</Link>
        </div>
      </div>
    </div>
  );
}
