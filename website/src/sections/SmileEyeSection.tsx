'use client';

import React from 'react';
import { Smile, Eye, ShieldCheck } from 'lucide-react';
import Image from 'next/image';

export function SmileEyeSection() {
  return (
    <section className="relative py-32 bg-secondaryBg overflow-hidden border-t border-b border-surfaceBorder">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface border border-cyanAccent/30 text-cyanAccent text-xs font-black tracking-widest uppercase shadow-neon-cyan">
              <Smile className="w-3.5 h-3.5" />
              Expression & Composition Guidance
            </div>

            <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-textPrimary leading-[0.95]">
              CANDID SMILES. <br />
              <span className="text-cyanAccent text-glow">LOCKED-IN EYE GAZE.</span>
            </h2>

            <p className="text-textSecondary text-base leading-relaxed">
              Never get caught blinking or holding a forced grin. POSEHANUM monitors micro-facial expressions (candid smile ratio and lens eye-contact) to fire the auto-capture shutter at the exact split-second your expression looks effortless.
            </p>

            <div className="p-4 rounded-2xl bg-surface/60 border border-surfaceBorder flex items-center gap-3 text-xs text-textSecondary">
              <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
              <span>
                <strong>100% Privacy Guarantee:</strong> Expression guidance runs completely on-device. Zero biometric identifiers, facial models, or image logs are ever stored or uploaded.
              </span>
            </div>
          </div>

          <div className="lg:col-span-6 flex justify-center">
            <div className="relative w-full max-w-sm aspect-[3/4] rounded-[36px] overflow-hidden border-2 border-cyanAccent/40 shadow-neon-cyan bg-[#111814] p-4 flex flex-col justify-between">
              <div className="absolute inset-0 z-0">
                <Image
                  src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80"
                  alt="Smile & Eye Contact Model"
                  fill
                  sizes="(max-width: 768px) 100vw, 384px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E0C]/90 via-transparent to-[#0A0E0C]/40" />
              </div>

              <div className="relative z-10 flex items-center justify-between">
                <span className="px-3 py-1.5 rounded-full bg-[#0A0E0C]/80 backdrop-blur-md text-[11px] font-black uppercase tracking-wider text-cyanAccent border border-cyanAccent/30">
                  EXPRESSION ENGINE
                </span>
                <span className="px-3 py-1.5 rounded-full bg-primary/20 backdrop-blur-md text-[11px] font-black uppercase text-primary border border-primary">
                  READY TO CAPTURE
                </span>
              </div>

              <div className="relative z-10 p-5 rounded-2xl bg-[#0A0E0C]/90 backdrop-blur-xl border border-surfaceBorder space-y-3">
                <div>
                  <div className="flex items-center justify-between text-xs font-extrabold uppercase mb-1">
                    <span className="flex items-center gap-1.5 text-textPrimary">
                      <Smile className="w-4 h-4 text-primary" /> Natural Smile
                    </span>
                    <span className="font-mono text-primary font-black">98%</span>
                  </div>
                  <div className="w-full h-2 bg-[#233027] rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-[98%]" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs font-extrabold uppercase mb-1">
                    <span className="flex items-center gap-1.5 text-textPrimary">
                      <Eye className="w-4 h-4 text-cyanAccent" /> Eye Contact
                    </span>
                    <span className="font-mono text-cyanAccent font-black">94%</span>
                  </div>
                  <div className="w-full h-2 bg-[#233027] rounded-full overflow-hidden">
                    <div className="h-full bg-cyanAccent w-[94%]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
