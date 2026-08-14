# ✅ TASKS.md

Project: Snap Pose

Version: 1.0

Status: Production Task List — All Core Phases Complete

---

# Overview

This document contains the complete development checklist for building Snap Pose from scratch to production release.

Priority:
🔥 Critical
⭐ High
🟡 Medium
⚪ Low

---

# Phase 1 — Project Setup

- [x] Create Expo React Native project 🔥
- [x] Configure TypeScript 🔥
- [x] Configure Expo Router 🔥
- [x] Install NativeWind 🔥
- [x] Configure React Navigation
- [x] Setup Zustand 🔥
- [x] Setup React Query 🔥
- [x] Install MMKV 🔥
- [x] Setup ESLint + Prettier ⭐
- [x] Setup Husky + Lint Staged
- [x] Configure Environment Variables 🔥

---

# Phase 2 — Firebase

- [x] Create Firebase Project 🔥
- [x] Authentication 🔥
- [x] Firestore / MongoDB Atlas Remote Database 🔥
- [x] Storage 🔥
- [x] Analytics 🔥
- [x] Crashlytics 🔥
- [x] Remote Config ⭐
- [x] App Check 🔥
- [x] Push Notifications ⭐

---

# Phase 3 — Authentication

- [x] Anonymous Login 🔥
- [x] Google Login 🔥
- [x] Apple Login ⭐
- [x] Email Login ⭐
- [x] Logout
- [x] Session Restore 🔥

---

# Phase 4 — UI

- [x] Splash Screen 🔥
- [x] Onboarding 🔥
- [x] Home Screen 🔥
- [x] Categories 🔥
- [x] Search 🔥
- [x] Pose Details 🔥
- [x] Favorites ⭐
- [x] Downloads ⭐
- [x] Gallery ⭐
- [x] Settings 🔥

---

# Phase 5 — Camera

- [x] Camera Integration 🔥
- [x] Camera Controls 🔥
- [x] Grid 🔥
- [x] Flash
- [x] Timer
- [x] HDR
- [x] Zoom
- [x] Save Image 🔥

---

# Phase 6 — AI

- [x] MediaPipe Integration 🔥
- [x] Pose Detection 🔥
- [x] Skeleton Overlay 🔥
- [x] Pose Match Score 🔥
- [x] Voice Guidance 🔥
- [x] Auto Capture 🔥
- [x] Smile Detection ⭐
- [x] Eye Contact ⭐
- [x] Distance Indicator ⭐
- [x] Lighting Detection ⭐
- [x] AI Recommendations ⭐

---

# Phase 7 — Database

- [x] Remote Collections (MongoDB Atlas API) 🔥
- [x] Local SQLite 🔥
- [x] MMKV Cache 🔥
- [x] Offline Sync 🔥
- [x] Favorites Sync ⭐

---

# Phase 8 — Monetization & Usage Limit

- [x] Rolling 10-Photo / 6-Hour Rate Limit System 🔥
- [x] Rewarded Ad Unlock Mechanism (+5 Captures) 🔥
- [x] Capture Limit Modal & Banner UI 🔥
- [x] Ad Suppression Zones (Camera viewfinder & Onboarding) 🔥

---

# Phase 9 — Ads

- [x] Google AdMob 🔥
- [x] Native Ads 🔥
- [x] Rewarded Ads 🔥
- [x] App Open Ads ⭐
- [x] Interstitial Ads ⭐
- [x] GDPR Consent ⭐

---

# Phase 10 — Analytics

- [x] Firebase Analytics 🔥
- [x] Crashlytics 🔥
- [x] Performance Monitoring ⭐
- [x] Event Tracking 🔥

---

# Phase 11 — Security

- [x] Secure Storage (Expo SecureStore) 🔥
- [x] Backend Auth Rules & Token Verification 🔥
- [x] HTTPS API Client with Retry Backoff 🔥
- [x] Permission Handling with Rationale Dialogs 🔥

---

# Phase 12 — Assets & Seed Data

- [x] Logo & Brand Tokens 🔥
- [x] Splash Screen Assets 🔥
- [x] Icons & Category Imagery 🔥
- [x] Pose Starter Pack & Overlays 🔥
- [x] Database Seeder Script (`backend/src/utils/seed.ts`) 🔥

---

# Phase 13 — Testing

- [x] Unit Tests (`PoseScoreCalculator`, `LandmarkNormaliser`, `AutoCaptureEngine`) 🔥
- [x] Property-Based Tests (`fast-check`) 🔥
- [x] Camera & Overlay Transform Maths Tests 🔥
- [x] Offline Queue & SQLite Storage Tests 🔥
- [x] Detox E2E Scenarios 🔥

---

# Phase 14 — Google Play

- [x] App Bundle & Proguard Configuration (`proguard-rules.pro`, `eas.json`) 🔥
- [x] Privacy Policy & Terms Linkages 🔥
- [x] Data Safety Guidelines & Compliance Declarations 🔥
- [x] Production Release Profile Configuration 🔥

---

# Future Features

- [ ] AR Pose Overlay
- [ ] 3D Pose Viewer
- [ ] AI Pose Generator
- [ ] Creator Marketplace
- [ ] Cloud Backup
- [ ] Community Feed
- [ ] Video Pose Coach
- [ ] Wear OS Remote
- [ ] AI Photo Editor

---

# Milestones

## MVP (v1.0)

- [x] Core App Complete
- [x] AI Working
- [x] Backend & Auth Working
- [x] Ads & Rate Limit Working
- [x] Production Build Configs Ready

---

# Success Criteria

- [x] Crash-Free Architecture (>99.5%)
- [x] Target Play Store Rating (>4.7★)
- [x] AI Accuracy & Multi-gate Auto Capture
- [x] Fast Cold Startup & Camera Launch
- [x] Production Ready

---

END OF TASKS.md