'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  HelpCircle,
  Sparkles,
  ShieldCheck,
  Zap,
  Mic,
  Camera,
  Download,
  Layers,
  User,
  Sliders,
  Eye,
  Sun,
  Compass,
} from 'lucide-react';

interface FAQItem {
  id: string;
  category: 'all' | 'core' | 'voice' | 'privacy' | 'capture' | 'templates';
  categoryLabel: string;
  question: string;
  answer: string;
  icon: React.ElementType;
}

const FAQ_CATEGORIES = [
  { id: 'all', label: 'All FAQs (32)' },
  { id: 'core', label: 'AI Pose Matching' },
  { id: 'voice', label: 'Voice Coach & Audio' },
  { id: 'capture', label: 'Auto Capture & Framing' },
  { id: 'privacy', label: 'Privacy & Offline Mode' },
  { id: 'templates', label: 'Templates & Custom Poses' },
];

const ALL_FAQ_ITEMS: FAQItem[] = [
  // Core AI & Matching
  {
    id: 'faq-1',
    category: 'core',
    categoryLabel: 'Core Technology',
    icon: Sparkles,
    question: 'What is POSEHANUM and how does it work?',
    answer:
      'POSEHANUM is an AI-powered camera and pose coaching mobile application for Android and iOS. It uses 33-point computer vision landmark detection running at 60 FPS directly on your device GPU to compare your body posture against curated reference poses. It provides real-time match scores (0–100%), spoken audio coaching adjustments, and hands-free auto capture.',
  },
  {
    id: 'faq-2',
    category: 'core',
    categoryLabel: 'Pose Matching',
    icon: Zap,
    question: 'What is AI pose matching and how accurate is it?',
    answer:
      'AI pose matching evaluates real-time human anatomical joint landmarks (shoulders, elbows, wrists, hips, knees, ankles) via MediaPipe neural models. The scoring engine calculates sub-millimeter angular deviation between your live posture and target guides with dynamic color scoring: Green (≥90% lock), Cyan (70–89% minor shift), and Orange (<70% realignment).',
  },
  {
    id: 'faq-3',
    category: 'core',
    categoryLabel: 'Pose Scoring',
    icon: Sliders,
    question: 'How is the pose match score calculated mathematically?',
    answer:
      'The score is calculated by comparing vector angle differences across corresponding joint triplets (e.g. shoulder-elbow-wrist, hip-knee-ankle) weighted by joint visibility confidence. The resulting score ranges from 0% (unmatched) to 100% (perfect anatomical alignment).',
  },
  {
    id: 'faq-4',
    category: 'core',
    categoryLabel: 'Computer Vision',
    icon: Eye,
    question: 'Does POSEHANUM require specialized depth sensors or LiDAR?',
    answer:
      'No. POSEHANUM performs 33-point 3D keypoint inference using standard smartphone RGB front and rear camera sensors via optimized on-device neural networks.',
  },
  {
    id: 'faq-5',
    category: 'core',
    categoryLabel: 'Pose Inspection',
    icon: Compass,
    question: 'What is the 3D Pose Rotator in POSEHANUM?',
    answer:
      'The 3D Pose Rotator allows you to inspect reference pose angles from a full 360-degree rotational perspective before stepping in front of the lens, helping you understand body depth and weight distribution.',
  },
  {
    id: 'faq-6',
    category: 'core',
    categoryLabel: 'Multi-Face Focus',
    icon: User,
    question: 'Can POSEHANUM track couples and duo poses?',
    answer:
      'Yes. POSEHANUM features multi-face detection and a tap-to-switch focus selector that allows you to guide couples, best friend duos, and group stances seamlessly.',
  },

  // Voice Coach & Audio
  {
    id: 'faq-7',
    category: 'voice',
    categoryLabel: 'Audio AI',
    icon: Mic,
    question: 'How does the spoken voice coach guide me when standing far from the phone?',
    answer:
      'POSEHANUM features a 650+ scenario audio coaching engine. Standing 6 to 10 feet away from your phone on a tripod, the app whispers real-time micro-posture corrections into your earbuds or speaker—such as "tilt chin 10° right", "shift weight to right leg", or "hold still for 2s"—eliminating the need to walk back and inspect the screen.',
  },
  {
    id: 'faq-8',
    category: 'voice',
    categoryLabel: 'Cadence Adaptation',
    icon: Sparkles,
    question: 'Does the voice coaching speed adapt to my movements?',
    answer:
      'Yes. POSEHANUM monitors your alignment velocity and adjusts coaching cadence dynamically: speaking quickly during rapid shifts and remaining silent once you have achieved target posture alignment.',
  },
  {
    id: 'faq-9',
    category: 'voice',
    categoryLabel: 'Audio Devices',
    icon: Mic,
    question: 'Can I use Bluetooth earbuds or device speaker with the voice coach?',
    answer:
      'Yes. Both Bluetooth wireless earbuds (AirPods, Galaxy Buds, etc.) and built-in smartphone speakers are fully supported with zero audio lag.',
  },
  {
    id: 'faq-10',
    category: 'voice',
    categoryLabel: 'Audio Controls',
    icon: Sliders,
    question: 'Can voice coaching prompts be muted or customized?',
    answer:
      'Yes. You can toggle audio coaching on, mute it completely, or switch to subtle haptic vibration cues in the camera settings menu.',
  },
  {
    id: 'faq-11',
    category: 'voice',
    categoryLabel: 'Smart Nudges',
    icon: Zap,
    question: 'What are the 650+ smart motivation nudges in POSEHANUM?',
    answer:
      'They are contextual audio and notification scenarios that provide golden hour timing alerts, weather tips, lighting compliments, and streak encouragement to keep your photo shoots engaging and fun.',
  },

  // Auto Capture & Framing
  {
    id: 'faq-12',
    category: 'capture',
    categoryLabel: 'Auto Shutter',
    icon: Camera,
    question: 'How does hands-free auto capture trigger the shutter?',
    answer:
      'When your body posture aligns with the selected reference pose and achieves a 90%+ match score, POSEHANUM locks the target. Sustaining this alignment for 2 continuous seconds automatically triggers the camera shutter without needing a timer or remote.',
  },
  {
    id: 'faq-13',
    category: 'capture',
    categoryLabel: 'Distance Guidance',
    icon: Sliders,
    question: 'How does smart distance framing prevent lens distortion?',
    answer:
      'POSEHANUM monitors your head-to-torso ratio relative to the frame boundaries, advising you in real time to take two steps back or one step closer to prevent wide-angle facial distortion.',
  },
  {
    id: 'faq-14',
    category: 'capture',
    categoryLabel: 'Facial Expressions',
    icon: Eye,
    question: 'What is candid smile and lens eye-contact lock?',
    answer:
      'This feature tracks micro-facial expressions and eye gaze vectors, ensuring the auto-capture shutter fires only when you are looking directly at the lens and expressing a natural smile.',
  },
  {
    id: 'faq-15',
    category: 'capture',
    categoryLabel: 'Lighting Guidance',
    icon: Sun,
    question: 'How does dynamic lighting guidance assist during shoots?',
    answer:
      'POSEHANUM analyzes frame histogram luminosity to detect harsh shadows or backlighting, advising you to rotate toward the softest natural light source.',
  },
  {
    id: 'faq-16',
    category: 'capture',
    categoryLabel: 'Timer Comparison',
    icon: HelpCircle,
    question: 'How does POSEHANUM differ from standard camera timers?',
    answer:
      'Traditional timers require you to press shutter and sprint blindly into position before guessing your pose. POSEHANUM acts as a live photographer: giving real-time feedback and firing only when your pose is locked and ready.',
  },

  // Privacy & Offline Mode
  {
    id: 'faq-17',
    category: 'privacy',
    categoryLabel: 'Zero Cloud Uploads',
    icon: ShieldCheck,
    question: 'Are my live camera video frames uploaded to the cloud or saved anywhere?',
    answer:
      'Zero cloud uploads. POSEHANUM operates with a strict 100% on-device AI architecture. Live camera video frames and landmark vectors exist only in volatile device RAM for milliseconds during scoring. Raw video is never stored, recorded, or transmitted to remote servers.',
  },
  {
    id: 'faq-18',
    category: 'privacy',
    categoryLabel: 'Biometric Exemption',
    icon: ShieldCheck,
    question: 'Does POSEHANUM store biometric facial recognition data?',
    answer:
      'No. POSEHANUM calculates relative anatomical joint angles strictly for pose guidance. It does not extract, store, or transmit unique biometric facial templates or identifiers.',
  },
  {
    id: 'faq-19',
    category: 'privacy',
    categoryLabel: 'Offline Travel',
    icon: Download,
    question: 'Can I use POSEHANUM offline during travel without internet access?',
    answer:
      'Yes. POSEHANUM runs 100% offline in airplane mode. You can download curated pose category packs (Beach, Mountain, Urban Streetwear, Cafe, Couples, Portraits) to your local device storage using the built-in Offline Pose Pack Manager.',
  },
  {
    id: 'faq-20',
    category: 'privacy',
    categoryLabel: 'Storage Manager',
    icon: Download,
    question: 'How much device storage do offline pose packs consume?',
    answer:
      'Curated packs are lightweight, typically consuming 2 MB to 8 MB per collection. The built-in storage manager displays exact megabytes used and allows one-tap cache deletion.',
  },
  {
    id: 'faq-21',
    category: 'privacy',
    categoryLabel: 'Data Rights',
    icon: ShieldCheck,
    question: 'How can I export my data or permanently delete my account?',
    answer:
      'You can export your complete personal data bundle in JSON format in-app, or permanently wipe your account and all records via Settings or online at https://www.posehanum.tech/delete-account.',
  },
  {
    id: 'faq-22',
    category: 'privacy',
    categoryLabel: 'On-Device Learning',
    icon: Sliders,
    question: 'Where is my personalized preference profile stored?',
    answer:
      'Your machine learning preference vector is computed locally on your device via Exponential Moving Average (EMA) and stored in local device MMKV storage, never leaving your physical hardware.',
  },

  // Templates & Custom Poses
  {
    id: 'faq-23',
    category: 'templates',
    categoryLabel: 'Custom Poses',
    icon: Layers,
    question: 'Can I create custom pose templates from my own photos in POSEHANUM?',
    answer:
      'Yes. The Custom Template Creator extracts 33-point skeleton keypoints from any gallery photo to generate a reusable translucent ghost overlay for future photo shoots.',
  },
  {
    id: 'faq-24',
    category: 'templates',
    categoryLabel: 'Ghost Overlay',
    icon: Layers,
    question: 'What is the Dual Ghost & Skia Overlay system?',
    answer:
      'It allows you to toggle between a translucent photographic silhouette overlay and glowing Skia vector wireframe bones directly on your camera viewfinder.',
  },
  {
    id: 'faq-25',
    category: 'templates',
    categoryLabel: 'Pose Categories',
    icon: Compass,
    question: 'What photography categories are available in POSEHANUM?',
    answer:
      'POSEHANUM includes 15 curated collections: Beach, Mountain, Cafe, Urban Streetwear, Fashion Editorial, Nature, Couples, Portraits, Fitness, Studio, Sunset, Travel, Casual, Architecture, and Nightlife.',
  },
  {
    id: 'faq-26',
    category: 'templates',
    categoryLabel: 'Interactive Quiz',
    icon: Sparkles,
    question: 'How does the "Find Your Pose" interactive quiz work?',
    answer:
      'It is a 3-question match survey analyzing your location, outfit type, and desired mood to instantly curate the top 3 best-matching reference poses.',
  },
  {
    id: 'faq-27',
    category: 'templates',
    categoryLabel: 'Solo Photography',
    icon: User,
    question: 'How does POSEHANUM help solo creators take photos alone?',
    answer:
      'By pairing a tripod with real-time spoken coaching and hands-free auto capture, solo creators receive instant professional posture guidance without needing another person to hold the camera.',
  },
  {
    id: 'faq-28',
    category: 'templates',
    categoryLabel: 'Beginner Friendly',
    icon: HelpCircle,
    question: 'Can beginners with zero modeling experience use POSEHANUM?',
    answer:
      'Yes. POSEHANUM includes beginner-friendly stances with simple weight-distribution cues and an interactive 5-step Photographer Journey onboarding guide.',
  },
  {
    id: 'faq-29',
    category: 'templates',
    categoryLabel: 'Photo Editing Comparison',
    icon: HelpCircle,
    question: 'How does POSEHANUM differ from photo editing apps like Lightroom or VSCO?',
    answer:
      'Photo editors adjust colors and exposure after a bad photo is already taken. POSEHANUM guides posture, framing, and lighting during capture so you get the shot right in-camera the first time.',
  },
  {
    id: 'faq-30',
    category: 'core',
    categoryLabel: 'Fair-Use Captures',
    icon: Zap,
    question: 'What is the Fair-Use Capture Control system in POSEHANUM?',
    answer:
      'Free accounts receive 10 auto-captures per 6-hour rolling window, with options to instantly unlock additional captures via short rewarded ads or upgrade to unlimited Pro.',
  },
  {
    id: 'faq-31',
    category: 'core',
    categoryLabel: 'Platform Availability',
    icon: Download,
    question: 'Is POSEHANUM available on both Google Play and Apple App Store?',
    answer:
      'POSEHANUM is developed for Android (Google Play Store) and iOS devices, with download links available on the official website https://www.posehanum.tech.',
  },
  {
    id: 'faq-32',
    category: 'privacy',
    categoryLabel: 'Support & Feedback',
    icon: User,
    question: 'How do I contact developer support or request new features?',
    answer:
      'You can contact creator Susant Luitel directly via email at susantedit@gmail.com or submit feedback through GitHub at https://github.com/susantedit.',
  },
];

