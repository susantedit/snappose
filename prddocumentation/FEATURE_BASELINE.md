# 📋 POSEHANUM — Feature Baseline Inventory

**Audit Date**: August 2026  
**Auditor**: Senior Lead Mobile, AI & Systems Engineer  
**Purpose**: Complete baseline feature inventory protecting all existing routes, screens, state stores, and services from regression.

---

## 🗂️ 1. App Routes Baseline (`src/app/`)
- `src/app/_layout.tsx`: Root stack navigation, query client, theme provider, and toast context.
- `src/app/(auth)/_layout.tsx`: Auth flow stack.
- `src/app/(auth)/sign-in.tsx`: Email/password and guest sign-in screen.
- `src/app/(auth)/sign-up.tsx`: Account creation with password strength meter.
- `src/app/(auth)/forgot-password.tsx`: Password reset with cooldown timer.
- `src/app/(auth)/onboarding.tsx`: Style preference and camera setup survey.
- `src/app/(auth)/complete-profile.tsx`: Post-signup profile details.
- `src/app/(auth)/verify-email.tsx`: Email confirmation prompt.
- `src/app/(auth)/privacy.tsx`: In-app Privacy Policy.
- `src/app/(auth)/terms.tsx`: In-app Terms of Service.
- `src/app/(tabs)/_layout.tsx`: Bottom tab navigator with custom icons and badges.
- `src/app/(tabs)/index.tsx`: Home discovery feed (Trending, Poses, Templates, Categories, T-Pose Hero).
- `src/app/(tabs)/camera.tsx`: Main camera viewfinder with HUD, BLEND/SKELETON modes, and Shutter.
- `src/app/(tabs)/search.tsx`: Search poses and categories with keyword indexing.
- `src/app/(tabs)/favorites.tsx`: Offline SQLite-backed favorite poses.
- `src/app/(tabs)/settings.tsx`: Audio coach, notification preferences, dark mode, and account links.
- `src/app/templates/index.tsx`: Template discovery feed.
- `src/app/template-creator/index.tsx`: Creator studio canvas editor for multi-layer templates.
- `src/app/gallery/index.tsx`: Captured photo management with multi-select bulk export and delete.
- `src/app/history/index.tsx`: Attempt history with before/after comparison slider.
- `src/app/journey/index.tsx`: 5-shot narrative photoshoot session sequencer.
- `src/app/profile/index.tsx`: User stats, XP, achievements, GDPR data export, and account deletion.
- `src/app/pose/[id].tsx`: Pose details with Shot Recipe and Pose DNA card.
- `src/app/pose/3d/[id].tsx`: 3D perspective skeletal viewer.
- `src/app/pose/upload.tsx`: Custom reference pose creation from gallery images.
- `src/app/capture-limit/index.tsx`: Monetization and Pro upgrade modal.

---

## 🗄️ 2. State Stores Baseline (`src/stores/`)
- `authStore.ts`: Authentication session, user profile, and token persistence.
- `cameraStore.ts`: Camera settings (flash, grid, active reference mode, timer).
- `creatorStore.ts`: Creator drafts, published templates, and analytics counters.
- `customPoseStore.ts`: User-uploaded custom poses in MMKV.
- `gamificationStore.ts`: XP, user level (1–20), streaks, and badge unlocks.
- `historyStore.ts`: Captured photo attempts with timestamp and regional scores.
- `notificationStore.ts`: Delivered notification message IDs, fatigue counters, and quiet hours.
- `offlineQueueStore.ts`: Ring buffer for pending backend mutations with sanitization.
- `personalizationStore.ts`: 12-dimensional ML preference vector and interaction history.
- `settingsStore.ts`: App preferences, voice coaching toggles, and language selection.
- `uiVisibilityStore.ts`: Camera HUD overlay visibility toggles.
