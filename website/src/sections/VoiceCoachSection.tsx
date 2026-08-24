'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mic, Volume2, Sparkles, Radio, Play, Square } from 'lucide-react';

const CUES = [
  { id: 1, text: 'Move your left hand slightly higher.', stage: 'Arm Adjustment' },
  { id: 2, text: 'Turn your shoulders 15 degrees towards the light.', stage: 'Lighting Angle' },
  { id: 3, text: 'Step back two paces for full body framing.', stage: 'Distance Guide' },
  { id: 4, text: 'Chin down slightly... Perfect. Hold still.', stage: 'Locked & Snapping' },
];

export function VoiceCoachSection() {
  const [activeCueIdx, setActiveCueIdx] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  const playActiveCue = () => {
    if (!synthRef.current) return;

    if (isPlayingAudio) {
      synthRef.current.cancel();
      setIsPlayingAudio(false);
      return;
    }

    synthRef.current.cancel(); // Reset any ongoing speech
    const cue = CUES[activeCueIdx];
    const utterance = new SpeechSynthesisUtterance(cue.text);
    utterance.rate = 0.95; // Natural cadence
    utterance.pitch = 1.05;

    utterance.onstart = () => setIsPlayingAudio(true);
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    synthRef.current.speak(utterance);
  };

  const switchCue = (idx: number) => {
    if (synthRef.current && isPlayingAudio) {
      synthRef.current.cancel();
      setIsPlayingAudio(false);
    }
    setActiveCueIdx(idx);
  };

  return (
    <section id="ai-coach" className="relative py-32 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Visual Waveform & Interactive Audio Card */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="w-full max-w-md p-8 rounded-[36px] bg-gradient-to-b from-surface via-[#111814] to-[#0A0E0C] border-2 border-cyanAccent/40 shadow-neon-cyan relative overflow-hidden">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-cyanAccent/20 border border-cyanAccent flex items-center justify-center text-cyanAccent shadow-[0_0_15px_rgba(0,217,255,0.4)]">
                    <Mic className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-base font-extrabold text-textPrimary uppercase">AI Voice Coach</h4>
                    <p className="text-xs font-bold text-cyanAccent flex items-center gap-1.5">
                      <Radio className="w-3.5 h-3.5 animate-ping" /> Real-Time Spoken Guidance
                    </p>
                  </div>
                </div>

                <Volume2 className={`w-5 h-5 transition-colors ${isPlayingAudio ? 'text-cyanAccent animate-pulse' : 'text-textSecondary'}`} />
              </div>

              {/* Animated Audio Waveform Bars */}
              <div className="flex items-center justify-center gap-1.5 h-16 my-8 px-4 bg-[#0A0E0C]/80 rounded-2xl border border-surfaceBorder/60">
                {[14, 28, 42, 20, 36, 48, 24, 40, 52, 30, 44, 22, 38, 16, 32, 46, 26, 18].map(
                  (h, i) => (
                    <div
                      key={i}
                      className={`w-1.5 rounded-full transition-all duration-300 ${
                        isPlayingAudio ? 'bg-cyanAccent shadow-[0_0_8px_#00D9FF]' : 'bg-cyanAccent/40'
                      }`}
                      style={{
                        height: isPlayingAudio ? `${h}px` : '8px',
                        animation: isPlayingAudio
                          ? `wave 0.8s ease-in-out infinite alternate ${i * 0.05}s`
                          : 'none',
                      }}
                    />
                  ),
                )}
              </div>

              {/* Spoken Instruction Bubble */}
              <div className="p-6 rounded-2xl bg-[#0A0E0C] border border-cyanAccent/30 relative mb-6">
                <span className="text-[10px] font-mono font-bold tracking-widest text-cyanAccent uppercase">
                  ACTIVE CUE // {CUES[activeCueIdx].stage}
                </span>
                <p className="text-lg font-black text-textPrimary mt-2 leading-snug">
                  “{CUES[activeCueIdx].text}”
                </p>
              </div>

              {/* Interactive Audio Controls & Cue Switchers */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-textMuted uppercase">Select Voice Cue:</span>
                  <button
                    onClick={playActiveCue}
                    aria-label={isPlayingAudio ? 'Stop voice sample' : 'Play voice sample'}
                    className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all ${
                      isPlayingAudio
                        ? 'bg-red-500/20 border border-red-500 text-red-400'
                        : 'bg-cyanAccent text-background shadow-neon-cyan hover:scale-105'
                    }`}
                  >
                    {isPlayingAudio ? (
                      <>
                        <Square className="w-3.5 h-3.5 fill-current" /> Stop
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" /> Listen Demo
                      </>
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {CUES.map((cue, idx) => (
                    <button
                      key={cue.id}
                      onClick={() => switchCue(idx)}
                      aria-label={`Select cue: ${cue.stage}`}
                      className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all ${
                        activeCueIdx === idx
                          ? 'bg-surface border-cyanAccent text-cyanAccent'
                          : 'bg-secondaryBg/40 border-surfaceBorder text-textSecondary hover:border-textSecondary'
                      }`}
                    >
                      {cue.stage}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Explanatory Copy */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface border border-cyanAccent/30 text-cyanAccent text-xs font-black tracking-widest uppercase shadow-neon-cyan">
              <Sparkles className="w-3.5 h-3.5" />
              Hands-Free Spoken Coaching
            </div>

            <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-textPrimary leading-[0.95]">
              LIKE HAVING A <br />
              <span className="text-cyanAccent text-glow">PRO PHOTOGRAPHER</span> <br />
              IN YOUR EAR.
            </h2>

            <p className="text-textSecondary text-base leading-relaxed">
              No need to squint at your screen while standing 6 feet away. POSEHANUM draws from a massive 650+ scenario audio coaching engine, whispering real-time micro-posture adjustments and encouraging tips directly to you: shifting weight, angling shoulders, or tilting your chin until the frame is magazine-ready.
            </p>

            <ul className="space-y-3 pt-2">
              {[
                '650+ scenario-based voice coaching prompts & motivation',
                'Adapts coaching cadence based on your alignment speed',
                'Natural, concise spoken prompts with zero audio lag',
                'Works hands-free with earbuds or phone speaker',
              ].map((benefit) => (
                <li key={benefit} className="flex items-center gap-3 text-sm font-bold text-textPrimary">
                  <div className="w-2 h-2 rounded-full bg-cyanAccent" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
