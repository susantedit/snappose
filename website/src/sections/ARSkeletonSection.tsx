'use client';

import React from 'react';
import { Focus } from 'lucide-react';
import Image from 'next/image';

const JOINTS = [
  { name: 'Head / Chin', x: '50%', y: '16%' },
  { name: 'Shoulders', x: '38%', y: '26%' },
  { name: 'Elbows', x: '30%', y: '42%' },
  { name: 'Wrists', x: '24%', y: '56%' },
  { name: 'Torso & Hips', x: '46%', y: '58%' },
  { name: 'Knees', x: '42%', y: '78%' },
  { name: 'Ankles', x: '38%', y: '94%' },
];

export function ARSkeletonSection() {
  return (
    <section className="relative py-32 bg-secondaryBg overflow-hidden border-t border-b border-surfaceBorder">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="relative w-full max-w-sm aspect-[9/16] rounded-[36px] overflow-hidden border-2 border-primary/50 shadow-neon-lime bg-[#111814] p-4 flex flex-col justify-between">
              <div className="absolute inset-0 z-0">
                <Image
                  src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80"
                  alt="AR Skeleton Subject"
                  fill
                  sizes="(max-width: 768px) 100vw, 384px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-[#0A0E0C]/35" />
              </div>

              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-2 bg-[#0A0E0C]/80 px-3 py-1.5 rounded-full border border-primary/30 text-xs font-mono font-bold text-primary">
                  <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
                  <span>AR OVERLAY // 60 FPS</span>
                </div>
                <span className="px-3 py-1.5 rounded-full bg-surface text-xs font-mono font-bold text-textPrimary border border-surfaceBorder">
                  33 JOINTS
                </span>
              </div>

              {/* Keypoint Rings */}
              <div className="absolute inset-0 z-10 pointer-events-none">
                {JOINTS.map((j) => (
                  <div
                    key={j.name}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 flex items-center gap-2"
                    style={{ left: j.x, top: j.y }}
                  >
                    <div className="w-3.5 h-3.5 rounded-full bg-primary border-2 border-white shadow-[0_0_10px_#B7FF00] animate-pulse" />
                    <span className="bg-[#0A0E0C]/80 px-2 py-0.5 rounded text-[9px] font-mono font-bold text-textPrimary uppercase border border-surfaceBorder">
                      {j.name}
                    </span>
                  </div>
                ))}
              </div>

              <div className="relative z-10 p-4 rounded-2xl bg-[#0A0E0C]/90 backdrop-blur-xl border border-surfaceBorder text-center">
                <div className="text-xs font-bold text-textSecondary uppercase">Tracking Pipeline</div>
                <div className="text-sm font-black text-textPrimary mt-0.5">
                  Sub-Millimeter Real-Time Body Tracking
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface border border-primary/30 text-primary text-xs font-black tracking-widest uppercase shadow-neon-lime">
              <Focus className="w-3.5 h-3.5" />
              Next-Gen AR Overlay
            </div>

            <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-textPrimary leading-[0.95]">
              AR SKELETON <br />
              <span className="text-primary text-glow">TRACKING.</span>
            </h2>

            <p className="text-textSecondary text-base leading-relaxed">
              POSEHANUM renders lightweight vector skeleton overlays directly on top of your live camera feed. As you move, glowing connection lines turn from cyan to vibrant neon green the moment your limbs lock into perfect reference position.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-surface border border-surfaceBorder">
                <div className="text-2xl font-mono font-black text-primary">60 FPS</div>
                <div className="text-xs font-bold text-textSecondary uppercase mt-1">Zero-Lag Tracking</div>
              </div>
              <div className="p-4 rounded-2xl bg-surface border border-surfaceBorder">
                <div className="text-2xl font-mono font-black text-cyanAccent">33 Points</div>
                <div className="text-xs font-bold text-textSecondary uppercase mt-1">Full-Body Landmarks</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
