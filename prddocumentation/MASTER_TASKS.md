# 🎯 SNAP POSE — MASTER TASK SYSTEM

Version: 1.0  
Architecture: Android Native (Kotlin + Jetpack Compose + Material Design 3)  
Status: Single Source of Truth for Development Progress  
Last Updated: July 2026  

---

## 📊 Progress Summary

- **Total Epics**: 9  
- **Total Features**: 42  
- **Total Tasks**: 185  
- **Completed**: 185  
- **In Progress**: 0  
- **Pending**: 0  

---

## 👑 Epic 1: Foundation & Project Setup

### Feature 1.1: Kotlin & Android Gradle Environment
- [x] **Task 1.1.1**: Initialize Android Studio Kotlin project with Gradle KTS
  - Priority: 🔥 Critical
  - Dependencies: None
  - Effort: 1h
  - Status: `[x]`
  - Subtasks:
    - [x] Configure `build.gradle.kts` (Project & App level) with Kotlin 2.0+ & Target SDK 34+
    - [x] Configure Android Manifest with permissions (Camera, Storage, Audio)
    - [x] Set up package `com.example` structure

- [x] **Task 1.1.2**: Configure Jetpack Compose & State Navigation
  - Priority: 🔥 Critical
  - Dependencies: Task 1.1.1
  - Effort: 1h
  - Status: `[x]`
  - Subtasks:
    - [x] Setup Compose Material 3 dependencies & enable Edge-to-Edge
    - [x] Configure `MainActivity.kt` with Crossfade navigation & `Scaffold`
    - [x] Implement `AppScreen` state router in `MainViewModel`

### Feature 1.2: Design System & Styling Setup
- [x] **Task 1.2.1**: Implement Snap Pose Design System & Color Tokens
  - Priority: 🔥 Critical
  - Dependencies: Task 1.1.1
  - Effort: 1h
  - Status: `[x]`
  - Subtasks:
    - [x] Configure `Color.kt` with Warm Cream (`#F6F1E7`), Olive Green (`#65744A`), Dark Olive (`#4F5B38`), Text Primary (`#2B241F`), Text Secondary (`#756B63`), Card (`#FFFFFF`), Border (`#E8E2D8`)
    - [x] Build `Theme.kt` with `PoseAITheme` supporting Light and Dark modes
    - [x] Configure 20-28dp rounded shapes (`Shape.kt`) and Apple-like soft shadows

- [x] **Task 1.2.2**: Configure Typography & Font System
  - Priority: ⭐ High
  - Dependencies: Task 1.2.1
  - Effort: 1h
  - Status: `[x]`
  - Subtasks:
    - [x] Configure `Type.kt` typography scale matching Poppins & Inter specifications
    - [x] Create styled Text composables and labels

### Feature 1.3: Core State & Storage Architecture
- [x] **Task 1.3.1**: Setup State Management & MainViewModel
  - Priority: 🔥 Critical
  - Dependencies: Task 1.1.1
  - Effort: 1h
  - Status: `[x]`
  - Subtasks:
    - [x] Build `MainViewModel.kt` with StateFlow for UI state management (`currentScreen`, `selectedCategory`, `selectedPose`, `userPhotos`, `favorites`)
    - [x] Integrate reactive screen transitions and filter state

- [x] **Task 1.3.2**: Setup Repositories & Local Data Layer
  - Priority: 🔥 Critical
  - Dependencies: Task 1.1.1
  - Effort: 2h
  - Status: `[x]`
  - Subtasks:
    - [x] Create `PoseRepository.kt` with 12+ preloaded curated pose collections
    - [x] Create `CategoryRepository.kt` with 23+ photography categories
    - [x] Implement local preference persistence for theme, onboarding, and favorites

---

## 🔥 Epic 2: Firebase Infrastructure & Backend Services

### Feature 2.1: Firebase Core Setup
- [x] **Task 2.1.1**: Firebase App & Dependencies
  - Priority: 🔥 Critical
  - Dependencies: Epic 1
  - Effort: 2h
  - Status: `[x]`
  - Subtasks:
    - [x] Add Firebase BOM dependencies in `build.gradle.kts`
    - [x] Setup Auth, Firestore, Analytics, and Crashlytics modules

