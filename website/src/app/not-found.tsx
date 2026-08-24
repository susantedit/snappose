import React from 'react';
import Link from 'next/link';
import { Home, Compass, BookOpen, HelpCircle, ArrowRight, Camera } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background text-textPrimary flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface border border-primary/30 text-primary text-xs font-black tracking-widest uppercase shadow-neon-lime">
          <Camera className="w-3.5 h-3.5" /> 404 Page Not Found
        </div>

        <h1 className="text-5xl sm:text-7xl font-black uppercase tracking-tight text-textPrimary">
          LOOKS LIKE YOU&apos;RE <br />
          <span className="text-primary text-glow">OUT OF FRAME.</span>
        </h1>

        <p className="text-base sm:text-lg text-textSecondary max-w-lg mx-auto leading-relaxed">
          The page or pose reference you are looking for has moved or does not exist. Let&apos;s get you back in position.
        </p>

        {/* Action Navigation Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left pt-4">
          <Link
            href="/"
            className="p-5 rounded-2xl bg-surface border border-surfaceBorder hover:border-primary transition-all duration-300 group"
          >
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3">
              <Home className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-textPrimary group-hover:text-primary transition-colors flex items-center justify-between">
              Homepage <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </h2>
            <p className="text-xs text-textSecondary mt-1">Explore real-time pose matching and camera features.</p>
          </Link>

          <Link
            href="/blog"
            className="p-5 rounded-2xl bg-surface border border-surfaceBorder hover:border-primary transition-all duration-300 group"
          >
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3">
              <BookOpen className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-textPrimary group-hover:text-primary transition-colors flex items-center justify-between">
              Guides & Blog Hub <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </h2>
            <p className="text-xs text-textSecondary mt-1">Read technical deep dives and photography tutorials.</p>
          </Link>

          <Link
            href="/#how-it-works"
            className="p-5 rounded-2xl bg-surface border border-surfaceBorder hover:border-primary transition-all duration-300 group"
          >
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3">
              <Compass className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-textPrimary group-hover:text-primary transition-colors flex items-center justify-between">
              How It Works <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </h2>
            <p className="text-xs text-textSecondary mt-1">Learn how 33-point keypoint matching functions.</p>
          </Link>

          <Link
            href="/#faq"
            className="p-5 rounded-2xl bg-surface border border-surfaceBorder hover:border-primary transition-all duration-300 group"
          >
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3">
              <HelpCircle className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-textPrimary group-hover:text-primary transition-colors flex items-center justify-between">
              FAQ Knowledge Base <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </h2>
            <p className="text-xs text-textSecondary mt-1">Answers regarding privacy, offline mode, and scoring.</p>
          </Link>
        </div>
      </div>
    </main>
  );
}
