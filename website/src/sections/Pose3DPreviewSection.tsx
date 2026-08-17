'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Box, Rotate3d, ArrowRight } from 'lucide-react';
import Image from 'next/image';

const MODELS = [
  { id: 'lean', title: 'Urban Wall Lean', category: 'City', image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80' },
  { id: 'summit', title: 'Panoramic Summit Stance', category: 'Mountain', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80' },
  { id: 'fashion', title: 'Editorial Silhouette', category: 'Fashion', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80' },
];

export function Pose3DPreviewSection() {
  const [activePoseIdx, setActivePoseIdx] = useState(0);
  const [rotation, setRotation] = useState(15);
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeModel = MODELS[activePoseIdx];

  const updateRotation = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = (x / rect.width - 0.5) * 60;
    setRotation(Math.round(pct));
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    updateRotation(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging && e.buttons !== 1) return;
    updateRotation(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    } catch {
      // Ignore if not captured
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setRotation((prev) => Math.max(-30, prev - 5));
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      setRotation((prev) => Math.min(30, prev + 5));
    }
  };

  return (
    <section className="relative py-32 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface border border-primary/30 text-primary text-xs font-black tracking-widest uppercase mb-4 shadow-neon-lime">
            <Box className="w-3.5 h-3.5" />
            360° Rotational Viewer
          </div>
          <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-textPrimary">
            3D POSE <span className="text-primary text-glow">PREVIEW.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-textSecondary">
            Inspect pose angles from every perspective before striking them in front of the lens.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center max-w-6xl mx-auto">
          {/* Left: 3D Canvas Box */}
          <div className="lg:col-span-8 flex justify-center">
            <div
              ref={containerRef}
              tabIndex={0}
              role="slider"
              aria-label="3D pose rotation angle"
              aria-valuenow={Math.round(rotation)}
              aria-valuemin={-30}
              aria-valuemax={30}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              onKeyDown={handleKeyDown}
              className="relative w-full max-w-2xl aspect-[16/10] rounded-[36px] bg-[#111814] border-2 border-primary/40 shadow-neon-lime overflow-hidden p-6 cursor-grab active:cursor-grabbing flex items-center justify-center select-none focus:outline-none focus:ring-2 focus:ring-primary [touch-action:none]"
            >
              <div
                className="relative w-72 h-96 transition-transform duration-100 ease-out"
                style={{
                  transform: `perspective(1000px) rotateY(${rotation}deg) scale(${zoom})`,
                }}
              >
                <Image
                  src={activeModel.image}
                  alt={activeModel.title}
                  fill
                  sizes="(max-width: 768px) 288px, 288px"
                  className="object-cover rounded-2xl shadow-2xl border border-primary/30"
                />
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-80 h-32 border border-cyanAccent/40 rounded-full [transform:rotateX(75deg)] pointer-events-none" />
              </div>

              <div className="absolute top-6 left-6 flex items-center gap-2 bg-[#0A0E0C]/80 px-3.5 py-1.5 rounded-full border border-surfaceBorder text-xs font-mono text-primary">
                <Rotate3d className="w-3.5 h-3.5 animate-spin" /> Y-AXIS: {Math.round(rotation)}°
              </div>

              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between pointer-events-auto bg-[#0A0E0C]/90 backdrop-blur-md p-3 rounded-2xl border border-surfaceBorder">
                <div className="flex items-center gap-2 text-xs text-textSecondary font-bold">
                  <label htmlFor="zoom-slider">Zoom:</label>
                  <input
                    id="zoom-slider"
                    type="range"
                    min="0.8"
                    max="1.3"
                    step="0.05"
                    value={zoom}
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                    aria-label="3D Pose Zoom Slider"
                    className="w-28 accent-primary cursor-pointer"
                  />
                </div>
                <span className="text-[11px] font-bold text-textMuted uppercase hidden sm:block">
                  Drag / Touch to Rotate • Arrow keys supported
                </span>
              </div>
            </div>
          </div>

          {/* Right: Pose Selector */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-xl font-black uppercase text-textPrimary">Select 3D Reference</h3>

            <div className="space-y-3">
              {MODELS.map((m, idx) => (
                <button
                  key={m.id}
                  onClick={() => {
                    setActivePoseIdx(idx);
                    setRotation(15);
                  }}
                  className={`w-full p-4 rounded-2xl border text-left transition-all ${
                    activePoseIdx === idx
                      ? 'bg-surface border-primary shadow-neon-lime text-textPrimary'
                      : 'bg-secondaryBg/60 border-surfaceBorder text-textSecondary hover:border-textSecondary'
                  }`}
                >
                  <div className="text-xs font-bold text-primary uppercase">{m.category}</div>
                  <div className="text-base font-extrabold text-textPrimary">{m.title}</div>
                </button>
              ))}
            </div>

            <a
              href="#download"
              className="mt-6 w-full py-4 rounded-2xl bg-primary hover:bg-primary-hover text-[#0A0E0C] font-black text-center text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-neon-lime transition-all duration-300"
            >
              Try This Pose in Camera <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
