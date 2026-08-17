'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  Mic,
  Zap,
  Maximize2,
  Sun,
  Smile,
  Eye,
  Focus,
  Box,
  Compass,
  Brain,
  WifiOff,
  Sparkles,
  Lock,
  Layers,
  Heart,
  Sliders,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'All 30 Capabilities' },
  { id: 'camera', label: 'Vision & Viewfinder' },
  { id: 'context', label: 'Discovery & 3D' },
  { id: 'ml', label: 'Personalization ML' },
  { id: 'privacy', label: 'Privacy & Offline' },
];

const FULL_FEATURE_SET = [
  // Vision & Viewfinder
  { id: 1, title: 'Pose Reference System', category: 'camera', desc: 'Curated 100+ editorial guides for men, women, and couples.', icon: Compass, status: 'Production v1.0', color: '#B7FF00' },
  { id: 2, title: 'Live Camera Ghost Overlay', category: 'camera', desc: 'Semi-transparent reference silhouette over the live feed.', icon: Layers, status: 'Production v1.0', color: '#00D9FF' },
  { id: 3, title: 'Pose Match Score (0–100%)', category: 'camera', desc: '60 FPS real-time calculation comparing 33 joint angles.', icon: Activity, status: 'Production v1.0', color: '#B7FF00' },
  { id: 4, title: 'Real-Time Pose Detection', category: 'camera', desc: 'Sub-millimeter anatomical keypoint tracking via MediaPipe.', icon: Focus, status: 'Production v1.0', color: '#00D9FF' },
  { id: 5, title: 'AR Skeleton Wireframe', category: 'camera', desc: 'Glowing vector bone connections with dynamic green lock cues.', icon: Focus, status: 'Production v1.0', color: '#B7FF00' },
  { id: 6, title: 'Adaptive Voice Coaching', category: 'camera', desc: 'Whispers posture corrections into your ear in real time.', icon: Mic, status: 'Production v1.0', color: '#00D9FF' },
  { id: 7, title: 'Intelligent Auto-Capture', category: 'camera', desc: 'Hands-free shutter trigger when 94%+ match is sustained for 2s.', icon: Zap, status: 'Production v1.0', color: '#B7FF00' },
  { id: 8, title: 'Smart Distance & Framing', category: 'camera', desc: 'Head-to-torso ratio tracking to avoid wide-angle facial distortion.', icon: Maximize2, status: 'Production v1.0', color: '#FF8A00' },
  { id: 9, title: 'Dynamic Lighting Guidance', category: 'camera', desc: 'Histogram luminosity analysis directing you to the softest light.', icon: Sun, status: 'Production v1.0', color: '#B7FF00' },
  { id: 10, title: 'Candid Smile Detection', category: 'camera', desc: 'Captures authentic micro-expressions rather than forced smiles.', icon: Smile, status: 'Production v1.0', color: '#00D9FF' },
  { id: 11, title: 'Lens Eye-Contact Lock', category: 'camera', desc: 'Monitors gaze vector so your eyes connect directly with the camera.', icon: Eye, status: 'Production v1.0', color: '#00D9FF' },

  // Discovery & 3D
  { id: 12, title: 'AI Pose Recommendations', category: 'context', desc: 'Curates 3 ideal poses tailored to your current environment.', icon: Sparkles, status: 'Production v1.0', color: '#B7FF00' },
  { id: 13, title: 'Location-Aware Framing', category: 'context', desc: 'Tailors compositions for Beach, Mountain, Cafe, City, or Nature.', icon: Compass, status: 'Production v1.0', color: '#FF8A00' },
  { id: 14, title: 'Outfit-Aware Posing', category: 'context', desc: 'Adapts angles for Streetwear, Casual, Formal, or Traditional attire.', icon: Layers, status: 'Production v1.0', color: '#00D9FF' },
  { id: 15, title: '3D Pose Rotator', category: 'context', desc: 'Inspect pose angles from 360° before stepping in front of the lens.', icon: Box, status: 'Production v1.0', color: '#B7FF00' },
  { id: 22, title: 'Cold-Start Baseline Quiz', category: 'context', desc: 'Instant 3-question match survey delivering zero-delay recommendations.', icon: CheckCircle2, status: 'Production v1.0', color: '#00D9FF' },
  { id: 27, title: 'Context-Aware Filter Chain', category: 'context', desc: 'Harmonizes scene, lighting, and wardrobe into a single match rank.', icon: Sliders, status: 'Production v1.0', color: '#FF8A00' },

  // Personalization ML
  { id: 16, title: 'Personalized ML Recommendations', category: 'ml', desc: 'Candidate generator prioritizing your unique aesthetic preferences.', icon: Brain, status: 'Production v1.0', color: '#B7FF00' },
  { id: 17, title: 'User Behavior Learning', category: 'ml', desc: 'Updates style weights via Exponential Moving Average (EMA).', icon: TrendingUp, status: 'Production v1.0', color: '#00D9FF' },
  { id: 18, title: 'Favorite/Skip/Capture Signals', category: 'ml', desc: 'Weighted ingestion (+1.0 capture, +0.8 fav, -0.35 fast skip).', icon: Heart, status: 'Production v1.0', color: '#FF8A00' },
  { id: 19, title: 'Match-Score Learning', category: 'ml', desc: 'Identifies which pose difficulty levels you naturally excel at.', icon: Activity, status: 'Production v1.0', color: '#B7FF00' },
  { id: 20, title: 'Short-Term Session Memory', category: 'ml', desc: 'In-memory fast cache avoiding repeated poses in the same shoot.', icon: Layers, status: 'Production v1.0', color: '#00D9FF' },
  { id: 21, title: 'Long-Term Preference Vectors', category: 'ml', desc: 'Persistent MMKV vector that deepens your style profile over time.', icon: Brain, status: 'Production v1.0', color: '#B7FF00' },
  { id: 23, title: 'Recommendation Diversity (80/20)', category: 'ml', desc: '80% familiar favorites blended with 20% creative discovery poses.', icon: Sparkles, status: 'Production v1.0', color: '#FF8A00' },
  { id: 24, title: 'Explicit User Feedback', category: 'ml', desc: 'Direct pose favoriting and category pinning for instant fine-tuning.', icon: Heart, status: 'Production v1.0', color: '#00D9FF' },
  { id: 25, title: 'Personalized Audio Cadence', category: 'ml', desc: 'Adjusts spoken guidance pace to match your alignment speed.', icon: Mic, status: 'Production v1.0', color: '#B7FF00' },
  { id: 26, title: 'Difficulty Adaptation', category: 'ml', desc: 'Begins with beginner-friendly poses and unlocks dynamic editorial stances.', icon: TrendingUp, status: 'Production v1.0', color: '#00D9FF' },

  // Privacy & Offline
  { id: 28, title: 'Granular Privacy Controls', category: 'privacy', desc: '1-click recommendation reset & data erasure in Settings.', icon: Lock, status: 'Production v1.0', color: '#B7FF00' },
  { id: 29, title: '100% Offline AI Inference', category: 'privacy', desc: 'Zero cloud latency. Runs fully in airplane mode with zero mobile data.', icon: WifiOff, status: 'Production v1.0', color: '#00D9FF' },
  { id: 30, title: 'Privacy-First Camera Processing', category: 'privacy', desc: 'Live camera frames never leave RAM; zero biometric storage or cloud uploads.', icon: ShieldCheck, status: 'Production v1.0', color: '#B7FF00' },
];

