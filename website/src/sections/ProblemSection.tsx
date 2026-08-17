'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, XCircle, CheckCircle2 } from 'lucide-react';

export function ProblemSection() {
  const painPoints = [
    { label: 'The Spot', text: 'You found the most aesthetic viewpoint in the city.', status: 'Ready' },
    { label: 'The Outfit', text: 'You spent 30 minutes curating the perfect fit.', status: 'Ready' },
    { label: 'The Light', text: 'Golden hour is peaking right in front of you.', status: 'Ready' },
    { label: 'The Pose', text: '“Wait... what do I do with my hands? How do I stand?”', status: 'Awkward & Unnatural', isPain: true },
  ];

  return (
    <section className="relative py-32 bg-secondaryBg overflow-hidden border-t border-b border-surfaceBorder">
      <div className="absolute inset-0 bg-grid-pattern opacity-40" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface border border-orangeAccent/30 text-orangeAccent text-xs font-black tracking-widest uppercase mb-4"
          >
            <Sparkles className="w-3.5 h-3.5" />
            The Photo Struggle
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-textPrimary leading-none"
          >
            YOU KNOW THE PLACE. <br />
            <span className="text-textSecondary">YOU PICKED THE OUTFIT.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-lg text-textSecondary"
          >
            The scenery is breathtaking. The lighting is immaculate. You just freeze the moment the camera opens.
          </motion.p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {painPoints.map((item, idx) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`p-6 rounded-3xl border transition-all duration-300 ${
                item.isPain
                  ? 'bg-[#181111] border-red-500/40 shadow-[0_0_30px_rgba(239,68,68,0.15)]'
                  : 'bg-surface border-surfaceBorder hover:border-primary/40'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-bold text-textSecondary uppercase tracking-wider">
                  0{idx + 1} // {item.label}
                </span>
                {item.isPain ? (
                  <XCircle className="w-5 h-5 text-red-400" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                )}
              </div>
              <p className={`text-base font-bold ${item.isPain ? 'text-red-200' : 'text-textPrimary'}`}>
                {item.text}
              </p>
              <div className="mt-6 pt-4 border-t border-surfaceBorder/60 flex items-center justify-between text-xs font-extrabold uppercase">
                <span className="text-textMuted">Status:</span>
                <span className={item.isPain ? 'text-red-400' : 'text-primary'}>
                  {item.status}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* The Solution */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-16 p-8 sm:p-12 rounded-[32px] bg-gradient-to-r from-[#152317] via-[#101E17] to-[#151D18] border-2 border-primary/40 shadow-neon-lime text-center max-w-3xl mx-auto"
        >
          <h3 className="text-3xl sm:text-5xl font-black uppercase text-primary tracking-tight">
            WE FIX THAT.
          </h3>
          <p className="mt-3 text-textPrimary font-medium text-base sm:text-lg">
            POSEHANUM projects live pose silhouettes over your camera viewfinder, gives real-time voice corrections, and snaps the shutter hands-free when your posture hits perfection.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
