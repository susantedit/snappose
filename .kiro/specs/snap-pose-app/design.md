# Design Document — Snap Pose

## Overview

Snap Pose is a production-quality, AI-powered mobile photography assistant built with React Native (Expo) and TypeScript
targeting Android (API 26+) as its primary release platform. The application helps users recreate professional poses
through real-time camera overlays, on-device MediaPipe Pose Landmarker AI (33 landmarks at 30–60 FPS), voice coaching,
automatic capture, lighting analysis, and smart recommendations — all working offline-first.

The architecture centres on three principles:

1. **Offline-first**: Every core user action — camera, AI pose detection, overlay, gallery, downloaded pose packs,
   and favorites — must work without a network connection.
2. **Clean separation of concerns**: Domain logic (scoring, normalisation, parsing) is independent of UI frameworks,
   enabling thorough property-based testing and future AI engine swaps.
3. **Adapter-gated external services**: Firebase, AdMob, and Play Billing are hidden behind typed adapter interfaces
   so the production implementations can be replaced with mocks in tests without touching application code.

Cross-references to requirements are annotated as **[Req N]** throughout this document.

---

## Architecture

### System Component Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          Snap Pose Application                           │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                     Presentation Layer                           │   │
│  │  Expo Router ──► Screen Components (Atomic Design)              │   │
│  │  NativeWind / React Native Reanimated / Skia / FlashList        │   │
│  └──────────────────────────┬──────────────────────────────────────┘   │
│                             │                                           │
│  ┌──────────────────────────▼──────────────────────────────────────┐   │
│  │                     Application Layer                            │   │
│  │  Zustand Stores  ──  TanStack Query (React Query)               │   │
│  │  Feature Hooks   ──  React Hook Form                            │   │
│  └──────────────────────────┬──────────────────────────────────────┘   │
│                             │                                           │
│  ┌──────────────────────────▼──────────────────────────────────────┐   │
│  │                      Domain Layer                                │   │
│  │  PoseScoreCalculator  ──  LandmarkNormaliser                    │   │
│  │  LandmarkParser/Serializer  ──  AutoCaptureEngine               │   │
│  │  RecommendationEngine  ──  DownloadManager                      │   │
│  └──────────────────────────┬──────────────────────────────────────┘   │
│                             │                                           │
│  ┌──────────────────────────▼──────────────────────────────────────┐   │
│  │                   Infrastructure Layer                           │   │
│  │  Repository Interfaces → Firestore / SQLite / MMKV impls        │   │
│  │  AI Adapter Interface → MediaPipe Pose Landmarker impl           │   │
│  │  Firebase Adapter  ──  AdMob Adapter  ──  PlayBilling Adapter   │   │
│  └──────────────────────────┬──────────────────────────────────────┘   │
│                             │                                           │
│  ┌──────────────────────────▼──────────────────────────────────────┐   │
│  │              On-Device Services & External Services              │   │
│  │  MediaPipe Pose Landmarker (bg thread)                          │   │
│  │  Expo Camera  ──  Android TTS  ──  MMKV  ──  SQLite             │   │
│  │  Firebase (Auth/Firestore/Storage/Analytics/Crashlytics/FCM)    │   │
│  │  Google AdMob  ──  Google Play Billing  ──  EAS Update          │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
```

The domain layer has **zero** imports from React Native, Expo, or any external service SDK.
This isolation enables pure unit and property-based tests that run in Node without any device emulator.

### Architectural Layers

| Layer | Responsibility | Key Constraint |
|---|---|---|
| Presentation | Screens, atoms, molecules, organisms, Reanimated | No business logic; reads from stores/queries only |
| Application | Zustand stores, React Query config, feature hooks | Orchestrates domain and infra, no Firebase imports |
| Domain | Scoring, normalisation, parsing, auto-capture | Pure TypeScript; zero external dependencies |
| Infrastructure | Repository impls, adapter impls | Implements domain interfaces; owns SDK imports |

**[Req 47]** — Feature-folder structure, adapter interfaces, repository pattern, abstract AI interfaces.

---

## Components and Interfaces

### Folder Structure (Feature-Based Modular)

```
src/
├── app/                          # Expo Router file-based routes
│   ├── (auth)/
│   │   └── onboarding.tsx
│   ├── (tabs)/
│   │   ├── _layout.tsx           # Bottom tab navigator
│   │   ├── index.tsx             # Home
│   │   ├── search.tsx
│   │   ├── camera.tsx
│   │   ├── favorites.tsx
│   │   └── settings.tsx
│   ├── pose/[id].tsx             # Pose Detail (dynamic route)
│   ├── category/[slug].tsx       # Category screen
│   ├── gallery/index.tsx
│   ├── downloads/index.tsx
│   ├── premium/index.tsx
│   ├── _layout.tsx               # Root layout (providers)
│   └── +not-found.tsx
│
├── features/
│   ├── ai/                       # AI Engine feature module
│   │   ├── domain/
│   │   │   ├── interfaces/
│   │   │   │   ├── PoseDetector.ts          # abstract interface [Req 47]
│   │   │   │   ├── ScoreCalculator.ts       # abstract interface
│   │   │   │   └── VoiceCoach.ts            # abstract interface
│   │   │   ├── PoseScoreCalculator.ts       # pure domain impl
│   │   │   ├── LandmarkNormaliser.ts        # pure domain impl
│   │   │   ├── AutoCaptureEngine.ts         # pure domain impl
│   │   │   └── VoiceCoachService.ts
│   │   ├── infrastructure/
│   │   │   └── MediaPipePoseDetector.ts     # MediaPipe impl
│   │   ├── hooks/
│   │   │   ├── usePoseDetection.ts
│   │   │   ├── usePoseScore.ts
│   │   │   └── useAutoCapture.ts
│   │   └── types.ts
│   │
│   ├── camera/                   # Camera Engine feature module
│   │   ├── domain/
│   │   │   ├── OverlayTransformEngine.ts    # pure domain impl
│   │   │   └── LightingAnalyser.ts
│   │   ├── hooks/
│   │   │   ├── useCameraEngine.ts
│   │   │   ├── useOverlay.ts
│   │   │   └── useLighting.ts
│   │   ├── components/
│   │   │   ├── SPCameraPreview.tsx
│   │   │   ├── SPSkeletonOverlay.tsx        # Skia canvas
│   │   │   ├── SPPoseOverlay.tsx            # ref overlay
│   │   │   ├── SPScoreRing.tsx
│   │   │   └── SPCameraControls.tsx
│   │   └── types.ts
│   │
│   ├── poses/                    # Pose browsing feature
│   │   ├── domain/
│   │   │   ├── interfaces/
│   │   │   │   └── PoseRepository.ts
│   │   │   └── RecommendationEngine.ts
│   │   ├── infrastructure/
│   │   │   ├── FirestorePoseRepository.ts
│   │   │   └── SQLitePoseRepository.ts
│   │   ├── hooks/
│   │   │   ├── usePoses.ts
│   │   │   ├── usePoseDetail.ts
│   │   │   └── useRecommendations.ts
│   │   └── types.ts
│   │
│   ├── favorites/
│   │   ├── domain/interfaces/FavoritesRepository.ts
│   │   ├── infrastructure/
│   │   │   ├── SQLiteFavoritesRepository.ts
│   │   │   └── FirestoreFavoritesRepository.ts
│   │   └── hooks/useFavorites.ts
│   │
│   ├── downloads/
│   │   ├── domain/
│   │   │   ├── DownloadManager.ts
│   │   │   └── interfaces/DownloadRepository.ts
│   │   ├── infrastructure/DownloadManagerImpl.ts
│   │   └── hooks/useDownloads.ts
│   │
│   ├── premium/
│   │   ├── domain/interfaces/BillingAdapter.ts   # abstract [Req 47]
│   │   ├── infrastructure/PlayBillingAdapter.ts
│   │   └── hooks/usePremium.ts
│   │
│   ├── ads/
│   │   ├── domain/interfaces/AdAdapter.ts        # abstract [Req 47]
│   │   ├── infrastructure/AdMobAdapter.ts
│   │   └── hooks/useAds.ts
│   │
│   ├── auth/
│   │   ├── domain/interfaces/AuthAdapter.ts      # abstract [Req 47]
│   │   ├── infrastructure/FirebaseAuthAdapter.ts
│   │   └── hooks/useAuth.ts
│   │
│   ├── settings/
│   │   ├── hooks/useSettings.ts
│   │   └── types.ts
│   │
│   └── notifications/
│       ├── domain/interfaces/NotificationAdapter.ts
│       ├── infrastructure/FCMNotificationAdapter.ts
│       └── hooks/useNotifications.ts
│
├── components/                   # Atomic Design component library
│   ├── atoms/
│   │   ├── SPButton.tsx
│   │   ├── SPText.tsx
│   │   ├── SPIcon.tsx
│   │   ├── SPProgressRing.tsx
│   │   ├── SPBadge.tsx
│   │   ├── SPDivider.tsx
│   │   └── SPAvatar.tsx
│   ├── molecules/
│   │   ├── SPCard.tsx
│   │   ├── SPPoseCard.tsx
│   │   ├── SPCategoryCard.tsx
│   │   ├── SPSearchBar.tsx
│   │   ├── SPToast.tsx
│   │   └── SPSkeletonCard.tsx
│   ├── organisms/
│   │   ├── SPBottomNav.tsx
│   │   ├── SPBottomSheet.tsx
│   │   ├── SPDialog.tsx
│   │   ├── SPPoseGrid.tsx
│   │   ├── SPCategoryGrid.tsx
│   │   └── SPPremiumPrompt.tsx
│   └── templates/
│       ├── SPScreenTemplate.tsx
│       └── SPCameraTemplate.tsx
│
├── stores/                       # Zustand global stores
│   ├── authStore.ts
│   ├── settingsStore.ts
│   ├── cameraStore.ts
│   ├── premiumStore.ts
│   └── offlineQueueStore.ts
│
├── services/                     # API service layer
│   ├── api/
│   │   ├── client.ts             # typed Axios/fetch client
│   │   ├── poses.ts
│   │   ├── categories.ts
│   │   ├── favorites.ts
│   │   ├── premium.ts
│   │   └── config.ts
│   └── firebase/
│       ├── firebaseConfig.ts
│       └── appCheck.ts
│
├── database/
│   ├── mmkv/
│   │   ├── mmkvClient.ts
│   │   └── keys.ts
│   └── sqlite/
│       ├── db.ts
│       └── migrations/
│
├── types/
│   ├── pose.ts
│   ├── landmark.ts
│   ├── user.ts
│   ├── subscription.ts
│   └── api.ts
│
├── utils/
│   ├── errorHandling.ts
│   ├── imageUtils.ts
│   ├── dateUtils.ts
│   └── validation.ts
│
├── constants/
│   ├── designTokens.ts
│   ├── routes.ts
│   └── remoteConfigKeys.ts
│
└── i18n/
    ├── en.json
    └── index.ts
