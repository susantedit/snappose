# POSEHANUM — Comprehensive Firebase Usage Audit

**Audit Date:** August 2026  
**Status:** Completed  
**System:** POSEHANUM Mobile App (React Native / Expo SDK 54) & Node/Express Backend

---

## Executive Summary

> [!IMPORTANT]
> **Firebase is NOT used for core pose inference.**
> All camera frames, real-time pose detection, 33-point landmark extraction, angular alignment calculations, and auto-capture shutter logic run **100% on-device** via MediaPipe topology algorithms. No images or camera video streams are ever transmitted to Firebase or any cloud AI provider.

Firebase in POSEHANUM is strictly confined to standard mobile infrastructure:
1. **Authentication** (`@react-native-firebase/auth`): Optional user login (Google, Email, Anonymous) for profile synchronization.
2. **Crash Reporting** (`@react-native-firebase/crashlytics`): Anonymized crash logs and uncaught error tracking.
3. **Analytics** (`@react-native-firebase/analytics`): Anonymized user interaction counts and feature usage metrics with strict PII/biometric sanitization.
4. **Backend Token Verification** (`firebase-admin`): Node/Express server verification of client bearer ID tokens.

---

## 1. Complete Repository Firebase Inventory

| Service / Module | Target File | Purpose | Data Transmitted | Runtime Execution | Required? | Prod Config Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Firebase Auth** (`@react-native-firebase/auth`) | `src/features/auth/infrastructure/FirebaseAuthAdapter.ts` | Handles user authentication and ID token acquisition. | Email, display name, UID, OAuth tokens. | Yes, when user signs in. Safe guest fallback if offline or native Firebase is absent. | Optional (Guest mode works 100% offline). | `google-services.json` (Android) / `GoogleService-Info.plist` (iOS). |
| **Firebase Crashlytics** (`@react-native-firebase/crashlytics`) | `src/services/firebase/crashlytics.ts` | Records uncaught JavaScript/Native exceptions and diagnostics. | Anonymized stack traces, error messages, device model. | Yes, when errors occur. Swallows errors in dev/web without crashing. | Optional (App functions normally without it). | Configured in `app.config.ts` plugins. |
| **Firebase Analytics** (`@react-native-firebase/analytics`) | `src/services/analytics/AnalyticsService.ts` | Tracks navigation, screen views, and pose usage events. | Event names (e.g. `pose_open`, `camera_open`), sanitized parameters (PII/frames stripped). | Yes, on user actions. Dev logger fallback in local dev. | Optional (App functions normally without it). | Configured in `app.config.ts`. |
| **Firebase App Check** | `src/services/firebase/appCheck.ts` | Placeholder for Play Integrity / DeviceCheck API attestation. | Device integrity token. | Stub only (`export {}`). Not active at runtime. | Optional for future anti-abuse hardening. | Pending production Play Store enrollment. |
| **Firebase Config Client** | `src/services/firebase/firebaseConfig.ts` | Placeholder for web/JS config bootstrap. | None. | Stub only (`export {}`). Native builds read `google-services.json` directly. | Optional. | Handled by Expo Prebuild / Native config. |
| **Firebase Admin SDK** (`firebase-admin`) | `backend/src/middleware/auth.ts` | Backend verification of incoming client Bearer ID tokens. | Client JWT tokens. | Active in backend authorization middleware. | Required only for authenticated cloud endpoints. | Server environment variables (`FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`). |

---

## 2. Cloud AI & Vertex / Gemini Audit

| Search Term | Found Instances | Description / Status |
| :--- | :--- | :--- |
| `Firebase AI` | 0 occurrences | Not installed, not configured, not used. |
| `Vertex AI` | 0 occurrences | Not installed, not configured, not used. |
| `Firebase ML Kit` | 0 occurrences | Not installed. Real-time vision is handled on-device. |
| `Firebase Storage` | 0 occurrences | Photos remain on the user's local device library (`expo-media-library`). No photos upload to Firebase Storage. |
| `Firestore` | 0 occurrences | Poses are bundled locally in `SNAP_POSE_DATASET` / SQLite. User data is persisted via MMKV and MongoDB backend. |

---

## 3. Unused & Misplaced Configuration Findings

### A. Critical Security Finding: Admin SDK JSON in Client Root
- **Finding:** A file named `snap-pose-c16f4-firebase-adminsdk-fbsvc-682246584b.json` was located in the client mobile project root `f:\snappose\`.
- **Risk:** This file contains private service-account credentials (`private_key`, `client_email`) with full administrative control over the Firebase project. If packaged into the client APK, it could be extracted and compromised.
- **Remediation:** 
  1. Remove this file from the client mobile repository.
  2. Ensure backend server environment variables in `backend/.env` are used exclusively for administrative access.
  3. Ensure `*.json` service accounts are ignored in `.gitignore`.

### B. Client `google-services.json`
- **Finding:** `google-services.json` is checked by `app.config.ts` (`fs.existsSync('./google-services.json')`).
- **Status:** In development, `@react-native-firebase` operates safely with graceful fallbacks (guest auth, dev logger). For release APK/AAB generation, the **client** `google-services.json` (from Firebase Console -> Project Settings -> Android App) must be placed in the project root.

---

## 4. Runtime Behavior Matrix

| Feature | Uses Firebase? | Network Call Made? | Offline Functional? |
| :--- | :--- | :--- | :--- |
| **Camera Preview** | ❌ No | ❌ No | ✅ Yes |
| **Pose Detection & Skeleton** | ❌ No | ❌ No | ✅ Yes |
| **Pose Alignment & Snap Score** | ❌ No | ❌ No | ✅ Yes |
| **Director Mode Voice Coaching** | ❌ No | ❌ No | ✅ Yes |
| **Auto Capture Trigger** | ❌ No | ❌ No | ✅ Yes |
| **Photo Save to Gallery** | ❌ No | ❌ No | ✅ Yes |
| **Pose Catalog Browsing** | ❌ No | ❌ No | ✅ Yes |
| **Personalization Engine** | ❌ No | ❌ No | ✅ Yes |
| **Guest Authentication** | ❌ No (Local Fallback) | ❌ No | ✅ Yes |
| **Google/Email Auth Sync** | ✅ Yes (`FirebaseAuth`) | ✅ Yes | ⚠️ Requires Network for Login |
| **Crashlytics Error Reporting**| ✅ Yes (`Crashlytics`) | ✅ Yes (Queued) | ✅ App continues uninterrupted |
| **Usage Analytics** | ✅ Yes (`Analytics`) | ✅ Yes (Batched) | ✅ App continues uninterrupted |