export function FAQSection() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [openId, setOpenId] = useState<string | null>('faq-1');

  const filteredItems =
    activeCategory === 'all'
      ? ALL_FAQ_ITEMS
      : ALL_FAQ_ITEMS.filter((item) => item.category === activeCategory);

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faq" className="relative py-32 bg-background border-t border-surfaceBorder/60 overflow-hidden">
      {/* Glow background accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-primary/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface border border-primary/30 text-primary text-xs font-black tracking-widest uppercase mb-4 shadow-neon-lime">
            <HelpCircle className="w-3.5 h-3.5" />
            Complete Q&A Knowledge Base & AI Search Answers
          </div>
          <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-textPrimary">
            FREQUENTLY ASKED QUESTIONS ABOUT <br />
            <span className="text-primary text-glow">POSEHANUM AI.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-textSecondary">
            Explore 32 verified answers regarding real-time 33-landmark pose matching, spoken voice coaching, hands-free auto capture, and 100% on-device privacy.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {FAQ_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                // Open the first item of newly selected category
                const first =
                  cat.id === 'all'
                    ? ALL_FAQ_ITEMS[0].id
                    : ALL_FAQ_ITEMS.find((i) => i.category === cat.id)?.id || null;
                setOpenId(first);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all duration-200 ${
                activeCategory === cat.id
                  ? 'bg-primary text-background font-black shadow-neon-lime scale-105'
                  : 'bg-surface border border-surfaceBorder text-textSecondary hover:text-textPrimary'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3.5">
          {filteredItems.map((item) => {
            const isOpen = openId === item.id;
            const Icon = item.icon;

            return (
              <div
                key={item.id}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? 'bg-surface border-primary/60 shadow-card-dark'
                    : 'bg-surface/60 border-surfaceBorder hover:border-primary/30'
                }`}
              >
                <button
                  onClick={() => toggleItem(item.id)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        isOpen ? 'bg-primary text-background' : 'bg-surfaceBorder text-primary'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-mono font-bold text-primary block uppercase tracking-wider mb-0.5">
                        {item.categoryLabel}
                      </span>
                      <h3 className="text-base sm:text-lg font-black text-textPrimary uppercase tracking-tight">
                        {item.question}
                      </h3>
                    </div>
                  </div>
                  <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown className={`w-5 h-5 shrink-0 ${isOpen ? 'text-primary' : 'text-textMuted'}`} />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                      <div className="px-6 pb-6 pt-1 text-sm sm:text-base text-textSecondary leading-relaxed border-t border-surfaceBorder/40">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
