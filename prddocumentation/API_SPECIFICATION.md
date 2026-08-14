# 🌐 API_SPECIFICATION.md

Project: Snap Pose

Version: 1.0

API Version: v1

Status: Production Ready

---

# Overview

Snap Pose follows an **Offline-First Architecture**. Most camera and AI features run locally. Cloud APIs are used only for authentication, synchronization, premium content, analytics, and updates.

---

# Architecture

```
React Native App
        │
        ▼
API Service Layer
        │
 ┌──────┼─────────┐
 ▼      ▼         ▼
Firebase  Cloud Functions  External APIs
        │
        ▼
Firestore
Storage
Authentication
Analytics
Crashlytics
FCM
```

---

# API Standards

Protocol

HTTPS Only

Data Format

JSON

Authentication

Firebase Authentication JWT

Encoding

UTF-8

Compression

GZIP

Timezone

UTC

Date Format

ISO-8601

Versioning

/api/v1/

---

# Authentication

Authorization Header

```
Authorization: Bearer <Firebase_ID_Token>
```

Anonymous users may access public endpoints without authentication.

---

# Standard Response

Success

```json
{
  "success": true,
  "message": "Request successful",
  "data": {},
  "timestamp": "2026-07-26T10:00:00Z"
}
```

Error

```json
{
  "success": false,
  "error": {
    "code": "POSE_NOT_FOUND",
    "message": "Pose does not exist"
  },
  "timestamp": "2026-07-26T10:00:00Z"
}
```

---

# Authentication APIs

## Login

POST

```
/api/v1/auth/login
```

Response

```
Firebase Token
User Profile
```

---

## Logout

POST

```
/api/v1/auth/logout
```

---

## Refresh Token

POST

```
/api/v1/auth/refresh
```

---

# User APIs

## Get Profile

GET

```
/api/v1/users/me
```

---

## Update Profile

PUT

```
/api/v1/users/me
```

Fields

- Name
- Avatar
- Theme
- Language
- Notification Settings

---

## Delete Account

DELETE

```
/api/v1/users/me
```

---

# Categories

## List Categories

GET

```
/api/v1/categories
```

Filters

- Premium
- Trending

---

## Category Details

GET

```
/api/v1/categories/{id}
```

---

# Pose APIs

## List Poses

GET

```
/api/v1/poses
```

Query Parameters

- category
- difficulty
- premium
- page
- limit
- search

---

## Pose Details

GET

```
/api/v1/poses/{id}
```

Returns

- Metadata
- Overlay
- Landmarks
- Lighting Tips
- Camera Tips

---

## Trending Poses

GET

```
/api/v1/poses/trending
```

---

## Recommended Poses

GET

```
/api/v1/poses/recommended
```

Requires authentication.

---

# Search

GET

```
/api/v1/search
```

Parameters

- keyword
- category
- difficulty
- indoor
- outdoor

---

# Favorites

## Add

POST

```
/api/v1/favorites
```

---

## Remove

DELETE

```
/api/v1/favorites/{poseId}
```

---

## List

GET

```
/api/v1/favorites
```

---

# Downloads

## Download Metadata

GET

```
/api/v1/downloads/{poseId}
```

---

## Download Pack

GET

```
/storage/poses/{poseId}
```

Returns ZIP package containing

- Image
- Overlay
- Metadata
- Landmarks

---

# Gallery Sync

## Backup Photo

POST

```
/api/v1/photos
```

Premium only.

---

## List Photos

GET

```
/api/v1/photos
```

---

## Delete Photo

DELETE

```
/api/v1/photos/{id}
```

---

# Premium

## Plans

GET

```
/api/v1/premium/plans
```

---

## Verify Purchase

POST

```
/api/v1/premium/verify
```

---

## Restore Purchase

POST

```
/api/v1/premium/restore
```

---

# Feedback

POST

```
/api/v1/feedback
```

Payload

- Rating
- Category
- Message
- Screenshot (optional)

---

# Notifications

GET

```
/api/v1/notifications
```

---

# Analytics

POST

```
/api/v1/analytics/events
```

Events

- app_open
- pose_view
- camera_open
- photo_capture
- favorite_add
- search
- premium_purchase
- download

---

# App Configuration

GET

```
/api/v1/config
```

Returns

- Latest Version
- Force Update
- Feature Flags
- Maintenance Mode
- AI Model Version

---

# AI APIs (Future Cloud Features)

## Generate Pose Suggestions

POST

```
/api/v1/ai/recommend
```

Input

- Category
- Outfit (user-selected)
- Location Type
- Time of Day

Output

Recommended poses.

---

## Upload Custom Pose

POST

```
/api/v1/ai/custom-pose
```

Future feature.

---

## AI Model Update

GET

```
/api/v1/ai/model
```

Returns latest model version.

---

# Pagination

```
?page=1

&limit=20
```

Response

```json
{
  "page": 1,
  "limit": 20,
  "total": 250,
  "hasNext": true
}
```

---

# Sorting

Supported

- newest
- oldest
- popular
- trending
- downloads
- favorites

---

# Filtering

Supported

- Category
- Difficulty
- Indoor
- Outdoor
- Premium
- Free
- Orientation
- Lighting
- Camera Angle

---

# Rate Limiting

Anonymous

60 requests/minute

Authenticated

300 requests/minute

Admin

1000 requests/minute

---

# HTTP Status Codes

200 OK

201 Created

204 No Content

400 Bad Request

401 Unauthorized

403 Forbidden

404 Not Found

409 Conflict

422 Validation Error

429 Too Many Requests

500 Internal Server Error

503 Service Unavailable

---

# Error Codes

```
INVALID_TOKEN

USER_NOT_FOUND

POSE_NOT_FOUND

CATEGORY_NOT_FOUND

DOWNLOAD_FAILED

PAYMENT_FAILED

PREMIUM_REQUIRED

RATE_LIMIT_EXCEEDED

NETWORK_ERROR

UNKNOWN_ERROR
```

---

# Security

- HTTPS only
- Firebase JWT authentication
- Input validation
- Firestore Security Rules
- Cloud Functions authorization
- No secrets in client code
- Signed Storage URLs where applicable

---

# Caching

Images

30 days

Categories

7 days

Pose Metadata

24 hours

Config

1 hour

User Profile

On login + refresh

---

# Offline Behavior

Works Offline

- Camera
- AI Pose Detection
- Overlay
- Downloaded Poses
- Favorites
- Gallery

Requires Internet

- Login
- Premium Purchase
- Cloud Sync
- Feedback
- Notifications

---

# Firebase Services

Authentication

Firestore

Storage

Cloud Functions

Analytics

Crashlytics

Performance Monitoring

Remote Config

Cloud Messaging

App Check

---

# Cloud Functions

syncFavorites()

verifyPurchase()

sendFeedback()

updateAnalytics()

checkForUpdates()

generateRecommendations()

cleanupOldData()

sendPushNotification()

---

# API Versioning

Current

v1

Future

v2

Maintain backward compatibility whenever possible.

---

# API Testing

Required

✓ Unit Tests

✓ Integration Tests

✓ Authentication Tests

✓ Permission Tests

✓ Offline Tests

✓ Rate Limit Tests

✓ Security Tests

✓ Performance Tests

---

# Acceptance Criteria

✓ RESTful conventions

✓ Secure authentication

✓ Offline-first support

✓ Versioned endpoints

✓ Scalable architecture

✓ Comprehensive error handling

✓ Optimized responses

✓ Google Play compliant

✓ Production-ready

---

END OF API_SPECIFICATION.md
```