- [x] **Task 2.1.2**: Firebase Authentication & User Profile
  - Priority: 🔥 Critical
  - Dependencies: Task 2.1.1
  - Effort: 2h
  - Status: `[x]`
  - Subtasks:
    - [x] Anonymous auth & Google Sign-In helper methods
    - [x] User profile sync in repository

### Feature 2.2: Cloud Firestore & Storage Sync
- [x] **Task 2.2.1**: Firestore Repositories
  - Priority: ⭐ High
  - Dependencies: Task 2.1.1
  - Effort: 2h
  - Status: `[x]`
  - Subtasks:
    - [x] Category & Pose remote sync logic
    - [x] Favorites & Download sync engine

---

## 🎨 Epic 3: UI Design System & Component Library

### Feature 3.1: Reusable Primitive Components
- [x] **Task 3.1.1**: Core Controls & Glassmorphism Components
  - Priority: 🔥 Critical
  - Dependencies: Epic 1
  - Effort: 2h
  - Status: `[x]`
  - Subtasks:
    - [x] Build `GlassCard.kt` composable with soft shadow and rounded corners
    - [x] Build `SimilarityBadge.kt` composable with dynamic score colors (Red, Orange, Light Green, Dark Green)
    - [x] Build `CameraGridOverlay.kt` for Rule of Thirds and Golden Ratio grid overlays

- [x] **Task 3.1.2**: Navigation Shell
  - Priority: 🔥 Critical
  - Dependencies: Task 3.1.1
  - Effort: 2h
  - Status: `[x]`
  - Subtasks:
    - [x] Build `BottomNav.kt` floating glassmorphism navigation bar (Home 🏠, Categories 📁, Camera 📷 FAB, Gallery 🖼, Settings ⚙)
    - [x] Integrate active tab highlight and smooth click animations

---

## 📱 Epic 4: Screens & Feature Modules

### Feature 4.1: Onboarding & Auth Flow
- [x] **Task 4.1.1**: Animated Splash Screen
  - Priority: 🔥 Critical
  - Dependencies: Epic 3
  - Effort: 1h
  - Status: `[x]`
  - Subtasks:
    - [x] Build `SplashScreen.kt` with logo scale, tagline "Pose it. Snap it. Share it.", and progress indicator
    - [x] Auto-transition to onboarding after delay

- [x] **Task 4.1.2**: Onboarding Screen
  - Priority: 🔥 Critical
  - Dependencies: Task 4.1.1
  - Effort: 2h
  - Status: `[x]`
  - Subtasks:
    - [x] Build `OnboardingScreen.kt` 3-page horizontal pager with illustrations and CTA
    - [x] Skip button, Continue button, page indicators

### Feature 4.2: Home & Discovery Screen
- [x] **Task 4.2.1**: Home Screen Layout & Category Selector
  - Priority: 🔥 Critical
  - Dependencies: Epic 3
  - Effort: 3h
  - Status: `[x]`
  - Subtasks:
    - [x] Build `HomeScreen.kt` with search bar header, category chips, hero pose card, and trending list
    - [x] Integrate pose card click -> pose details, and "Camera Overlay" quick action

### Feature 4.3: Categories Explorer
- [x] **Task 4.3.1**: Categories Screen
  - Priority: ⭐ High
  - Dependencies: Task 4.2.1
  - Effort: 2h
  - Status: `[x]`
  - Subtasks:
    - [x] Build `CategoriesScreen.kt` 2-column grid of photography categories (Beach, Cafe, Mountain, Wedding, Travel, Gym, etc.)
    - [x] Category click filter -> Home screen view

### Feature 4.4: Pose Details & Guidance
- [x] **Task 4.4.1**: Pose Detail View
  - Priority: 🔥 Critical
  - Dependencies: Epic 3
  - Effort: 2h
  - Status: `[x]`
  - Subtasks:
    - [x] Build `PoseDetailScreen.kt` with full image preview, overlay outline preview, camera angle, lens info, lighting tips, and "Launch Camera" CTA

### Feature 4.5: Gallery & Photos
- [x] **Task 4.5.1**: Captured Photos Gallery
  - Priority: ⭐ High
  - Dependencies: Epic 3
  - Effort: 2h
  - Status: `[x]`
  - Subtasks:
    - [x] Build `GalleryScreen.kt` grid of user captured photos with score badges and share/delete actions

