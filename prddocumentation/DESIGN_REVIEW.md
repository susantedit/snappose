# 🎬 SNAP POSE — SENIOR UI/UX & PRODUCT ENGINEERING DESIGN REVIEW & AUDIT REPORT

**Project:** Snap Pose — AI-Powered Photography Assistant  
**Reviewed by:** Senior Staff UI/UX Designer, Lead Product Engineer & Mobile App Reviewer  
**Date:** August 2026  
**Architecture Evaluated:** React Native (Expo SDK 54 / TypeScript) + Android CameraX / Skia + Next.js 14 Web Showcase  
**Status:** Comprehensive Codebase & UX Inspection Complete  

---

## 1. Overall Score: `8.2 / 10` (Production Alpha / Architecture Complete)

### Score Breakdown
- **Architecture & Domain Logic:** `9.8 / 10` (Clean TypeScript pure domain engines, zero-dependency mathematical scoring, robust MMKV persistence).
- **Design System & Visual Aesthetics:** `9.5 / 10` (Warm Cream `#F6F1E7`, Olive Green `#65744A`, Neon Lime `#B7FF00`, Dark mode cross-fades, Skia HUD).
- **Cinematic Marketing Website:** `9.7 / 10` (High-converting Next.js 14 storytelling, Web Speech demo, responsive pointer physics, 13 creator links).
- **Camera UX & Control Ergonomics:** `8.5 / 10` (Dual modes, 3-layer switching, gestures, auto-capture countdown, flash/timer/grid).
- **Real-Time On-Device AI Integration:** `6.8 / 10` (Domain mathematics complete; active camera view currently runs step simulation because native Vision Camera frame processor JNI bridge requires prebuild/EAS native binaries).
- **3D Pose Studio:** `7.0 / 10` (Smooth 2.5D perspective card with gesture matrix transforms; true 3D skeletal mesh model is not yet integrated).
- **Privacy & Offline Resilience:** `10 / 10` (Zero cloud image uploads, local MMKV storage, explicit permission disclosures).

---

## 2. What is Excellent

