# 🌟 POSEHANUM — Complete Brand Migration Architecture & Decision Record

**Migration Date**: August 2026  
**Status**: 100% Verified & Active Across Codebase  

---

## 1. 🏷️ Executive Identity Overview

| Property | Value |
|---|---|
| **Brand Name** | **POSEHANUM** |
| **Product Name** | **POSEHANUM AI Pose Coach** |
| **Category Positioning** | **AI Photography & Pose Assistant** |
| **Brand Meaning** | *"Hanum"* is inspired by the Nepali expression used for *"let's do/take it."* **POSEHANUM** = *"Let's take the pose / Let's capture the shot."* |
| **Brand Promise** | **"POSEHANUM guides you from 'How should I pose?' to 'That's the shot.'"** |
| **Primary Tagline** | **"Pose Garौँ. Perfect Shot Lिऔँ."** |
| **English Tagline** | **"Let's Pose. Let's Capture."** |
| **Secondary Tagline** | **"Pose Smarter. Capture Better."** |
| **Visual Asset** | **`Posehanum.png`** (Approved mountain & cafe silhouette in forest olive and warm cream with POSEHANUM mark) |

---

## 2. 🏛️ Centralized Configuration

All user-facing branding and endpoints are managed centrally in [`src/config/brand.ts`](file:///f:/snappose/src/config/brand.ts):

```typescript
export const BRAND_CONFIG = {
  name: 'POSEHANUM',
  shortName: 'POSEHANUM',
  productName: 'POSEHANUM AI Pose Coach',
  categoryPositioning: 'AI Photography & Pose Assistant',
  meaning: '"Hanum" is inspired by the Nepali expression for "let\'s do/take it." POSEHANUM = "Let\'s take the pose / Let\'s capture the shot."',
  primaryTagline: 'Pose Garौँ. Perfect Shot Lिऔँ.',
  englishTagline: "Let's Pose. Let's Capture.",
  secondaryTagline: 'Pose Smarter. Capture Better.',
  promise: 'POSEHANUM guides you from "How should I pose?" to "That\'s the shot."',
  urls: {
    website: 'https://posehanum.app',
    privacyPolicy: 'https://posehanum.app/privacy',
    termsOfService: 'https://posehanum.app/terms',
    googlePlay: 'https://play.google.com/store/apps/details?id=com.example.snappose',
    feedbackEmail: 'susantedit@gmail.com',
  },
  // ...
};
```

---

## 3. 🛡️ Data & Installation Safety Decisions

1. **Android Package ID**: Intentionally preserved as `com.example.snappose` to allow seamless Google Play app updates without creating orphaned installations.
2. **Database Storage Keys**: MMKV storage keys (`snappose_history_attempts_v1`, `snappose_custom_poses_v1`, `snappose_notif_preferences_v1`) preserved to guarantee zero data loss for existing users.
3. **Public-Facing Branding**: 100% of visible screens, onboarding, camera HUD, settings, notifications, modals, and website components render `POSEHANUM`.
4. **Creator Social Links**: All 13 verified social profiles for creator **Susant Luitel** are preserved exactly.

---

## 4. 🧪 Build & Test Verification Results

- **TypeScript Typecheck (App)**: `node node_modules/typescript/bin/tsc --noEmit` ➔ **0 errors**
- **TypeScript Typecheck (Website)**: `website/tsc --noEmit` ➔ **0 errors**
- **Unit & Property Test Suite**: `pnpm test` ➔ **14/14 test suites passed (162/162 tests passing)**
