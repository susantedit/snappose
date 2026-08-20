'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from 'framer-motion';
import { Camera, Sparkles, ChevronDown } from 'lucide-react';
import Image from 'next/image';

export function HeroScrollExperience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 26,
    restDelta: 0.001,
  });

  // Derived animation states based on scroll progress (0.0 to 1.0)
  const heroBackgroundBlur = useTransform(smoothProgress, [0, 0.14], ['blur(20px)', 'blur(0px)']);
  const heroBlurLayerOpacity = useTransform(smoothProgress, [0, 0.12, 0.16], [1, 0.5, 0]);
  const heroBackdropShade = useTransform(smoothProgress, [0, 0.14], ['rgba(10, 14, 12, 0.7)', 'rgba(10, 14, 12, 0)']);

  const imageOpacity = useTransform(smoothProgress, [0.04, 0.18], [0.1, 1]);
  const cameraFrameScale = useTransform(smoothProgress, [0.12, 0.28], [0.88, 1]);
  const overlayOpacity = useTransform(smoothProgress, [0.24, 0.38], [0, 0.85]);
  const skeletonOpacity = useTransform(smoothProgress, [0.35, 0.48], [0, 1]);
  const scoreNumber = useTransform(smoothProgress, [0.45, 0.55, 0.68, 0.8], [72, 84, 94, 98]);
  const isPerfectPose = useTransform(smoothProgress, [0.76, 0.88], [0, 1]);
  
  // Iris/Aperture blade animation & lens bloom
  const irisBladeScale = useTransform(smoothProgress, [0.82, 0.89, 0.94], [1.4, 0.2, 1.4]);
  const flashOpacity = useTransform(smoothProgress, [0.87, 0.91, 0.96], [0, 0.98, 0]);
  const lensBloomOpacity = useTransform(smoothProgress, [0.85, 0.90, 0.96], [0, 0.8, 0]);
  const finalPhotoScale = useTransform(smoothProgress, [0.91, 1.0], [0.95, 1]);
  
  // Pinned container smooth exit easing into next section
  const sectionExitOpacity = useTransform(smoothProgress, [0.94, 1.0], [1, 0.85]);
  const sectionExitScale = useTransform(smoothProgress, [0.94, 1.0], [1, 0.97]);

  const [currentScore, setCurrentScore] = useState(72);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    return scoreNumber.on('change', (latest) => {
      setCurrentScore(Math.round(latest));
    });
  }, [scoreNumber]);

  useEffect(() => {
    return isPerfectPose.on('change', (latest) => {
      setIsSuccess(latest > 0.5);
    });
  }, [isPerfectPose]);

  return (
    <section ref={containerRef} className="relative h-[390vh] bg-[#0A0E0C]">
      {/* Sticky Cinematic Screen Viewport */}
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden">
        {/* Ambient Parallax Particles / Glows */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-[128px] pointer-events-none" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-cyanAccent/10 rounded-full blur-[128px] pointer-events-none" />

        {/* Dynamic Frosted Background Blur Overlay (Active at Top, Clears on Scroll) */}
        <motion.div
          style={{
            opacity: heroBlurLayerOpacity,
            backdropFilter: heroBackgroundBlur,
            WebkitBackdropFilter: heroBackgroundBlur,
            backgroundColor: heroBackdropShade,
          }}
          className="absolute inset-0 z-25 pointer-events-none transition-all"
        />

        {/* Top Hero Copy */}
        <motion.div
          style={{
            opacity: useTransform(smoothProgress, [0, 0.18], [1, 0]),
            translateY: useTransform(smoothProgress, [0, 0.18], [0, -40]),
          }}
          className="absolute top-20 z-30 text-center px-4 max-w-4xl mx-auto pointer-events-none"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface border border-primary/30 text-primary text-xs font-black tracking-widest uppercase mb-4 shadow-neon-lime">
            <Sparkles className="w-3.5 h-3.5" />
            AI Photography Coach
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter uppercase leading-[0.92] text-textPrimary">
            STOP SAYING <br />
            <span className="text-primary text-glow">&ldquo;I DON&rsquo;T KNOW HOW TO POSE.&rdquo;</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-textSecondary font-medium max-w-2xl mx-auto">
            POSEHANUM is your visual path to the perfect shot. Real-time visual overlay, AI voice coaching, and instant auto capture.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 pointer-events-auto">
            <a
              href="#download"
              className="px-8 py-3.5 rounded-full bg-primary hover:bg-primary-hover text-[#0A0E0C] font-black text-sm tracking-wider uppercase transition-all duration-300 shadow-neon-lime flex items-center gap-2"
            >
              <Camera className="w-4 h-4" /> Try POSEHANUM Free
            </a>
            <a
              href="#how-it-works"
              className="px-8 py-3.5 rounded-full bg-surface hover:bg-secondaryBg border border-surfaceBorder text-textPrimary font-bold text-sm tracking-wider uppercase transition-colors"
            >
              See How It Works
            </a>
          </div>
        </motion.div>

        {/* Centerpiece Viewfinder Container */}
        <motion.div
          style={{
            scale: shouldReduceMotion ? 1 : cameraFrameScale,
            opacity: sectionExitOpacity,
          }}
          className="relative w-[90vw] max-w-[420px] aspect-[9/16] max-h-[74vh] rounded-[38px] bg-[#111814] border-2 border-surfaceBorder/80 shadow-[0_0_60px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col justify-between p-5 z-20 [will-change:transform]"
        >
          {/* Base Photo Subject Layer */}
          <motion.div
            style={{
              opacity: imageOpacity,
              scale: shouldReduceMotion ? 1 : finalPhotoScale,
              filter: heroBackgroundBlur,
            }}
            className="absolute inset-0 z-0"
          >
            <Image
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=900&auto=format&fit=crop&q=80"
              alt="Live Camera Subject"
              fill
              sizes="(max-width: 480px) 90vw, 420px"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E0C]/90 via-transparent to-[#0A0E0C]/40" />
          </motion.div>

          {/* Semi-Transparent Ghost Reference Overlay */}
          <motion.div
            style={{ opacity: overlayOpacity }}
            className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center p-3"
          >
            <div className="w-full h-full border-2 border-dashed border-cyanAccent/70 rounded-3xl flex items-center justify-center relative">
              <span className="text-[10px] font-black tracking-widest text-cyanAccent bg-[#0A0E0C]/85 px-3 py-1 rounded-full uppercase absolute top-12 border border-cyanAccent/40 shadow-sm">
                Ghost Reference Overlay
              </span>
            </div>
          </motion.div>

          {/* MediaPipe AI Skeleton Keypoint Connections */}
          <motion.svg
            style={{ opacity: skeletonOpacity }}
            className="absolute inset-0 w-full h-full z-10 pointer-events-none"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <line x1="50" y1="20" x2="40" y2="30" stroke={isSuccess ? '#B7FF00' : '#00D9FF'} strokeWidth="1.2" strokeDasharray={isSuccess ? '0' : '2 2'} />
            <line x1="50" y1="20" x2="60" y2="30" stroke={isSuccess ? '#B7FF00' : '#00D9FF'} strokeWidth="1.2" strokeDasharray={isSuccess ? '0' : '2 2'} />
            <line x1="40" y1="30" x2="60" y2="30" stroke={isSuccess ? '#B7FF00' : '#00D9FF'} strokeWidth="1.2" />
            <line x1="40" y1="30" x2="32" y2="45" stroke={isSuccess ? '#B7FF00' : '#00D9FF'} strokeWidth="1.2" />
            <line x1="60" y1="30" x2="68" y2="45" stroke={isSuccess ? '#B7FF00' : '#00D9FF'} strokeWidth="1.2" />
            <line x1="32" y1="45" x2="28" y2="58" stroke={isSuccess ? '#B7FF00' : '#00D9FF'} strokeWidth="1.2" />
            <line x1="68" y1="45" x2="72" y2="58" stroke={isSuccess ? '#B7FF00' : '#00D9FF'} strokeWidth="1.2" />
            <line x1="45" y1="58" x2="55" y2="58" stroke={isSuccess ? '#B7FF00' : '#00D9FF'} strokeWidth="1.2" />
            <line x1="45" y1="58" x2="42" y2="78" stroke={isSuccess ? '#B7FF00' : '#00D9FF'} strokeWidth="1.2" />
            <line x1="55" y1="58" x2="58" y2="78" stroke={isSuccess ? '#B7FF00' : '#00D9FF'} strokeWidth="1.2" />

            <circle cx="50" cy="20" r="2.5" fill="#FFFFFF" stroke={isSuccess ? '#B7FF00' : '#00D9FF'} strokeWidth="1" />
            <circle cx="40" cy="30" r="2" fill={isSuccess ? '#B7FF00' : '#00D9FF'} />
            <circle cx="60" cy="30" r="2" fill={isSuccess ? '#B7FF00' : '#00D9FF'} />
            <circle cx="32" cy="45" r="2" fill={isSuccess ? '#B7FF00' : '#00D9FF'} />
            <circle cx="68" cy="45" r="2" fill={isSuccess ? '#B7FF00' : '#00D9FF'} />
            <circle cx="28" cy="58" r="2.2" fill={isSuccess ? '#B7FF00' : '#00D9FF'} />
            <circle cx="72" cy="58" r="2.2" fill={isSuccess ? '#B7FF00' : '#00D9FF'} />
            <circle cx="45" cy="58" r="2" fill={isSuccess ? '#B7FF00' : '#00D9FF'} />
            <circle cx="55" cy="58" r="2" fill={isSuccess ? '#B7FF00' : '#00D9FF'} />
            <circle cx="42" cy="78" r="2" fill={isSuccess ? '#B7FF00' : '#00D9FF'} />
            <circle cx="58" cy="78" r="2" fill={isSuccess ? '#B7FF00' : '#00D9FF'} />
          </motion.svg>

          {/* Reticle Camera HUD Ticks */}
          <div className="absolute inset-8 pointer-events-none border border-white/10 rounded-2xl flex flex-col justify-between p-2">
            <div className="flex justify-between">
              <div className="w-2.5 h-2.5 border-t-2 border-l-2 border-primary/70" />
              <div className="w-2.5 h-2.5 border-t-2 border-r-2 border-primary/70" />
            </div>
            <div className="flex justify-between">
              <div className="w-2.5 h-2.5 border-b-2 border-l-2 border-primary/70" />
              <div className="w-2.5 h-2.5 border-b-2 border-r-2 border-primary/70" />
            </div>
          </div>

          {/* Top HUD: Status Bar & Match Indicator */}
          <div className="relative z-20 flex items-center justify-between">
            <div className="flex items-center gap-2 bg-[#0A0E0C]/85 backdrop-blur-md px-3 py-1.5 rounded-full border border-surfaceBorder shadow-sm">
              <div className={`w-2 h-2 rounded-full ${isSuccess ? 'bg-primary animate-ping' : 'bg-cyanAccent animate-pulse'}`} />
              <span className="text-[11px] font-black tracking-wider uppercase text-textPrimary">
                {isSuccess ? 'LOCKED IN' : 'AI TRACKING'}
              </span>
            </div>

            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-md font-black text-xs border transition-colors duration-300 ${
              isSuccess ? 'bg-primary/20 text-primary border-primary shadow-neon-lime' : 'bg-surface/80 text-textPrimary border-surfaceBorder'
            }`}>
              <span>MATCH</span>
              <span className="text-sm font-mono">{currentScore}%</span>
            </div>
          </div>

          {/* Bottom HUD: Dynamic AI Voice Coaching Prompt */}
          <div className="relative z-20 space-y-3">
            <motion.div
              style={{
                opacity: useTransform(smoothProgress, [0.35, 0.45], [0, 1]),
              }}
              className="bg-[#0A0E0C]/90 backdrop-blur-xl p-3 rounded-2xl border border-surfaceBorder/80 flex items-center gap-3 shadow-lg"
            >
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-[10px] font-bold text-textSecondary uppercase tracking-wider">AI Voice Coach</div>
                <div className="text-xs font-bold text-textPrimary">
                  {currentScore < 85 ? '“Shift your left shoulder slightly back”' : '“Perfect silhouette! Hold still for capture...”'}
                </div>
              </div>
            </motion.div>

            {/* Shutter Button Representation */}
            <div className="flex items-center justify-center pt-1">
              <div className={`w-14 h-14 rounded-full border-4 flex items-center justify-center transition-all duration-300 ${
                isSuccess ? 'border-primary scale-110 shadow-neon-lime bg-primary/20' : 'border-textPrimary/40'
              }`}>
                <div className={`w-10 h-10 rounded-full transition-colors duration-300 ${
                  isSuccess ? 'bg-primary' : 'bg-textPrimary'
                }`} />
              </div>
            </div>
          </div>

          {/* Camera Aperture / Iris Blades Closing Animation */}
          <motion.div
            style={{
              scale: irisBladeScale,
              opacity: useTransform(smoothProgress, [0.83, 0.88, 0.94], [0, 1, 0]),
            }}
            className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none"
          >
            <div className="w-80 h-80 rounded-full border-[60px] border-[#0A0E0C] opacity-90 shadow-2xl" />
          </motion.div>

          {/* Radial Lens Bloom Flare */}
          <motion.div
            style={{ opacity: lensBloomOpacity }}
            className="absolute inset-0 z-45 bg-[radial-gradient(circle_at_center,_rgba(183,255,0,0.6)_0%,_rgba(0,217,255,0.4)_40%,_transparent_75%)] pointer-events-none"
          />

          {/* Camera Shutter Flash Overlay */}
          <motion.div
            style={{ opacity: flashOpacity }}
            className="absolute inset-0 bg-white z-50 pointer-events-none"
          />
        </motion.div>

        {/* Scroll Progress Timeline */}
        <div className="absolute bottom-6 z-30 flex items-center gap-4 bg-surface/85 backdrop-blur-md px-5 py-2.5 rounded-full border border-surfaceBorder shadow-lg">
          <div className="text-xs font-bold text-textSecondary flex items-center gap-2">
            <ChevronDown className="w-4 h-4 text-primary animate-bounce" />
            <span>SCROLL TO SIMULATE POSE CAPTURE</span>
          </div>
          <div className="w-24 h-1.5 bg-[#233027] rounded-full overflow-hidden">
            <motion.div
              style={{ scaleX: smoothProgress, transformOrigin: 'left' }}
              className="h-full bg-primary"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
