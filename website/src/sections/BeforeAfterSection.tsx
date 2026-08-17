'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Sparkles, XCircle, CheckCircle2, Sliders } from 'lucide-react';
import Image from 'next/image';

export function BeforeAfterSection() {
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.round((x / rect.width) * 100);
    setSliderPos(percent);
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    updatePosition(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging && e.buttons !== 1) return;
    updatePosition(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    } catch {
      // Ignore if pointer capture wasn't active
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setSliderPos((prev) => Math.max(0, prev - 5));
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      setSliderPos((prev) => Math.min(100, prev + 5));
    } else if (e.key === 'Home') {
      e.preventDefault();
      setSliderPos(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setSliderPos(100);
    }
  };

  return (
    <section className="relative py-32 bg-secondaryBg overflow-hidden border-t border-b border-surfaceBorder">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface border border-primary/30 text-primary text-xs font-black tracking-widest uppercase mb-4 shadow-neon-lime">
            <Sparkles className="w-3.5 h-3.5" />
            Visual Transformation
          </div>
          <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-textPrimary">
            BEFORE & AFTER <span className="text-primary text-glow">POSEHANUM.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-textSecondary">
            Drag or swipe the interactive divider to see how AI guidance transforms awkward postures into confident, natural compositions.
          </p>
        </div>

        {/* Interactive Comparison Slider */}
        <div className="max-w-4xl mx-auto">
          <div
            ref={containerRef}
            tabIndex={0}
            role="slider"
            aria-label="Before and After pose comparison slider"
            aria-valuenow={sliderPos}
            aria-valuemin={0}
            aria-valuemax={100}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onKeyDown={handleKeyDown}
            className="relative aspect-[16/9] w-full rounded-[36px] overflow-hidden border-2 border-primary/40 shadow-neon-lime select-none cursor-ew-resize focus:outline-none focus:ring-2 focus:ring-primary [touch-action:none]"
          >
            {/* After Image (Right Side / Full Base) */}
            <div className="absolute inset-0 z-0">
              <Image
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1200&auto=format&fit=crop&q=80"
                alt="Natural Confident Pose with POSEHANUM Guidance"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 896px"
                className="object-cover"
              />
              <div className="absolute top-6 right-6 px-4 py-2 rounded-full bg-[#0A0E0C]/85 backdrop-blur-md border border-primary text-xs font-black text-primary uppercase flex items-center gap-2 shadow-lg">
                <CheckCircle2 className="w-4 h-4" /> WITH POSEHANUM
              </div>
            </div>

            {/* Before Image (Left Side / Clipped) */}
            <div
              className="absolute inset-0 z-10 overflow-hidden"
              style={{ width: `${sliderPos}%` }}
            >
              <div className="relative w-full h-full min-w-[700px] sm:min-w-[900px] max-w-none">
                <Image
                  src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&auto=format&fit=crop&q=80"
                  alt="Awkward Stiff Pose without Guidance"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 896px"
                  className="object-cover grayscale brightness-75"
                />
                <div className="absolute top-6 left-6 px-4 py-2 rounded-full bg-[#0A0E0C]/85 backdrop-blur-md border border-red-500/60 text-xs font-black text-red-400 uppercase flex items-center gap-2 shadow-lg">
                  <XCircle className="w-4 h-4" /> AWKWARD POSE
                </div>
              </div>
            </div>

            {/* Vertical Divider Bar */}
            <div
              className="absolute top-0 bottom-0 z-20 w-1 bg-white shadow-[0_0_15px_#B7FF00] flex items-center justify-center pointer-events-none"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="w-10 h-10 rounded-full bg-primary text-background flex items-center justify-center shadow-neon-lime transition-transform group-hover:scale-110">
                <Sliders className="w-5 h-5 text-[#0A0E0C]" />
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center text-xs font-bold text-textSecondary uppercase mt-4 px-2">
            <span>← Awkward & Stiff (No Guidance)</span>
            <span className="hidden sm:inline text-textMuted font-normal">Use touch swipe or arrow keys to slide</span>
            <span>Natural Editorial Posture (POSEHANUM) →</span>
          </div>
        </div>
      </div>
    </section>
  );
}
