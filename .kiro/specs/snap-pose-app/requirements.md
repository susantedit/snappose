# Requirements Document

## Introduction

Snap Pose is a production-quality, AI-powered mobile photography assistant built with React Native (Expo) and TypeScript.
The application helps users recreate professional poses through real-time camera overlays, on-device AI pose detection
(MediaPipe Pose), voice coaching, automatic capture, lighting analysis, and smart recommendations — all working offline-first.

The platform targets Android (API 26+) as the primary release, with iOS as a future milestone.
Monetization is achieved entirely through Google AdMob (native, rewarded, interstitial, and app-open ads). The app is
100% free — there are no paid tiers or subscription gates. The backend is powered by Firebase (Authentication, Firestore,
Storage, Analytics, Crashlytics, Remote Config, App Check, Cloud Messaging). Local persistence uses MMKV and SQLite.

This document derives all requirements from the complete PRD documentation set (PROJECT_OVERVIEW, FUNCTIONAL_REQUIREMENTS,
NON_FUNCTIONAL_REQUIREMENTS, USER_STORIES, UI_UX_SPECIFICATION, AI_POSE_ENGINE, CAMERA_ENGINE, MONETIZATION, ANALYTICS,
SECURITY, GOOGLE_PLAY_COMPLIANCE, DESIGN_SYSTEM, DATABASE_SCHEMA, API_SPECIFICATION, FIREBASE_SETUP, and TASKS).

---

## Glossary

- **App**: The Snap Pose React Native (Expo) application.
- **AI_Engine**: The on-device pose detection and scoring module powered by MediaPipe Pose Landmarker.
- **Camera_Engine**: The module combining Expo Camera, React Native Skia overlays, gesture handling, and image capture.
- **Overlay**: A transparent PNG or SVG silhouette of a reference pose rendered over the live camera preview.
- **Skeleton**: The real-time 33-landmark body skeleton drawn by the AI_Engine over the camera preview.
- **Pose_Score**: A normalised 0–100 integer representing similarity between the user's detected body pose and the reference pose.
- **Reference_Pose**: A curated pose stored with image, overlay asset, landmark JSON, and metadata.
- **Auto_Capture**: The subsystem that triggers an automatic photo capture when all quality gates are met.
- **Voice_Coach**: The on-device Text-to-Speech module that delivers short corrective instructions to the user.
- **Download_Manager**: The module responsible for downloading, caching, pausing, resuming, and deleting pose packs.
- **AdMob**: Google AdMob SDK used to display native, rewarded, interstitial, and app-open advertisements.
- **Firebase**: The backend-as-a-service platform providing authentication, Firestore, Storage, Analytics, Crashlytics, Remote Config, App Check, and Cloud Messaging.
- **Firestore**: The Firebase cloud NoSQL database used for remote data.
- **MMKV**: The fast on-device key-value store used for preferences and lightweight caching.
- **SQLite**: The on-device relational database used for offline pose pack data.
- **Landmark**: A single normalised (x, y, z, visibility) coordinate representing one body keypoint detected by MediaPipe.
- **Pose_Pack**: A downloadable bundle containing pose images, overlays, landmark JSON, and metadata for offline use.
- **NativeWind**: The utility-first CSS-in-JS styling library built on TailwindCSS for React Native.
- **Reanimated**: React Native Reanimated v3+ used for 60 FPS animations and gesture-driven interactions.
- **Skia**: React Native Skia used for hardware-accelerated skeleton and overlay rendering.
- **FlashList**: The high-performance list component used for scrollable pose and category grids.
- **React_Query**: TanStack Query used for data fetching, caching, and synchronisation state management.
- **Zustand**: The lightweight global state management library.
- **EAS**: Expo Application Services used for builds, secrets management, and OTA updates.
- **App_Check**: Firebase App Check backed by Play Integrity API (Android) to prevent unauthorised API access.
- **Capture_Window**: The rolling 6-hour period used to track the number of photos captured for rate limiting.
- **Rate_Limiter**: The module that enforces the photo capture limit (10 per 6-hour window) and manages rewarded-ad unlocks.
- **ANR**: Application Not Responding — an Android error triggered when the UI thread is blocked for more than 5 seconds.
- **GDPR**: General Data Protection Regulation governing EU user data.
- **CCPA**: California Consumer Privacy Act governing Californian user data.
- **UMP**: Google User Messaging Platform for ad consent management.
- **WCAG_AA**: Web Content Accessibility Guidelines Level AA — the minimum accessibility compliance target.
- **BlurHash**: A compact image placeholder representation used before full images load.
- **WebP**: The preferred compressed image format for pose assets.
- **Lottie**: The animation library used for Lottie JSON animation playback.
- **TalkBack**: Android screen reader assistive technology.


---

## Requirements

### Requirement 1: Application Startup & Splash Screen

**User Story:** As a first-time user, I want the application to launch with a branded splash screen within 2 seconds, so that I immediately understand the product and am not left staring at a blank display.

#### Acceptance Criteria

1. THE App SHALL display a splash screen containing the Snap Pose logo, the tagline "Pose it. Snap it. Share it.", and an animated loading indicator on every cold start.
2. WHEN the app is cold-started, THE App SHALL complete the splash screen and transition to the next screen within 2 seconds on supported mid-range Android devices.
3. WHEN the app is warm-started, THE App SHALL complete the transition to the active screen within 1 second.
4. THE App SHALL animate the splash logo from scale 0.8 to 1.0 with opacity 0 to 100% over no more than 400 ms.
5. WHILE the splash screen is displayed, THE App SHALL NOT present any interactive buttons or navigation elements.
6. WHEN the splash sequence completes, THE App SHALL navigate to the Onboarding screen if the user is launching the app for the first time, otherwise to the Home screen.

---

### Requirement 2: Onboarding Flow

**User Story:** As a new user, I want a concise three-page onboarding experience so that I understand the app's AI photography features before I start using it.

#### Acceptance Criteria

1. THE App SHALL display the onboarding flow on the first launch only, and never again unless the user explicitly resets onboarding from Settings.
2. THE App SHALL store onboarding completion status in MMKV under the key `onboardingCompleted` as a boolean.
3. THE Onboarding screen SHALL contain exactly three pages with swipe-to-advance support, page-dot progress indicators, a skip button, and a "Start Exploring" call-to-action on the final page.
4. WHEN the user taps the skip button on any onboarding page, THE App SHALL immediately navigate to the Home screen and mark onboarding as complete.
5. WHEN the user reaches the third page and taps "Start Exploring", THE App SHALL navigate to the Home screen and mark onboarding as complete.
6. THE Onboarding screen SHALL use parallax, fade, and slide animations between pages, with each page transition completing in no more than 350 ms.
7. IF the user is on the Onboarding screen and the device's Reduce Motion setting is enabled, THEN THE Onboarding screen SHALL use fade transitions only and suppress parallax effects.

---

### Requirement 3: Authentication

**User Story:** As a user, I want to use the app immediately without creating an account, and optionally sign in later to sync my favorites and unlock cloud features.

#### Acceptance Criteria

1. THE App SHALL allow users to browse all free content, use the camera, and save photos locally without requiring authentication.
2. THE App SHALL support anonymous sign-in via Firebase Authentication on first launch to establish a user session.
3. WHEN a user chooses to sign in, THE App SHALL support Google Sign-In, and email/password authentication via Firebase Authentication.
4. WHEN authentication succeeds, THE App SHALL store the Firebase ID token securely using Expo SecureStore (Android Keystore backed).
5. WHEN the authentication token expires, THE App SHALL automatically refresh the token without user intervention.
6. WHEN the user logs out, THE App SHALL clear all stored authentication tokens and session data from secure storage.
7. THE App SHALL restore the previous authenticated session on subsequent app launches without requiring the user to sign in again.
8. IF Firebase Authentication is unreachable, THEN THE App SHALL continue operating in offline mode using the locally cached session.


---

### Requirement 4: Home Screen & Discovery

**User Story:** As a user, I want a rich home screen that surfaces trending, recommended, and recently viewed poses across categories, so I can quickly find something interesting to try.

#### Acceptance Criteria

