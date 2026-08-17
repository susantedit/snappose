'use client';

import React, { useState } from 'react';
import { Zap, Play } from 'lucide-react';
import Image from 'next/image';

export function AutoCaptureSection() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(92);
  const [isFlashed, setIsFlashed] = useState(false);
  const [isBloom, setIsBloom] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const runSimulation = () => {
    if (isPlaying) return;
    setIsPlaying(true);
    setIsComplete(false);
    setIsFlashed(false);
    setIsBloom(false);
    setScore(92);

    setTimeout(() => setScore(95), 600);
    setTimeout(() => setScore(98), 1200);
    setTimeout(() => {
      setScore(99);
      setIsBloom(true);
    }, 1800);
    setTimeout(() => {
      setIsFlashed(true);
      setIsBloom(false);
      setTimeout(() => {
        setIsFlashed(false);
        setIsComplete(true);
        setIsPlaying(false);
      }, 350);
    }, 2400);
  };

  return (
    <section className="relative py-32 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface border border-primary/30 text-primary text-xs font-black tracking-widest uppercase mb-4 shadow-neon-lime">
            <Zap className="w-3.5 h-3.5" />
            Hands-Free Precision
          </div>
          <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-textPrimary leading-[0.95]">
            INTELLIGENT <br />
            <span className="text-primary text-glow">AUTO CAPTURE.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-textSecondary">
            Set your phone down on a ledge, step into position, and let POSEHANUM snap the shot when you hit 94%+ posture alignment.
          </p>
        </div>

        {/* Simulation Frame */}
        <div className="max-w-lg mx-auto flex flex-col items-center">
          <div className="relative w-full aspect-[9/16] rounded-[36px] overflow-hidden border-2 border-primary/50 shadow-neon-lime bg-[#111814] p-5 flex flex-col justify-between">
            <div className="absolute inset-0 z-0">
              <Image
                src={
                  isComplete
                    ? 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&auto=format&fit=crop&q=80'
                    : 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&auto=format&fit=crop&q=80'
                }
                alt="Auto Capture Result"
                fill
                sizes="(max-width: 768px) 100vw, 448px"
                className="object-cover transition-opacity duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E0C]/90 via-transparent to-[#0A0E0C]/40" />
            </div>

            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-2 bg-[#0A0E0C]/80 px-3 py-1.5 rounded-full border border-surfaceBorder text-xs font-mono font-bold text-textPrimary">
                <span className={`w-2 h-2 rounded-full ${score >= 98 ? 'bg-primary animate-ping' : 'bg-orangeAccent'}`} />
                <span>{score >= 98 ? 'HOLD STILL (AUTO-CAP)' : 'ALIGNING POSE'}</span>
              </div>
              <span className="px-3.5 py-1.5 rounded-full bg-primary/20 text-primary font-mono text-sm font-black border border-primary">
                {score}%
              </span>
            </div>

            <div className="relative z-10 p-5 rounded-2xl bg-[#0A0E0C]/90 backdrop-blur-xl border border-surfaceBorder text-center">
              <div className="text-xs font-bold text-textSecondary uppercase">Shutter Status</div>
              <div className="text-base font-black text-textPrimary mt-1">
                {isComplete
                  ? '✓ Captured! Saved to High-Res Gallery'
                  : score >= 98
                  ? 'LOCKED IN — Capturing Now...'
                  : 'Adjusting posture to reach 94% threshold'}
              </div>
            </div>

            {/* Radial Lens Bloom & Aperture Flare */}
            {isBloom && (
              <div className="absolute inset-0 z-45 bg-[radial-gradient(circle_at_center,_rgba(183,255,0,0.7)_0%,_rgba(0,217,255,0.4)_40%,_transparent_75%)] animate-pulse pointer-events-none" />
            )}

            {/* Shutter Flash Screen Overlay */}
            {isFlashed && (
              <div className="absolute inset-0 bg-white z-50 animate-out fade-out duration-300 pointer-events-none" />
            )}
          </div>

          <button
            onClick={runSimulation}
            disabled={isPlaying}
            aria-label="Simulate hands-free auto-capture shutter"
            className="mt-8 px-8 py-4 rounded-full bg-primary hover:bg-primary-hover text-[#0A0E0C] font-black text-sm tracking-wider uppercase shadow-neon-lime transition-all duration-300 flex items-center gap-2"
          >
            <Play className="w-4 h-4 fill-[#0A0E0C]" />
            {isPlaying ? 'Running Auto-Capture...' : 'Simulate Auto-Capture Shutter'}
          </button>
        </div>
      </div>
    </section>
  );
}
