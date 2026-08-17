'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Maximize2, CheckCircle2, AlertCircle } from 'lucide-react';
import Image from 'next/image';

export function DistanceSection() {
  const [distance, setDistance] = useState(1.8);

  const isTooClose = distance < 1.2;
  const isTooFar = distance > 2.5;
  const isOptimal = !isTooClose && !isTooFar;

  return (
    <section className="relative py-32 bg-secondaryBg overflow-hidden border-t border-b border-surfaceBorder">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface border border-orangeAccent/30 text-orangeAccent text-xs font-black tracking-widest uppercase shadow-neon-orange">
              <Maximize2 className="w-3.5 h-3.5" />
              Smart Distance & Framing AI
            </div>

            <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-textPrimary leading-[0.95]">
              NEVER GUESS <br />
              <span className="text-orangeAccent text-glow">CAMERA DISTANCE</span> <br />
              AGAIN.
            </h2>

            <p className="text-textSecondary text-base leading-relaxed">
              POSEHANUM estimates camera-to-subject distance in real time using head-to-torso proportions. It dynamically alerts you whether to step forward or step back to prevent wide-angle facial distortion.
            </p>

            {/* Interactive Distance Slider */}
            <div className="p-6 rounded-2xl bg-surface border border-surfaceBorder space-y-4">
              <div className="flex items-center justify-between">
                <label htmlFor="distance-range" className="text-xs font-bold text-textSecondary uppercase">
                  Simulate Distance:
                </label>
                <span className="font-mono text-base font-black text-orangeAccent">
                  {distance.toFixed(1)} meters
                </span>
              </div>
              <input
                id="distance-range"
                type="range"
                min="0.8"
                max="3.2"
                step="0.1"
                value={distance}
                onChange={(e) => setDistance(parseFloat(e.target.value))}
                aria-label="Camera to subject distance slider"
                aria-valuenow={parseFloat(distance.toFixed(1))}
                aria-valuemin={0.8}
                aria-valuemax={3.2}
                className="w-full accent-orangeAccent cursor-pointer h-2 bg-[#233027] rounded-lg"
              />
              <div className="flex justify-between text-[10px] font-mono text-textMuted uppercase">
                <span>0.8m (Too Close)</span>
                <span>1.8m (Optimal)</span>
                <span>3.2m (Too Far)</span>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="relative w-full max-w-sm aspect-[3/4] rounded-[36px] overflow-hidden border-2 border-surfaceBorder shadow-2xl bg-[#111814] p-4 flex flex-col justify-between">
              <div className="absolute inset-0 z-0 overflow-hidden">
                <motion.div
                  animate={{ scale: 2.2 / distance }}
                  transition={{ type: 'spring', stiffness: 140, damping: 20 }}
                  className="w-full h-full relative"
                >
                  <Image
                    src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80"
                    alt="Distance Framing Model"
                    fill
                    sizes="(max-width: 768px) 100vw, 384px"
                    className="object-cover"
                  />
                </motion.div>
                <div className="absolute inset-0 bg-[#0A0E0C]/30" />
              </div>

              <div className="relative z-10 flex items-center justify-between">
                <span className="px-3.5 py-1.5 rounded-full bg-[#0A0E0C]/85 backdrop-blur-md text-xs font-mono font-black text-textPrimary border border-surfaceBorder">
                  EST. DISTANCE: {distance.toFixed(1)}M
                </span>

                <span
                  className={`px-3.5 py-1.5 rounded-full backdrop-blur-md text-xs font-black uppercase tracking-wider border flex items-center gap-1.5 ${
                    isOptimal
                      ? 'bg-primary/20 text-primary border-primary'
                      : 'bg-orangeAccent/20 text-orangeAccent border-orangeAccent'
                  }`}
                >
                  {isOptimal ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                  {isTooClose ? 'STEP BACK' : isTooFar ? 'STEP CLOSER' : 'GOOD DISTANCE'}
                </span>
              </div>

              <div className="relative z-10 p-4 rounded-2xl bg-[#0A0E0C]/90 backdrop-blur-xl border border-surfaceBorder text-center">
                <div className="text-xs font-bold text-textSecondary uppercase">Framing Recommendation</div>
                <div className="text-sm font-black text-textPrimary mt-0.5">
                  {isOptimal
                    ? '✓ Full body in golden-ratio frame'
                    : isTooClose
                    ? '⚠️ Torso cropped — step back 0.6m'
                    : '⚠️ Subject too small for pose detection'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
