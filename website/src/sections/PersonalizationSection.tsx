'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Brain,
  Lock,
  Sparkles,
  Heart,
  Camera,
  XCircle,
  Share2,
  RefreshCw,
  Compass,
  CheckCircle2,
  Sliders,
  Layers,
} from 'lucide-react';

const EVOLUTION_STAGES = [
  {
    step: '01',
    label: 'Initial Library',
    tagline: '“Here are some poses.”',
    description: 'Browse 15 curated photography categories with 100+ standard reference poses for travel, street, and portraits.',
    status: 'Baseline Catalog',
  },
  {
    step: '02',
    label: 'Session Context',
    tagline: '“Poses picked for this moment.”',
    description: 'Calculates location, outfit type, camera distance, and lighting in real time to filter the 3 highest-potential poses.',
    status: 'Context Engine',
  },
  {
    step: '03',
    label: 'Learned Profile',
    tagline: '“POSEHANUM understands your style.”',
    description: 'Continuously updates an on-device preference vector based on poses you capture, favorite, skip, or achieve 90%+ match scores on.',
    status: 'Active ML Vector',
  },
];

const PREFERENCE_SCORES = [
  { label: 'Mountain & Travel Scenery', score: 91, color: '#B7FF00' },
  { label: 'Natural / Candid Expressions', score: 94, color: '#B7FF00' },
  { label: 'Standing & Leaning Postures', score: 88, color: '#00D9FF' },
  { label: 'Side & 3/4 Camera Angles', score: 86, color: '#00D9FF' },
  { label: 'Casual / Streetwear Fits', score: 92, color: '#FF8A00' },
];

const SIGNAL_TRIGGERS = [
  { icon: Camera, name: 'Photo Captured', weight: '+1.00 weight', desc: 'Strong positive reinforcement' },
  { icon: Heart, name: 'Pose Favorited', weight: '+0.80 weight', desc: 'Explicit user preference bookmark' },
  { icon: Share2, name: 'Photo Shared', weight: '+0.60 weight', desc: 'High visual satisfaction signal' },
  { icon: XCircle, name: 'Pose Skipped (<3s)', weight: '-0.35 weight', desc: 'Soft penalty to avoid repetition' },
];

