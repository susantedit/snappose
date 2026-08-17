'use client';

import React, { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';
import Image from 'next/image';

const SCORE_LEVELS = [
  { score: 68, label: 'Adjusting Pose', color: '#FF8A00', hint: 'Lift your right elbow slightly higher.' },
  { score: 76, label: 'Approaching Target', color: '#00D9FF', hint: 'Turn shoulders 15° to the right.' },
  { score: 84, label: 'Great Alignment', color: '#00D9FF', hint: 'Tilt chin slightly down towards the lens.' },
  { score: 92, label: 'Excellent Match', color: '#B7FF00', hint: 'Slightly shift torso back.' },
  { score: 98, label: 'PERFECT POSE', color: '#B7FF00', hint: 'Flawless posture! Auto-capturing in 2s...' },
];

export function PoseMatchSection() {
  const [levelIdx, setLevelIdx] = useState(3);

  useEffect(() => {
    const timer = setInterval(() => {
      setLevelIdx((prev) => (prev + 1) % SCORE_LEVELS.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  const activeLevel = SCORE_LEVELS[levelIdx];

  return (
    <section className="relative py-32 bg-secondaryBg overflow-hidden border-t border-b border-surfaceBorder">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Interactive Score HUD */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface border border-primary/30 text-primary text-xs font-black tracking-widest uppercase shadow-neon-lime">
              <Activity className="w-3.5 h-3.5" />
              Real-Time MediaPipe Engine
            </div>

            <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-textPrimary leading-[0.95]">
              AI POSE MATCH SCORE: <br />
              <span className="text-primary text-glow font-mono text-5xl sm:text-7xl">
                {activeLevel.score}%
              </span>
            </h2>

            <p className="text-textSecondary text-base leading-relaxed">
              POSEHANUM tracks 33 critical anatomical 3D landmarks on your device. Every joint angle (shoulders, elbows, wrists, hips, knees, and ankles) is compared with professional photography references in real time.
            </p>

            {/* Interactive Score Selector */}
            <div className="space-y-3">
              <div className="text-xs font-bold text-textMuted uppercase tracking-wider">
                Simulate Alignment Progress:
              </div>
              <div className="flex flex-wrap gap-2">
                {SCORE_LEVELS.map((lvl, idx) => (
                  <button
                    key={lvl.score}
                    onClick={() => setLevelIdx(idx)}
                    aria-label={`Simulate ${lvl.score}% alignment score`}
                    className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all ${
                      levelIdx === idx
                        ? 'bg-primary text-background font-black shadow-neon-lime scale-105'
                        : 'bg-surface border border-surfaceBorder text-textSecondary hover:text-textPrimary'
                    }`}
                  >
                    {lvl.score}%
                  </button>
                ))}
              </div>
            </div>

            {/* Active Joint Guidance Box */}
            <div className="p-5 rounded-2xl bg-surface border border-surfaceBorder space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-textSecondary uppercase">AI Feedback Prompt:</span>
                <span
                  className="text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded-md"
                  style={{ color: activeLevel.color, backgroundColor: `${activeLevel.color}15` }}
                >
                  {activeLevel.label}
                </span>
              </div>
              <p className="text-sm font-extrabold text-textPrimary">
                “{activeLevel.hint}”
              </p>
            </div>
          </div>

          {/* Right Column: Visual Skeleton Overlay */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="relative w-full max-w-sm aspect-[3/4] rounded-[36px] overflow-hidden border-2 border-surfaceBorder shadow-2xl bg-[#111814] p-4 flex flex-col justify-between">
              <div className="absolute inset-0 z-0">
                <Image
                  src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80"
                  alt="Skeleton Model"
                  fill
                  sizes="(max-width: 768px) 100vw, 384px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-[#0A0E0C]/40" />
              </div>

              {/* Skeleton Lines */}
              <svg
                className="absolute inset-0 w-full h-full z-10 pointer-events-none"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <line x1="50" y1="18" x2="42" y2="28" stroke={activeLevel.color} strokeWidth="1.2" />
                <line x1="50" y1="18" x2="58" y2="28" stroke={activeLevel.color} strokeWidth="1.2" />
                <line x1="42" y1="28" x2="58" y2="28" stroke={activeLevel.color} strokeWidth="1.2" />
                <line x1="42" y1="28" x2="36" y2="44" stroke={activeLevel.color} strokeWidth="1.2" />
                <line x1="58" y1="28" x2="64" y2="44" stroke={activeLevel.color} strokeWidth="1.2" />
                <line x1="36" y1="44" x2="30" y2="58" stroke={activeLevel.color} strokeWidth="1.2" />
                <line x1="64" y1="44" x2="70" y2="58" stroke={activeLevel.color} strokeWidth="1.2" />
                <line x1="44" y1="58" x2="56" y2="58" stroke={activeLevel.color} strokeWidth="1.2" />
                <line x1="44" y1="58" x2="40" y2="82" stroke={activeLevel.color} strokeWidth="1.2" />
                <line x1="56" y1="58" x2="60" y2="82" stroke={activeLevel.color} strokeWidth="1.2" />

                <circle cx="50" cy="18" r="2.5" fill="#FFF" stroke={activeLevel.color} strokeWidth="1" />
                <circle cx="42" cy="28" r="2" fill={activeLevel.color} />
                <circle cx="58" cy="28" r="2" fill={activeLevel.color} />
                <circle cx="36" cy="44" r="2" fill={activeLevel.color} />
                <circle cx="64" cy="44" r="2" fill={activeLevel.color} />
                <circle cx="30" cy="58" r="2" fill={activeLevel.color} />
                <circle cx="70" cy="58" r="2" fill={activeLevel.color} />
                <circle cx="44" cy="58" r="2" fill={activeLevel.color} />
                <circle cx="56" cy="58" r="2" fill={activeLevel.color} />
                <circle cx="40" cy="82" r="2" fill={activeLevel.color} />
                <circle cx="60" cy="82" r="2" fill={activeLevel.color} />
              </svg>

              <div className="relative z-20 flex items-center justify-between">
                <span className="px-3.5 py-1.5 rounded-full bg-[#0A0E0C]/80 backdrop-blur-md text-[11px] font-black tracking-wider uppercase text-textPrimary border border-surfaceBorder">
                  33 LANDMARKS ACTIVE
                </span>
                <span
                  className="px-4 py-1.5 rounded-full backdrop-blur-md font-mono text-sm font-black border"
                  style={{
                    backgroundColor: `${activeLevel.color}20`,
                    borderColor: activeLevel.color,
                    color: activeLevel.color,
                  }}
                >
                  {activeLevel.score}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
