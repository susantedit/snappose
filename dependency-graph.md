# 📦 Snap Pose — Dependency Graph & Codebase Structure

## 1. Module Import Hierarchy & Architecture Graph

```mermaid
graph TD
    subgraph UI_Layer [Presentation & Screen Layer]
        AppRoot[app/_layout.tsx]
        AuthGroup[app/(auth)/*]
        TabsGroup[app/(tabs)/*]
        StackScreens[app/pose/[id], app/category/[slug], app/gallery, app/downloads, app/capture-limit]
        Atoms[src/components/atoms/*]
        Molecules[src/components/molecules/*]
        Organisms[src/components/organisms/*]
    end

    subgraph State_Layer [State & Store Layer]
        AuthStore[src/stores/authStore.ts]
        CameraStore[src/stores/cameraStore.ts]
        SettingsStore[src/stores/settingsStore.ts]
        OfflineQueueStore[src/stores/offlineQueueStore.ts]
    end

    subgraph Feature_Layer [Feature Domains]
        AI_Domain[src/features/ai/domain/*]
        Camera_Domain[src/features/camera/domain/*]
        Poses_Domain[src/features/poses/domain/*]
        Favorites_Domain[src/features/favorites/domain/*]
        Downloads_Domain[src/features/downloads/domain/*]
        Ads_Domain[src/features/ads/domain/*]
    end

    subgraph Data_Layer [Data & Storage Layer]
        SQLite[(src/database/sqlite/db.ts & DAOs)]
        MMKV[(src/database/mmkv/mmkvClient.ts)]
        APIClient[src/services/api/client.ts]
        FirebaseServices[src/services/firebase/* & analytics/*]
    end

    AppRoot --> TabsGroup
    AppRoot --> AuthGroup
    AppRoot --> StackScreens
    TabsGroup --> Molecules
    TabsGroup --> Organisms
    TabsGroup --> CameraStore
    TabsGroup --> SettingsStore
    TabsGroup --> AI_Domain
    TabsGroup --> Camera_Domain

    Camera_Domain --> AI_Domain
    Camera_Domain --> MMKV
    AI_Domain --> CameraStore

    SettingsStore --> MMKV
    AuthStore --> FirebaseServices

    Favorites_Domain --> SQLite
    Favorites_Domain --> APIClient
    Downloads_Domain --> SQLite
    Poses_Domain --> SQLite
    Poses_Domain --> APIClient
```

---

## 2. Critical & Core System Files

These files are high-impact architectural pillars. Modifications to them can ripple across multiple subsystems:

| File Path | Responsibility | Why It's Critical | Risk Level |
| :--- | :--- | :--- | :--- |
| `app/_layout.tsx` | App root lifecycle, provider hierarchy, hydration | Initializes theme, React Query, MMKV, gesture handlers, and navigation tree | 🔴 **CRITICAL** |
| `src/constants/designTokens.ts` | Complete visual token dictionary | Colors, typography, spacing, border radii, animation durations used across all 40+ components | 🔴 **CRITICAL** |
| `src/constants/theme.tsx` | Theme Context & Provider | Handles dark/light/system switching without UI flicker; bound to MMKV | 🔴 **CRITICAL** |
| `src/database/mmkv/mmkvClient.ts` & `keys.ts` | Synchronous KV Engine | All fast settings, rate limits, onboarding flags depend on MMKV keys remaining consistent | 🔴 **CRITICAL** |
| `src/database/sqlite/db.ts` | Local SQLite DB & Migrations | Defines schema DDL, indexes, and starter seed for offline functionality | 🔴 **CRITICAL** |
| `src/features/ai/domain/PoseScoreCalculator.ts` | 7-Region Angular Scoring Engine | Pure TypeScript implementation of MediaPipe landmark angular difference calculation; runs every frame | 🔴 **CRITICAL** |
| `src/features/camera/domain/CaptureRateLimit.ts` | Free Tier 10 photo/6hr Rate Limiter | Governs monetization gate, countdown logic, and bonus capture grants | 🟡 **HIGH** |
| `src/features/poses/data/posesData.ts` | Curated Master Dataset | Contains 26 comprehensive offline poses across 12 categories with full metadata | 🟡 **HIGH** |
| `src/services/api/client.ts` | Typed Axios HTTP Client | Handles auth bearer token injection, envelope unwrap, 429 retry-after backoff | 🟡 **HIGH** |
| `src/features/ads/infrastructure/AdMobAdapter.ts` | AdMob Interstitial & Rewarded SDK | Mediates ads, handles fallback on simulator/dev, manages frequency limits | 🟡 **HIGH** |

---

## 3. Third-Party Libraries & Native Modules Matrix

| Library | Version | Purpose & Integration Area | Native Dependency |
| :--- | :--- | :--- | :--- |
| `expo` | `~54.0.36` | Core SDK platform | Yes |
| `expo-router` | `~6.0.24` | Typed file-based routing | No (JS layer) |
| `expo-camera` | `~17.0.10` | Fullscreen viewfinder, torch, resolution capture | Yes (Camera2 / AVFoundation) |
| `expo-media-library` | `~18.2.1` | Photo saving, permission checks, gallery asset discovery | Yes (Storage permissions) |
| `expo-sqlite` | `~16.0.10` | Offline relational DB with WAL mode | Yes (sqlite3 native binary) |
| `react-native-mmkv` | `^2.12.2` | Ultra-fast C++ MMKV key-value store | Yes (C++ JSI bindings) |
| `react-native-reanimated` | `~4.1.7` | UI thread animations, micro-interactions, flip gestures | Yes (Reanimated worklets) |
| `react-native-gesture-handler` | `~2.28.0` | Pan/pinch/zoom overlay transforms | Yes (Native gesture recognizers) |
| `@shopify/flash-list` | `^2.0.2` | High-performance recycled 3-column gallery list | Yes |
| `@shopify/react-native-skia` | `^2.2.12` | High-performance 2D drawing & graphic overlays | Yes (Skia C++ engine) |
| `@tanstack/react-query` | `^5.40.0` | Data fetching, cache layer, retry backoff | No (JS layer) |
| `@react-native-firebase/app` | `^20.0.0` | Firebase core integration | Yes (Google Play Services / iOS SDK) |
| `@react-native-firebase/auth` | `^20.0.0` | Anonymous, Email, and Google authentication | Yes |
| `@react-native-firebase/crashlytics` | `^20.0.0` | Native crash reporting and breadcrumb logging | Yes |
| `react-native-google-mobile-ads` | `^16.4.0` | AdMob Native, Interstitial, Rewarded Video Ads | Yes (Google Mobile Ads SDK) |
| `zustand` | `^4.5.2` | Lightweight modular state management | No (JS layer) |
| `axios` | `^1.7.2` | REST API communication with envelope unwrapping | No (JS layer) |
| `zod` | `^3.23.8` | Schema validation | No (JS layer) |