export function PersonalizationSection() {
  const [activeStage, setActiveStage] = useState(2);

  return (
    <section id="personalization" className="relative py-32 bg-secondaryBg overflow-hidden border-t border-b border-surfaceBorder">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface border border-primary/30 text-primary text-xs font-black tracking-widest uppercase mb-4 shadow-neon-lime">
            <Brain className="w-3.5 h-3.5" />
            Privacy-First Machine Learning
          </div>
          <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-textPrimary leading-[0.95]">
            FROM STATIC POSES TO <br />
            <span className="text-primary text-glow">YOUR SIGNATURE STYLE.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-textSecondary">
            POSEHANUM evolves from showing standard references to deeply understanding what compositions make you look your best.
          </p>
        </div>

        {/* 3-Stage Evolution Pipeline Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 max-w-5xl mx-auto">
          {EVOLUTION_STAGES.map((stg, idx) => (
            <button
              key={stg.step}
              onClick={() => setActiveStage(idx)}
              className={`p-6 rounded-3xl border text-left transition-all duration-300 ${
                activeStage === idx
                  ? 'bg-surface border-primary shadow-neon-lime -translate-y-1'
                  : 'bg-surface/50 border-surfaceBorder text-textSecondary hover:border-textSecondary'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold text-primary uppercase">
                  STAGE {stg.step}
                </span>
                <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                  activeStage === idx ? 'bg-primary/20 text-primary border border-primary/40' : 'bg-secondaryBg text-textMuted'
                }`}>
                  {stg.status}
                </span>
              </div>
              <h3 className="text-lg font-black text-textPrimary uppercase">
                {stg.tagline}
              </h3>
              <p className="text-xs font-medium text-textSecondary mt-2 leading-relaxed">
                {stg.description}
              </p>
            </button>
          ))}
        </div>

        {/* Interactive Neural Network & Behavior Signals Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left: Dynamic Neural Vector Node Map */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="relative w-full max-w-md aspect-square rounded-[36px] bg-[#0A0E0C] border-2 border-primary/30 shadow-neon-lime p-6 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                <div className="w-72 h-72 border border-primary rounded-full animate-ping" />
                <div className="w-48 h-48 border border-cyanAccent rounded-full" />
              </div>

              <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                <line x1="50%" y1="50%" x2="20%" y2="25%" stroke="#B7FF00" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="50%" y1="50%" x2="80%" y2="25%" stroke="#00D9FF" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="50%" y1="50%" x2="15%" y2="70%" stroke="#B7FF00" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="50%" y1="50%" x2="85%" y2="70%" stroke="#FF8A00" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="50%" y1="50%" x2="50%" y2="15%" stroke="#00D9FF" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="50%" y1="50%" x2="50%" y2="85%" stroke="#FF8A00" strokeWidth="1" strokeDasharray="3 3" />
              </svg>

              <div className="relative z-10 w-24 h-24 rounded-full bg-primary flex flex-col items-center justify-center text-[#0A0E0C] shadow-neon-lime">
                <span className="text-[10px] font-black tracking-widest uppercase">STYLE</span>
                <span className="text-xl font-black">YOU</span>
              </div>

              {/* Surrounding Nodes */}
              {[
                { label: 'Pose Angle', x: '80%', y: '25%', color: '#00D9FF' },
                { label: 'Category EMA', x: '20%', y: '25%', color: '#B7FF00' },
                { label: 'Outfit Context', x: '85%', y: '70%', color: '#FF8A00' },
                { label: 'Match Scores', x: '15%', y: '70%', color: '#B7FF00' },
                { label: 'Favorites', x: '50%', y: '15%', color: '#00D9FF' },
                { label: 'Capture Habit', x: '50%', y: '85%', color: '#FF8A00' },
              ].map((node) => (
                <div
                  key={node.label}
                  className="absolute z-10 px-3 py-1.5 rounded-full bg-surface border backdrop-blur-md text-[11px] font-extrabold uppercase shadow-lg transform -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: node.x,
                    top: node.y,
                    borderColor: `${node.color}50`,
                    color: node.color,
                  }}
                >
                  {node.label}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Learned Vector Bars & Behavioral Ingestion Signals */}
          <div className="lg:col-span-6 space-y-6">
            <div className="p-8 rounded-3xl bg-surface border border-surfaceBorder space-y-5">
              <div className="flex items-center justify-between border-b border-surfaceBorder/80 pb-4">
                <div>
                  <h3 className="text-lg font-black text-textPrimary uppercase">Your Learned Style Vector</h3>
                  <p className="text-xs font-bold text-textSecondary">
                    8-Factor Candidate Scoring Engine (80% Exploit / 20% Explore)
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-primary/20 text-primary font-mono text-xs font-black">
                  ON-DEVICE v1.0
                </span>
              </div>

              <div className="space-y-3">
                {PREFERENCE_SCORES.map((item) => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between text-xs font-bold uppercase mb-1">
                      <span className="text-textPrimary">{item.label}</span>
                      <span className="font-mono font-black" style={{ color: item.color }}>
                        {item.score}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-[#0A0E0C] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${item.score}%`, backgroundColor: item.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Interaction Signal Cards */}
            <div className="grid grid-cols-2 gap-3">
              {SIGNAL_TRIGGERS.map((sig) => {
                const Icon = sig.icon;
                return (
                  <div key={sig.name} className="p-3.5 rounded-2xl bg-surface/60 border border-surfaceBorder flex items-start gap-2.5">
                    <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-extrabold text-textPrimary">{sig.name}</div>
                      <div className="text-[10px] font-mono text-primary font-bold">{sig.weight}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Privacy Guarantee Disclosure */}
            <div className="p-4 rounded-2xl bg-[#0A0E0C] border border-surfaceBorder/80 flex items-center justify-between text-xs text-textSecondary gap-4">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-primary shrink-0" />
                <span>
                  <strong>Zero Cloud Profiling:</strong> Preference vectors are stored in synchronous local MMKV. You can toggle off or reset recommendation history instantly in Settings.
                </span>
              </div>
              <span className="text-[10px] font-mono text-cyanAccent uppercase font-bold shrink-0 border border-cyanAccent/30 px-2 py-1 rounded-md">
                100% OFFLINE
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
