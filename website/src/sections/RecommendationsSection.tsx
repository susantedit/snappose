'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import Image from 'next/image';

const SCENES = [
  { id: 'couple', label: '💑 Couple & Romantic' },
  { id: 'mountain', label: '🏔 Mountain' },
  { id: 'cafe', label: '☕ Cafe' },
  { id: 'beach', label: '🌊 Beach' },
  { id: 'city', label: '🌆 City & Street' },
  { id: 'nature', label: '🌲 Nature' },
];

const OUTFITS = [
  { id: 'casual', label: 'Casual' },
  { id: 'streetwear', label: 'Streetwear' },
  { id: 'formal', label: 'Formal' },
  { id: 'traditional', label: 'Traditional' },
];

const GENERATED_POSES: Record<string, { title: string; image: string; tag: string }[]> = {
  couple: [
    { title: 'Golden Duo Stride', image: '/IMG_20260818_112337.jpg', tag: 'Couple Stance' },
    { title: 'Sunset Silhouette Embrace', image: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&auto=format&fit=crop&q=80', tag: 'Duo' },
    { title: 'Forehead Touch Chemistry', image: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=800&auto=format&fit=crop&q=80', tag: 'Romantic' },
  ],
  mountain: [
    { title: 'Summit Stride', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80', tag: 'Standing' },
    { title: 'Panoramic Ridge Look', image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&auto=format&fit=crop&q=80', tag: 'Candid' },
    { title: 'Cliff Edge Silhouette', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80', tag: 'Adventure' },
  ],
  cafe: [
    { title: 'Window Table Lean', image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80', tag: 'Sitting' },
    { title: 'Espresso Forearm Rest', image: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&auto=format&fit=crop&q=80', tag: 'Aesthetic' },
    { title: 'Cozy Book Gaze', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop&q=80', tag: 'Indoor' },
  ],
  beach: [
    { title: 'Shoreline Stroll', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80', tag: 'Walking' },
    { title: 'Golden Hour Silhouette', image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&auto=format&fit=crop&q=80', tag: 'Sunset' },
    { title: 'Wave Spray Laugh', image: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800&auto=format&fit=crop&q=80', tag: 'Candid' },
  ],
  city: [
    { title: 'Urban Wall Lean', image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80', tag: 'Streetwear' },
    { title: 'Crosswalk Motion Stride', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80', tag: 'Motion' },
    { title: 'Rooftop Horizon', image: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=800&auto=format&fit=crop&q=80', tag: 'Nightlife' },
  ],
  nature: [
    { title: 'Forest Pathway Wander', image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop&q=80', tag: 'Serene' },
    { title: 'Sunlit Clearing Stance', image: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=800&auto=format&fit=crop&q=80', tag: 'Standing' },
    { title: 'Misty Pine Lookback', image: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800&auto=format&fit=crop&q=80', tag: 'Atmospheric' },
  ],
};

export function RecommendationsSection() {
  const [selectedScene, setSelectedScene] = useState('city');
  const [selectedOutfit, setSelectedOutfit] = useState('casual');

  const poses = GENERATED_POSES[selectedScene] || GENERATED_POSES.city;

  return (
    <section className="relative py-32 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface border border-primary/30 text-primary text-xs font-black tracking-widest uppercase mb-4 shadow-neon-lime">
            <Sparkles className="w-3.5 h-3.5" />
            Context-Aware Discovery
          </div>
          <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-textPrimary">
            AI RECOMMENDATION <span className="text-primary text-glow">ENGINE.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-textSecondary">
            Tell POSEHANUM where you are and what you are wearing — get 3 tailored poses matched instantly.
          </p>
        </div>

        {/* Interactive Selectors */}
        <div className="max-w-4xl mx-auto p-8 rounded-[36px] bg-secondaryBg border-2 border-surfaceBorder shadow-2xl mb-16">
          <div className="mb-8">
            <span className="text-xs font-mono font-black text-primary tracking-widest uppercase mb-3 block">
              STEP 01 // WHERE ARE YOU SHOOTING?
            </span>
            <div className="flex flex-wrap gap-3">
              {SCENES.map((scene) => (
                <button
                  key={scene.id}
                  onClick={() => setSelectedScene(scene.id)}
                  aria-label={`Select scene ${scene.label}`}
                  className={`px-5 py-3 rounded-2xl text-sm font-bold transition-all ${
                    selectedScene === scene.id
                      ? 'bg-primary text-background font-black shadow-neon-lime scale-105'
                      : 'bg-surface border border-surfaceBorder text-textSecondary hover:text-textPrimary'
                  }`}
                >
                  {scene.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="text-xs font-mono font-black text-cyanAccent tracking-widest uppercase mb-3 block">
              STEP 02 // WHAT ARE YOU WEARING?
            </span>
            <div className="flex flex-wrap gap-3">
              {OUTFITS.map((outfit) => (
                <button
                  key={outfit.id}
                  onClick={() => setSelectedOutfit(outfit.id)}
                  aria-label={`Select outfit ${outfit.label}`}
                  className={`px-5 py-3 rounded-2xl text-sm font-bold transition-all ${
                    selectedOutfit === outfit.id
                      ? 'bg-cyanAccent text-background font-black shadow-neon-cyan scale-105'
                      : 'bg-surface border border-surfaceBorder text-textSecondary hover:text-textPrimary'
                  }`}
                >
                  {outfit.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 3 Output Poses */}
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-black uppercase text-textPrimary flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              3 Poses Handpicked for You
            </h3>
            <span className="text-xs font-mono font-bold text-textSecondary uppercase">
              Match Engine v1.0
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {poses.map((pose, idx) => (
              <motion.div
                key={pose.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group relative rounded-[28px] overflow-hidden border border-surfaceBorder bg-surface hover:border-primary/60 transition-all duration-300 shadow-card-dark"
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden">
                  <Image
                    src={pose.image}
                    alt={pose.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 320px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E0C] via-transparent to-transparent" />
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#0A0E0C]/80 backdrop-blur-md text-[10px] font-black uppercase text-primary border border-primary/30">
                    {pose.tag}
                  </span>
                </div>

                <div className="p-5">
                  <h4 className="text-lg font-black text-textPrimary uppercase">{pose.title}</h4>
                  <a
                    href="#download"
                    className="mt-3 w-full py-2.5 rounded-xl bg-surface border border-surfaceBorder group-hover:bg-primary group-hover:text-background text-xs font-bold uppercase transition-colors flex items-center justify-center gap-1.5"
                  >
                    Try This Pose <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
