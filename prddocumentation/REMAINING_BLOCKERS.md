# 🚧 POSEHANUM — REMAINING BLOCKERS & HARDWARE PREREQUISITES

**Document Version**: 2.1 (Forensic Engineering Audit)  
**Status**: Brutally Honest / Zero Fabrication  

---

## 1. Native Android CameraX → MediaPipe Live Stream Execution

| Detail | Specification |
|---|---|
| **Exact Reason** | In the Expo Go / managed JS sandbox environment, native C++ and Kotlin frame processor modules cannot execute. The native CameraX → MediaPipe pipeline code is written, but cannot be physically verified without building the native Android binary. |
| **Exact Files** | [`modules/expo-pose-detector/android/src/main/java/expo/modules/posedetector/CameraXPoseProcessor.kt`](file:///f:/snappose/modules/expo-pose-detector/android/src/main/java/expo/modules/posedetector/CameraXPoseProcessor.kt)<br>[`modules/expo-pose-detector/android/src/main/java/expo/modules/posedetector/PoseLandmarkerHelper.kt`](file:///f:/snappose/modules/expo-pose-detector/android/src/main/java/expo/modules/posedetector/PoseLandmarkerHelper.kt) |
| **Exact Missing Dependency** | MediaPipe task model asset (`pose_landmarker_full.task`, ~9 MB) in `android/app/src/main/assets/` |
| **Exact Command / Action Required** | 1. `node scripts/download-mediapipe-model.js`<br>2. `npx expo run:android` (or `npm run run:android`) |
| **Developer Credentials Required?** | ❌ No |
| **Physical Hardware Required?** | ✅ **YES** — Physical Android device with USB debugging enabled (or Android Studio hardware-accelerated emulator) |

---

## 2. Real Firebase Authentication & Cloud Services

| Detail | Specification |
|---|---|
| **Exact Reason** | `@react-native-firebase/auth`, `analytics`, `perf`, and `crashlytics` require the Google Services Gradle plugin to parse real project configuration keys at native build time. Without `google-services.json`, the app operates in offline Guest mode. |
| **Exact Files** | `f:\snappose\google-services.json` (missing from root)<br>[`src/features/auth/infrastructure/FirebaseAuthAdapter.ts`](file:///f:/snappose/src/features/auth/infrastructure/FirebaseAuthAdapter.ts)<br>[`backend/src/middleware/auth.ts`](file:///f:/snappose/backend/src/middleware/auth.ts) |
| **Exact Missing Dependency** | Real `google-services.json` downloaded from the Firebase Console for Android package `com.example.snappose` |
| **Exact Command / Action Required** | 1. Go to Firebase Console → Project Settings → General → Android Apps (`snap-pose-c16f4`)<br>2. Download `google-services.json`<br>3. Place in `f:\snappose\google-services.json`<br>4. Run `npm run run:android` |
| **Developer Credentials Required?** | ✅ **YES** — Google Firebase Project Owner Access |
| **Physical Hardware Required?** | ❌ No (Can run in Android emulator once configured) |

---

## 3. Backend Database Connection & Cloud Hosting

| Detail | Specification |
|---|---|
| **Exact Reason** | The Express REST API connects to MongoDB to persist public templates, analytics, and cross-device favorites. Currently `backend/.env` is set to local default without a remote MongoDB Atlas URI. |
| **Exact Files** | `f:\snappose\backend\.env`<br>[`backend/src/config/db.ts`](file:///f:/snappose/backend/src/config/db.ts)<br>[`src/features/templates/services/CloudTemplateRepository.ts`](file:///f:/snappose/src/features/templates/services/CloudTemplateRepository.ts) |
| **Exact Missing Dependency** | MongoDB Atlas connection string (`mongodb+srv://...`) and deployed backend URL |
| **Exact Command / Action Required** | 1. Create a cluster on MongoDB Atlas<br>2. Add `MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/snappose` to `backend/.env`<br>3. Deploy backend to hosting (e.g. Railway, Render, Fly.io, or AWS ECS)<br>4. Update `EXPO_PUBLIC_MONGODB_API_URL` in root `.env` |
| **Developer Credentials Required?** | ✅ **YES** — MongoDB Atlas & Cloud Hosting Credentials |
| **Physical Hardware Required?** | ❌ No |

---

## 4. Face Switch Neural Model Weights

| Detail | Specification |
|---|---|
| **Exact Reason** | The architectural boundary and consent validation for Face Switch are implemented, but real on-device neural face synthesis requires an actual pre-trained ONNX or CoreML model weight file. |
| **Exact Files** | [`src/features/ai/domain/faceSwitch/FaceSwitchProvider.ts`](file:///f:/snappose/src/features/ai/domain/faceSwitch/FaceSwitchProvider.ts) |
| **Exact Missing Dependency** | Bundled `face_blend_model.onnx` (~40 MB) placed in `android/app/src/main/assets/` |
| **Exact Command / Action Required** | Obtain approved ONNX face transformation model weights and bundle into Android native assets directory. |
| **Developer Credentials Required?** | ❌ No |
| **Physical Hardware Required?** | ❌ No |

---

## 5. Background Segmentation Model Weights

| Detail | Specification |
|---|---|
| **Exact Reason** | The background segmentation provider architecture is implemented, but real on-device segmentation inference requires the Google Selfie Segmentation TFLite model file. |
| **Exact Files** | [`src/features/ai/domain/background/BackgroundSegmentationProvider.ts`](file:///f:/snappose/src/features/ai/domain/background/BackgroundSegmentationProvider.ts) |
| **Exact Missing Dependency** | `selfie_segmentation.tflite` (~3 MB) placed in `android/app/src/main/assets/` |
| **Exact Command / Action Required** | Download Google MediaPipe Selfie Segmentation TFLite model and place in Android assets. |
| **Developer Credentials Required?** | ❌ No |
| **Physical Hardware Required?** | ❌ No |

---

## 6. Google AdMob & Play Console Configuration

| Detail | Specification |
|---|---|
| **Status** | ✅ **CONFIGURED IN APP CONFIG & .ENV** |
| **Configured Credentials** | - **App ID**: `ca-app-pub-9145129314168118~2811749135`<br>- **Native Unit ID**: `ca-app-pub-9145129314168118/9197777249`<br>- **Rewarded Unit ID**: `ca-app-pub-9145129314168118/8699917940`<br>- **Interstitial Unit ID**: `ca-app-pub-9145129314168118/7723546497`<br>- **App Open Unit ID**: `ca-app-pub-9145129314168118/7097006324` |
| **Integration Files** | [`f:\snappose\.env`](file:///f:/snappose/.env)<br>[`app.config.ts:L105-108`](file:///f:/snappose/app.config.ts#L105-108)<br>[`src/features/ads/infrastructure/AdMobAdapter.ts`](file:///f:/snappose/src/features/ads/infrastructure/AdMobAdapter.ts)<br>[`src/features/ads/hooks/useRewardedAd.ts`](file:///f:/snappose/src/features/ads/hooks/useRewardedAd.ts)<br>[`src/features/ads/hooks/useInterstitialAd.ts`](file:///f:/snappose/src/features/ads/hooks/useInterstitialAd.ts) |
| **Remaining Step for AdMob** | None on client side! The IDs are actively injected via `process.env`. They will serve real ads once built into the native release APK. |

---

## 📋 Summary Table of Blockers

| # | Feature Area | Primary Blocker | Credentials Needed? | Hardware Needed? | Actionable Command |
|---|---|---|:---:|:---:|---|
| 1 | **Native MediaPipe Inference** | Unbuilt native APK / missing task file | ❌ No | ✅ **YES** | `npm run run:android` |
| 2 | **Firebase Authentication** | Missing `google-services.json` | ✅ **YES** | ❌ No | Download from Firebase Console |
| 3 | **Cloud Template Sync** | Missing `MONGODB_URI` / cloud hosting | ✅ **YES** | ❌ No | Add URI to `backend/.env` |
| 4 | **Face Switch** | Missing ONNX model weights file | ❌ No | ❌ No | Bundle ONNX model in assets |
| 5 | **Background Segmentation** | Missing TFLite model weights file | ❌ No | ❌ No | Bundle TFLite model in assets |
| 6 | **Google AdMob Production** | **RESOLVED** (Unit IDs wired in `.env` & `app.config.ts`) | ✅ Done | ❌ No | Ready for native APK build |