1. THE Home screen SHALL display a search bar, a horizontally scrollable category chip row, a trending poses section, a recommended poses section, a recently viewed section (last 20 poses stored in MMKV), and an editor's picks section.
2. WHEN the App fetches home screen data, THE App SHALL display BlurHash skeleton placeholders immediately and replace them with real content as data loads.
3. THE Home screen SHALL never display a blank white screen; every data-loading state SHALL use a skeleton or shimmer placeholder.
4. WHEN no internet connection is available, THE Home screen SHALL display downloaded and cached content, and show an offline indicator banner.
5. THE Home screen SHALL include a floating circular camera action button (72 px, Olive Green) that opens the Camera screen when tapped.
6. WHEN the user scrolls the home screen, THE App SHALL maintain 60 FPS scroll performance using FlashList for pose card lists.
7. WHEN home screen data has not changed since the last fetch, THE React_Query cache SHALL serve the cached data within 10 ms from the local MMKV-backed cache layer.

---

### Requirement 5: Category Browsing

**User Story:** As a user, I want to browse all pose categories in a grid so I can discover poses for my specific shooting scenario.

#### Acceptance Criteria

1. THE App SHALL display a minimum of 23 pose categories including: Beach, Cafe, Mountain, Nature, Wedding, Festival, Friends, Couple, Solo, Selfie, Luxury, Car, Bike, Gym, Office, Traditional, Fashion, Camping, Forest, Snow, Golden Hour, Night, and Travel.
2. THE Categories screen SHALL present categories in a 2-column grid using FlashList, each card showing a real photograph, category title, and pose count.
3. WHEN a category is tapped, THE App SHALL navigate to the filtered pose list for that category with a shared-element hero transition completing within 450 ms.
4. THE Categories screen SHALL load category data from the local SQLite database first and then refresh from Firestore in the background.

---

### Requirement 6: Pose Search

**User Story:** As a user, I want to search poses instantly by keyword, category, or difficulty so I can find the exact look I want in under 200 ms.

#### Acceptance Criteria

1. THE Search screen SHALL display a search bar with debounced input triggering results within 200 ms after the user pauses typing.
2. WHEN the user starts typing, THE Search screen SHALL show live suggestions from recent search history (stored in SQLite) and trending keywords.
3. THE App SHALL support filtering search results by: category, difficulty (easy/medium/hard), orientation (portrait/landscape), and indoor/outdoor.
4. THE App SHALL store the last 20 search keywords in SQLite and display them as recent searches when the search bar is focused and empty.
5. WHEN a search returns no results, THE Search screen SHALL display an empty state with the message "No poses found" and a "Explore Categories" button.
6. WHEN the user clears the search bar, THE Search screen SHALL return to the recent searches and trending keywords view.


---

### Requirement 7: Pose Detail Screen

**User Story:** As a user, I want to view full pose information — photo, overlay preview, lighting tips, camera angle, and difficulty — before launching the camera, so I know exactly what to expect.

#### Acceptance Criteria

1. THE Pose_Detail screen SHALL display: a full-width hero image (16:9 aspect ratio with parallax scroll), pose name, category, difficulty indicator, indoor/outdoor tag, estimated distance, recommended camera angle, recommended lens, lighting tips, body direction instructions, and related poses carousel.
2. THE Pose_Detail screen SHALL include a Favorite button, a Download button, and a "Use This Pose" primary button (height 60 px, Olive Green).
3. WHEN the user taps "Use This Pose", THE App SHALL open the Camera screen with the corresponding Overlay pre-loaded within 1 second.
4. WHEN the user taps the Favorite button, THE App SHALL toggle the favorite state optimistically in local storage and sync to Firestore when online.
5. WHEN the user taps the Download button, THE Download_Manager SHALL begin downloading the Pose_Pack and display a progress indicator.

---

### Requirement 8: Camera Engine

**User Story:** As a user, I want the camera to open in under 1 second, show my chosen pose overlay, and provide all necessary controls so I can compose and capture my shot effortlessly.

#### Acceptance Criteria

1. WHEN the user opens the Camera screen, THE Camera_Engine SHALL activate the camera preview within 1 second.
2. THE Camera screen SHALL support both rear and front cameras with animated flip transitions completing in 250 ms.
3. THE Camera_Engine SHALL capture images at 1080 p resolution by default, with 4K capture available on capable devices.
4. THE Camera screen SHALL support: Flash (Auto/On/Off), HDR toggle, 3-second/5-second/10-second timer, Rule-of-Thirds grid, and Golden Ratio grid overlays.
5. THE Camera_Engine SHALL deliver preview frames at a minimum of 30 FPS and target 60 FPS on supported devices.
6. WHEN the camera capture button is tapped, THE Camera_Engine SHALL capture the image within 150 ms.
7. WHEN the camera is backgrounded or the screen is locked, THE Camera_Engine SHALL immediately stop the camera preview and release camera resources.
8. IF the user has denied camera permission, THEN THE App SHALL display a permission explanation card with a link to open the device Settings, and shall NOT crash or display a blank screen.
9. WHEN a photo is captured, THE App SHALL compress the image to WebP format, generate a thumbnail, store EXIF metadata including Pose ID and AI Score, and save to the on-device gallery immediately.
10. THE Camera screen SHALL never display advertisements, pop-ups, or overlapping UI during active camera preview or pose alignment.

---

### Requirement 9: Pose Overlay Engine

**User Story:** As a user, I want to position, resize, and rotate a transparent pose overlay on the live camera preview so I can align my body to the reference pose precisely.

#### Acceptance Criteria

1. THE Camera_Engine SHALL render the Overlay as a transparent layer on top of the live camera preview using React Native Skia.
2. THE Overlay SHALL support the following gesture interactions: drag to move, pinch to resize (25%–250% scale), two-finger rotate (−180° to +180°), double-tap to reset to default position, and long-press to lock/unlock.
3. THE Overlay SHALL support an opacity slider with range 0%–100% and a default of 55%.
4. WHEN the user locks the Overlay, THE App SHALL prevent all gesture transformations and display a lock indicator until unlocked.
5. WHEN the user taps "Reset", THE Overlay SHALL animate back to the default centered position and scale within 250 ms.
6. THE Overlay SHALL support mirroring (horizontal flip) to match front-camera selfie orientation.
7. WHEN the user switches between front and rear camera, THE Camera_Engine SHALL automatically mirror the Overlay for front-camera mode.
8. THE Overlay rendering latency SHALL be less than 16 ms per frame to maintain 60 FPS.


---

### Requirement 10: AI Pose Detection & Landmark Tracking

**User Story:** As a user, I want the app to detect my body landmarks in real time so I receive live feedback on how closely my pose matches the reference.

#### Acceptance Criteria

1. THE AI_Engine SHALL track 33 body landmarks (nose, eyes, ears, shoulders, elbows, wrists, hips, knees, ankles, heels, and toes) using MediaPipe Pose Landmarker, running entirely on-device.
2. THE AI_Engine SHALL process frames and update landmark positions at 30–60 FPS during active camera sessions.
3. THE AI_Engine SHALL normalise landmark coordinates for body scale, camera distance, rotation, and aspect ratio before scoring.
4. THE AI_Engine SHALL ignore landmarks with a confidence score below 0.60.
5. WHEN landmark confidence falls below 0.45 for more than 500 ms, THE AI_Engine SHALL pause pose scoring and display "Step into the frame."
6. THE AI_Engine SHALL complete pose detection inference in less than 100 ms per frame on mid-range Android devices (e.g., Snapdragon 665 class or equivalent).
7. THE AI_Engine SHALL run all inference asynchronously on a background thread to ensure the UI thread is never blocked.
8. WHEN the app is backgrounded, THE AI_Engine SHALL immediately pause all inference to conserve CPU and battery.
9. IF the AI_Engine fails to initialise, THEN THE Camera_Engine SHALL fall back to Overlay-only mode and display a non-blocking error notification.
10. THE AI_Engine SHALL be available fully offline, requiring no network connection for inference.

---

### Requirement 11: Pose Match Scoring

**User Story:** As a user, I want to see a live 0–100% similarity score between my pose and the reference pose, colour-coded so I understand at a glance how close I am.

#### Acceptance Criteria