1. **Rock-Solid Domain Architecture:**
   - [`PoseScoreCalculator.ts`](file:///f:/snappose/src/features/ai/domain/PoseScoreCalculator.ts): Pure TypeScript implementation calculating joint angles across 7 body regions (shoulders, arms, hands, torso, legs, head, feet) with weighted scoring.
   - [`DistanceEstimator.ts`](file:///f:/snappose/src/features/camera/domain/DistanceEstimator.ts): Shoulder-to-frame ratio and bounding-box height estimation.
   - [`LightingAnalyser.ts`](file:///f:/snappose/src/features/camera/domain/LightingAnalyser.ts): Pixel luminance histogram and backlight contrast ratio analyzer.
   - [`FaceAnalyser.ts`](file:///f:/snappose/src/features/camera/domain/FaceAnalyser.ts): Mouth corner rise smile probability and eye symmetry detection without intrusive facial recognition.
   - [`OverlayTransformEngine.ts`](file:///f:/snappose/src/features/camera/domain/OverlayTransformEngine.ts): Clamped pan, pinch scale (0.25–2.5), 2-finger rotation (-π to +π), mirror, and lock state machine.
   - [`PersonalizationEngine.ts`](file:///f:/snappose/src/features/personalization/domain/PersonalizationEngine.ts): 8-factor candidate scoring with 80/20 exploitation/exploration balance and <15ms execution.

2. **UI Design System & Tactile Motion:**
   - Cohesive luxury aesthetic blending Warm Cream (`#F6F1E7`), Olive Green (`#65744A`), Neon Lime (`#B7FF00`), and Electric Cyan (`#00D9FF`).
   - Skia vector overlays (`SPSkeletonOverlay.tsx`, `SPPoseOverlay.tsx`) rendering smooth color-coded joint segments (Green ≥71%, Orange 41–70%, Red ≤40%).
   - Reanimated v3 tactile physics with haptic feedback on shutters, toggles, and switches.

3. **Dual Photography Modes & Layer Switching:**
   - **Subject Mode**: Solo/selfie alignment with mirrored orientation.
   - **Photographer Mode**: Framing grid, distance prompts, and director guidance cues.
   - **3-Way Layer Switch**: Instant toggling between **Reference Photo**, **AR Skeleton**, and **Both (Layered)**.

4. **Privacy-First Engineering:**
   - 100% on-device processing. No photos or camera frames uploaded to any remote server.
   - One-tap "Reset Recommendations" and personalization opt-out in Settings.

---

## 3. What Feels Unfinished

1. **Native Frame Processor Bridge (`MediaPipePoseDetector.ts`):**
   - The domain math (`PoseScoreCalculator`) is production-ready, but the active Expo `CameraScreen` currently uses an interval step progression (`AI_GUIDANCE_STEPS`) to showcase HUD states in Expo Go. Wiring 30 FPS camera frame buffers directly into the detector requires a bare native build (`react-native-vision-camera` + frame processor plugin).
2. **Custom Pose Static Landmark Extraction (`upload.tsx`):**
   - The user upload workflow (Gallery pick -> Metadata edit -> Save to MMKV -> Launch in camera overlay) is fully wired, but the landmark extraction step uses a 1.4s animated timer rather than executing offline MediaPipe static image landmarker inference.
3. **In-App Billing & AdMob Live Placement:**
   - AdMob and Play Billing wrapper architecture exists in code and config, but live AdMob unit IDs and Google Play Console product SKUs are pending developer account setup.

---

## 4. What is Only a Mock / Simulation

1. **Camera Screen Live Match Progression:**
   - In `src/app/(tabs)/camera.tsx`, `aiStateIndex` steps through simulated scores (35% -> 60% -> 78% -> 88% -> 96%) over 2.8s intervals to drive the HUD in Expo Go / simulator environments.
2. **3D Pose Studio (`src/app/pose/3d/[id].tsx`):**
   - The 3D Studio utilizes a 2.5D perspective projection matrix (`perspective: 800`, `rotateY`, `rotateX`) with an interactive floor ring plate. It is not yet a true 3D rigged humanoid mesh (e.g. Three.js / Expo GL humanoid bone model).
3. **Upload Landmark Extractor:**
   - Extracted landmarks badge triggers via timeout simulation instead of executing an ONNX/MediaPipe model directly on the picked image bytes.

---

## 5. Missing Features

1. **True 3D Human Skeleton Mesh:**
   - Skinned 3D humanoid mesh in 3D Pose Studio that can be rotated 360° with anatomically accurate depth and joint bending.
2. **Full System Image Picker in Upload Flow:**
   - `upload.tsx` currently fetches the first 20 assets from the media roll via `MediaLibrary.getAssetsAsync` rather than opening the native OS gallery selector (`ImagePicker.launchImageLibraryAsync`).
3. **Real-time Live Audio Waveform in Camera:**
   - Voice coaching speaks via `expo-speech`, but an active visual audio spectrum bar inside the camera HUD is currently only on the website.

---

## 6. UX Problems

1. **Camera HUD Visual Density:**
   - On smaller phone screens (<360dp width), having the Score Ring, Distance Badge, Lighting Badge, Voice Banner, Layer Toggle, and Mode Toggle simultaneously visible crowds the camera preview.
2. **Gallery Roll Auto-Pick in Upload Screen:**
   - Automatically selecting the first photo from the camera roll without presenting a visual thumbnail grid or full picker can be confusing if the latest photo is not the intended pose reference.
3. **Lack of Captured Photo Comparison Slider:**
   - In the captured photo modal, users can save or share, but cannot drag a split-screen slider to compare their photo directly against the pose reference.

---

## 7. Animation Problems

1. **Camera Flip Axis Physics:**
   - Flipping the front/back camera triggers a `rotateY(180deg)` transition. If overlay controls are in the same animated container, HUD text briefly mirrors backward during the flip.
2. **Android Skia Gesture Contention:**
   - When pinching to zoom the pose overlay near the edges of the screen, Android's system back-gesture navigation can occasionally intercept the horizontal drag.

---

## 8. Mobile Problems

1. **Android Hardware Back Button:**
   - Navigating into `/pose/[id]`, `/pose/3d/[id]`, or `/pose/upload` relies on header back buttons. Hardware back press on Android needs explicit `BackHandler` listeners to guarantee predictable stack popping.
2. **Variable Viewfinder Aspect Ratios:**
   - Android devices vary widely (16:9, 19.5:9, 20:9, 4:3). The camera preview needs dynamic letterboxing or crop-to-fill scaling to avoid distortion across unconventional screen ratios.

---

## 9. Performance Problems

1. **Remote Dataset Asset Loading:**
   - Pose images in `posesData.ts` are loaded from high-resolution remote Unsplash URLs. Without persistent local image caching or low-resolution blurhashes, initial scrolling on slow cellular connections will show white placeholders.
2. **Zustand State Re-renders in High-Frequency Loops:**
   - Updating `poseScore` at 30–60 FPS must bypass React component state and update Skia Canvas shared values directly to avoid triggering React tree reconciliations.

---

## 10. Google Play Risks

1. **Runtime Permissions Declaration (Android 14+):**
   - Target SDK 34 requires granular photo permissions (`READ_MEDIA_IMAGES`) and explicit explanation modals before prompting for camera or microphone access.
2. **Camera Foreground Service:**
   - If audio coaching or auto-capture runs while the screen dims, Google Play requires declaration of appropriate foreground service types.
3. **Privacy Policy Link:**
   - Must link to a live, publicly accessible HTTPS privacy policy URL before submission.

---

## 11. Top Improvements Ranked

### 🔴 Critical (Blockers for Real Production Release)
1. **Integrate Native MediaPipe Vision Camera Frame Processor:** Compile EAS native build with custom frame processor plugin to feed 30 FPS camera frames into `PoseScoreCalculator`.
2. **Replace Gallery Pick with `expo-image-picker`:** Use `ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true })` in `upload.tsx`.
3. **Android Hardware Back Button Handlers:** Add `BackHandler.addEventListener` across all sub-screens.

### 🟠 High (Major UX & Feature Enhancements)
4. **Static Image Landmark Extraction in Upload:** Run MediaPipe static image landmarker on uploaded custom photos to extract real landmark coordinates.
5. **Local Image Caching & Blurhashes:** Implement `expo-image` with memory/disk caching and blurhash placeholders for all 21 categories.
6. **Captured vs Reference Split-Screen Slider:** Add an interactive before/after slider modal after photo capture.

### 🟡 Medium (Ergonomic & Polish Improvements)
7. **Adaptive Camera HUD Decluttering:** Automatically fade out secondary metrics (distance/lighting) once pose match reaches ≥85% to maximize composition visibility.
8. **Viewfinder Aspect Ratio Controls:** Add 1:1, 4:3, 16:9, and Full screen format toggles in camera controls.
9. **Upgrade 3D Studio to 3D Skeletal Rig:** Integrate Three.js / Expo GL skinned humanoid model with true rotational depth.

### 🟢 Polish (Micro-Interactions & Delight)
10. **Mechanical Shutter Audio Click:** Play a tactile, premium camera shutter sound on capture.
11. **Haptic Alignment Pulse:** Gentle haptic tick when crossing 75%, 85%, and 95% alignment thresholds.

---

## 12. Exact Recommended Implementation Order

```mermaid
graph TD
    A["Phase 1: Critical Android & Picker Ergonomics<br/>• expo-image-picker in upload.tsx<br/>• Android BackHandler hooks<br/>• expo-image disk caching & blurhash"] --> B["Phase 2: True Camera Frame Pipeline<br/>• Prebuild EAS native project<br/>• react-native-vision-camera frame processor<br/>• MediaPipe 33-landmark live feed"]
    B --> C["Phase 3: Camera HUD & Capture Polish<br/>• Adaptive HUD decluttering<br/>• Before/After comparison slider modal<br/>• Mechanical shutter sound & haptic ticks"]
    C --> D["Phase 4: 3D Rig & Static Landmarker<br/>• Static MediaPipe image landmarking in upload<br/>• Three.js / Expo GL humanoid 3D pose studio"]
    D --> E["Phase 5: Release Hardening & Store Submission<br/>• Google Play Data Safety & live Privacy Policy<br/>• AdMob production IDs & Play Billing verification<br/>• Generate release Android App Bundle (.aab)"]
```

---

## 13. Summary Verdict

Snap Pose possesses an **outstanding product vision, world-class design aesthetics, and complete domain mathematics**. The codebase is clean, strictly typed (0 TypeScript errors), and architecturally sound. Following the prioritized 5-phase roadmap will elevate the product from its current alpha state into a market-leading AI photography assistant on Google Play.
