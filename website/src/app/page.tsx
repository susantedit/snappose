import React from 'react';
import { Navbar } from '@/components/Navbar';
import { HeroScrollExperience } from '@/sections/HeroScrollExperience';
import { ProblemSection } from '@/sections/ProblemSection';
import { HowItWorksSection } from '@/sections/HowItWorksSection';
import { PoseMatchSection } from '@/sections/PoseMatchSection';
import { VoiceCoachSection } from '@/sections/VoiceCoachSection';
import { DistanceSection } from '@/sections/DistanceSection';
import { LightingSection } from '@/sections/LightingSection';
import { SmileEyeSection } from '@/sections/SmileEyeSection';
import { RecommendationsSection } from '@/sections/RecommendationsSection';
import { PersonalizationSection } from '@/sections/PersonalizationSection';
import { Pose3DPreviewSection } from '@/sections/Pose3DPreviewSection';
import { ARSkeletonSection } from '@/sections/ARSkeletonSection';
import { AutoCaptureSection } from '@/sections/AutoCaptureSection';
import { PoseCategoriesSection } from '@/sections/PoseCategoriesSection';
import { FindYourPoseSection } from '@/sections/FindYourPoseSection';
import { BeforeAfterSection } from '@/sections/BeforeAfterSection';
import { FeaturesGridSection } from '@/sections/FeaturesGridSection';
import { DownloadCTASection } from '@/sections/DownloadCTASection';
import { FooterSection } from '@/sections/FooterSection';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-textPrimary flex flex-col">
      {/* Navigation Header */}
      <Navbar />

      {/* 1. Cinematic Scroll-Driven Product Film */}
      <HeroScrollExperience />

      {/* 2. Problem Statement */}
      <ProblemSection />

      {/* 3. 4-Step How It Works Pipeline */}
      <HowItWorksSection />

      {/* 4. Real-Time Pose Match Scoring */}
      <PoseMatchSection />

      {/* 5. AI Spoken Voice Coach */}
      <VoiceCoachSection />

      {/* 6. Distance & Framing Guidance */}
      <DistanceSection />

      {/* 7. Dynamic Lighting Angle AI */}
      <LightingSection />

      {/* 8. Smile & Eye Contact Expression Lock */}
      <SmileEyeSection />

      {/* 9. Contextual AI Recommendations */}
      <RecommendationsSection />

      {/* 10. Machine Learning & Preference Vector */}
      <PersonalizationSection />

      {/* 11. 3D Pose Rotational Inspector */}
      <Pose3DPreviewSection />

      {/* 12. AR Skeleton Keypoint Overlay */}
      <ARSkeletonSection />

      {/* 13. Hands-Free Auto Capture */}
      <AutoCaptureSection />

      {/* 14. 15 Photography Category Collections */}
      <PoseCategoriesSection />

      {/* 15. "Find Your Pose" Interactive Quiz */}
      <FindYourPoseSection />

      {/* 16. Before / After Interactive Slider */}
      <BeforeAfterSection />

      {/* 17. 12-Feature Deep Dive Grid */}
      <FeaturesGridSection />

      {/* 18. Download CTA & Store Badges */}
      <DownloadCTASection />

      {/* 19. Footer with 13 Social Creator Links */}
      <FooterSection />
    </main>
  );
}