export function FeaturesGridSection() {
  const [activeCat, setActiveCat] = useState('all');

  const filteredFeatures =
    activeCat === 'all'
      ? FULL_FEATURE_SET
      : FULL_FEATURE_SET.filter((f) => f.category === activeCat);

  return (
    <section className="relative py-32 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface border border-primary/30 text-primary text-xs font-black tracking-widest uppercase mb-4 shadow-neon-lime">
            <Sparkles className="w-3.5 h-3.5" />
            Complete Feature Matrix (30 Capabilities)
          </div>
          <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-textPrimary">
            COMPLETE ARCHITECTURE. <br />
            <span className="text-primary text-glow">ZERO GAPS.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-textSecondary">
            From real-time 33-point computer vision to on-device behavioral learning and strict offline privacy.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-14">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCat(cat.id)}
              className={`px-5 py-2.5 rounded-2xl text-xs font-bold uppercase transition-all ${
                activeCat === cat.id
                  ? 'bg-primary text-background font-black shadow-neon-lime scale-105'
                  : 'bg-surface border border-surfaceBorder text-textSecondary hover:text-textPrimary'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredFeatures.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (idx % 8) * 0.04 }}
                className="group p-5 rounded-3xl bg-surface border border-surfaceBorder hover:border-primary/60 transition-all duration-300 shadow-card-dark flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                      style={{
                        backgroundColor: `${feat.color}15`,
                        color: feat.color,
                        border: `1px solid ${feat.color}40`,
                      }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-textMuted uppercase bg-[#0A0E0C] px-2 py-0.5 rounded border border-surfaceBorder">
                      #{feat.id.toString().padStart(2, '0')}
                    </span>
                  </div>

                  <h3 className="text-base font-black text-textPrimary uppercase group-hover:text-primary transition-colors">
                    {feat.title}
                  </h3>
                  <p className="mt-1.5 text-xs font-medium text-textSecondary leading-relaxed">
                    {feat.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-surfaceBorder/60 flex items-center justify-between">
                  <span className="text-[10px] font-mono font-black text-primary uppercase">
                    {feat.status}
                  </span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
