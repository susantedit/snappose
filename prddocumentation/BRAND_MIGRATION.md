# 🌟 POSEVIA — Complete Brand Migration Architecture

**Migration Date**: August 2026  
**Status**: 100% Verified & Complete  

---

## 1. 🏷️ Executive Summary & Identity

| Property | Old Brand | New Brand (POSEVIA) |
|---|---|---|
| **Brand Name** | Snap Pose | **POSEVIA** |
| **Product Name** | Snap Pose AI | **POSEVIA AI Pose Coach** |
| **Category Positioning** | Pose Reference App | **AI Photography & Pose Assistant** |
| **Brand Meaning** | Generic camera snap | **POSE + VIA** (*"The way/path to your perfect pose."*) |
| **Brand Promise** | "Pose it. Snap it. Share it." | **"POSEVIA guides you from 'How should I pose?' to 'That's the shot.'"** |
| **Primary Tagline** | "Find your perfect pose" | **"Pose Smarter. Capture Better."** |
| **Secondary Tagline** | N/A | **"Find Your Pose. Find Your Moment."** |
| **Visual Asset** | Placeholder icon | **`POSEVIA.png`** (Mountain & cafe silhouette in forest olive and warm cream) |

---

## 2. 🏛️ Central Brand Architecture System

All public strings, titles, taglines, URLs, and creator profiles are centralized into [`src/config/brand.ts`](file:///f:/snappose/src/config/brand.ts):

```typescript
export const BRAND_CONFIG = {
  name: 'POSEVIA',
  shortName: 'POSEVIA',
  productName: 'POSEVIA AI Pose Coach',
  categoryPositioning: 'AI Photography & Pose Assistant',
  meaning: 'POSE + VIA = The way/path to your perfect pose.',
  tagline: 'Pose Smarter. Capture Better.',
  secondaryTagline: 'Find Your Pose. Find Your Moment.',
  promise: 'POSEVIA guides you from "How should I pose?" to "That\'s the shot."',
  urls: {
    website: 'https://posevia.app',
    googlePlay: 'https://play.google.com/store/apps/details?id=com.example.snappose',
    feedbackEmail: 'susantedit@gmail.com',
  },
  // ...
};
```

---

## 3. 🛡️ Backward-Compatible Technical Decisions

To guarantee seamless app updates and prevent data loss for existing users:
1. **Android Package Identifier**: Retained as `com.example.snappose` in `app.config.ts` (ensuring Google Play update compatibility).
2. **MMKV Database Keys**: Maintained with backward compatibility (`snappose_history_attempts_v1`, `snappose_custom_poses_v1`, `snappose_notif_preferences_v1`).
3. **Public Display Strings**: All visible labels, headers, toasts, notifications, dialogs, and about modals are 100% updated to **POSEVIA**.
4. **Creator Social Links**: All 13 verified social profiles for creator **Susant Luitel** are preserved exactly.

---

## 4. 🌐 Web & Store Assets Rebranding

- **Website Navbar & Hero**: Updated with POSEVIA brand wordmark and logo image.
- **Structured Data (JSON-LD)**: Configured with `SoftwareApplication`, `MobileApplication`, `Organization`, and `WebSite` schemas for POSEVIA.
- **Sitemap & Robots**: Configured with `https://posevia.app`.
- **Google Play Store Listing**: Created in `prddocumentation/PLAY_STORE_LISTING.md`.
- **Complete SEO Strategy**: Created in `prddocumentation/SEO_ASO.md`.

---

## 5. 🧪 Verification & Build Results

- **TypeScript Typecheck**:
  ```bash
  $ node node_modules/typescript/bin/tsc --noEmit
  # Exit code: 0 (Zero errors across all modules)
  ```
- **Website Production Typecheck**:
  ```bash
  $ cd website && node node_modules/typescript/bin/tsc --noEmit
  # Exit code: 0 (Zero errors)
  ```
- **Jest Test Suite**:
  ```bash
  $ pnpm test
  # Test Suites: 14 passed, 14 total
  # Tests:       162 passed, 162 total
  ```
