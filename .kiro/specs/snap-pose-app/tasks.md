# Implementation Plan: Snap Pose (React Native Conversion)

## Overview

Convert the existing Android Kotlin/Jetpack Compose app to React Native (Expo).
Replace Firestore with MongoDB Atlas. Remove all subscriptions — free, ad-supported.
Add 10-photo/6-hour rolling rate limit with rewarded-ad unlock.

**Key changes:** Framework → React Native (Expo), Remote DB → MongoDB Atlas (Node.js API),
Monetization → AdMob only (no billing), Usage limit → 10 captures/6hr window.

## Tasks

- [x] 1. Initialise Expo project with TypeScript, Expo Router, and folder structure
  - Run `npx create-expo-app@latest snap-pose --template blank-typescript`
  - Configure `tsconfig.json` strict mode with `@/` path alias
  - Set up `.env` with MongoDB API URL and AdMob IDs as `EXPO_PUBLIC_*` variables
  - Configure `app.config.ts` with bundle ID, permissions, minSdkVersion 26
  - Create feature folder tree: `src/features/{ai,camera,poses,favorites,downloads,ads,auth,settings}/`
  - Create `src/{components,stores,services,database,types,utils,constants,i18n}/`
  - **Dependencies:** none
  - **Req:** 39, 47

- [x] 2. Install and configure all core dependencies
  - Install Expo Router, NativeWind/TailwindCSS, Zustand, TanStack Query, react-native-mmkv
  - Install expo-camera, expo-media-library, expo-file-system, expo-sqlite, expo-secure-store
  - Install @shopify/react-native-skia, react-native-reanimated, react-native-gesture-handler
  - Install react-native-google-mobile-ads, @shopify/flash-list, expo-speech, axios
  - Install i18n-js, expo-localization, @react-native-firebase/analytics, @react-native-firebase/crashlytics
  - Configure NativeWind tailwind.config.js with SP design tokens
  - **Dependencies:** task 1
  - **Req:** 39

- [x] 3. Set up EAS Build with development/preview/production profiles
  - Run `eas build:configure` creating eas.json with three profiles
  - Add EAS Secrets: MONGODB_API_URL, ADMOB_APP_ID, ADMOB_NATIVE_ID, ADMOB_REWARDED_ID, ADMOB_INTERSTITIAL_ID
  - Configure proguard/R8 for release builds
  - Set up EAS Update for OTA JS-layer changes
  - **Dependencies:** task 1
  - **Req:** 39

