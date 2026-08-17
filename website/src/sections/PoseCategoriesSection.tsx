'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Compass, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { SNAP_POSE_CATEGORIES } from '../data/categoriesData';

export function PoseCategoriesSection() {
  return (
    <section id="categories" className="relative py-32 bg-secondaryBg overflow-hidden border-t border-b border-surfaceBorder">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface border border-primary/30 text-primary text-xs font-black tracking-widest uppercase mb-4 shadow-neon-lime">
              <Compass className="w-3.5 h-3.5" />
              15 Curated Photography Styles
            </div>
            <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-textPrimary">
              EXPLORE POSE <span className="text-primary text-glow">COLLECTIONS.</span>
            </h2>
          </div>
          <p className="text-textSecondary text-base max-w-md">
            From mountain summits and casual cafes to high fashion runways and romantic couple candids.
          </p>
        </div>

        {/* Mobile Horizontal Snap Carousel + Desktop Grid */}
        <div className="flex md:grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 overflow-x-auto md:overflow-visible pb-4 md:pb-0 snap-x mandatory md:snap-none [-webkit-overflow-scrolling:touch]">
          {SNAP_POSE_CATEGORIES.map((cat, idx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (idx % 5) * 0.06 }}
              className="group relative flex-none w-[78vw] sm:w-[320px] md:w-auto snap-start rounded-[28px] overflow-hidden border border-surfaceBorder bg-surface hover:border-primary transition-all duration-500 shadow-card-dark flex flex-col justify-between"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 768px) 78vw, (max-width: 1200px) 25vw, 240px"
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E0C] via-[#0A0E0C]/30 to-transparent" />

                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-[#0A0E0C]/80 backdrop-blur-md text-[10px] font-mono font-bold text-textPrimary border border-surfaceBorder">
                    {cat.totalPoses} POSES
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-black text-textPrimary uppercase group-hover:text-primary transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-textSecondary line-clamp-2 mt-1">
                    {cat.subtitle}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-[#0A0E0C]">
                <a
                  href="#download"
                  aria-label={`Explore ${cat.name} poses collection`}
                  className="w-full py-2.5 rounded-xl bg-surface border border-surfaceBorder group-hover:bg-primary group-hover:text-[#0A0E0C] text-xs font-extrabold uppercase transition-all duration-300 flex items-center justify-center gap-1.5"
                >
                  Explore Poses <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
