# 🗺️ Snap Pose — Routing & Navigation Intelligence

## 1. Expo Router (Mobile Client Navigation Map)

Snap Pose uses **Expo Router v6** file-based navigation with typed routes enabled (`experiments.typedRoutes: true`).

### 1.1 Complete Routes Table

| Route Path | File Path | Type | Purpose | Auth Required | Transition / Presentation |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/(auth)/splash` | `app/(auth)/splash.tsx` | Screen | Initial app entry, MMKV hydration, animation & auth routing | Optional (Anonymous) | `none` |
| `/(auth)/onboarding` | `app/(auth)/onboarding.tsx` | Screen | First-time onboarding walkthrough & feature intro | Optional | `fade` |
| `/(tabs)/` (index) | `app/(tabs)/index.tsx` | Tab Screen | Main Discovery Home, Categories, Hero, Trending & Editor's picks | Optional | Tab Switch / Default |
| `/(tabs)/search` | `app/(tabs)/search.tsx` | Tab Screen | Real-time pose search, keyword history, category filters | Optional | Tab Switch / Default |
| `/(tabs)/camera` | `app/(tabs)/camera.tsx` | Tab Screen (FAB) | Live camera viewfinder, AI assist mode, overlay guide, capture | Optional | Tab Switch / Center FAB |
| `/(tabs)/favorites` | `app/(tabs)/favorites.tsx` | Tab Screen | Saved pose inspirations, multi-sort (newest, difficulty, cat) | Optional (Local MMKV) | Tab Switch / Default |
| `/(tabs)/settings` | `app/(tabs)/settings.tsx` | Tab Screen | User preferences, theme, flash, voice coaching, legal, about | Optional | Tab Switch / Default |
| `/pose/[id]` | `app/pose/[id].tsx` | Stack Screen | Full pose details, step-by-step instructions, lighting specs, try CTA | Optional | `slide_from_right` |
| `/category/[slug]` | `app/category/[slug].tsx` | Stack Screen | Category pose gallery, curated filters, batch pose cards | Optional | `slide_from_right` |
| `/gallery` | `app/gallery/index.tsx` | Stack Screen | 3-column photo gallery, metadata inspector, multi-select batch delete | Optional (Local Media) | `slide_from_bottom` |
| `/downloads` | `app/downloads/index.tsx` | Stack Screen | Offline pose pack manager, storage size breakdown, deletion | Optional | `slide_from_right` |
| `/capture-limit` | `app/capture-limit/index.tsx`| Modal Screen | 10 photos/6h limit notification, countdown timer, rewarded ad unlock | Optional | `modal` (slide from bottom) |
| `+not-found` | `app/+not-found.tsx` | Screen | 404 fallback screen | None | Default |

---

## 2. Deep Linking Configuration

- **URL Scheme**: `snappose://`
- **Supported Deep Link Patterns**:
  - `snappose://pose/:id` $\rightarrow$ Direct navigation to specific pose detail screen
  - `snappose://category/:slug` $\rightarrow$ Direct navigation to specific category collection
  - `snappose://camera?poseId=:id` $\rightarrow$ Direct launch into camera with reference pose preloaded

---

## 3. Backend Express API Route Map

Base URL: `http://<host>:3000/api` or `process.env.EXPO_PUBLIC_MONGODB_API_URL`

| HTTP Method | Route | Handler File | Auth Required | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/health` | `backend/src/index.ts` | No | Server health check & timestamp |
| `GET` | `/api/poses` | `backend/src/routes/poses.ts` | Optional | Paginated list of poses with search, difficulty, category & indoor filters |
| `GET` | `/api/poses/:id` | `backend/src/routes/poses.ts` | Optional | Get single pose detail and increment view count |
| `GET` | `/api/categories` | `backend/src/routes/categories.ts` | No | Fetch all pose categories sorted by `sortOrder` |
| `GET` | `/api/favorites` | `backend/src/routes/favorites.ts` | **Required (Bearer)** | Get user's cloud-synced favorite pose IDs |
| `POST` | `/api/favorites` | `backend/src/routes/favorites.ts` | **Required (Bearer)** | Add pose to user favorites |
| `DELETE` | `/api/favorites/:poseId` | `backend/src/routes/favorites.ts` | **Required (Bearer)** | Remove pose from user favorites |
| `GET` | `/api/captures/stats` | `backend/src/routes/captures.ts` | **Required (Bearer)** | Check user's 6-hour rolling capture limit and reset timestamp |
| `POST` | `/api/captures` | `backend/src/routes/captures.ts` | **Required (Bearer)** | Record a photo capture against the rolling limit |
| `POST` | `/api/captures/bonus` | `backend/src/routes/captures.ts` | **Required (Bearer)** | Grant $+5$ bonus captures following verified rewarded ad |
| `GET` | `/api/app-config` | `backend/src/routes/config.ts` | No | Fetch remote configuration, maintenance mode, min version |
| `POST` | `/api/feedback` | `backend/src/routes/feedback.ts` | Optional (Bearer) | Submit user feedback, suggestions or bug reports |
