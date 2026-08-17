'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Compass, Focus, Activity, Camera, Sparkles } from 'lucide-react';
import Image from 'next/image';

const STEPS = [
  {
    step: '01',
    title: 'CHOOSE',
    tagline: 'Find a pose that fits your moment',
    description:
      'Browse curated collections across 15+ photography styles: mountain panoramas, cozy cafe corners, urban street fashion, natural candids, or couples.',
    icon: Compass,
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80',
    highlight: 'Curated 100+ Poses',
  },
  {
    step: '02',
    title: 'ALIGN',
    tagline: 'Use the live ghost reference to match',
    description:
      'The reference pose appears as a semi-transparent guide over your real-time camera viewfinder. Simply align your posture with the silhouette.',
    icon: Focus,
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80',
    highlight: 'AR Ghost Silhouette',
  },
  {
    step: '03',
    title: 'MATCH',
    tagline: 'AI tells you how close you are',
    description:
      'On-device MediaPipe landmark detection tracks 33 body joints in real-time, calculating alignment accuracy (0–100%) and offering spoken voice adjustments.',
    icon: Activity,
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
    highlight: 'Real-Time Match Score',
  },
  {
    step: '04',
    title: 'CAPTURE',
    tagline: 'Snap the photo when you are ready',
    description:
      'Hands-free intelligent auto-capture fires the shutter as soon as you sustain 92%+ posture alignment. Perfect compositions, zero photographer required.',
    icon: Camera,
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80',
    highlight: 'Auto-Capture Shutter',
  },
];

export function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section id="how-it-works" className="relative py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface border border-primary/30 text-primary text-xs font-black tracking-widest uppercase mb-4 shadow-neon-lime">
            <Sparkles className="w-3.5 h-3.5" />
            Seamless 4-Step Pipeline
          </div>
          <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-textPrimary">
            HOW POSEHANUM <span className="text-primary text-glow">WORKS.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-textSecondary">
            From discovering the aesthetic to capturing the perfect frame in under 30 seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-4">
            {STEPS.map((s, idx) => {
              const Icon = s.icon;
              const isActive = activeStep === idx;

              return (
                <button
                  key={s.step}
                  onClick={() => setActiveStep(idx)}
                  className={`w-full text-left p-6 rounded-3xl border transition-all duration-300 ${
                    isActive
                      ? 'bg-surface border-primary shadow-neon-lime translate-x-2'
                      : 'bg-secondaryBg/60 border-surfaceBorder hover:border-textSecondary/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm transition-colors ${
                          isActive ? 'bg-primary text-background' : 'bg-surface text-textSecondary'
                        }`}
                      >
                        {s.step}
                      </div>
                      <div>
                        <h3 className="text-xl font-extrabold uppercase tracking-tight text-textPrimary">
                          {s.title}
                        </h3>
                        <p className="text-xs font-semibold text-textSecondary mt-0.5">
                          {s.tagline}
                        </p>
                      </div>
                    </div>
                    <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-textMuted'}`} />
                  </div>

                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-4 pt-4 border-t border-surfaceBorder/80 text-sm text-textSecondary leading-relaxed"
                    >
                      {s.description}
                    </motion.div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="lg:col-span-6 flex justify-center">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35 }}
              className="relative w-full max-w-md aspect-[4/5] rounded-[36px] overflow-hidden border-2 border-primary/40 shadow-2xl bg-[#111814] p-4 flex flex-col justify-between"
            >
              <div className="absolute inset-0 z-0">
                <Image
                  src={STEPS[activeStep].image}
                  alt={STEPS[activeStep].title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 448px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E0C] via-transparent to-[#0A0E0C]/60" />
              </div>

              <div className="relative z-10 flex items-center justify-between">
                <span className="px-3.5 py-1.5 rounded-full bg-[#0A0E0C]/80 backdrop-blur-md text-xs font-black tracking-wider text-primary border border-primary/30 uppercase">
                  STEP {STEPS[activeStep].step} // {STEPS[activeStep].title}
                </span>
                <span className="px-3.5 py-1.5 rounded-full bg-surface/90 backdrop-blur-md text-[11px] font-bold text-textPrimary border border-surfaceBorder">
                  {STEPS[activeStep].highlight}
                </span>
              </div>

              <div className="relative z-10 p-5 rounded-2xl bg-[#0A0E0C]/90 backdrop-blur-xl border border-surfaceBorder">
                <div className="text-xs font-bold text-textSecondary uppercase tracking-wider mb-1">
                  Active Feature
                </div>
                <div className="text-base font-extrabold text-textPrimary">
                  {STEPS[activeStep].tagline}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
