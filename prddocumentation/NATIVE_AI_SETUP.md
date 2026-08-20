# POSEHANUM — Native Android MediaPipe AI Setup & Build Guide

**Document Version:** 1.0  
**Target Platform:** Android (API Level 26+ / Android 8.0+)  
**Inference Engine:** Google MediaPipe Tasks Vision (`com.google.mediapipe:tasks-vision:0.10.14`)  
**Topology:** MediaPipe 33-Landmark Anatomical Body Skeleton  

---

## 1. Native Architecture Overview

In Expo SDK 54 / React Native, continuous real-time vision inference (30–60 FPS) cannot pass raw uncompressed video frames (YUV420_888 / NV21) over the React Native JavaScript bridge due to JSON serialization bottlenecks.

To solve this natively without third-party cloud AI or fake mock generators, POSEHANUM uses the **Custom Expo Native Module** architecture:

```
[ CameraX ImageAnalysis Stream (YUV420_888) ]
                     │
                     ▼ (Background Thread)
[ MediaPipe Tasks Vision PoseLandmarker ]
                     │
                     ├─ If Persons == 0  ──> Emit Status: NO_PERSON
                     ├─ If Persons > 1   ──> Emit Status: MULTIPLE_PEOPLE
                     ├─ If Points < 16   ──> Emit Status: LOW_CONFIDENCE
                     │
                     ▼ (If Person == 1 && Points >= 16)
[ Extract 33 Keypoints {x, y, z, visibility} ]
                     │
                     ▼ (Lightweight JSON Payload, ~1.5 KB)
[ React Native JS Bridge / usePoseDetection ]
                     │
                     ▼
[ PoseScoreCalculator (Pure Gaussian Vector Math) ]
```

---

## 2. Module File Layout

The native module is located at `modules/expo-pose-detector`:

| File | Purpose |
|:---|:---|
| `expo-module.config.json` | Expo autolinking manifest mapping `ExpoPoseDetectorModule`. |
| `android/build.gradle` | Gradle configuration bundling `com.google.mediapipe:tasks-vision:0.10.14` and CameraX. |
| `android/src/.../PoseLandmarkerHelper.kt` | Native Kotlin landmarker running `PoseLandmarker.detectAsync()` on live stream buffers. |
| `android/src/.../ExpoPoseDetectorModule.kt` | Expo Kotlin module exposing `startDetection()`, `stopDetection()`, and emitting `onPoseDetected`. |
| `index.ts` | TypeScript interface and event listener bindings. |

---

## 3. Real Device vs Automated Test Verification Status

> [!IMPORTANT]
> **Current Verification Status Matrix:**

| Verification Scope | Status | Evidence |
|:---|:---|:---|
| **Pose Scoring Mathematics** | **VERIFIED (Automated)** | 17/17 test suites (188 tests passing). Tested across 9 pose geometries. |
| **State Machine Contract** | **VERIFIED (Automated)** | `NO_PERSON`, `LOW_CONFIDENCE`, `MULTIPLE_PEOPLE`, `REAL_LANDMARKS` transitions verified in `RealPoseAccuracy.test.ts`. |
| **Zero-Cloud & Privacy** | **VERIFIED (Code Audit)** | Exactly 0 camera frames or biometric coordinates are sent to Firebase or external servers. |
| **Physical Android Device Running Native APK** | **AWAITING HARDWARE ATTACHMENT** | `adb devices` returned `<empty>`. Requires connecting physical Android phone via USB/WiFi or booting Android Studio emulator. |

---

## 4. How to Build & Run Native Android Release

To compile and launch the native MediaPipe APK on a connected Android phone:

### Step 1: Attach Physical Device or Start Emulator
```bash
# Verify device connection
adb devices
```

### Step 2: Run Expo Prebuild & Native Android Runner
```bash
# Generate native android/ directory and run on connected device
npx expo run:android
```

### Step 3: Cloud Build via EAS (Alternative)
```bash
# Build standalone Android APK/AAB via Expo Application Services
eas build --platform android --profile preview
```

---

## 5. Multiple-Person Safety Lockout

When multiple individuals enter the camera viewfinder:
1. `PoseLandmarkerHelper.kt` detects `personCount > 1`.
2. Native module immediately flags `status: 'MULTIPLE_PEOPLE'`.
3. Camera HUD displays `MULTIPLE PEOPLE` in red with cue *"Only one person should be in frame"*.
4. Match score drops to **0%** and auto-capture is immediately **locked** to prevent unintended capture.