```

### Key TypeScript Abstract Interfaces

**PoseDetector** — AI engine interface **[Req 47]**
```typescript
export interface PoseDetector {
  initialise(): Promise<void>;
  detect(frame: CameraFrame): Promise<LandmarkSet | null>;
  destroy(): void;
}
```

**ScoreCalculator** — scoring interface **[Req 47]**
```typescript
export interface ScoreCalculator {
  compute(user: NormalisedLandmarks, reference: NormalisedLandmarks): PoseScore;
}
```

**VoiceCoach** — TTS interface **[Req 47]**
```typescript
export interface VoiceCoach {
  speak(instruction: string): void;
  stop(): void;
  isAvailable(): boolean;
}
```

**PoseRepository** — data access interface **[Req 47]**
```typescript
export interface PoseRepository {
  findById(id: string): Promise<Pose | null>;
  findByCategory(slug: string, cursor?: string, limit?: number): Promise<PagedResult<Pose>>;
  search(query: SearchQuery): Promise<PagedResult<Pose>>;
  upsert(pose: Pose): Promise<void>;
}
```

**BillingAdapter** — Play Billing interface **[Req 47]**
```typescript
export interface BillingAdapter {
  getProducts(): Promise<BillingProduct[]>;
  purchase(productId: string): Promise<PurchaseResult>;
  verifyPurchase(token: string): Promise<VerificationResult>;
  restorePurchases(): Promise<SubscriptionStatus>;
}
```

**AdAdapter** — AdMob interface **[Req 47]**
```typescript
export interface AdAdapter {
  loadNativeAd(adUnitId: string): Promise<NativeAd>;
  loadRewardedAd(adUnitId: string): Promise<RewardedAd>;
  showInterstitial(adUnitId: string): Promise<void>;
  showAppOpenAd(adUnitId: string): Promise<void>;
  isAdSuppressed(): boolean; // returns true when camera is active or user is Premium
}
```

---

## Navigation Architecture

Expo Router file-based routing is used for all navigation **[Req 47.2]**, enabling deep linking and future web support.

### Route Tree

```
app/
├── _layout.tsx          Root provider layout (Firebase, QueryClient, Zustand hydration)
├── +not-found.tsx
│
├── (auth)/              Auth group — no bottom tab bar
│   ├── _layout.tsx      (splash → onboarding conditional redirect)
│   └── onboarding.tsx
│
├── (tabs)/              Main tab group
│   ├── _layout.tsx      Bottom tab navigator (glassmorphism bar, 72 px)
│   ├── index.tsx        → Home screen
│   ├── search.tsx       → Search screen
│   ├── camera.tsx       → Camera screen (FAB centre tab)
│   ├── favorites.tsx    → Favorites screen
│   └── settings.tsx     → Settings screen
│
├── pose/[id].tsx        → Pose Detail (shared-element hero transition)
├── category/[slug].tsx  → Filtered pose list
├── gallery/
│   └── index.tsx        → Gallery screen
├── downloads/
│   └── index.tsx        → Downloads screen
└── premium/
    └── index.tsx        → Premium paywall screen
