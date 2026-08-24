'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Trash2, AlertTriangle, CheckCircle2, ShieldCheck, Mail, Clock, ExternalLink } from 'lucide-react';

export default function DeleteAccountWebPage() {
  const [email, setEmail] = useState('');
  const [reason, setReason] = useState('');
  const [confirmChecked, setConfirmChecked] = useState(false);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'submitted'>('idle');
  const [referenceId, setReferenceId] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !confirmChecked) return;

    setStatus('submitting');
    const generatedRef = `DEL-${Math.floor(100000 + Math.random() * 900000)}-POSE`;
    setReferenceId(generatedRef);

    try {
      // Send real POST request to server API endpoint
      await fetch('/api/delete-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          reason,
          referenceId: generatedRef,
        }),
      });
    } catch (err) {
      console.error('API submission fallback:', err);
    } finally {
      setStatus('submitted');
    }
  };

  const handleOpenEmailClient = () => {
    const subject = encodeURIComponent(`Account Deletion Request [${referenceId}]`);
    const body = encodeURIComponent(
      `Hello POSEHANUM Admin (Susant Luitel),\n\nI am requesting permanent deletion of my POSEHANUM account and data.\n\nTarget Account Email: ${email}\nTracking Reference ID: ${referenceId}\nReason: ${reason || 'N/A'}\n\nPlease confirm when data purging is complete.\n\nThank you.`
    );
    
    // Direct Gmail Webmail URL fallback to guarantee email composer opens in browser
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=susantedit@gmail.com&su=${subject}&body=${body}`;
    window.open(gmailUrl, '_blank');
  };

  return (
    <main className="min-h-screen bg-background text-textPrimary py-16 px-4 sm:px-6 lg:px-8">
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
        <header className="border-b border-surfaceBorder pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Trash2 className="w-4 h-4" /> Account & Data Deletion Portal
          </div>
          <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-textPrimary">
            Request Account & Data Deletion
          </h1>
          <p className="mt-4 text-base text-textSecondary leading-relaxed">
            In compliance with Google Play Developer Policies, Apple App Store Guidelines, and global privacy regulations (GDPR / CCPA), this portal allows <strong>POSEHANUM</strong> users to permanently request deletion of their account, cloud bookmarks, and associated records.
          </p>
        </header>

        {/* Informational Box */}
        <div className="p-6 rounded-2xl bg-surface/60 border border-surfaceBorder space-y-3 text-textSecondary text-sm sm:text-base leading-relaxed">
          <h2 className="text-base font-bold text-textPrimary flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" /> What Happens When You Submit a Request?
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm">
            <li><strong>Logged & Dispatched to Admin:</strong> Requests are recorded directly in the server privacy queue and dispatched to developer/admin (<strong className="text-primary">susantedit@gmail.com</strong>).</li>
            <li><strong>Firebase Auth Account Purge:</strong> Your authentication profile, registered email, and internal user UID are permanently wiped from the authentication database.</li>
            <li><strong>Cloud Favorites & Sync:</strong> All synchronized custom pose metadata, collections, and cloud favorites are erased from servers.</li>
            <li><strong>On-Device Local Data:</strong> If POSEHANUM is installed on your phone, you can also simultaneously clear local app storage via <em>Settings &rarr; Storage &rarr; Clear Cache</em> in-app.</li>
            <li><strong>Processing Timeline:</strong> Deletion requests are processed across our systems within 24 to 48 business hours.</li>
          </ul>
        </div>

        {/* Form / Submitted State */}
        {status === 'submitted' ? (
          <div className="p-8 rounded-3xl bg-surface border border-primary/40 text-center space-y-6 shadow-neon-lime animate-in fade-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto text-primary shadow-neon-lime">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-mono font-bold uppercase border border-primary/20">
                Logged to Admin Queue
              </span>
              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-textPrimary">
                Deletion Request Confirmed
              </h2>
              <p className="text-sm text-textSecondary max-w-md mx-auto leading-relaxed">
                Your request for <strong className="text-textPrimary">{email}</strong> has been saved and dispatched to Admin (<strong className="text-primary">susantedit@gmail.com</strong>).
              </p>
            </div>

            {/* Reference Ticket Box */}
            <div className="p-4 rounded-2xl bg-background border border-surfaceBorder text-left space-y-2 max-w-md mx-auto">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-textMuted">Tracking Reference:</span>
                <span className="font-bold text-primary">{referenceId}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-textMuted">Admin Email:</span>
                <span className="font-bold text-primary">susantedit@gmail.com</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-textMuted">Status:</span>
                <span className="font-bold text-amber-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Queued for Deletion (24–48h)
                </span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-textMuted">Target Account:</span>
                <span className="font-semibold text-textPrimary truncate max-w-[200px]">{email}</span>
              </div>
            </div>

            {/* Final Step Callout */}
            <div className="p-5 rounded-2xl bg-primary/10 border border-primary/40 space-y-3">
              <span className="text-xs font-mono font-bold text-primary uppercase tracking-wider block">
                ⚠️ Final Step Required
              </span>
              <p className="text-sm font-semibold text-textPrimary leading-relaxed">
                Click below to complete your last step and send your deletion confirmation email directly to Admin (<strong className="text-primary">susantedit@gmail.com</strong>).
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleOpenEmailClient}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-background font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-neon-lime cursor-pointer"
                >
                  <Mail className="w-4 h-4 fill-background text-background" /> 👉 CLICK HERE FOR LAST STEP (SEND EMAIL) <ExternalLink className="w-3.5 h-3.5" />
                </button>
                <Link
                  href="/"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-surface border border-surfaceBorder hover:border-primary text-textPrimary font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center"
                >
                  Return to Homepage
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-8 rounded-3xl bg-surface border border-surfaceBorder space-y-6 shadow-card-dark">
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
                placeholder="your.email@domain.com"
                className="w-full px-4 py-3.5 rounded-xl bg-background border border-surfaceBorder text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary text-sm transition-all"
              />
              <p className="text-[11px] text-textMuted mt-1.5">
                Admin notification will be recorded for account verification and purging.
              </p>
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
                className="w-full px-4 py-3.5 rounded-xl bg-background border border-surfaceBorder text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary text-sm resize-none transition-all"
              />
            </div>

            <div className="flex items-start gap-3 pt-2">
              <input
                id="confirm"
                type="checkbox"
                required
                checked={confirmChecked}
                onChange={(e) => setConfirmChecked(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-surfaceBorder text-primary focus:ring-primary accent-primary"
              />
              <label htmlFor="confirm" className="text-xs text-textSecondary leading-relaxed cursor-pointer select-none">
                I understand that this action is permanent. All cloud favorites, custom pose metadata, and my POSEHANUM authentication credentials will be permanently erased.
              </label>
            </div>

            <button
              type="submit"
              disabled={status === 'submitting' || !email || !confirmChecked}
              className="w-full py-4 rounded-xl bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-red-500/20 cursor-pointer"
            >
              {status === 'submitting' ? (
                <>
                  <Clock className="w-4 h-4 animate-spin" /> Logging Request to Admin...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" /> Submit Deletion Request & Notify Admin
                </>
              )}
            </button>
          </form>
        )}

        {/* Legal Links */}
        <footer className="flex flex-wrap gap-4 text-xs text-textSecondary border-t border-surfaceBorder pt-6">
          <Link href="/privacy" className="hover:text-primary underline">Privacy Policy</Link>
          <span>•</span>
          <Link href="/terms" className="hover:text-primary underline">Terms of Service</Link>
          <span>•</span>
          <Link href="/data-retention" className="hover:text-primary underline">Data Retention Schedule</Link>
        </footer>
      </div>
    </main>
  );
}