- [x] 4. Implement design tokens, theme system, and Inter font
  - Create `src/constants/designTokens.ts` with all SP colour tokens (Primary #F6F1E7, Accent #65744A, Dark #181818, etc.)
  - Create dark/light theme context backed by MMKV key `theme` with 200ms cross-fade on change
  - Configure animation duration constants: Quick 120ms, Medium 220ms, Long 350ms, Hero 450ms
  - Load Inter font via expo-font with system sans-serif fallback
  - **Dependencies:** task 2
  - **Req:** 32

- [x] 5. Build root layout and Expo Router navigation structure (port MainActivity.kt)
  - Create `app/_layout.tsx` wrapping QueryClientProvider, GestureHandlerRootView, ThemeProvider, MMKV hydration
  - Create `app/(auth)/_layout.tsx` for splash and onboarding with no bottom nav
  - Create `app/(tabs)/_layout.tsx` with glassmorphism bottom nav (72px): Home/Search/Camera FAB/Favorites/Settings
  - Implement deep link scheme `snappose://pose/[id]`
  - Create remaining route files: `app/pose/[id].tsx`, `app/category/[slug].tsx`, `app/gallery/index.tsx`, `app/downloads/index.tsx`
  - **Dependencies:** tasks 2, 4
  - **Req:** 1, 47.2

- [x] 6. Build atomic component library (port Kotlin UI components)
  - `SPButton.tsx` — Primary/Secondary/Ghost variants, 48dp minimum height, accessibilityLabel [port ButtonDefaults patterns]
  - `SPCard.tsx` — glassmorphism blur variant (port GlassCard.kt), NativeWind styled, dark/light compatible
  - `SPProgressRing.tsx` — Skia animated circular ring, colour-coded 0–100 (Red/Orange/Green/DarkGreen bands)
  - `SPBottomNav.tsx` — glassmorphism blur, FAB camera tab (port BottomNav.kt)
  - `SPToast.tsx` — dismissible toast with success/warning/error variants
  - `SPSkeletonCard.tsx` — shimmer placeholder for loading states
  - `SPDialog.tsx` — modal with confirm/cancel, never shows behind camera
  - `SPPoseCard.tsx` — masonry card with heart icon, category pill, camera shortcut (port ReferencePoseCard)
  - `SPScoreBadge.tsx` — similarity badge with guidance cue chip (port SimilarityBadge.kt)
  - **Dependencies:** tasks 2, 4, 5
  - **Req:** 32

- [x] 7. Implement splash screen (port SplashScreen.kt)
  - Create `app/(auth)/splash.tsx` with Snap Pose logo + tagline "Pose it. Snap it. Share it."
  - Reanimated scale 0.8→1.0 + opacity 0→100% animation completing in ≤400ms
  - Read MMKV `onboardingCompleted`: route to onboarding (false/absent) or home (true)
  - No interactive elements during splash; total cold-start transition ≤2s
  - **Dependencies:** tasks 4, 5
  - **Req:** 1

- [x] 8. Implement onboarding screen (port OnboardingScreen.kt)
  - Create `app/(auth)/onboarding.tsx` with 3-page Reanimated pager
  - Page-dot indicator, Skip button on pages 1–2, "Start Exploring" CTA on page 3
  - Parallax/fade/slide transitions ≤350ms; fade-only when Reduce Motion enabled
  - On complete/skip: write `onboardingCompleted: true` to MMKV, clear back-stack, navigate to Home
  - **Dependencies:** tasks 5, 6, 7
  - **Req:** 2

- [x] 9. Implement home screen (port HomeScreen.kt)
  - Create `app/(tabs)/index.tsx` — port masonry 2-column grid from LazyVerticalGrid using FlashList
  - Horizontal category chip row with all 23 categories (Beach, Cafe, Mountain, Nature, Wedding, etc.)
  - Search bar with debounced input (200ms), BlurHash skeleton placeholders while loading
  - Trending / Recommended / Recently Viewed / Editor's Picks sections
  - Floating circular camera FAB (72px, Olive Green #65744A)
  - Offline banner when no connectivity; serve SQLite cache; 60 FPS scroll
  - **Dependencies:** tasks 5, 6
  - **Req:** 4

- [x] 10. Implement categories and search screen (port CategoriesScreen.kt)
  - Create `app/(tabs)/search.tsx` — 2-column FlashList grid of all 23 categories
  - Each card: real WebP photo, category name, pose count, Premium badge
  - Shared-element hero transition on tap completing ≤450ms
  - Load from SQLite first, refresh from MongoDB API in background
  - Search bar with filter support: category, difficulty, orientation, indoor/outdoor
  - Store last 20 search keywords in SQLite; recent searches shown when search bar focused and empty
  - **Dependencies:** tasks 6, 9
  - **Req:** 5, 6

- [x] 11. Implement pose detail screen (port PoseDetailScreen.kt)
  - Create `app/pose/[id].tsx` with 16:9 hero image and parallax scroll
  - Display: name, category, difficulty, indoor/outdoor, distance, camera angle, lighting tips, body direction instructions
  - Favorite button with optimistic update (SQLite immediately, MongoDB sync in background)
  - Download button triggering DownloadManager with progress indicator
  - "Use This Pose" primary button (60px, Olive Green) opening Camera with overlay pre-loaded ≤1s
  - Related poses carousel at bottom; show lock prompt when accessing poses not yet downloaded
  - **Dependencies:** tasks 6, 9
  - **Req:** 7

- [x] 12. Implement settings screen
  - Create `app/(tabs)/settings.tsx` with sections: General, Appearance, Camera, Downloads, Notifications, Privacy, Developer, About
  - Theme toggle with 200ms cross-fade; camera settings (grid, flash, overlay opacity, auto-capture threshold 80–99, voice toggle, smile toggle)
  - Storage section: downloaded pack sizes, delete all downloads button
  - Privacy: permission overview, "Request Account Deletion" action
  - Developer section: Susant Luitel links (GitHub, YouTube, LinkedIn, Instagram, Facebook, Pinterest, TikTok, X, WhatsApp, Email)
  - **Dependencies:** tasks 5, 6
  - **Req:** 23

- [x] 13. Implement gallery screen (port GalleryScreen.kt)
  - Create `app/gallery/index.tsx` — 3-column FlashList grid sorted by capture date descending
  - Long-press enters multi-select mode with batch delete
  - Per-photo actions: Share, Delete, Favorite, View Metadata (capture date, pose ID, AI score, resolution)
  - System share sheet supporting Instagram, WhatsApp, Facebook, X, Pinterest, TikTok, generic targets
  - Fully offline — no network request needed to view or delete local photos
  - **Dependencies:** tasks 5, 6
  - **Req:** 20

- [x] 14. Implement favorites screen
  - Create `app/(tabs)/favorites.tsx` — Pinterest masonry grid via FlashList
  - Sort options: newest, oldest, category, difficulty
  - Fully offline from SQLite `favorites` table; merge anonymous favorites on sign-in
  - **Dependencies:** tasks 6, 9
  - **Req:** 18

- [x] 15. Port PoseMatcher.kt pose scoring algorithm to TypeScript
  - Create `src/features/ai/domain/types.ts` — port KeyPoint and PoseMatchResult data classes
  - Create `src/features/ai/domain/PoseScoreCalculator.ts` — port `getReferenceSkeletonForKey()` with all 5 keys: OVER_SHOULDER, WALKING_CASUAL, SEATED_CAFE, MIRROR_SELFIE, COUPLE_EMBRACE
  - Port `evaluatePose()` to `computePoseScore()` — preserve scoring algorithm (distance error → 0–100, coerced 15–98)
  - Port guidance cue logic: Move Right/Left/Closer/Back, Straighten Up, Adjusting
  - Port `isAutoCaptureReady` threshold (score ≥ 94%)
  - Create abstract `ScoreCalculator` TypeScript interface
  - **Dependencies:** task 4
  - **Req:** 11, 47.3

- [x] 16. Integrate MediaPipe Pose Landmarker for 33-landmark detection
  - Create `src/features/ai/domain/interfaces/PoseDetector.ts` abstract interface
  - Create `src/features/ai/infrastructure/MediaPipePoseDetector.ts` implementing the interface
  - Run inference on background thread (JSI Worklet); never add >5ms to UI thread budget
  - Track 33 landmarks; ignore landmarks with confidence < 0.60
  - Pause inference within 200ms of backgrounding; resume within 500ms of foregrounding
  - On init failure: fall back to Overlay-only mode, show dismissible toast, log to Crashlytics
  - Target: inference < 100ms per frame on Snapdragon 665-class device
  - **Dependencies:** task 15
  - **Req:** 10, 47.3

- [x] 17. Implement landmark normalisation pipeline
  - Create `src/features/ai/domain/LandmarkNormaliser.ts`
  - Normalise to body-centred, scale-independent coordinate system using shoulder-to-hip distance as reference
  - Account for body scale, camera distance (bounding box height), rotation (torso angle), aspect ratio
  - Discard landmark sets with fewer than 17/33 landmarks above 0.60 confidence
  - Write PBT in `src/__pbt__/normalisation.pbt.ts`: scale invariance, translation invariance, rotation equivariance (≤3pts for |θ|≤10°)
  - **Dependencies:** task 16
  - **Req:** 42

- [x] 18. Build pose score ring and visual coaching skeleton overlay
  - Create `src/features/camera/components/SPScoreRing.tsx` using React Native Skia — animated circular ring
  - Colour bands: 0–40 Red #F44336, 41–70 Orange #FF8A00, 71–90 Green #4CAF50, 91–100 Dark Green #2E7D32
  - Smooth 200ms colour transition between bands; update ring at 30 FPS; ≤33ms arc delta per frame
  - Create `src/features/camera/components/SPSkeletonOverlay.tsx` — Skia 3px rounded lines per segment
  - Per-segment colour: green/orange/red based on match quality; smooth colour transitions
  - Auto-dismiss correction chip after 2 seconds; freeze ring at last value when AI paused
  - **Dependencies:** tasks 15, 16
  - **Req:** 11, 12

- [x] 19. Port VoiceAssistant.kt to TypeScript voice coach service
  - Create `src/features/ai/domain/interfaces/VoiceCoach.ts` abstract interface
  - Create `src/features/ai/domain/VoiceCoachService.ts` using expo-speech (on-device TTS)
  - Rate-limit: max 1 instruction per 2 seconds; never repeat identical instruction consecutively
  - Instructions: "Raise your left arm.", "Move slightly backward.", "Look toward the camera.", "Perfect!", "Smile.", "Hold still."
  - On score ≥ 95: say "Perfect!" then begin auto-capture countdown
  - Silence immediately when `voiceGuidanceEnabled` is false in settings; respect device volume
  - On TTS init failure: continue silently, log to Crashlytics
  - **Dependencies:** task 15
  - **Req:** 13, 47.3

- [x] 20. Implement auto-capture engine with multi-gate logic
  - Create `src/features/ai/domain/AutoCaptureEngine.ts`
  - Gates: pose_score ≥ configurable threshold AND face_detected AND eyes_visible AND camera_stable (gyro delta < 2°/300ms) AND lighting_score ≥ 50
  - Smile gate: optional, enabled/disabled from settings (Req 16.5)
  - 3-second Reanimated countdown ring (3→2→1→Capture); cancel if any gate drops below threshold
  - Threshold default 95, range 80–99, persisted in MMKV; Remote Config key `autoCaptureThreshold`
  - On capture: heavy haptic (expo-haptics) + DSLR shutter sound; 3-second re-arm cooldown
  - Write PBT: gate conjunction invariant, countdown cancellation, threshold boundary
  - **Dependencies:** tasks 16, 17, 19
  - **Req:** 17

- [x] 21. Implement lighting analysis and distance estimation
  - Create `src/features/camera/domain/LightingAnalyser.ts` — analyse brightness, contrast, backlighting from camera frame
  - Lighting score 0–100; update ≥5 times/sec; sun icon indicator on Camera screen
  - Show suggestions: "Turn toward the light.", "Avoid backlight.", "Increase exposure.", "Face the window."
  - Distance estimation from shoulder width + body bounding box: Too Close / Good Distance / Too Far indicator
  - Smile probability and eye-contact detection via MediaPipe face landmarks
  - **Dependencies:** task 16
  - **Req:** 14, 15, 16

- [x] 22. Build camera screen (port CameraScreen.kt)
  - Create `app/(tabs)/camera.tsx` using expo-camera; preview active ≤1s from screen open
  - Front/rear camera flip with 250ms Reanimated transition; auto-mirror overlay for front camera
  - Controls: Flash (Auto/On/Off), HDR toggle, 3s/5s/10s timer, Rule-of-Thirds grid, Golden Ratio grid
  - Port top control bar (flash, timer, grid, aspect ratio, voice mic toggle) from CameraScreen.kt
  - Port bottom controls (overlay transparency slider, overlay flip/lock/reset, shutter button) from CameraScreen.kt
  - Shutter button: 72dp circle, Olive Green border, fill green when isAutoCaptureReady
  - Permission denied: show SPPermissionCard with "Open Settings" — no crash, no blank screen
  - Release camera resources within 500ms when backgrounded or screen locked
  - Never show ads/popups during camera preview
  - **Dependencies:** tasks 5, 6, 18, 20, 21
  - **Req:** 8

- [x] 23. Build pose overlay engine (port PoseOverlayView.kt)
  - Create `src/features/camera/components/SPPoseOverlay.tsx` using React Native Skia canvas
  - Render transparent reference pose overlay on top of live camera preview
  - Gesture Handler support: drag (move), pinch (scale 25–250%), 2-finger rotate (±180°), double-tap (reset 250ms animation), long-press (lock/unlock)
  - Opacity slider 0–100%, default 55%; mirror for front camera automatically
  - Lock indicator badge when locked; render latency < 16ms/frame
  - Port CameraGridOverlay.kt → `SPCameraGridOverlay.tsx` for thirds/golden ratio grid modes
  - **Dependencies:** task 22
  - **Req:** 9

- [x] 24. Implement photo capture with rate limiting check
  - On shutter tap or auto-capture: check CaptureRateLimit before proceeding
  - If limit reached: block capture and show SPCaptureLimitModal (Task 28 prerequisite)
  - If allowed: capture via expo-camera at 1080p (4K on capable devices)
  - Compress to WebP quality ≥85, generate 256×256 thumbnail
  - Store EXIF metadata: pose ID, AI score, timestamp, resolution
  - Save to device gallery via expo-media-library within 3 seconds
  - Insert record into SQLite `captured_photos` table; increment MMKV `captureCount`
  - Emit `photo_capture` analytics event
  - **Dependencies:** tasks 22, 27 (rate limit)
  - **Req:** 8.9

- [x] 25. Build MongoDB Atlas Node.js/Express backend API
  - Create `backend/` Node.js TypeScript project with Express, Mongoose, dotenv, express-rate-limit
  - Connect to MongoDB Atlas; define Mongoose schemas: User (with captureStats), Pose, Category, Favorite, Download, AppConfig
  - Implement endpoints: GET /poses (paginated), GET /poses/:id, GET /categories, POST/DELETE /favorites, GET /favorites, POST /users, GET /app-config, POST /feedback, GET /user/capture-stats, POST /captures, POST /captures/bonus
  - JWT authentication middleware verifying Firebase Auth tokens
  - Deploy to Railway/Render/Fly.io; store base URL in EAS Secrets as EXPO_PUBLIC_MONGODB_API_URL
  - **Dependencies:** none (parallel with client tasks)
  - **Req:** 24, 25, 37

- [x] 26. Implement typed API service layer and React Query hooks
  - Create `src/services/api/client.ts` — Axios instance with Bearer token, 30s timeout, 429 Retry-After backoff
  - Create `src/services/api/{poses,categories,favorites,captures,config}.ts` typed service modules
  - All responses conform to `{ success, data, error: { code, message }, timestamp }` shape
  - React Query hooks: `usePoses`, `useCategories`, `usePoseDetail`, `useFavorites` with stale times (categories 7d, poses 24h, app-config 1h)
  - MMKV used as React Query persistence adapter so cache survives restarts
  - **Dependencies:** tasks 2, 25
  - **Req:** 37, 41

- [x] 27. Implement client-side photo capture rate limiting system (NEW)
  - Create `src/features/camera/domain/CaptureRateLimit.ts`
  - MMKV keys: `captureCount` (int), `windowStartTime` (timestamp ms), `bonusCaptures` (int)
  - On each capture attempt: if now − windowStartTime ≥ 6 hours → reset count=0, windowStartTime=now, bonusCaptures=0
  - Block capture if captureCount ≥ 10 + bonusCaptures; show SPCaptureLimitModal
  - After successful capture: increment captureCount in MMKV + POST /captures to MongoDB
  - On rewarded ad completion: add 5 to bonusCaptures in MMKV + POST /captures/bonus to MongoDB
  - Write unit tests: window reset logic, count boundary (10+bonus), bonus grant
  - **Dependencies:** tasks 2, 25
  - **Req:** new — ad-supported free tier

- [x] 28. Build capture limit UI components (NEW — replaces PremiumScreen.kt)
  - Create `src/features/camera/components/SPCaptureLimitBanner.tsx` — progress arc on Camera screen when ≥8 captures used
  - Create `src/features/camera/components/SPCaptureLimitModal.tsx` — blocks capture at limit, shows "Watch ad for 5 more captures" button and countdown to window reset
  - Create `app/capture-limit/index.tsx` — explains free limit, rewarded ad unlock, window reset countdown
  - All elements have accessibilityLabel; timer shows HH:MM:SS until reset
  - **Dependencies:** tasks 6, 27
  - **Req:** new

- [x] 29. Set up SQLite local database (port PoseDatabase.kt / PoseDao.kt)
  - Create `src/database/sqlite/db.ts` — initialise expo-sqlite, run migrations on startup
  - Create tables: poses, pose_landmarks, favorites, downloads, recent_searches, recent_views, captured_photos (port PoseEntity.kt schema)
  - Create `src/database/sqlite/poseDao.ts` — port PoseDao.kt CRUD methods to TypeScript
  - Create `src/features/poses/infrastructure/SQLitePoseRepository.ts`
  - Create `src/features/favorites/infrastructure/SQLiteFavoritesRepository.ts`
  - **Dependencies:** tasks 4, 25
  - **Req:** 25

- [x] 30. Implement MMKV key-value store configuration
  - Create `src/database/mmkv/mmkvClient.ts` and `src/database/mmkv/keys.ts` with all 13 defined keys
  - Zustand `settingsStore` persisted in MMKV; `premiumStore` removed (no billing)
  - Write PBT in `src/__pbt__/mmkv.pbt.ts`: serialisation round-trip, key isolation
  - **Dependencies:** task 2
  - **Req:** 25

- [x] 31. Implement offline queue and sync (FIFO mutation queue)
  - Create `src/stores/offlineQueueStore.ts` — MMKV-backed FIFO queue for mutations (favorites, analytics, feedback)
  - On connectivity restore: drain queue in enqueue order, retry with exponential backoff (1s→2s→4s, max 3 retries)
  - On max retries exhausted: log to Crashlytics, remove from queue
  - Write PBT: FIFO ordering invariant, retry idempotence
  - **Dependencies:** tasks 29, 30
  - **Req:** 30, 41

- [x] 32. Implement landmark parser and serialiser
  - Create `src/features/ai/domain/LandmarkParser.ts` — parse JSON to PoseLandmarks (33 entries, each with x/y/z/visibility)
  - On malformed/missing fields: return ParseError result, never throw unhandled exception
  - Create `src/features/ai/domain/LandmarkSerializer.ts` — deterministic idempotent JSON stringify
  - Write PBT in `src/__pbt__/landmarkParser.pbt.ts`: round-trip property, error signalling on invalid input, idempotent serialisation
  - **Dependencies:** task 15
  - **Req:** 40

- [x] 33. Implement pose pack download manager
  - Create `src/features/downloads/domain/DownloadManager.ts` using expo-file-system
  - Download ZIP bundle (WebP image + PNG overlay + landmark JSON + metadata JSON)
  - Progress indicator 0–100% updated ≥1/sec; pause/resume support; auto-resume within 5s of reconnect
  - SHA-256 integrity check after download; delete corrupted bundle + notify user with retry option
  - Block new downloads if < 50MB free storage; prevent duplicate downloads (idempotent state)
  - Show storage usage in Downloads screen; allow deletion of individual packs
  - Write PBT: idempotence, pause-resume integrity, offline read after download
  - **Dependencies:** tasks 25, 29
  - **Req:** 19

- [x] 34. Implement app-config remote control from MongoDB
  - On each app launch: GET /app-config → cache in MMKV with 1-hour stale time
  - Respect: maintenanceMode (full-screen notice), minimumVersion (force-update prompt), latestVersion (soft banner), adsEnabled, autoCaptureThreshold, voiceGuidanceEnabled
  - **Dependencies:** tasks 25, 26, 30
  - **Req:** 46

- [x] 35. Set up AdMob with UMP consent and ad suppression zones
  - Create `src/features/ads/domain/interfaces/AdAdapter.ts` abstract interface
  - Create `src/features/ads/infrastructure/AdMobAdapter.ts` implementing the interface
  - UMP consent flow via mobileAds().initialize() for GDPR/CCPA regions before any ad is shown
  - `isAdSuppressed()` returns true whenever cameraStore.isActive === true OR during onboarding OR during permission dialogs
  - All ad placements clearly labelled "Ad" or "Sponsored"; close buttons never hidden
  - **Dependencies:** tasks 2, 4
  - **Req:** 22

- [x] 36. Implement native ads in Home, Category, and Pose list feeds
  - Insert one native ad unit every 10–15 content items using FlashList interleaving
  - Never show native ads: during camera, AI guidance, auto-capture countdown, onboarding, after photo capture
  - **Dependencies:** task 35
  - **Req:** 22

- [x] 37. Implement rewarded ads for capture limit unlock
  - Load rewarded ad in background when captureCount ≥ 8 (pre-load before needed)
  - Show rewarded ad when user taps "Watch ad for 5 more captures" in SPCaptureLimitModal
  - On full ad completion: grant 5 bonusCaptures immediately (MMKV + POST /captures/bonus)
  - On partial view or close: no reward; dismiss modal
  - Also use rewarded ad to temporarily unlock preview of a premium pose
  - Write PBT: rewarded completeness invariant (reward iff full view completed, not on partial)
  - **Dependencies:** tasks 27, 28, 35
  - **Req:** 22

- [x] 38. Implement interstitial and app-open ads with frequency caps
  - App-open ad: show on first app launch of the day; track last shown date in MMKV
  - Interstitial: maximum once every 8–10 minutes of active use, only between browsing sessions
  - Track last interstitial timestamp in MMKV; enforce cap strictly
  - Write PBT: frequency cap ≤ floor(T/10) interstitials for T-minute session
  - **Dependencies:** task 35
  - **Req:** 22

- [x] 39. Set up Firebase Authentication (anonymous + Google + email)
  - Create `src/features/auth/domain/interfaces/AuthAdapter.ts` abstract interface
  - Create `src/features/auth/infrastructure/FirebaseAuthAdapter.ts`
  - Anonymous sign-in on first launch; Google Sign-In and email/password as opt-in
  - Store Firebase ID token exclusively in Expo SecureStore (Android Keystore); never in MMKV or AsyncStorage
  - Auto-refresh expiring tokens; restore session on relaunch without prompting user
  - On sign-out: clear SecureStore tokens and MMKV session metadata
  - On Firebase unreachable: continue with locally cached session
  - **Dependencies:** tasks 2, 4
  - **Req:** 3, 26

- [x] 40. Implement accessibility across all screens
  - Add accessibilityLabel and accessibilityHint to all interactive elements
  - Ensure all touch targets ≥ 48×48dp; verify with TalkBack on Android
  - Dynamic text scaling: all screens scale with system font size without layout breakage
  - Reduce Motion: disable parallax/spring/hero animations, use fade-only transitions
  - WCAG AA colour contrast for all text in both light and dark themes
  - **Dependencies:** tasks 7–14
  - **Req:** 28

- [x] 41. Set up Firebase Analytics, Crashlytics, and performance monitoring
  - Log core events: app_open, screen_view, pose_open, camera_open, photo_capture, favorite_add, search_started, native_ad_loaded, rewarded_completed, auto_capture, voice_guidance_played, capture_limit_hit, reward_ad_watched
  - Set user properties: userType (anonymous/google), country, language, appVersion, deviceModel
  - Never log passwords, camera frames, tokens, or biometric data
  - Crashlytics custom keys: appVersion, deviceModel, osVersion, currentScreen
  - Root error boundary reports unhandled JS errors to Crashlytics
  - **Dependencies:** task 2
  - **Req:** 27

- [x] 42. Implement opt-in push notifications
  - Request notification permission only when user enables from Settings — never on first launch
  - Notification types: daily pose suggestion, download completed, capture window reset
  - Deep-link on notification tap to relevant screen
  - Per-type toggle in Settings; never re-request permission unless user visits Notifications settings
  - **Dependencies:** tasks 12, 39
  - **Req:** 33

- [x] 43. Implement full error handling, resilience, and blank-screen prevention
  - Root error boundary in app/_layout.tsx → full-screen recovery + "Restart App" + Crashlytics report
  - Per-screen error boundaries → error card with Retry button, never blank white
  - All screens implement loading (skeleton), empty (illustrated), error (retry) states via SPScreenTemplate
  - All HTTP 4xx/5xx errors mapped to user-readable messages; no raw codes shown
  - Storage full on capture → SPDialog "Storage Full — Manage Storage", camera session preserved
  - Firestore/API timeout: exponential backoff 1s→2s→4s, user message after 3 failures
  - **Dependencies:** tasks 6, 7
  - **Req:** 35

- [x] 44. Implement Google Play compliance measures
  - Request Camera permission only immediately before Camera screen opens with in-app rationale
  - Request Photos/Media permission only immediately before saving a photo
  - Never request: Contacts, SMS, Call Logs, Background Location, Device Administrator
  - Privacy Policy URL and Terms & Conditions URL surfaced in Settings
  - Data Safety declaration: capture stats, analytics events, no payment data (no billing)
  - "Request Account Deletion" in Settings → POST /feedback with type=account_deletion
  - Pass Google Play Pre-Launch Report with zero critical issues
  - **Dependencies:** all
  - **Req:** 31

- [x] 45. Write unit tests targeting 85% domain coverage
  - `PoseScoreCalculator.test.ts` — scoring algorithm, regional weights sum to 100%, colour band boundaries
  - `LandmarkNormaliser.test.ts` — scale/translation/rotation normalisation
  - `AutoCaptureEngine.test.ts` — gate conjunction, threshold boundary, countdown state machine
  - `LandmarkParser.test.ts` — valid/invalid JSON, serialise/parse round-trip
  - `CaptureRateLimit.test.ts` — window reset, count increment, bonus grant, blocking at limit
  - `OverlayTransformEngine.test.ts` — gesture transform maths (scale, rotation, translate)
  - All hooks tested with @testing-library/react-native
  - **Dependencies:** tasks 15–27
  - **Req:** 38

- [x] 46. Write property-based tests with fast-check
  - `poseScore.pbt.ts` — range [0,100], identity ≥95, monotonicity, weighted sum = 100%, normalisation round-trip
  - `autoCapture.pbt.ts` — gate conjunction invariant, countdown cancellation, threshold boundary
  - `captureRateLimit.pbt.ts` — window reset invariant, count never exceeds 10+bonusCaptures
  - `download.pbt.ts` — idempotence, pause-resume SHA-256 integrity
  - `landmarkParser.pbt.ts` — round-trip, error signalling, idempotent serialisation
  - `mmkv.pbt.ts` — serialisation round-trip, key isolation
  - `adFrequency.pbt.ts` — frequency cap ≤ floor(T/10), exclusion zone invariant
  - `normalisation.pbt.ts` — scale invariance, translation invariance, rotation equivariance
  - **Dependencies:** task 45
  - **Req:** 38

- [x] 47. Write E2E tests with Detox on Android emulator
  - `onboarding.e2e.ts` — skip and complete flows; verify onboardingCompleted in MMKV
  - `captureFlow.e2e.ts` — pose detail → camera → capture → gallery; verify file saved
  - `rateLimit.e2e.ts` — take 10 photos, verify block, watch rewarded ad, verify 5 bonus captures
  - `favorites.e2e.ts` — add/remove favorite; verify offline access
  - `downloads.e2e.ts` — download pose pack, pause, resume, verify offline access
  - `settings.e2e.ts` — theme switch, voice toggle, capture threshold change
  - **Dependencies:** tasks 45, 46
  - **Req:** 38

- [x] 48. Set up CI/CD pipeline and final production build
  - GitHub Actions pipeline: tsc --noEmit → eslint → prettier --check → npm audit → jest --coverage → detox
  - Block merge on any failure; coverage threshold 85% lines
  - EAS production build: signed AAB, proguard/R8 enabled, targetSdkVersion latest, minSdkVersion 26
  - Test on Android 8 (API 26), Android 10, Android 12, Android 14, and latest stable
  - Submit to Google Play internal testing track; promote to production after Pre-Launch Report passes
  - **Dependencies:** tasks 44, 45, 46, 47
  - **Req:** 38, 39

## Task Dependency Graph

```json
{
  "waves": [
    {
      "wave": 1,
      "tasks": ["1", "25"],
      "description": "Project scaffolding and MongoDB backend (parallel)"
    },
    {
      "wave": 2,
      "tasks": ["2", "3"],
      "description": "Dependencies and EAS setup"
    },
    {
      "wave": 3,
      "tasks": ["4", "30"],
      "description": "Design tokens, theme, MMKV"
    },
    {
      "wave": 4,
      "tasks": ["5", "26", "29"],
      "description": "Navigation, API service layer, SQLite"
    },
    {
      "wave": 5,
      "tasks": ["6", "27", "31"],
      "description": "Component library, rate limit domain, offline queue"
    },
    {
      "wave": 6,
      "tasks": ["7", "8", "15", "28", "39"],
      "description": "Splash, onboarding, PoseMatcher port, limit UI, auth"
    },
    {
      "wave": 7,
      "tasks": ["9", "16", "32", "33", "35"],
      "description": "Home screen, MediaPipe, landmark parser, downloads, AdMob setup"
    },
    {
      "wave": 8,
      "tasks": ["10", "11", "12", "13", "14", "17", "19", "34", "36"],
      "description": "All remaining screens, normalisation, voice coach, config, native ads"
    },
    {
      "wave": 9,
      "tasks": ["18", "20", "21", "37", "38", "40", "41"],
      "description": "Score ring, auto-capture, lighting, rewarded ads, interstitials, accessibility, analytics"
    },
    {
      "wave": 10,
      "tasks": ["22", "42", "43"],
      "description": "Camera screen, notifications, error handling"
    },
    {
      "wave": 11,
      "tasks": ["23", "24"],
      "description": "Overlay engine, photo capture with rate limit check"
    },
    {
      "wave": 12,
      "tasks": ["44", "45"],
      "description": "Play compliance, unit tests"
    },
    {
      "wave": 13,
      "tasks": ["46", "47"],
      "description": "PBT and E2E tests"
    },
    {
      "wave": 14,
      "tasks": ["48"],
      "description": "CI/CD and production release"
    }
  ]
}
```
                          │
                          ▼
                    4 (tokens/theme)
                          │
                    ┌─────┴──────┐
                    ▼            ▼
              5 (nav layout)   30 (MMKV)
                    │            │
           ┌────────┤            ▼
           ▼        │        31 (offline queue)
     6 (components) │
           │        ▼
    ┌──────┤    7 (splash) ──► 8 (onboarding)
    │      │
    ▼      ▼
  9 (home) ──► 10 (categories)
  9 (home) ──► 11 (pose detail)
  9 (home) ──► 14 (favorites)
  5 ──► 12 (settings)
  5 ──► 13 (gallery)
        │
        ▼
25 (MongoDB backend) ──► 26 (API service) ──► 29 (SQLite)
                                │
                         ┌──────┴──────┐
                         ▼             ▼
                    27 (rate limit)  33 (downloads)
                         │
                    28 (limit UI)
                         │
                         ▼
15 (PoseMatcher port) ──► 16 (MediaPipe) ──► 17 (normalisation)
        │                       │
        ▼                       ▼
   19 (VoiceCoach)        18 (score ring + skeleton)
        │                       │
        └──────────┬────────────┘
                   ▼
             20 (auto-capture) ──► 21 (lighting/distance)
                                         │
                                         ▼
                                   22 (camera screen) ──► 23 (overlay engine)
                                         │
                                         ▼
                                   24 (photo capture + rate limit check)

35 (AdMob setup) ──► 36 (native ads)
                ──► 37 (rewarded ads) ◄── 27 (rate limit)
                ──► 38 (interstitial/app-open)

39 (Firebase Auth) ──► 41 (Analytics/Crashlytics)
                   ──► 42 (push notifications)

tasks 7-14 ──► 40 (accessibility)
tasks 7-14 ──► 43 (error handling)
all ──► 44 (Play compliance)

tasks 15-27 ──► 45 (unit tests) ──► 46 (PBT) ──► 47 (E2E) ──► 48 (CI/CD + release)
```

## Notes

- **MongoDB replaces Firestore** for all remote persistence. The backend is a Node.js/Express API (see Task 25) deployed separately from the Expo client. Authentication still uses Firebase Auth for JWT tokens.
- **No subscriptions or Google Play Billing.** The PremiumScreen.kt is replaced entirely by the capture-limit flow (Tasks 27–28) and the rewarded ad system (Task 37).
- **10 captures per 6-hour rolling window** is enforced both client-side (MMKV, Task 27) and server-side (MongoDB captureStats, Task 25) for anti-abuse.
- **Rewarded ads unlock 1 extra captures** per watch — this is the sole monetisation mechanic alongside passive native/interstitial/app-open ads.
- The existing Android Kotlin app screens map directly to Expo Router routes — do not rewrite from scratch, port the logic and UI patterns.
- All domain logic (PoseScoreCalculator, AutoCaptureEngine, LandmarkNormaliser, CaptureRateLimit) lives in `src/features/*/domain/` with zero React Native imports, enabling pure Node.js unit and property-based testing.
