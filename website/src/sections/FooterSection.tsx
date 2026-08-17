'use client';

import React from 'react';
import Link from 'next/link';
import { Camera, ExternalLink } from 'lucide-react';
import { CREATOR_SOCIAL_LINKS } from '../data/socialLinks';

export function FooterSection() {
  return (
    <footer className="bg-[#070A08] text-textSecondary pt-20 pb-12 border-t border-surfaceBorder">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-16 border-b border-surfaceBorder/60">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden shadow-neon-lime">
                <img src="/logo.png" alt="POSEHANUM logo" className="w-full h-full object-cover" />
              </div>
              <span className="text-2xl font-extrabold text-textPrimary tracking-tight">
                POSE<span className="text-primary font-black">HANUM</span>
              </span>
            </div>
            <p className="text-sm text-textSecondary max-w-sm leading-relaxed">
              POSEHANUM is the privacy-first AI photography & pose coach that helps anyone take stunning, natural photos without needing a professional photographer.
            </p>
            <p className="text-xs font-mono font-bold text-primary">
              Pose Garौँ. Perfect Shot Lिऔँ.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-mono font-black text-textPrimary uppercase tracking-wider mb-4">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm font-semibold">
              <li><a href="#" className="hover:text-primary transition-colors">Home</a></li>
              <li><a href="#how-it-works" className="hover:text-primary transition-colors">How It Works</a></li>
              <li><a href="#ai-coach" className="hover:text-primary transition-colors">AI Voice Coach</a></li>
              <li><a href="#categories" className="hover:text-primary transition-colors">Pose Collections</a></li>
              <li><a href="#personalization" className="hover:text-primary transition-colors">Personalization</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-mono font-black text-textPrimary uppercase tracking-wider mb-4">
              Privacy & Legal
            </h4>
            <ul className="space-y-2.5 text-sm font-semibold">
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="/data-retention" className="hover:text-primary transition-colors">Data Retention Schedule</Link></li>
              <li><Link href="/delete-account" className="hover:text-primary transition-colors text-red-400 hover:text-red-300">Request Account Deletion</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-mono font-black text-textPrimary uppercase tracking-wider mb-4">
              Creator & Connect
            </h4>
            <p className="text-xs text-textSecondary mb-3">
              Crafted by <strong>Kantaraj Luitel (Susant)</strong>
            </p>
            <div className="flex flex-wrap gap-2">
              {CREATOR_SOCIAL_LINKS.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1.5 rounded-lg bg-surface border border-surfaceBorder hover:border-primary text-xs font-bold text-textPrimary hover:text-primary transition-colors inline-flex items-center gap-1"
                >
                  {link.name} <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs font-medium text-textMuted gap-4">
          <p>© {new Date().getFullYear()} POSEHANUM. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with Next.js 14, Tailwind CSS & Framer Motion.
          </p>
        </div>
      </div>
    </footer>
  );
}
