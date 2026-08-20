# POSEHANUM References UI Redesign — Editorial Photography Experience

## 1. Executive Summary

This document details the complete redesign of the POSEHANUM References & Home feed into a high-end editorial photography experience inspired by minimalist fashion/lifestyle apps (e.g. Apple Design Award winners, Awwwards editorial photography apps, Pinterest-curated male lifestyle reference platforms).

---

## 2. Core Design Pillars Implemented

### A. Editorial Header & Identity
- **Display Heading**: Large, calm "References" title using serif typography (`Georgia` on iOS, `serif` on Android), high contrast, generous whitespace.
- **Supporting Subtitle**: Clean, understated tagline *"Find your next pose"* in muted secondary sage.
- **Top Actions**: Minimal circular buttons for custom pose uploading (AI skeleton extraction) and global search.

### B. Tactile Category Filter Strip
- **Horizontal Scrollable Pills**:
  `All`, `Beach`, `Cafe`, `Nature`, `Trek`, `Selfie`, `Gym`, `Street`, `City`, `Portrait`
- **Active State**: Rich POSEHANUM olive green (`#5F6F52` / `#65744A`) with crisp white bold typography.
- **Inactive State**: Warm natural linen/cream tone (`#EFE9DC` in light mode, `#222520` in dark mode) with dark charcoal text.
- **Spring Feedback**: Instant Reanimated spring compression and selection haptic response.

### C. True 2-Column Asymmetric Masonry Grid
- **Organic Vertical Rhythm**: Independent left and right column stacks with alternating aspect ratios:
  - Left column heights: `1.56x`, `1.32x`, `1.62x`, `1.40x` of column width.
  - Right column heights: `1.34x`, `1.60x`, `1.36x`, `1.52x` of column width.
- **Visual Dominance**: Full-bleed edge-to-edge photography without distracting card bodies or white borders.
- **Card Geometry**: Refined `22–24px` border radius with smooth clipping.
- **Minimalist Overlays**:
  - Floating translucent dark category tag pill (`[Beach]`, `[Selfie]`, `[Nature]`, `[Cafe]`, etc.) placed at the bottom-left corner with subtle gradient backing for contrast.
  - Floating top-right heart icon with spring expansion and radial pulse ring.

### D. Curated Editorial Dataset
- Curated high-resolution lifestyle reference photos specifically tailored for aesthetic male portraits, beachwear, streetwear, cafe culture, and nature walks:
  - **Beach**: Palm tree leans in sage linen, golden hour sunset shoreline walks, coastal railing poses, sand strides.
  - **Selfie / Mirror**: Full-length bedroom mirror fit checks, arched mirror denim aesthetics, sweater shoulder drapes, smart button-down shirt checks.
  - **Nature**: Lush lawn tree seated poses, tall pine trunk canopy views, misty lake horizon back-views, hillside log rests.
  - **Cafe**: Iced matcha & book table seats, outdoor sunlit bistro smiles, cozy window coffee warmth.
  - **Trek & Gym**: High alpine ridge trails, summit overlooks, punching bag leans, athletic mirror pump checks.

### E. Personalized "For Your Style" Discovery
- Connected to the on-device Personalization Engine (`usePersonalizationStore`).
- When interaction history exists, renders a subtle, curated "For Your Style" horizontal carousel at the top of the feed with AI-curated badges.

### F. Floating Glass Bottom Navigation
- Premium floating pill navigation bar (`borderRadius: 30`, floating `12px` above screen bottom).
- Ultra-translucent glassmorphism with subtle border and blur backdrop.
- 4 clear destinations:
  1. `Camera` — Live Viewfinder with AI silhouette overlay
  2. `References` — Curated Masonry Feed (Active highlighted tab)
  3. `My Shots` — Captured gallery & favorites
  4. `Profile` — Preferences & settings
- Respects safe area insets on all device form factors.

---

## 3. Responsive & Accessibility Verification

| Device Profile | Verification Result |
| :--- | :--- |
| **Small Android Phone (360dp)** | Dynamic column width calculation prevents overflow; category pills scroll smoothly. |
| **Standard Android (390-412dp)** | Ideal 2-column masonry spacing (16px side margin, 14px column gap). |
| **Large Phones / Foldables** | Max-width constraints on floating navigation; grid maintains crisp asset scaling. |
| **Dark / Light Theme** | Automatic color token switching (`#F6F1E7` linen cream / `#141612` deep charcoal). |
| **Accessibility (Screen Readers)** | All image cards declare full accessibility labels (name, category, difficulty, favorite state). |
| **Reduced Motion** | Disables intense parallax and spring loops when reduced motion is enabled in system settings. |

---

## 4. Modified Files Reference

- [index.tsx](file:///f:/snappose/src/app/(tabs)/index.tsx) — Redesigned References feed with asymmetric masonry.
- [SPPoseCard.tsx](file:///f:/snappose/src/components/molecules/SPPoseCard.tsx) — Full-bleed editorial card variant with floating category pill.
- [_layout.tsx](file:///f:/snappose/src/app/(tabs)/_layout.tsx) — Floating glass navigation bar.
- [posesData.ts](file:///f:/snappose/src/features/poses/data/posesData.ts) — Curated lifestyle aesthetic pose references.