```

### Navigation Flow

```
Cold Start
    │
    ▼
Splash (1.x) ─── first launch? ──► Onboarding ──► Home
    │                                               ▲
    └─── returning user ─────────────────────────────┘

Home ──► Pose Detail ──► Camera (pre-loaded overlay)
     ──► Category ──► Pose Detail
     ──► Search ──► Pose Detail
     ──► Favorites
     ──► Gallery
     ──► Downloads
     ──► Premium
     ──► Settings
```

### Navigation Constraints

- **[Req 1.5]** Splash screen has no interactive navigation elements.
- **[Req 7.3]** Pose Detail → Camera pre-loads overlay within 1 second.
- **[Req 5.3]** Category tap uses shared-element hero transition (≤ 450 ms).
- **[Req 47.2]** All routes support deep links (e.g., `snappose://pose/beach-001`).
- Bottom nav FAB (Camera) is always accessible from any tab screen.
- The Camera screen suppresses bottom nav to maximise camera preview area.

---

## Data Models

### State Management Architecture

#### Zustand Stores

**authStore** — authentication and session state
```typescript
interface AuthState {
  user: FirebaseUser | null;
  isAnonymous: boolean;
  isLoading: boolean;
  idToken: string | null;  // NOT persisted in plain storage — only in SecureStore [Req 26]
  signInWithGoogle(): Promise<void>;
  signInAnonymously(): Promise<void>;
  signOut(): Promise<void>;
  refreshToken(): Promise<string>;
}
```

