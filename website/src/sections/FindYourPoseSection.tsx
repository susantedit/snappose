'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import Image from 'next/image';

const LOCATIONS = ['Beach', 'Mountain', 'Cafe', 'City & Street', 'Nature'];
const VIBES = ['Aesthetic', 'Casual', 'Luxury', 'Adventure', 'Streetwear', 'Romantic'];
const OUTFITS = ['Casual Fit', 'Formal Suit / Dress', 'Streetwear Jacket', 'Summer Linen', 'Traditional Attire'];

export function FindYourPoseSection() {
  const [selectedLoc, setSelectedLoc] = useState('Mountain');
  const [selectedVibe, setSelectedVibe] = useState('Adventure');
  const [selectedOutfit, setSelectedOutfit] = useState('Casual Fit');

  return (
    <section className="relative py-32 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface border border-primary/30 text-primary text-xs font-black tracking-widest uppercase mb-4 shadow-neon-lime">
            <Sparkles className="w-3.5 h-3.5" />
            Interactive Match Quiz
          </div>
          <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-textPrimary">
            FIND YOUR <span className="text-primary text-glow">PERFECT POSE.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-textSecondary">
            Answer 3 quick questions to discover your ideal photography composition.
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Questions */}
          <div className="lg:col-span-7 p-8 rounded-[36px] bg-secondaryBg border-2 border-surfaceBorder space-y-6">
            <div>
              <span className="text-xs font-mono font-black text-primary uppercase tracking-wider block mb-2.5">
                01 // WHERE ARE YOU?
              </span>
              <div className="flex flex-wrap gap-2">
                {LOCATIONS.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => setSelectedLoc(loc)}
                    aria-label={`Select location ${loc}`}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      selectedLoc === loc
                        ? 'bg-primary text-background font-black shadow-neon-lime'
                        : 'bg-surface border border-surfaceBorder text-textSecondary hover:text-textPrimary'
                    }`}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="text-xs font-mono font-black text-cyanAccent uppercase tracking-wider block mb-2.5">
                02 // WHAT IS THE VIBE?
              </span>
              <div className="flex flex-wrap gap-2">
                {VIBES.map((v) => (
                  <button
                    key={v}
                    onClick={() => setSelectedVibe(v)}
                    aria-label={`Select vibe ${v}`}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      selectedVibe === v
                        ? 'bg-cyanAccent text-background font-black shadow-neon-cyan'
                        : 'bg-surface border border-surfaceBorder text-textSecondary hover:text-textPrimary'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="text-xs font-mono font-black text-orangeAccent uppercase tracking-wider block mb-2.5">
                03 // WHAT ARE YOU WEARING?
              </span>
              <div className="flex flex-wrap gap-2">
                {OUTFITS.map((o) => (
                  <button
                    key={o}
                    onClick={() => setSelectedOutfit(o)}
                    aria-label={`Select outfit ${o}`}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      selectedOutfit === o
                        ? 'bg-orangeAccent text-background font-black shadow-neon-orange'
                        : 'bg-surface border border-surfaceBorder text-textSecondary hover:text-textPrimary'
                    }`}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Result Card */}
          <div className="lg:col-span-5 flex justify-center">
            <motion.div
              key={`${selectedLoc}-${selectedVibe}-${selectedOutfit}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-sm rounded-[36px] overflow-hidden border-2 border-primary shadow-neon-lime bg-surface p-5 flex flex-col justify-between"
            >
              <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden mb-4">
                <Image
                  src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80"
                  alt="Recommended Pose Preview"
                  fill
                  sizes="(max-width: 768px) 100vw, 384px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E0C] via-transparent to-transparent" />
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#0A0E0C]/80 backdrop-blur-md text-[10px] font-black uppercase text-primary border border-primary/30">
                  98% MATCH RATING
                </span>
              </div>

              <div>
                <div className="text-xs font-mono font-bold text-primary uppercase">
                  {selectedLoc} • {selectedVibe}
                </div>
                <h4 className="text-xl font-black text-textPrimary uppercase mt-1">
                  The Summit Stride
                </h4>
                <p className="text-xs text-textSecondary mt-1 leading-relaxed">
                  Tailored for {selectedOutfit.toLowerCase()} in {selectedLoc.toLowerCase()} lighting with a relaxed 3/4 turn.
                </p>

                <a
                  href="#download"
                  aria-label="Try this pose in camera"
                  className="mt-5 w-full py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-[#0A0E0C] font-black text-center text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-neon-lime transition-all"
                >
                  Try This Pose Now <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
