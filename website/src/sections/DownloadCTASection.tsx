'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Smartphone, Download } from 'lucide-react';

export function DownloadCTASection() {
  return (
    <section id="download" className="relative py-32 bg-secondaryBg overflow-hidden border-t border-surfaceBorder">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface border border-primary/30 text-primary text-xs font-black tracking-widest uppercase mb-6 shadow-neon-lime"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Ready to Elevate Your Photos?
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-7xl font-black uppercase tracking-tighter text-textPrimary leading-[0.92]"
        >
          YOUR NEXT GREAT PHOTO <br />
          <span className="text-primary text-glow">IS ONE POSE AWAY.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-6 text-base sm:text-xl text-textSecondary max-w-2xl mx-auto font-medium"
        >
          Download POSEHANUM today. Free on Android with on-device AI guidance, 100+ curated poses, and instant auto-capture.
        </motion.p>

        {/* Store Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href="https://play.google.com/store/apps/details?id=com.example.snappose"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 rounded-2xl bg-primary hover:bg-primary-hover text-[#0A0E0C] font-black text-sm tracking-wider uppercase transition-all duration-300 shadow-neon-lime flex items-center gap-3"
          >
            <Download className="w-5 h-5 stroke-[2.5]" />
            <div className="text-left leading-tight">
              <div className="text-[10px] tracking-normal font-bold">GET IT ON</div>
              <div className="text-base font-black">Google Play</div>
            </div>
          </a>

          <div className="px-8 py-4 rounded-2xl bg-surface border border-surfaceBorder text-textSecondary font-bold text-sm tracking-wider uppercase flex items-center gap-3 cursor-not-allowed opacity-80">
            <Smartphone className="w-5 h-5 text-cyanAccent" />
            <div className="text-left leading-tight">
              <div className="text-[10px] tracking-normal font-bold text-textMuted">iOS APP STORE</div>
              <div className="text-base font-black text-cyanAccent">Coming Soon</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