**settingsStore** — persisted in MMKV **[Req 25.3]**
```typescript
interface SettingsState {
  theme: 'light' | 'dark' | 'system';
  language: string;
  overlayOpacity: number;           // default 55
  autoCaptureThreshold: number;     // default 95, range 80–99 [Req 17.6]
  voiceGuidanceEnabled: boolean;
  gridType: 'thirds' | 'golden' | 'none';
  flashMode: 'auto' | 'on' | 'off';
  smileRequired: boolean;           // optional auto-capture gate [Req 16.5]
  notificationsEnabled: boolean;
}
```

**cameraStore** — transient camera session state (no persistence)
```typescript
interface CameraState {
  isActive: boolean;
  currentPoseId: string | null;
  overlayTransform: OverlayTransform;
  poseScore: number;
  autoCaptureCountdown: number | null;
  lightingScore: number;
  distanceState: 'too_close' | 'good' | 'too_far';
  isOverlayLocked: boolean;
  facing: 'front' | 'back';
}
```

**premiumStore** — backed by MMKV key `premiumCached` **[Req 21.7]**
```typescript
interface PremiumState {
  isPremium: boolean;
  plan: 'monthly' | 'yearly' | null;
  expiresAt: number | null;
  lastVerified: number;
  setStatus(status: SubscriptionStatus): void;
  invalidate(): void;
}
```

**offlineQueueStore** — FIFO mutation queue backed by MMKV **[Req 30.3, 41.3]**
```typescript
interface QueuedOperation {
  id: string;
  type: 'favorite_add' | 'favorite_remove' | 'analytics_event' | 'feedback';
  payload: unknown;
  enqueuedAt: number;
  retryCount: number;
}
interface OfflineQueueState {
  queue: QueuedOperation[];
  enqueue(op: Omit<QueuedOperation, 'id' | 'enqueuedAt' | 'retryCount'>): void;
  drainNext(): Promise<void>;
  drainAll(): Promise<void>;
}
```

#### React Query Configuration

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 24 * 60 * 60 * 1000,   // 24h default (pose metadata) [Req 41.4]
      gcTime: 7 * 24 * 60 * 60 * 1000,  // 7-day GC
      retry: 3,
    },
  },
});

