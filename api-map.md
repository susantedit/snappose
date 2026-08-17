# 🌐 Snap Pose — API Specification & Endpoint Map

## 1. Global API Standards

- **Base URL**: Configured via `EXPO_PUBLIC_MONGODB_API_URL` (Defaults to `http://localhost:3000/api` or `https://<app>.railway.app/api`).
- **Standard Envelope Response**:
```typescript
export type ApiResponse<T> =
  | {
      success: true;
      data: T;
      timestamp: string;
    }
  | {
      success: false;
      data: null;
      error: {
        code: string;
        message: string;
      };
      timestamp: string;
    };
```
- **Error Codes**:
  - `NOT_FOUND`: Resource does not exist.
  - `UNAUTHORIZED`: Bearer token missing or invalid.
  - `FORBIDDEN`: Insufficient permissions.
  - `RATE_LIMITED` / `LIMIT_EXCEEDED`: HTTP 429 rate limit reached.
  - `INVALID_INPUT`: Bad request parameters or payload.
  - `INTERNAL_ERROR`: Unhandled server exception.

---

## 2. Complete API Inventory

### 2.1 Poses Service (`/api/poses`)

#### `GET /api/poses`
- **Purpose**: Fetch paginated poses with optional multi-criteria filtering and full-text search.
- **Used by**: `src/services/api/poses.ts`, `src/hooks/usePoses.ts`, `app/(tabs)/index.tsx`, `app/(tabs)/search.tsx`.
- **Query Parameters**:
  - `categoryId` (string, optional): Filter by category ID (e.g. `'street'`, `'cafe'`).
  - `difficulty` (`'easy'` | `'medium'` | `'hard'`, optional): Filter by pose difficulty.
  - `orientation` (`'portrait'` | `'landscape'`, optional): Filter by orientation.
  - `indoor` (boolean, optional): Filter indoor/outdoor poses.
  - `keyword` (string, optional): Case-insensitive regex match against `title` and `tags`.
  - `limit` (number, optional, default: 20, max: 50): Page size.
  - `cursor` (string, optional): Cursor for next page pagination.
- **Success Response Data (`200 OK`)**:
```json
{
  "items": [
    {
      "id": "pose-1",
      "categoryId": "solo-female",
      "title": "Over the Shoulder Glance",
      "description": "Subtle turn looking back over your shoulder.",
      "imageUrl": "https://...",
      "overlayImage": "https://...",
      "thumbnailUrl": "https://...",
      "difficulty": "easy",
      "indoor": false,
      "tags": ["portrait", "glance", "outdoor"],
      "views": 1240,
      "downloads": 380,
      "favorites": 215,
      "estimatedDistance": 2.0,
      "cameraAngle": "Eye Level",
      "lighting": "Natural Soft Light",
      "orientation": "portrait"
    }
  ],
  "cursor": "pose-20",
  "hasMore": true,
  "total": 26
}
```

#### `GET /api/poses/:id`
- **Purpose**: Fetch single pose metadata and asynchronously increment view count.
- **Used by**: `app/pose/[id].tsx`, `src/features/poses/hooks/usePoseDetail.ts`.
- **Response Data (`200 OK`)**: Single `IPose` object.

---

### 2.2 Categories Service (`/api/categories`)

#### `GET /api/categories`
- **Purpose**: Fetch all pose categories sorted by `sortOrder`.
- **Used by**: `src/services/api/categories.ts`, `src/hooks/useCategories.ts`, `app/(tabs)/index.tsx`.
- **Response Data (`200 OK`)**:
```json
[
  {
    "id": "street",
    "name": "Street",
    "slug": "street",
    "image": "https://...",
    "icon": "🏙️",
    "color": "#4F5B38",
    "totalPoses": 5,
    "sortOrder": 1
  }
]
```

---

### 2.3 Favorites Service (`/api/favorites`)

#### `GET /api/favorites`
- **Purpose**: Fetch all pose IDs favorited by the authenticated user.
- **Auth**: `Bearer <token>` (Required).
- **Used by**: `src/services/api/favorites.ts`, `src/features/favorites/hooks/useFavorites.ts`.
- **Response Data (`200 OK`)**: `string[]` (Array of pose IDs).

#### `POST /api/favorites`
- **Purpose**: Add pose to favorites (upsert).
- **Auth**: `Bearer <token>` (Required).
- **Request Body**: `{ "poseId": "pose-1" }`
- **Response Data (`200 OK`)**: `{ "poseId": "pose-1", "isFavorite": true }`

#### `DELETE /api/favorites/:poseId`
- **Purpose**: Remove pose from favorites.
- **Auth**: `Bearer <token>` (Required).
- **Response Data (`200 OK`)**: `{ "poseId": "pose-1", "isFavorite": false }`

---

### 2.4 Photo Captures & Rate Limit Service (`/api/captures`)

#### `GET /api/captures/stats`
- **Purpose**: Retrieve current rolling 6-hour window capture statistics.
- **Auth**: `Bearer <token>` (Required).
- **Used by**: `src/services/api/captures.ts`, `app/capture-limit/index.tsx`.
- **Response Data (`200 OK`)**:
```json
{
  "count": 4,
  "maxAllowed": 15,
  "remaining": 11,
  "bonusCaptures": 5,
  "windowResetTime": 1723824000000,
  "isLimitReached": false
}
```

#### `POST /api/captures`
- **Purpose**: Increment user photo capture counter against rate limit.
- **Auth**: `Bearer <token>` (Required).
- **Response Data (`200 OK`)**: `{ "captured": true, "count": 5, "remaining": 10 }`
- **Error (`429 Too Many Requests`)**:
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "LIMIT_EXCEEDED",
    "message": "Rolling 6-hour photo capture limit reached"
  },
  "timestamp": "2026-08-16T14:30:00.000Z"
}
```

#### `POST /api/captures/bonus`
- **Purpose**: Grant $+5$ bonus captures after user completes a rewarded video ad.
- **Auth**: `Bearer <token>` (Required).
- **Response Data (`200 OK`)**:
```json
{
  "granted": 5,
  "totalBonus": 5,
  "maxAllowed": 15,
  "remaining": 10
}
```

---

### 2.5 App Remote Configuration (`/api/app-config`)

#### `GET /api/app-config`
- **Purpose**: Retrieve global app configuration flags.
- **Used by**: `src/services/api/config.ts`, `src/hooks/useAppConfig.ts`.
- **Response Data (`200 OK`)**:
```json
{
  "key": "global",
  "maintenanceMode": false,
  "minimumVersion": "1.0.0",
  "latestVersion": "1.0.0",
  "adsEnabled": true,
  "autoCaptureThreshold": 94,
  "voiceGuidanceEnabled": true
}
```

---

### 2.6 Feedback Service (`/api/feedback`)

#### `POST /api/feedback`
- **Purpose**: Submit user feedback, suggestions or bug reports.
- **Auth**: Optional Bearer token.
- **Request Body**: `{ "type": "bug" | "suggestion" | "feedback", "message": "..." }`
- **Response Data (`200 OK`)**: Feedback record with generated timestamp and ID.