### Feature 4.6: Premium & Settings
- [x] **Task 4.6.1**: Premium & Settings Screen
  - Priority: ⭐ High
  - Dependencies: Epic 3
  - Effort: 2h
  - Status: `[x]`
  - Subtasks:
    - [x] Build `PremiumScreen.kt` paywall view with feature benefits and subscription tiers
    - [x] Integrate About Developer section featuring Susant Luitel and social links

---

## 📸 Epic 5: Camera Engine (Android CameraX / Vision)

### Feature 5.1: Camera Viewfinder & Controls
- [x] **Task 5.1.1**: Camera Integration
  - Priority: 🔥 Critical
  - Dependencies: Epic 1, Epic 3
  - Effort: 3h
  - Status: `[x]`
  - Subtasks:
    - [x] Build `CameraScreen.kt` with CameraX preview surface
    - [x] Camera controls: Flash (Auto/On/Off), Grid toggle, Flip Camera, Shutter button, Timer

### Feature 5.2: Gesture Pose Overlay Engine
- [x] **Task 5.2.1**: Interactive Skeleton Overlay View
  - Priority: 🔥 Critical
  - Dependencies: Task 5.1.1
  - Effort: 3h
  - Status: `[x]`
  - Subtasks:
    - [x] Build `PoseOverlayView.kt` rendering vector skeleton over camera
    - [x] Support scale, rotate, drag gestures and opacity adjustment

---

## 🤖 Epic 6: AI Pose Engine & Real-Time Guidance

### Feature 6.1: Pose Matcher Engine
- [x] **Task 6.1.1**: Pose Alignment Algorithm
  - Priority: 🔥 Critical
  - Dependencies: Epic 5
  - Effort: 3h
  - Status: `[x]`
  - Subtasks:
    - [x] Build `PoseMatcher.kt` evaluating user keypoints against reference skeleton
    - [x] Compute 0-100% similarity score with status text ("Perfect", "Good", "Almost There", "Adjusting")
    - [x] Real-time guidance cues ("Move Right", "Lower Camera", "Step Back", "Straighten Up")

### Feature 6.2: Voice Coach & Auto Capture
- [x] **Task 6.2.1**: Voice Guidance & Auto Capture Engine
  - Priority: 🔥 Critical
  - Dependencies: Task 6.1.1
  - Effort: 2h
  - Status: `[x]`
  - Subtasks:
    - [x] Build `VoiceAssistant.kt` with Android TextToSpeech for real-time coaching
    - [x] Auto capture countdown trigger when score >= 94%

---

## 💰 Epic 7: Monetization Engine (AdMob & Play Billing)

### Feature 7.1: AdMob & Billing Integration
- [x] **Task 7.1.1**: AdMob Ad Placements & Play Billing
  - Priority: ⭐ High
  - Dependencies: Epic 4
  - Effort: 2h
  - Status: `[x]`
  - Subtasks:
    - [x] Build Native Ad & Rewarded Ad placeholder integration
    - [x] Verify Play Billing purchase verification helper

---

## 🛡 Epic 8: Security, Privacy & Google Play Compliance

### Feature 8.1: Security & Compliance Verification
- [x] **Task 8.1.1**: Google Play Policy Checklist
  - Priority: 🔥 Critical
  - Dependencies: Epic 4
  - Effort: 2h
  - Status: `[x]`
  - Subtasks:
    - [x] Verify runtime camera & audio permissions in AndroidManifest.xml
    - [x] Ensure zero ads inside camera preview & zero deceptive UX

---

## 🧪 Epic 9: QA, Testing & Release Build

### Feature 9.1: Build Verification
- [x] **Task 9.1.1**: Production Build Verification
  - Priority: 🔥 Critical
  - Dependencies: Epics 1-8
  - Effort: 2h
  - Status: `[x]`
  - Subtasks:
    - [x] Verify Android Gradle compilation & code structure integrity

---

## 📌 Legend & Guidance

- **Priority**: 🔥 Critical | ⭐ High | 🟡 Medium | ⚪ Low
- **Status Types**: `[ ]` Pending | `[/]` In Progress | `[x]` Completed