1. THE AI_Engine SHALL compute the Pose_Score using joint angles, limb orientation, relative body proportions, head direction, torso rotation, hand position, leg position, and symmetry.
2. THE AI_Engine SHALL weight body regions as follows: Shoulders 15%, Arms 20%, Hands 10%, Torso 20%, Legs 20%, Head 10%, Feet 5%.
3. THE App SHALL display the Pose_Score as an animated circular progress ring updating smoothly at 30 FPS without visible flickering or jump discontinuities.
4. THE App SHALL colour the Pose_Score ring according to these ranges: 0–40 = Red (#F44336), 41–70 = Orange (#FF8A00), 71–90 = Light Green (#4CAF50), 91–100 = Dark Green (#2E7D32).
5. THE AI_Engine SHALL compute each Pose_Score update in less than 50 ms.
6. WHEN the Pose_Score transitions between colour bands, THE App SHALL smoothly animate the colour change rather than snapping.
7. THE AI_Engine SHALL produce stable score values that do not oscillate more than ±5 points between consecutive frames when the user is stationary.

**Correctness Properties for Property-Based Testing:**

- **Score range invariant**: For all valid landmark inputs, the Pose_Score SHALL always be an integer in [0, 100].
- **Score stability under identity**: When the user's landmarks exactly match the reference landmarks (within floating-point tolerance), the Pose_Score SHALL be 95 or higher.
- **Score monotonicity (near-identity)**: As the normalised angular distance between user landmarks and reference landmarks decreases monotonically, the Pose_Score SHALL not decrease.
- **Weighted sum invariant**: The sum of all body region weights SHALL equal exactly 100%.
- **Normalisation round-trip**: FOR ALL valid raw landmark sets, normalise(denormalise(normalise(landmarks))) SHALL equal normalise(landmarks) within floating-point tolerance (round-trip idempotence).


---

### Requirement 12: Real-Time Visual Coaching

**User Story:** As a user, I want the AI to highlight incorrect body parts in colour so I know exactly which limb to adjust.

#### Acceptance Criteria

1. THE AI_Engine SHALL render the Skeleton over the camera preview using React Native Skia with 3 px rounded lines.
2. THE AI_Engine SHALL colour each body segment according to match quality: Green (#4CAF50) for correct, Orange (#FF8A00) for nearly correct, Red (#F44336) for incorrect.
3. THE AI_Engine SHALL display only the single highest-priority correction suggestion at a time as a floating chip (e.g., "⬆ Raise Arm", "⬅ Move Left").
4. WHEN a correction chip is displayed, THE App SHALL automatically dismiss it after 2 seconds.
5. THE AI_Engine SHALL animate segment colour transitions smoothly rather than switching instantaneously.
6. THE Skeleton SHALL be rendered on every valid frame where landmark confidence is above 0.60.

---

### Requirement 13: AI Voice Coaching

**User Story:** As a user, I want the AI to give me short, calm verbal instructions so I can adjust my pose without looking at the screen.

#### Acceptance Criteria

1. THE Voice_Coach SHALL use on-device Android TextToSpeech to deliver instructions without requiring internet access.
2. THE Voice_Coach SHALL issue at most one instruction every 2 seconds.
3. THE Voice_Coach SHALL not repeat an identical instruction consecutively.
4. THE Voice_Coach SHALL deliver short, natural-language corrections such as: "Raise your left arm.", "Move slightly backward.", "Look toward the camera.", "Perfect!", "Smile.", "Hold still."
5. WHEN the Pose_Score reaches 95 or higher, THE Voice_Coach SHALL say "Perfect!" before Auto_Capture countdown begins.
6. WHEN the user disables voice guidance from Settings, THE Voice_Coach SHALL be silenced immediately and remain silent until re-enabled.
7. THE Voice_Coach SHALL respect the device's current audio volume without modifying system volume settings.
8. IF text-to-speech initialisation fails, THEN THE App SHALL continue camera and AI functionality silently and log the failure to Crashlytics.

---

### Requirement 14: Distance Estimation

**User Story:** As a user, I want the app to tell me whether I am too close or too far from the camera so I can position myself at the right distance for the shot.

#### Acceptance Criteria

1. THE AI_Engine SHALL estimate subject distance using shoulder width, hip width, and body bounding box relative to the camera field of view.
2. THE Camera screen SHALL display a distance indicator with three states: "Too Close" (Red), "Good Distance" (Green), "Too Far" (Red).
3. WHEN the subject is at the optimal distance, THE distance indicator SHALL display green.
4. THE AI_Engine SHALL update the distance estimate in real time at the same rate as pose landmark updates.

---

### Requirement 15: Lighting Analysis

**User Story:** As a user, I want the app to analyse the camera preview's lighting and suggest improvements so I take well-lit photos.

#### Acceptance Criteria

1. THE AI_Engine SHALL analyse the live camera preview for brightness, contrast, face illumination, shadow direction, and backlighting.
2. WHEN lighting is inadequate, THE App SHALL display actionable suggestions including: "Turn toward the light.", "Avoid backlight.", "Increase exposure.", "Face the window."
3. THE App SHALL display a lighting score indicator (0–100) represented by a sun icon on the Camera screen.
4. WHEN lighting conditions are acceptable, THE App SHALL display the lighting indicator in green and suppress lighting suggestions.
5. THE AI_Engine SHALL update the lighting score at least 5 times per second during active camera sessions.


---

### Requirement 16: Smile & Eye Contact Detection

**User Story:** As a user, I want the app to detect my smile and eye contact so the auto-capture produces a photo where I look natural and engaged.

#### Acceptance Criteria

1. THE AI_Engine SHALL detect smile probability from the face landmarks tracked by MediaPipe.
2. WHEN a smile is detected, THE Camera screen SHALL display a "😊 Nice smile!" indicator.
3. THE AI_Engine SHALL detect whether the subject's eyes are open and oriented toward the camera.
4. WHEN eye contact is not detected, THE Voice_Coach SHALL suggest "Look at the camera."
5. Smile detection SHALL be optional for the Auto_Capture trigger; the user SHALL be able to enable or disable it from Settings.

---

### Requirement 17: Auto Capture Engine

**User Story:** As a user, I want the app to automatically take the photo at the perfect moment — when my pose score is high and my smile and lighting are acceptable — so I never miss the ideal frame.

#### Acceptance Criteria

1. THE Auto_Capture engine SHALL trigger only when ALL of the following conditions are simultaneously met: Pose_Score ≥ 95, face is detected, eyes are visible, camera is stable (gyroscope delta < 2° over 300 ms), and lighting score is acceptable.
2. WHEN all Auto_Capture conditions are met, THE App SHALL begin a 3-second countdown (3 → 2 → 1 → Capture) displayed as an animated ring overlay.
3. WHEN the Pose_Score drops below 95 during the countdown, THE App SHALL cancel the countdown and reset without capturing.
4. WHEN the countdown completes, THE Camera_Engine SHALL capture the image as defined in Requirement 8 (Acceptance Criteria 9).
5. WHEN Auto_Capture fires, THE App SHALL provide heavy haptic feedback and play the soft DSLR capture sound.
6. THE configurable auto-capture threshold SHALL default to 95 and be adjustable from Settings in the range 80–99.
7. THE Auto_Capture trigger threshold SHALL be remotely configurable via Firebase Remote Config under the key `autoCaptureThreshold`.

**Correctness Properties for Property-Based Testing:**

- **Gate conjunction invariant**: Auto_Capture SHALL fire if and only if ALL of the named quality gates return true simultaneously — never on a partial set.
- **Countdown cancellation**: FOR ALL sequences where Pose_Score is ≥ threshold for N frames then drops below threshold, Auto_Capture SHALL NOT fire.
- **Threshold boundary**: FOR ALL threshold values t in [80, 99] configured via settings, Auto_Capture SHALL fire when Pose_Score = t and not fire when Pose_Score = t − 1.

---

### Requirement 18: Favorites Management

**User Story:** As a user, I want to favorite poses and have my favorites available offline and synced to my account when signed in.

#### Acceptance Criteria

1. THE App SHALL allow any user (authenticated or anonymous) to favorite any pose by tapping the heart button.
2. WHEN a pose is favorited, THE App SHALL store the favorite record in SQLite immediately for offline access.
3. WHEN the user is authenticated and online, THE App SHALL synchronise favorites to Firestore in the background.
4. WHEN the user un-favorites a pose, THE App SHALL remove the record from SQLite immediately and queue a Firestore deletion.
5. THE Favorites screen SHALL display favorited poses in a Pinterest-style masonry grid, sortable by newest, oldest, category, and difficulty.
6. THE Favorites screen SHALL work fully offline using the SQLite cache.
7. WHEN the user signs in on a new device, THE App SHALL merge cloud favorites with any locally stored anonymous favorites.

---

### Requirement 19: Pose Pack Downloads & Offline Access

**User Story:** As a user, I want to download pose packs so I can use the app fully offline, with the ability to pause, resume, and delete downloads.

#### Acceptance Criteria

1. THE Download_Manager SHALL download Pose_Packs as structured ZIP bundles containing: pose image (WebP), overlay PNG, landmark JSON, and metadata JSON.
2. WHEN a download begins, THE App SHALL display a circular progress indicator on the pose card showing download progress.
3. THE Download_Manager SHALL support pausing and resuming interrupted downloads.
4. WHEN a download is interrupted by a network loss, THE Download_Manager SHALL automatically resume once connectivity is restored.
5. WHEN the device storage is below 50 MB of free space, THE App SHALL warn the user and halt new downloads.
6. THE Downloads screen SHALL display total storage used by downloaded packs and allow deletion of individual packs.
7. WHEN a downloaded Pose_Pack is opened offline, THE App SHALL serve all assets (image, overlay, landmarks) entirely from local storage without any network request.
8. THE App SHALL prevent duplicate downloads; if a pose pack is already downloaded, the download button SHALL reflect the downloaded state.

**Correctness Properties for Property-Based Testing:**

- **Download idempotence**: Downloading the same Pose_Pack N times SHALL result in exactly one copy on disk with the same content hash as the single download.
- **Pause-resume integrity**: FOR ALL downloads paused at arbitrary byte offsets and then resumed, the final downloaded file SHA-256 hash SHALL equal the expected server-provided hash.
- **Offline read after download**: FOR ALL downloaded Pose_Packs, every asset (image, overlay, landmarks) SHALL be accessible without network connectivity after successful download completion.


---

### Requirement 20: Gallery

**User Story:** As a user, I want to view, share, delete, and favorite my captured photos in a gallery so I can manage my photography results.

#### Acceptance Criteria

1. THE Gallery screen SHALL display captured photos in a 3-column grid sorted by capture date descending, using FlashList for performance.
2. WHEN a photo is captured, THE Gallery screen SHALL immediately reflect the new photo without requiring a manual refresh.
3. WHEN the user long-presses a photo, THE Gallery SHALL enter multi-selection mode allowing batch delete.
4. THE Gallery SHALL provide per-photo actions: Share, Delete, Favorite, and View Metadata.
5. WHEN viewing photo metadata, THE App SHALL display: capture date, pose used, AI Score at capture, resolution, and device lens.
6. WHEN the user shares a photo, THE App SHALL invoke the system share sheet supporting Instagram, WhatsApp, Facebook, X, Pinterest, TikTok, and generic share targets.
7. THE Gallery SHALL be fully functional offline; no network request is required to view, delete, or favourite locally stored photos.

---

### Requirement 21: Photo Capture Rate Limiter

**User Story:** As a product owner, I want to limit free captures to 10 per 6-hour rolling window so that users are incentivised to engage with rewarded ads while the app remains fully accessible.

#### Acceptance Criteria

1. THE Rate_Limiter SHALL track all photo captures within a rolling 6-hour window, stored in MMKV as `captureWindowStart` (Unix timestamp, ms) and `captureCount` (integer).
2. WHEN a capture event occurs and `captureCount` is less than the window limit, THE Rate_Limiter SHALL increment `captureCount` and allow the capture to proceed.
3. WHEN `captureCount` reaches 10 within the current 6-hour window, THE Rate_Limiter SHALL block further captures and display a bottom sheet explaining the limit, offering a rewarded ad option and showing the time remaining until the window resets.
4. WHEN the user successfully completes a rewarded ad view, THE Rate_Limiter SHALL increment the window limit by 5 additional captures (one-time per ad view) and allow the capture to proceed immediately.
5. WHEN the current time exceeds `captureWindowStart` + 6 hours, THE Rate_Limiter SHALL reset `captureCount` to 0 and `captureWindowStart` to the current time before evaluating the next capture.
6. THE Camera screen SHALL display a remaining-captures badge showing the number of captures left in the current window.
7. ALL poses, categories, and features SHALL remain fully accessible regardless of capture count; only the act of saving a photo is rate-limited.
8. THE Rate_Limiter SHALL operate entirely on-device without any network call; no server-side validation of capture count is required.
9. WHEN the app is reinstalled or app data is cleared, THE Rate_Limiter SHALL reset to a fresh window with `captureCount` = 0.

**Correctness Properties for Property-Based Testing:**

- **Window reset invariant**: FOR ALL timestamps T where T > `captureWindowStart` + 21600000 ms (6 hours), the Rate_Limiter SHALL reset `captureCount` to 0 before processing the next capture — never carry over stale counts.
- **Capture count monotonicity**: Within a single valid window (not yet expired), `captureCount` SHALL never decrease except on a window reset.
- **Rewarded ad grant idempotence**: Completing a rewarded ad view SHALL add exactly 5 to the effective limit — never more, never less, regardless of how many times the ad grant function is called for the same ad completion event.
- **Boundary enforcement**: FOR ALL `captureCount` values equal to the current limit (base 10 + earned extras), the Rate_Limiter SHALL block the next capture; for values strictly less than the limit, it SHALL allow the capture.

---

### Requirement 22: Advertisement Integration (AdMob)

**User Story:** As a product owner, I want AdMob to be the sole revenue source, with non-intrusive ads shown to all users, that never interrupt photography sessions or degrade the experience.

#### Acceptance Criteria

1. THE App SHALL display AdMob native ads in the Home feed, Category feed, and Pose list at a frequency of one ad per 10–15 content items.
2. THE App SHALL display rewarded ads that users may watch to unlock 5 additional captures beyond the 10-photo-per-window limit (Requirement 21).
3. THE App SHALL display app-open ads on the first app launch of the day only, and after long inactivity periods.
4. THE App SHALL display interstitial ads at a maximum frequency of once every 8–10 minutes of active use, only between browsing sessions.
5. THE App SHALL NEVER display any advertisement: during camera preview, during AI pose guidance, during Auto_Capture countdown, during onboarding, immediately after capturing a photo, or while permission dialogs are displayed.
6. WHEN a rewarded ad is initiated, THE App SHALL grant the reward (5 additional captures) immediately upon successful completion of the full ad view.
7. THE App SHALL obtain user consent for personalised advertising through Google UMP (User Messaging Platform) in regions where GDPR or CCPA applies.
8. ALL ad placements SHALL clearly label advertisements with "Ad" or "Sponsored" text and shall never hide close buttons or cause accidental clicks.
9. THE App SHALL show ads to ALL users; there are no Premium or ad-free user tiers.

**Correctness Properties for Property-Based Testing:**

- **Ad exclusion zone invariant**: FOR ALL camera-session states (preview active, auto-capture countdown, photo capture), the set of active ad units SHALL be empty.
- **Rewarded ad completeness**: FOR ALL rewarded ad views, the reward SHALL be granted if and only if the full ad view was completed — neither partial views nor repeat completions SHALL grant a reward.
- **Frequency cap**: FOR ALL user session timelines longer than T minutes where T > 10, the count of interstitial ads shown SHALL be ≤ floor(T / 10).


---

### Requirement 23: Settings Screen

**User Story:** As a user, I want a Settings screen where I can configure the app's theme, language, camera defaults, downloads, notifications, and privacy preferences.

#### Acceptance Criteria

1. THE Settings screen SHALL contain sections for: General, Appearance (Light/Dark/System theme), Camera (grid, HDR, flash, default lens, auto-capture threshold, voice guidance toggle, overlay opacity default), Capture Limit (remaining captures in current window, time until window reset), Downloads (storage usage, clear downloads), Notifications (enable/disable, per-type), Privacy (permission overview, data deletion request), Developer (About page with social links), and About (version, licenses).
2. WHEN the user changes the theme, THE App SHALL apply the new theme immediately across all screens using a 200 ms cross-fade transition, and persist the selection in MMKV under the key `theme`.
3. THE Settings screen SHALL display the total storage consumed by downloaded pose packs and allow the user to delete all downloads.
4. THE Settings screen SHALL provide access to the Privacy Policy and Terms & Conditions pages, both linkable to external URLs.
5. THE Settings screen SHALL provide a "Request Account Deletion" action that submits a deletion request via the feedback API.
6. THE Developer section SHALL display the developer profile for Susant Luitel with tappable links to GitHub, YouTube, LinkedIn, Instagram, Facebook, Pinterest, TikTok, X, WhatsApp, and Email.

---

### Requirement 24: Firebase Backend Integration

**User Story:** As a developer, I want the app to integrate all required Firebase services so that user data is persisted, the backend is scalable, and crashes are detected automatically.

#### Acceptance Criteria

1. THE App SHALL initialise Firebase Authentication, Cloud Firestore, Firebase Storage, Firebase Analytics, Firebase Crashlytics, Firebase Performance Monitoring, Firebase Cloud Messaging, Firebase Remote Config, and Firebase App Check on startup.
2. THE App SHALL enable Firestore offline persistence so that reads and queued writes continue to function without internet.
3. WHEN the app regains internet connectivity after an offline period, THE App SHALL automatically synchronise all queued Firestore writes using the last-write-wins conflict resolution strategy.
4. THE App SHALL enforce Firebase App Check using the Play Integrity API on Android, rejecting requests from unverified clients.
5. THE App SHALL store all Firebase credentials as EAS Secrets and expose only the public-safe fields as `EXPO_PUBLIC_*` environment variables; no private keys or service account credentials SHALL be bundled in the app binary.
6. THE App SHALL log all critical non-fatal errors to Firebase Crashlytics with custom keys: appVersion, deviceModel, osVersion, userType, and currentScreen.
7. WHEN Firebase Crashlytics detects a crash rate exceeding 1%, THE App SHALL surface an alert in the Firebase console (configured via alerting rules).

**Correctness Properties for Property-Based Testing:**

- **Offline queue round-trip**: FOR ALL Firestore writes performed while offline, after the device reconnects, each write SHALL be reflected in the remote Firestore document and the local cache SHALL be consistent with the remote document.
- **Session token validity**: FOR ALL authenticated sessions, the Firebase ID token returned by getIdToken(forceRefresh: false) SHALL be a valid JWT with a future expiry timestamp.

---

### Requirement 25: Data Persistence & Database Schema

**User Story:** As a developer, I want a well-defined hybrid database schema (Firestore + SQLite + MMKV) so data is consistent, fast, and resilient to network loss.

#### Acceptance Criteria

1. THE App SHALL maintain the following Firestore collections: `users`, `poses`, `categories`, `favorites`, `downloads`, `captured_photos`, `notifications`, `feedback`, `analytics_events`, and `app_config`.
2. THE App SHALL maintain the following SQLite tables for offline use: `poses`, `favorites`, `downloads`, `recent_searches`, and `recent_views`.
3. THE App SHALL store the following keys in MMKV: `theme`, `language`, `onboardingCompleted`, `cameraSettings`, `overlayOpacity`, `lastCategory`, `captureWindowStart`, `captureCount`, `notificationEnabled`, `session`, `firstLaunch`, and `lastSync`.
4. THE App SHALL use strong TypeScript interfaces for all Firestore document shapes and SQLite row types; all database access code SHALL pass strict TypeScript compilation.
5. WHEN a Pose_Pack is downloaded, THE App SHALL store the landmark JSON in SQLite in the `pose_landmarks` table with columns (poseId, landmarks JSON) indexed on poseId.
6. THE App SHALL paginate all Firestore list queries using cursor-based pagination (limit + startAfter) to prevent unbounded reads.
7. WHEN the user deletes their account, THE App SHALL delete all user Firestore documents, all user-uploaded Storage files, and all locally cached user data within 24 hours.

**Correctness Properties for Property-Based Testing:**

- **SQLite-Firestore sync consistency**: FOR ALL favorite records written to SQLite while offline and then synced to Firestore, the record in Firestore SHALL have the same poseId, uid, and a createdAt timestamp ≥ the SQLite write time.
- **MMKV serialisation round-trip**: FOR ALL values written to MMKV, reading the same key immediately after writing SHALL return an equal value (parse(serialize(v)) == v).
- **Pagination completeness**: FOR ALL paginated Firestore queries over a collection of N documents with page size P, the union of all pages SHALL contain exactly N documents with no duplicates.


---

### Requirement 26: Security

**User Story:** As a user, I want the app to protect my data with encryption, secure authentication, and minimal permissions so my privacy is preserved.

#### Acceptance Criteria

1. THE App SHALL store all authentication tokens, refresh tokens, Premium status, and session IDs using Expo SecureStore (backed by Android Keystore).
2. THE App SHALL never store sensitive user data in AsyncStorage, plain-text files, or app logs.
3. THE App SHALL use HTTPS/TLS 1.2+ for all network communication and shall never disable SSL certificate validation.
4. THE App SHALL validate all Firebase ID Tokens server-side in Cloud Functions before granting access to protected resources.
5. THE App SHALL protect all Firestore collections with Security Rules enforcing that users can only read and write their own documents (uid-scoped access).
6. THE App SHALL never expose Firebase Admin SDK credentials, service account keys, or AdMob App IDs as client-side plaintext.
7. THE App SHALL sanitise all user inputs (search queries, feedback messages, filenames) to prevent injection attacks before submitting to Firebase.
8. THE App SHALL run `npm audit` and `expo doctor` as part of the CI/CD pipeline and block releases with known critical vulnerabilities.
9. THE Camera SHALL never access the microphone unless the voice features module is explicitly active and the user has granted microphone permission.
10. THE App SHALL disable verbose logging (console.log) in production builds.

**Correctness Properties for Property-Based Testing:**

- **Secure storage non-disclosure**: FOR ALL keys stored via Expo SecureStore, reading the same key from AsyncStorage or plain file system access SHALL return undefined/null (data is not duplicated to insecure storage).
- **Firebase rule access control**: FOR ALL Firestore read attempts by uid=A on a document owned by uid=B (A ≠ B), the operation SHALL be rejected with a PERMISSION_DENIED error.

---

### Requirement 27: Analytics & Crash Reporting

**User Story:** As a product owner, I want comprehensive analytics and crash reporting so I can make informed product decisions and ensure stability.

#### Acceptance Criteria

1. THE App SHALL log the following core Firebase Analytics events: `app_install`, `app_open`, `screen_view`, `pose_open`, `pose_download`, `camera_open`, `photo_capture`, `favorite_add`, `search_started`, `native_ad_loaded`, `rewarded_completed`, `rewarded_capture_unlocked`, `auto_capture`, `voice_guidance_played`, `capture_limit_reached`.
2. THE App SHALL set the following Firebase Analytics user properties: userType (anonymous/google), country, language, appVersion, and deviceModel.
3. THE App SHALL never log passwords, email content, camera frames, photos, authentication tokens, or biometric data to Analytics.
4. THE App SHALL enable Firebase Crashlytics to capture JavaScript crashes, native crashes, and ANRs.
5. THE App SHALL enable Firebase Performance Monitoring to measure app startup time, camera launch time, Firestore read/write latency, and storage download speed.
6. THE App SHALL comply with Google Play Data Safety requirements by accurately declaring all data collected, shared, and whether data is encrypted in transit.
7. WHEN the crash-free session rate drops below 99.5%, THE App's Firebase project SHALL trigger a configured alert notification.
8. THE App SHALL retain analytics events for 365 days, crash reports for 90 days, and performance metrics for 180 days.

---

### Requirement 28: Accessibility

**User Story:** As a user with accessibility needs, I want the app to fully support TalkBack, dynamic font sizes, high contrast, and large touch targets so I can use it comfortably.

#### Acceptance Criteria

1. THE App SHALL support TalkBack with descriptive accessibilityLabel and accessibilityHint properties on all interactive elements.
2. THE App SHALL scale all text dynamically in response to the device's system font size setting without breaking layouts.
3. ALL interactive touch targets SHALL have a minimum size of 48 × 48 dp.
4. THE App SHALL meet WCAG AA colour contrast ratios for all text and interactive elements in both Light and Dark themes.
5. WHEN the device's Reduce Motion setting is enabled, THE App SHALL disable parallax, spring physics animations, and hero transitions, using simple fade transitions instead.
6. THE App SHALL maintain a logical focus order for keyboard and assistive technology navigation through all screens.
7. THE App SHALL provide screen reader labels for all camera controls, overlay gestures, AI score indicators, and voice coaching feedback.


---

### Requirement 29: Performance Requirements

**User Story:** As a user, I want the app to feel fast and fluid with smooth animations and quick screen transitions so the experience feels premium.

#### Acceptance Criteria

1. THE App SHALL achieve a cold-start time of less than 2 seconds on mid-range Android devices.
2. THE App SHALL achieve a warm-start time of less than 1 second.
3. THE Camera_Engine SHALL activate and display the camera preview within 1 second of the Camera screen opening.
4. THE App SHALL maintain 60 FPS for all animations, scrolling, and camera preview under normal operating conditions.
5. WHERE the device supports a 120 Hz display, THE App SHALL target 120 FPS for scroll and animation via React Native Reanimated's Fabric renderer.
6. THE App SHALL maintain a peak memory footprint of less than 250 MB during active camera and AI sessions.
7. ALL screen navigation transitions SHALL complete in less than 250 ms.
8. THE App SHALL complete search queries and display results in less than 200 ms from the last keypress.
9. THE App SHALL not trigger Android ANR events (UI thread blocked > 5 seconds) under any documented use case.
10. THE AI_Engine SHALL run exclusively on a background thread; frame processing SHALL never add more than 5 ms to the UI thread frame budget.
11. WHILE the app is backgrounded, THE App SHALL pause all AI inference, camera access, and non-essential background tasks to minimise battery drain.

---

### Requirement 30: Offline-First Architecture

**User Story:** As a user in an area with no internet, I want all core features — camera, AI, downloaded poses, gallery, and favorites — to continue working without connectivity.

#### Acceptance Criteria

1. THE App SHALL operate the following features without any network connection: camera preview and capture, AI pose detection and scoring, skeleton overlay, voice coaching, overlay rendering, gallery, favorites (from local cache), and any downloaded Pose_Packs.
2. WHEN offline, THE App SHALL display a dismissible offline indicator banner at the top of any screen that attempts a cloud operation.
3. WHEN offline, THE App SHALL queue Firestore write operations (favorites, analytics events) and execute them in order when connectivity is restored.
4. THE App SHALL never crash, freeze, or display an unhandled error when network operations time out or fail; all network errors SHALL be caught and surfaced as user-friendly messages with retry options.
5. THE App SHALL support airplane mode operation for the full offline feature set.
6. WHEN connectivity is restored, THE App SHALL automatically re-authenticate, synchronise queued writes, and refresh stale cached data in the background without user intervention.

---

### Requirement 31: Google Play Policy Compliance

**User Story:** As a product owner, I want the app to meet all Google Play Developer Program requirements so it is approved on first submission and remains compliant through updates.

#### Acceptance Criteria

1. THE App SHALL request the Camera permission only immediately before opening the Camera screen, with a clear in-app rationale explaining the benefit to the user.
2. THE App SHALL request the Photos/Media Library permission only immediately before saving a photo, with a clear in-app rationale.
3. THE App SHALL NEVER request: Contacts, SMS, Phone State, Call Logs, Calendar, Background Location, Accessibility Service (unless essential), or Device Administrator permissions.
4. THE App SHALL provide a publicly accessible Privacy Policy URL and a Terms & Conditions URL, both surfaced within the app Settings.
5. THE App SHALL implement a Data Safety Form-compatible data declaration, accurately disclosing all data types collected and shared.
6. THE App SHALL comply with Google Play's monetization policies; AdMob is the sole monetization method and no alternative payment SDK shall be used for digital content.
7. THE App SHALL comply with the Google AdMob policies: no ads during camera, no forced ad clicks, no hidden close buttons, and no deceptive ad placements.
8. THE App SHALL target the latest Android API level required by Google Play for new app submissions.
9. THE App SHALL support Android 8.0 (API 26) as the minimum SDK.
10. THE App shall provide an in-app "Request Account Deletion" flow as required by Google Play's data deletion requirements.
11. THE App SHALL pass the Google Play Pre-Launch Report without critical issues before each production release.


---

### Requirement 32: UI Design System & Theming

**User Story:** As a developer, I want a consistent, reusable component library with a well-defined design system so every screen looks premium and cohesive.

#### Acceptance Criteria

1. THE App SHALL implement the Snap Pose design token set: Primary Background #F6F1E7, Primary Accent #65744A (Olive Green), Secondary Accent #4F5B38, Text Primary #2B241F, Text Secondary #756B63, Success #4CAF50, Warning #FFB300, Error #F44336, Card Background #FFFFFF, Dark Mode background #181818.
2. THE App SHALL use the Inter font family with fallback to system sans-serif, with the following scale: Display 48/Bold, H1 36/Bold, H2 30/SemiBold, H3 24/SemiBold, Body 16/Regular, Caption 12/Regular, Button 16/SemiBold.
3. THE App SHALL use Lucide icons (stroke width 2, rounded) throughout, never mixing with other icon styles.
4. ALL interactive components SHALL follow the SP-prefixed naming convention: SPButton, SPCard, SPOverlay, SPCamera, SPCategoryCard, SPPoseCard, SPBottomSheet, SPToast, SPDialog, SPAvatar, SPProgressRing.
5. THE App SHALL implement a bottom navigation bar with glassmorphism blur background, floating rounded container (height 72 px), icons with labels for: Home, Search, Camera (FAB), Favorites, and Settings.
6. THE App SHALL implement Dark Mode as a named theme (background #181818, cards #242424, text #FFFFFF, accent #7E9261) togglable via system setting or manual override.
7. ALL animations SHALL use React Native Reanimated with duration constraints: Quick 120 ms, Medium 220 ms, Long 350 ms, Hero 450 ms; no animation SHALL exceed 500 ms.
8. THE App SHALL use NativeWind for all component styling to ensure consistent design token application via Tailwind utility classes.

---

### Requirement 33: Push Notifications & Reminders

**User Story:** As a user, I want opt-in push notifications for daily pose suggestions and download completion so I stay engaged without feeling spammed.

#### Acceptance Criteria

1. THE App SHALL request notification permission only when the user explicitly enables notifications from Settings — never on first launch.
2. THE App SHALL support the following notification types: daily pose suggestion, trending pose alert, download completed, and premium expiry reminder.
3. WHEN the user taps a notification, THE App SHALL deep-link to the relevant screen (e.g., pose detail, downloads).
4. THE App SHALL allow users to disable individual notification types from Settings.
5. THE App SHALL never send unsolicited promotional notifications outside the defined notification types.
6. WHEN push notification permission is denied, THE App SHALL continue functioning normally and SHALL NOT re-request permission unless the user navigates to the Notifications Settings section.

---

### Requirement 34: Pose Recommendation Engine

**User Story:** As a user, I want the app to recommend relevant poses based on my history, favorite categories, and optionally my location so I always have fresh inspiration.

#### Acceptance Criteria

1. THE App SHALL generate pose recommendations locally based on: frequently viewed categories (stored in SQLite `recent_views`), favorited poses, downloaded pose history, and time of day.
2. WHERE the user has granted location permission, THE App SHALL factor the user's approximate location type (beach, mountain, cafe, city) into pose recommendations.
3. Location permission for recommendations SHALL be optional; THE App SHALL never make location permission mandatory for any feature.
4. THE App SHALL never infer sensitive personal attributes (gender, ethnicity, age) from camera data; gender for pose filtering SHALL only be used if the user explicitly sets a preference.
5. THE recommendation engine SHALL run locally without a network call; cloud-based recommendations are a future enhancement.
6. THE App SHALL display "Recommended for You" content on the Home screen driven by local recommendation logic, refreshed on each app open.


---

### Requirement 35: Error Handling & Resilience

**User Story:** As a user, I want the app to handle all error conditions gracefully with clear messages and recovery options so I never see a blank screen or unhandled crash.

#### Acceptance Criteria

1. THE App SHALL implement React error boundaries at the root and screen levels to catch unhandled JavaScript errors and display a recovery screen with a "Restart" button.
2. WHEN camera permission is denied, THE App SHALL display an in-context card explaining the reason for the permission with a "Open Settings" button.
3. WHEN storage permission is denied, THE App SHALL display a non-blocking message explaining that saving photos requires storage permission.
4. WHEN the AI_Engine fails to initialise, THE App SHALL fall back to Overlay-only camera mode and display a dismissible notification.
5. WHEN a Firestore operation fails due to a network timeout, THE App SHALL retry with exponential back-off (1s, 2s, 4s, max 30s) and surface a user-friendly message after three failed attempts.
6. WHEN the device storage is full during a photo capture, THE App SHALL display a "Storage Full — Manage Storage" prompt without losing the camera session.
7. THE App SHALL never display a blank white screen; every loading, empty, and error state SHALL have a defined UI treatment as specified in the Design System.
8. ALL HTTP error responses (4xx, 5xx) from cloud functions SHALL be mapped to user-readable messages; raw error codes SHALL never be shown to users.

---

### Requirement 36: Image Asset Management

**User Story:** As a developer, I want all pose images to be real high-quality photographs in optimised WebP format with BlurHash placeholders and lazy loading so the UI feels fast and premium.

#### Acceptance Criteria

1. ALL pose card images SHALL be real royalty-free photographs sourced from Unsplash, Pexels, or Pixabay — no AI-generated images, cartoon illustrations, or stock placeholders.
2. ALL pose images SHALL be stored and delivered in WebP format to minimise bandwidth and storage footprint.
3. THE App SHALL use BlurHash placeholders rendered immediately while full images load progressively.
4. THE App SHALL implement image caching (disk + memory) using FastImage or equivalent, with a minimum disk cache duration of 30 days for pose assets.
5. THE App SHALL lazy-load pose images and only preload the first visible viewport of cards on list screens.
6. EVERY pose SHALL be stored with: original WebP photo, transparent PNG overlay, thumbnail WebP, landmark JSON, and metadata JSON, organised under `assets/poses/{category}/{pose_id}/`.
7. THE App SHALL maintain the correct image aspect ratio at all times; images SHALL never be stretched or distorted.

---

### Requirement 37: API Service Layer & Cloud Functions

**User Story:** As a developer, I want a well-structured API service layer with versioned endpoints, standard response shapes, and rate limiting so the backend is secure and maintainable.

#### Acceptance Criteria

1. THE App SHALL access all remote data through a typed API service layer that issues HTTPS-only requests with `Authorization: Bearer <Firebase_ID_Token>` headers.
2. ALL API responses SHALL conform to a standard shape: `{ success: boolean, data: T | null, error: { code: string, message: string } | null, timestamp: string }`.
3. THE App SHALL implement client-side rate-limit awareness; when a 429 response is received, THE App SHALL back off and retry after the `Retry-After` header interval.
4. THE App SHALL deploy the following Firebase Cloud Functions: `syncFavorites`, `sendFeedback`, `updateAnalytics`, `checkForUpdates`, `generateRecommendations`, `cleanupOldData`, and `sendPushNotification`.
5. THE App SHALL use the `app_config` Firestore document to read remotely configurable values: `maintenanceMode`, `latestVersion`, `minimumVersion`, `adsEnabled`, `aiModelVersion`, `autoCaptureThreshold`, and `voiceGuidanceEnabled`.
6. WHEN `maintenanceMode` is true in app_config, THE App SHALL display a full-screen maintenance notice and disable all cloud-dependent features gracefully.
7. WHEN `minimumVersion` in app_config is greater than the installed app version, THE App SHALL display a force-update prompt with a link to the Play Store.

**Correctness Properties for Property-Based Testing:**

- **API response schema invariant**: FOR ALL API responses, deserialising the response body SHALL produce a valid typed object matching the declared TypeScript interface without runtime type errors.
- **Auth token round-trip**: FOR ALL valid Firebase user sessions, getIdToken() → send as Bearer header → verify in Cloud Function SHALL return the correct uid without mutation.
- **Config remote control**: FOR ALL values of `autoCaptureThreshold` set in `app_config` (range 80–99), the Auto_Capture engine SHALL use the remote value on next app open and never cache a stale threshold beyond one session.


---

### Requirement 38: Testing & Quality Assurance

**User Story:** As a developer, I want a comprehensive automated test suite covering units, integration, property-based, and E2E scenarios so I can release confidently.

#### Acceptance Criteria

1. THE App SHALL achieve a minimum unit test coverage of 85% across hooks, utilities, AI scoring logic, overlay transform calculations, and API service layer functions.
2. THE App SHALL include integration tests for: Firebase Authentication flows, Firestore sync, Download_Manager, Camera_Engine + AI_Engine pipeline, Rate_Limiter + rewarded ad flow, and notification handling.
3. THE App SHALL include property-based tests (using fast-check or equivalent) for the correctness properties defined in Requirements 11, 17, 19, 21, 22, 25, 26, and 37.
4. THE App SHALL include E2E tests (using Detox) covering the critical user journeys: onboarding, home browsing, pose detail → camera → capture, favorites, downloads, and capture-limit rewarded-ad unlock.
5. ALL automated tests SHALL execute in the CI/CD pipeline on every commit; the pipeline SHALL block the merge if any test fails.
6. THE CI/CD pipeline SHALL also run: TypeScript strict mode compilation, ESLint, Prettier formatting check, and `npm audit` for dependency vulnerabilities.
7. BEFORE every production release, THE App SHALL pass the full regression test suite and the Google Play Pre-Launch Report with zero critical issues.
8. THE App SHALL be tested on: Android 8 (API 26), Android 10, Android 12, Android 14, and the latest stable Android version; and on low-end, mid-range, and flagship device tiers.

---

### Requirement 39: Build, Deployment & Release

**User Story:** As a developer, I want a reproducible EAS build pipeline that produces a signed Android App Bundle ready for Google Play submission.

#### Acceptance Criteria

1. THE App SHALL use Expo Application Services (EAS) Build to produce a signed Android App Bundle (.aab) for Google Play submission.
2. ALL secrets (Firebase credentials, AdMob App IDs) SHALL be managed via EAS Secrets and injected at build time; no secrets SHALL be committed to version control.
3. THE App SHALL have three EAS build profiles: `development` (debug), `preview` (internal testing), and `production` (signed release).
4. THE production build profile SHALL target the latest Google Play-required `targetSdkVersion` and set `minSdkVersion` to 26.
5. THE App SHALL include a proguard/R8 configuration that protects AI model files and business logic from reverse engineering.
6. WHEN a new version is published via EAS Update, THE App SHALL receive the OTA update on next launch without requiring a full Play Store update (for JS-layer changes only).
7. THE App SHALL pass the Google Play Pre-Launch Report for crashes, permissions, performance, and security before being promoted to production.

---

### Requirement 40: Pose Landmark Data Parser & Serialiser

**User Story:** As a developer, I want a robust parser and serialiser for the landmark JSON format so I can load pose reference data from disk and round-trip it without data loss.

#### Acceptance Criteria

1. THE App SHALL implement a `LandmarkParser` that parses the landmark JSON file format into a typed `PoseLandmarks` object with 33 `Landmark` entries each containing `{ x: number, y: number, z: number, visibility: number }`.
2. WHEN a landmark JSON file is malformed or missing required fields, THE LandmarkParser SHALL return a descriptive `ParseError` and SHALL NOT throw an unhandled exception.
3. THE App SHALL implement a `LandmarkSerializer` that converts a `PoseLandmarks` object back into the canonical JSON string representation.
4. FOR ALL valid `PoseLandmarks` objects, parsing the serialised output SHALL produce an object equal to the original (round-trip property).

**Correctness Properties for Property-Based Testing:**

- **Round-trip property**: FOR ALL valid `PoseLandmarks` objects L, `LandmarkParser.parse(LandmarkSerializer.serialize(L))` SHALL equal L (deep equality within floating-point tolerance).
- **Error signalling on invalid input**: FOR ALL strings that are not valid landmark JSON (empty string, truncated JSON, wrong schema), `LandmarkParser.parse(s)` SHALL return a `ParseError` result and SHALL NOT return a partial or undefined `PoseLandmarks`.
- **Idempotent serialisation**: FOR ALL valid `PoseLandmarks` objects L, `LandmarkSerializer.serialize(L)` called twice SHALL produce identical strings (serialisation is deterministic and idempotent).


---

### Requirement 41: Network Resilience & Request Management

**User Story:** As a developer, I want all network requests to handle failures gracefully with retries, timeouts, and offline queueing so the app is robust on unstable mobile connections.

#### Acceptance Criteria

1. THE App SHALL set a request timeout of 30 seconds for all cloud function and REST API calls.
2. THE App SHALL automatically retry failed network requests using exponential back-off with jitter: initial delay 1 s, multiplier 2×, maximum delay 30 s, maximum 3 retries.
3. THE App SHALL queue all mutating requests (favorites, analytics, feedback) in an MMKV-backed pending-operations queue when offline and drain the queue in FIFO order when connectivity is restored.
4. THE React_Query layer SHALL cache GET responses with the following stale times: categories 7 days, pose metadata 24 hours, app_config 1 hour.
5. WHEN a queued operation fails after maximum retries, THE App SHALL log the failure to Crashlytics and remove it from the queue to prevent indefinite blocking.

**Correctness Properties for Property-Based Testing:**

- **Retry idempotence for mutating operations**: FOR ALL idempotent write operations retried up to 3 times due to transient failures, the final server state SHALL be the same as if the operation had succeeded on the first attempt.
- **Queue FIFO ordering**: FOR ALL sequences of N offline mutations enqueued and then drained, the operations SHALL be applied to Firestore in exactly the same order they were enqueued.
- **Cache stale-time invariant**: FOR ALL cached responses with stale time T, a cache hit SHALL occur for any read within T ms of the original fetch, and a cache miss (re-fetch) SHALL occur for any read after T ms.

---

### Requirement 42: Pose Score Normalisation & Coordinate Transform Pipeline

**User Story:** As a developer, I want the landmark normalisation pipeline to be correct and invertible so pose scoring is independent of camera resolution, zoom level, and subject distance.

#### Acceptance Criteria

1. THE AI_Engine SHALL normalise all landmark coordinates to a body-centred, scale-independent coordinate system before computing Pose_Score.
2. THE normalisation SHALL account for: body scale (shoulder-to-hip distance as reference), camera distance (bounding box height), rotation (torso orientation angle), and aspect ratio.
3. THE normalised coordinate space SHALL be independent of: device resolution, zoom level, camera model, and camera orientation.
4. WHEN two subjects are in the same pose at different distances from the camera, THE AI_Engine SHALL compute Pose_Scores that differ by no more than 5 points.
5. THE AI_Engine SHALL discard any landmark set where fewer than 17 of 33 landmarks have confidence ≥ 0.60 before normalisation.

**Correctness Properties for Property-Based Testing:**

- **Scale invariance**: FOR ALL landmark sets L and scale factors s > 0, normalize(scale(L, s)) SHALL equal normalize(L) within floating-point tolerance.
- **Translation invariance**: FOR ALL landmark sets L and translation vectors (dx, dy), normalize(translate(L, dx, dy)) SHALL equal normalize(L) within floating-point tolerance.
- **Rotation equivariance**: FOR ALL landmark sets L and rotation angles θ around the torso centroid, the Pose_Score between normalize(rotate(L, θ)) and a reference pose SHALL vary by no more than 3 points for |θ| ≤ 10°.

---

### Requirement 43: Device Compatibility & Responsive Layout

**User Story:** As a user on any Android device from a low-end phone to a foldable tablet, I want the app to display correctly and perform well.

#### Acceptance Criteria

1. THE App SHALL support Android 8.0 (API 26) through the latest stable Android release without crashes or unhandled exceptions.
2. THE App SHALL display correctly on screen widths from 360 dp (small phone) to 840 dp (large tablet) in portrait orientation.
3. WHERE the device is a tablet (sw ≥ 600 dp), THE App SHALL replace the bottom navigation bar with a navigation rail and adapt the categories grid to 4 columns.
4. THE App SHALL support portrait orientation as the primary layout; landscape is a future enhancement.
5. THE App SHALL not produce layout overflow, text clipping, or overlapping UI elements at any supported screen size.
6. THE App SHALL pass baseline performance tests on a low-end device (3 GB RAM, Snapdragon 450 class) without exceeding 250 MB RAM or causing ANRs.

---

### Requirement 44: Internationalisation & Localisation

**User Story:** As an international user, I want the app to support my language, and as a developer I want the app to be architecture-ready for future language additions.

#### Acceptance Criteria

1. THE App SHALL ship with full English (en-US) localisation as the primary language.
2. THE App SHALL use a localisation framework (e.g., i18n-js or expo-localization) with all user-facing strings externalised to locale files; no hardcoded user-visible strings SHALL exist in component code.
3. THE App SHALL detect the device locale on startup and apply the matching language if supported, defaulting to English if no match is found.
4. THE App SHALL support future addition of Nepali, Hindi, Spanish, Japanese, and Arabic languages by adding locale files without code changes.
5. WHERE future languages require Right-to-Left (RTL) layouts, THE App's component library SHALL be compatible with React Native's RTL layout support.
6. THE Voice_Coach SHALL use the device locale's Text-to-Speech voice where available, defaulting to English if the locale voice is unavailable.


---

### Requirement 45: Privacy & Data Minimisation

**User Story:** As a user, I want the app to collect only the minimum data necessary, never upload my photos without consent, and give me full control over my data.

#### Acceptance Criteria

1. THE App SHALL process all camera frames and AI inference entirely on-device; raw camera frames SHALL never be transmitted to any server.
2. THE App SHALL never perform facial recognition, identity recognition, or biometric authentication.
3. THE App SHALL never create or store biometric templates derived from camera data.
4. THE App SHALL never collect continuous location history; if location is used for pose recommendations, it SHALL be accessed as a single point-in-time reading and not persisted beyond the current session.
5. WHEN the user captures a photo, THE photo SHALL be stored exclusively on-device in the app's private storage unless the user explicitly initiates a backup or share action.
6. THE App SHALL provide a clear data deletion flow: "Request Account Deletion" in Settings SHALL delete all Firestore user documents and Storage files within 24 hours and clear all local MMKV and SQLite user data.
7. THE App SHALL declare all data collection accurately in the Google Play Data Safety section, matching the types described in these requirements.
8. THE App SHALL display a consent dialogue for personalised advertising via Google UMP before showing any personalised ads to users in GDPR-applicable regions.

---

### Requirement 46: App Configuration & Remote Control

**User Story:** As a product owner, I want to be able to remotely toggle features, update the auto-capture threshold, and put the app in maintenance mode without issuing an app update.

#### Acceptance Criteria

1. THE App SHALL fetch the `app_config` Firestore document on each app launch and cache it in MMKV with a 1-hour stale time.
2. THE App SHALL respect the following remote configuration keys from `app_config`: `maintenanceMode` (bool), `latestVersion` (string), `minimumVersion` (string), `adsEnabled` (bool), `aiModelVersion` (string), `autoCaptureThreshold` (int, 80–99), `voiceGuidanceEnabled` (bool), and `featuredCategories` (string[]).
3. WHEN `adsEnabled` is false, THE App SHALL suppress all ad loading and display for all users regardless of Premium status.
4. THE App SHALL also use Firebase Remote Config as a secondary configuration source for A/B testing flags.
5. WHEN `latestVersion` exceeds the installed version, THE App SHALL display a non-blocking update available banner.
6. WHEN `minimumVersion` exceeds the installed version, THE App SHALL block app usage and display a forced update prompt with a Play Store link.

---

### Requirement 47: Future-Ready Architecture

**User Story:** As a developer, I want the codebase to be architected so that future features (AR, 3D pose preview, AI pose generator, creator marketplace, community feed) can be added without major refactoring.

#### Acceptance Criteria

1. THE App SHALL follow a modular feature-folder architecture (feature-based module organisation) where each feature (camera, ai, premium, gallery, etc.) encapsulates its own components, hooks, services, and types.
2. THE App SHALL use Expo Router's file-based routing for all navigation, enabling deep linking and future web support.
3. THE App SHALL define all AI engine interfaces (PoseDetector, ScoreCalculator, VoiceCoach) as TypeScript abstract interfaces so implementations can be swapped (e.g., from MediaPipe to TensorFlow Lite or ONNX Runtime) without changing consumer code.
4. THE App SHALL use the repository pattern for all data access, abstracting Firestore and SQLite behind typed repository interfaces so the data layer can be replaced independently.
5. THE App SHALL define all external service integrations (Firebase, AdMob, Play Billing) behind adapter interfaces so mocks can be substituted during testing without network access.
6. THE App's component library SHALL follow the Atomic Design hierarchy (Atoms → Molecules → Organisms → Templates → Screens) to enable systematic reuse as the feature set grows.

---

## Summary of Correctness Properties for Property-Based Testing

The following requirements include explicit property-based testing correctness properties suitable for implementation with fast-check or equivalent PBT libraries:

| Requirement | Property Description |
|---|---|
| 11 — Pose Match Scoring | Score range [0,100] invariant; identity score ≥ 95; monotonicity; weighted sum = 100%; normalisation round-trip idempotence |
| 17 — Auto Capture | Gate conjunction invariant; countdown cancellation; threshold boundary |
| 19 — Downloads | Download idempotence; pause-resume integrity; offline read after download |
| 21 — Photo Capture Rate Limiter | Window reset invariant; capture count monotonicity; rewarded ad grant idempotence; boundary enforcement |
| 22 — Advertisement | Ad exclusion zone invariant; rewarded ad completeness; frequency cap |
| 25 — Data Persistence | SQLite-Firestore sync consistency; MMKV serialisation round-trip; pagination completeness |
| 26 — Security | Secure storage non-disclosure; Firebase rule access control |
| 37 — API Service Layer | API response schema invariant; auth token round-trip; config remote control |
| 38 — Testing | Coverage, integration, E2E baseline requirements |
| 40 — Landmark Parser | Round-trip property; error signalling on invalid input; idempotent serialisation |
| 41 — Network Resilience | Retry idempotence; queue FIFO ordering; cache stale-time invariant |
| 42 — Normalisation Pipeline | Scale invariance; translation invariance; rotation equivariance |

