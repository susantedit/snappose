'use client';

import React, { useState } from 'react';
import { Sun } from 'lucide-react';
import Image from 'next/image';

const LIGHT_STEPS = [
  { score: 62, angle: 'Backlit (Harsh Shadows)', advice: 'Turn 45° left toward main sunlight.', status: 'Suboptimal' },
  { score: 78, angle: 'Side Lit (High Contrast)', advice: 'Tilt face 15° upward into the key light.', status: 'Acceptable' },
  { score: 95, angle: 'Golden Front Light (Soft)', advice: 'Perfect soft illumination across face.', status: 'PERFECT LIGHT' },
];

export function LightingSection() {
  const [stepIdx, setStepIdx] = useState(2);
  const currentLight = LIGHT_STEPS[stepIdx];

  return (
    <section className="relative py-32 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="relative w-full max-w-sm aspect-[3/4] rounded-[36px] overflow-hidden border-2 border-primary/40 shadow-neon-lime bg-[#111814] p-4 flex flex-col justify-between">
              <div className="absolute inset-0 z-0">
                <Image
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80"
                  alt="Lighting Model"
                  fill
                  sizes="(max-width: 768px) 100vw, 384px"
                  className="object-cover"
                />
                <div
                  className="absolute inset-0 transition-opacity duration-700 pointer-events-none"
                  style={{
                    background:
                      stepIdx === 2
                        ? 'radial-gradient(circle at 75% 25%, rgba(183,255,0,0.35) 0%, rgba(0,0,0,0.2) 70%)'
                        : 'rgba(0,0,0,0.5)',
                  }}
                />
              </div>

              <div className="relative z-10 flex items-center justify-between">
                <span className="px-3.5 py-1.5 rounded-full bg-[#0A0E0C]/80 backdrop-blur-md text-xs font-mono font-black text-textPrimary border border-surfaceBorder">
                  LIGHT QUALITY: {currentLight.score}%
                </span>
                <span className="px-3.5 py-1.5 rounded-full bg-primary/20 backdrop-blur-md text-xs font-black text-primary border border-primary uppercase">
                  {currentLight.status}
                </span>
              </div>

              <div className="relative z-10 p-4 rounded-2xl bg-[#0A0E0C]/90 backdrop-blur-xl border border-surfaceBorder space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-textSecondary uppercase">
                  <span>Current Direction:</span>
                  <span className="text-primary font-mono">{currentLight.angle}</span>
                </div>
                <div className="text-sm font-extrabold text-textPrimary">
                  “{currentLight.advice}”
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface border border-primary/30 text-primary text-xs font-black tracking-widest uppercase shadow-neon-lime">
              <Sun className="w-3.5 h-3.5" />
              Dynamic Lighting AI
            </div>

            <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-textPrimary leading-[0.95]">
              HARNESS <br />
              <span className="text-primary text-glow">PERFECT NATURAL LIGHT</span> <br />
              EVERY TIME.
            </h2>

            <p className="text-textSecondary text-base leading-relaxed">
              No more dark silhouettes or squinting into harsh glare. POSEHANUM analyzes luminosity histograms and facial highlights in real time, directing you exactly how many degrees to rotate your body toward the softest light source.
            </p>

            <div className="space-y-3 pt-2">
              <div className="text-xs font-bold text-textMuted uppercase tracking-wider">
                Simulate Lighting Angles:
              </div>
              <div className="flex flex-wrap gap-3">
                {LIGHT_STEPS.map((step, idx) => (
                  <button
                    key={step.score}
                    onClick={() => setStepIdx(idx)}
                    aria-label={`Simulate ${step.angle}`}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      stepIdx === idx
                        ? 'bg-primary text-background font-black shadow-neon-lime'
                        : 'bg-surface border border-surfaceBorder text-textSecondary hover:text-textPrimary'
                    }`}
                  >
                    {step.score}% ({step.status})
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