// Per-query stale time overrides [Req 41.4]
// categories: 7 days
// app_config:  1 hour
// pose detail: 24 hours
```

MMKV is used as the React Query persistence adapter so cached data survives app restarts **[Req 4.7]**.

---

### Database Design

#### Firestore Collections **[Req 25.1]**

**users** (`users/{uid}`)
```typescript
{
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  provider: 'google' | 'email' | 'anonymous';
  premium: boolean;
  premiumPlan: 'monthly' | 'yearly' | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastLogin: Timestamp;
  language: string;
  theme: 'light' | 'dark' | 'system';
  notificationEnabled: boolean;
  country: string;
  appVersion: string;
  deviceModel: string;
}
```

**poses** (`poses/{poseId}`)
```typescript
{
  id: string;
  categoryId: string;
  title: string;
  description: string;
  imageUrl: string;          // WebP in Firebase Storage
  overlayImage: string;      // transparent PNG
  thumbnailUrl: string;
  difficulty: 'easy' | 'medium' | 'hard';
  indoor: boolean;
  premium: boolean;
  tags: string[];
  views: number;
  downloads: number;
  favorites: number;
  estimatedDistance: number; // cm
  cameraAngle: string;
  lighting: string;
  orientation: 'portrait' | 'landscape';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

**pose_landmarks** (`pose_landmarks/{poseId}`)
```typescript
{
  poseId: string;
  landmarks: Array<{ x: number; y: number; z: number; visibility: number }>;
  // exactly 33 entries; stored separately from pose to reduce read cost
}
```

**categories** (`categories/{categoryId}`)
```typescript
{
  id: string; name: string; slug: string; image: string;
  icon: string; color: string; totalPoses: number;
  premium: boolean; sortOrder: number;
}
```

**favorites** (`favorites/{favoriteId}`)
```typescript
{ id: string; uid: string; poseId: string; createdAt: Timestamp; }
// composite index: uid + poseId
```

**downloads** (`downloads/{downloadId}`)
```typescript
{ id: string; uid: string; poseId: string; downloadedAt: Timestamp; version: number; storageSize: number; }
```

**captured_photos** (`captured_photos/{photoId}`)
```typescript
{
  id: string; uid: string; poseId: string; localPath: string;
  thumbnail: string; width: number; height: number;
  aiScore: number; capturedAt: Timestamp; favorite: boolean;
}
```

**subscriptions** (`subscriptions/{uid}`)
```typescript
{
  uid: string; active: boolean; platform: 'android';
  plan: 'monthly' | 'yearly'; purchaseToken: string;
  expiryDate: Timestamp; autoRenew: boolean;
}
```

**app_config** (single document `app_config/main`) **[Req 46.2]**
```typescript
{
  latestVersion: string; minimumVersion: string; maintenanceMode: boolean;
  premiumEnabled: boolean; adsEnabled: boolean; forceUpdate: boolean;
  aiModelVersion: string; autoCaptureThreshold: number; // 80–99
  voiceGuidanceEnabled: boolean; featuredCategories: string[];
}
```

#### SQLite Tables **[Req 25.2]**

```sql
CREATE TABLE poses (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  image TEXT,
  overlay TEXT,
  premium INTEGER NOT NULL DEFAULT 0,
  updatedAt TEXT NOT NULL
);

CREATE TABLE pose_landmarks (
  poseId TEXT PRIMARY KEY,
  landmarks TEXT NOT NULL -- JSON blob
);

CREATE TABLE favorites (
  id TEXT PRIMARY KEY,
  poseId TEXT NOT NULL,
  createdAt TEXT NOT NULL
);

CREATE TABLE downloads (
  id TEXT PRIMARY KEY,
  poseId TEXT NOT NULL UNIQUE,
  version INTEGER NOT NULL DEFAULT 1,
  downloadedAt TEXT NOT NULL,
  filePath TEXT NOT NULL
);

CREATE TABLE recent_searches (
  id TEXT PRIMARY KEY,
  keyword TEXT NOT NULL,
  createdAt TEXT NOT NULL
);

CREATE TABLE recent_views (
  id TEXT PRIMARY KEY,
  poseId TEXT NOT NULL,
  viewedAt TEXT NOT NULL
);
```

#### MMKV Keys **[Req 25.3]**

| Key | Type | Description |
|---|---|---|
| `theme` | `string` | `'light' \| 'dark' \| 'system'` |
| `language` | `string` | BCP 47 locale code |
| `onboardingCompleted` | `boolean` | First-launch gate **[Req 2.2]** |
| `cameraSettings` | `string` | JSON-serialised camera prefs |
| `overlayOpacity` | `number` | 0–100, default 55 |
| `lastCategory` | `string` | Last browsed category slug |
| `premiumCached` | `string` | JSON: `{isPremium, plan, expiresAt, lastVerified}` **[Req 21.7]** |
| `notificationEnabled` | `boolean` | Master notification toggle |
| `session` | `string` | JSON session metadata (NO token) |
| `firstLaunch` | `boolean` | Cold-start detection |
| `lastSync` | `number` | Unix ms of last Firestore sync |
| `offlineQueue` | `string` | JSON array of QueuedOperation **[Req 41.3]** |
| `appConfig` | `string` | Cached app_config JSON + fetchedAt **[Req 46.1]** |

Authentication tokens are stored **only** in Expo SecureStore (Android Keystore), never in MMKV **[Req 26.1]**.

---

## Correctness Properties

The domain layer enforces the following correctness invariants, all verifiable via property-based tests (fast-check) without any device emulator. **[Req 38.3]**

### Property 1: Pose Score Invariants **[Req 11]**

**Validates: Requirements 11.1, 11.2, 11.5, 11.7**

| Property | Description |
|---|---|
| **Score range** | `computePoseScore(user, ref)` always returns an integer in `[0, 100]` for any valid `NormalisedLandmarks` input. |
| **Identity** | When `user === ref` (within fp tolerance), score ≥ 95. |
| **Monotonicity** | As normalised angular distance decreases monotonically, score must not decrease. |
| **Weighted sum** | Sum of all regional weights equals exactly 100 (Shoulders 15 + Arms 20 + Hands 10 + Torso 20 + Legs 20 + Head 10 + Feet 5). |
| **Normalisation round-trip** | `normalise(denormalise(normalise(L))) === normalise(L)` within fp tolerance. |

### Property 2: Auto-Capture Invariants **[Req 17]**

**Validates: Requirements 17.1, 17.3, 17.6, 17.7**

| Property | Description |
|---|---|
| **Gate conjunction** | `shouldTrigger(gates)` returns `true` iff all gates are simultaneously true — never on a partial set. |
| **Countdown cancellation** | For any sequence where score ≥ threshold for N frames then drops below, `captureCount` remains 0. |
| **Threshold boundary** | For all `t ∈ [80, 99]`, trigger fires when `score === t` and does not fire when `score === t − 1`. |

### Property 3: Download Manager Invariants **[Req 19]**

**Validates: Requirements 19.3, 19.4, 19.7, 19.8**

| Property | Description |
|---|---|
| **Idempotence** | Downloading the same `poseId` N times leaves exactly one file on disk with the expected SHA-256 hash. |
| **Pause-resume integrity** | For any pause byte offset, resumed download's final SHA-256 equals the server-provided hash. |
| **Offline read** | After successful download, all assets are accessible with network disabled. |

### Property 4: Landmark Parser Invariants **[Req 40]**

**Validates: Requirements 40.1, 40.2, 40.3, 40.4**

| Property | Description |
|---|---|
| **Round-trip** | `parse(serialize(L)) deepEquals L` within fp tolerance for all valid `PoseLandmarks`. |
| **Error on invalid input** | `parse(s)` returns `ParseError` for all invalid JSON strings — never throws, never returns partial data. |
| **Idempotent serialisation** | `serialize(L)` is deterministic: two calls with the same input produce identical strings. |

### Property 5: Normalisation Pipeline Invariants **[Req 42]**

**Validates: Requirements 42.1, 42.2, 42.3, 42.4**

| Property | Description |
|---|---|
| **Scale invariance** | `normalise(scale(L, s)) === normalise(L)` for all `s > 0`. |
| **Translation invariance** | `normalise(translate(L, dx, dy)) === normalise(L)` for all `(dx, dy)`. |
| **Rotation equivariance** | Pose_Score variation ≤ 3 points for `|θ| ≤ 10°` rotation around torso centroid. |

### Property 6: Data Layer Invariants **[Req 25]**

**Validates: Requirements 25.3, 25.6, 30.3, 41.3**

| Property | Description |
|---|---|
| **MMKV round-trip** | `read(write(v)) deepEquals v` for all serialisable values. |
| **Pagination completeness** | Union of all pages over N docs with page-size P contains exactly N docs, no duplicates. |
| **Offline queue FIFO** | N enqueued mutations are applied to Firestore in exactly enqueue order. |

### Property 7: Security Invariants **[Req 26]**

**Validates: Requirements 26.1, 26.2, 26.5**

| Property | Description |
|---|---|
| **SecureStore non-disclosure** | A key written via `SecureStore.setItemAsync` is not readable from `AsyncStorage` or plain FS. |
| **Firestore access control** | Read attempt by `uid=A` on doc owned by `uid=B` (A≠B) is rejected with `PERMISSION_DENIED`. |

### Property 8: API Layer Invariants **[Req 37]**

| Property | Description |
|---|---|
| **Response schema** | Deserialising any API response produces a valid typed object — no runtime type errors. |
| **Auth token round-trip** | `getIdToken() → Bearer header → Cloud Function verify` returns correct uid without mutation. |
| **Subscription consistency** | For all sequences of purchase/expire/restore, local Premium status matches latest Play Billing verification. |
| **Ad-free invariant** | While `premiumStatus === true`, zero ad units are loaded or displayed across all screens. |

---

## Error Handling

### Error Boundary Strategy **[Req 35]**

Two React error boundaries wrap the app:

1. **Root boundary** (`app/_layout.tsx`) — catches catastrophic errors; renders a full-screen recovery screen with "Restart App" button and reports to Crashlytics.
2. **Screen-level boundaries** — each screen in `(tabs)/` and route screens is individually wrapped; a screen crash shows a per-screen error card with a "Retry" button rather than crashing the whole app.

### Camera & Permission Errors **[Req 35.2, 35.3]**

| Error | Handler |
|---|---|
| Camera permission denied | Show `SPPermissionCard` with rationale + "Open Settings" button; do not crash or show blank screen. |
| Storage permission denied | Show non-blocking toast; camera session continues; saving is disabled. |
| Camera hardware unavailable | Show full-screen error with "Retry" button; log to Crashlytics. |

### AI Engine Errors **[Req 35.4]**

| Error | Handler |
|---|---|
| `MediaPipePoseDetector.initialise()` failure | Fall back to Overlay-only mode; show dismissible toast "AI unavailable — overlay mode active"; log to Crashlytics with `{ errorCode, deviceModel }`. |
| Frame inference timeout (> 200 ms) | Skip frame, increment `droppedFrameCount`; if 10 consecutive drops, restart inference thread. |
| TTS initialisation failure **[Req 13.8]** | Silence voice coach silently; log to Crashlytics; camera and AI continue. |

### Network & Firebase Errors **[Req 35.5, 41]**

| Error | Handler |
|---|---|
| Firestore timeout | Exponential back-off: 1 s → 2 s → 4 s → max 30 s. User-friendly message after 3 failures: "Couldn't sync. Tap to retry." |
| Network unavailable | Enqueue mutation in `offlineQueueStore`; show offline indicator banner (dismissible). |
| `429 Too Many Requests` | Back off per `Retry-After` header; surface no UI error on first occurrence. |
| 4xx / 5xx from Cloud Functions | Map to user-readable message via `errorCodeMap`; never expose raw HTTP status to users **[Req 35.8]**. |
| Firebase Auth unreachable | Continue with locally cached session **[Req 3.8]**; log non-fatal to Crashlytics. |

### Storage Full **[Req 35.6, 19.5]**

- On photo capture: display `SPDialog` — "Storage Full — Manage Storage" — with link to Downloads screen; camera session is preserved.
- On download start: warn and halt if < 50 MB free.

### Billing Errors **[Req 21.8]**

| Error | Handler |
|---|---|
| User cancels purchase | No error message; dismiss billing flow silently. |
| Payment declined | Toast: "Payment declined. Please check your payment method." with "Retry" button. |
| Item unavailable | Toast: "This subscription is currently unavailable." |
| Network failure during billing | Toast: "Couldn't complete purchase. Check your connection and try again." |

### Queue Exhaustion **[Req 41.5]**

When a queued operation fails after max retries (3), it is removed from the queue, logged to Crashlytics with `{ operationType, payload, retryCount }`, and a silent analytics event `queue_operation_failed` is emitted.

### Blank Screen Prevention **[Req 35.7]**

Every screen must implement all three states:
- **Loading** — skeleton/shimmer placeholder (never blank white).
- **Empty** — illustrated empty state with action button.
- **Error** — error card with message + retry button.

This is enforced by `SPScreenTemplate` which requires `renderLoading`, `renderEmpty`, and `renderError` props.

---

## Testing Strategy

### Test Pyramid **[Req 38]**

```
         ┌───────────────┐
         │   E2E (Detox) │  ← critical user journeys (slow, high confidence)
         ├───────────────┤
         │  Integration  │  ← Firebase flows, Camera+AI pipeline, Billing
         ├───────────────┤
         │ Property-Based│  ← domain invariants (fast-check)
         ├───────────────────────────────┤
         │         Unit Tests            │  ← hooks, utils, scoring, parsing (Jest)
         └───────────────────────────────┘
```

### Unit Tests — Target 85% Coverage **[Req 38.1]**

All domain-layer modules (pure TypeScript, zero React Native imports) have unit tests in `src/features/*/domain/__tests__/`:

- `PoseScoreCalculator.test.ts` — scoring algorithm, weight verification, colour band boundaries.
- `LandmarkNormaliser.test.ts` — scale / translation / rotation normalisation.
- `AutoCaptureEngine.test.ts` — gate conjunction, threshold boundary, countdown state machine.
- `LandmarkParser.test.ts` — valid/invalid JSON, round-trip.
- `OverlayTransformEngine.test.ts` — gesture transform maths.
- `RecommendationEngine.test.ts` — local recommendation logic.
- `DownloadManager.test.ts` — pause/resume state machine.

All hooks in `src/features/*/hooks/` are tested with `@testing-library/react-native`.

### Property-Based Tests — fast-check **[Req 38.3]**

Located in `src/__pbt__/`:

| File | Properties |
|---|---|
| `poseScore.pbt.ts` | Score range, identity, monotonicity, weighted sum, normalisation round-trip |
| `autoCapture.pbt.ts` | Gate conjunction, countdown cancellation, threshold boundary |
| `download.pbt.ts` | Idempotence, pause-resume integrity |
| `billing.pbt.ts` | Subscription state consistency, purchase idempotence, ad-free invariant |
| `adFrequency.pbt.ts` | Frequency cap, ad exclusion zone |
| `mmkv.pbt.ts` | Serialisation round-trip, key isolation |
| `firestoreSync.pbt.ts` | FIFO ordering, pagination completeness |
| `landmarkParser.pbt.ts` | Round-trip, error signalling, idempotent serialisation |
| `network.pbt.ts` | Retry idempotence, cache stale-time invariant |
| `normalisation.pbt.ts` | Scale invariance, translation invariance, rotation equivariance |

### Integration Tests **[Req 38.2]**

Located in `src/__integration__/`. Use real SQLite and MMKV via in-memory test doubles; Firebase services use the Firebase Local Emulator Suite:

- `auth.integration.ts` — anonymous sign-in, Google sign-in, token refresh, offline fallback.
- `firestoreSync.integration.ts` — offline write queue drain, conflict resolution.
- `downloadManager.integration.ts` — full download lifecycle including pause/resume.
- `cameraAIPipeline.integration.ts` — Camera_Engine → AI_Engine frame pipeline.
- `billing.integration.ts` — purchase flow, restore, expiry downgrade.
- `notifications.integration.ts` — FCM registration, deep-link on tap.

### E2E Tests — Detox **[Req 38.4]**

Located in `e2e/`. Runs against Android emulator in CI:

| Journey | File |
|---|---|
| Onboarding (skip + complete) | `onboarding.e2e.ts` |
| Home browsing + pose detail | `homeBrowsing.e2e.ts` |
| Pose detail → Camera → Capture | `captureFlow.e2e.ts` |
| Favorites add/remove + offline | `favorites.e2e.ts` |
| Download pack + offline access | `downloads.e2e.ts` |
| Premium purchase + ad suppression | `premium.e2e.ts` |
| Settings theme switch | `settings.e2e.ts` |

### CI/CD Pipeline **[Req 38.5, 38.6, 39]**

Every PR triggers:
1. `tsc --noEmit` (strict mode) — blocks on any type error.
2. `eslint` + `prettier --check` — blocks on lint/format violations.
3. `npm audit --audit-level critical` — blocks on critical CVEs.
4. `jest --coverage --coverageThreshold='{"global":{"lines":85}}'` — unit + PBT.
5. `detox test --configuration android.emu.release` — E2E on Android emulator.
6. `expo doctor` — checks for deprecated SDK usage.

Production releases additionally run the Google Play Pre-Launch Report before promotion to the production track **[Req 38.7]**.

### Test Environments

| Tier | Firebase | AdMob | Play Billing | SQLite | MMKV |
|---|---|---|---|---|---|
| Unit | Mock adapter | Mock adapter | Mock adapter | In-memory | In-memory |
| Integration | Firebase Emulator Suite | Mock adapter | Mock adapter | Real (temp file) | Real (temp file) |
| E2E | Firebase Staging project | Test ad units | Billing test mode | Real | Real |

### Device Matrix **[Req 38.8]**

Tests must pass on:
- Android 8 (API 26) — low-end, 3 GB RAM
- Android 10 — mid-range
- Android 12 — mid-range
- Android 14 — flagship
- Latest stable Android

---
