# 🗄 DATABASE_SCHEMA.md

Project: Snap Pose

Version: 1.0

Database

Firebase Firestore + Firebase Storage + Local SQLite/MMKV

Status

Production Ready

---

# Overview

Snap Pose uses a hybrid database architecture.

Cloud

- Firebase Firestore
- Firebase Storage
- Firebase Authentication
- Firebase Analytics
- Firebase Crashlytics

Local

- MMKV (Fast Key-Value)
- SQLite (Offline Pose Packs)
- File System (Images)

This ensures

✓ Offline Support

✓ Fast Performance

✓ Secure Sync

✓ Low Latency

---

# Database Architecture

```
                Firebase
        ┌──────────────────────┐
        │ Authentication        │
        │ Firestore             │
        │ Storage               │
        │ Analytics             │
        └──────────┬────────────┘
                   │
           Sync Engine
                   │
        ┌──────────▼───────────┐
        │ Local Database       │
        │ SQLite               │
        │ MMKV                 │
        │ File System          │
        └──────────────────────┘
```

---

# Firestore Collections

```
users

poses

categories

favorites

downloads

photos

subscriptions

analytics

feedback

notifications

app_config

versions

leaderboards (Future)

achievements (Future)
```

---

# users

Document ID

```
user_uid
```

Fields

```ts
{
 uid: string
 displayName: string
 email: string
 photoURL: string

 provider: "google" | "apple" | "email" | "anonymous"

 premium: boolean

 premiumPlan: string

 createdAt: Timestamp

 updatedAt: Timestamp

 lastLogin: Timestamp

 language: string

 theme: "light" | "dark" | "system"

 notificationEnabled: boolean

 country: string

 appVersion: string

 deviceModel: string

 osVersion: string
}
```

Indexes

```
premium

country

createdAt
```

---

# categories

Document

```
category_id
```

Fields

```ts
{
 id: string

 name: string

 slug: string

 image: string

 icon: string

 color: string

 totalPoses: number

 premium: boolean

 sortOrder: number
}
```

Examples

```
Beach

Cafe

Mountain

Wedding

Travel

Luxury

Gym

Traditional

Nature
```

---

# poses

Document

```
pose_id
```

Fields

```ts
{
 id: string

 categoryId: string

 title: string

 description: string

 imageUrl: string

 overlayImage: string

 difficulty: "easy" | "medium" | "hard"

 indoor: boolean

 premium: boolean

 tags: string[]

 views: number

 downloads: number

 favorites: number

 createdAt: Timestamp

 updatedAt: Timestamp

 estimatedDistance: number

 cameraAngle: string

 lighting: string

 orientation: string
}
```

---

# pose_landmarks

Store reference skeleton.

```ts
{
 poseId: string

 landmarks: [
   {
     x: number,
     y: number,
     z: number,
     visibility: number
   }
 ]
}
```

---

# favorites

```
favorite_id
```

```ts
{
 id: string

 uid: string

 poseId: string

 createdAt: Timestamp
}
```

Composite Index

```
uid

poseId
```

---

# downloads

```
download_id
```

```ts
{
 id: string

 uid: string

 poseId: string

 downloadedAt: Timestamp

 version: number

 storageSize: number
}
```

---

# captured_photos

```
photo_id
```

```ts
{
 id: string

 uid: string

 poseId: string

 localPath: string

 thumbnail: string

 width: number

 height: number

 aiScore: number

 capturedAt: Timestamp

 favorite: boolean
}
```

Images remain local unless user explicitly backs them up.

---

# subscriptions

```
subscription_id
```

```ts
{
 uid: string

 active: boolean

 platform: "android" | "ios"

 plan: "monthly" | "yearly"

 purchaseToken: string

 expiryDate: Timestamp

 autoRenew: boolean
}
```

---

# notifications

```ts
{
 id: string

 uid: string

 title: string

 body: string

 type: string

 read: boolean

 createdAt: Timestamp
}
```

---

# feedback

```ts
{
 id: string

 uid: string

 rating: number

 category: string

 message: string

 screenshot: string

 createdAt: Timestamp
}
```

---

# analytics_events

```ts
{
 uid: string

 event: string

 screen: string

 timestamp: Timestamp

 metadata: map
}
```

Examples

```
camera_opened

pose_viewed

download_started

download_completed

premium_clicked

premium_purchased

photo_saved

search_used

favorite_added
```

---

# app_config

Single document

```ts
{
 latestVersion

 minimumVersion

 maintenanceMode

 premiumEnabled

 adsEnabled

 forceUpdate

 aiModelVersion

 featuredCategories
}
```

---

# Local SQLite Tables

## poses

```
id

title

category

image

overlay

premium

updatedAt
```

---

## favorites

```
id

poseId
```

---

## downloads

```
id

poseId

version

downloadedAt
```

---

## recent_searches

```
id

keyword

createdAt
```

---

## recent_views

```
id

poseId

viewedAt
```

---

# MMKV Keys

```
theme

language

onboardingCompleted

cameraSettings

overlayOpacity

lastCategory

premiumCached

notificationEnabled

userToken

session

firstLaunch

lastSync
```

---

# Firebase Storage Structure

```
storage/

categories/

poses/

overlays/

thumbnails/

premium/

avatars/

feedback/

assets/

models/

updates/
```

---

# Pose Asset Structure

```
poses/

beach/

001/

image.webp

overlay.png

metadata.json

landmarks.json

thumbnail.webp
```

---

# Security Rules

Users can only access

Own

Favorites

Photos

Subscriptions

Feedback

Admins can manage

Categories

Poses

Updates

Configurations

Premium Packs

---

# Firestore Indexes

```
poses

categoryId + premium

poses

downloads DESC

poses

favorites DESC

favorites

uid + poseId

photos

uid + capturedAt

notifications

uid + createdAt
```

---

# Backup Strategy

Automatic Firestore Backup

Daily

Storage Backup

Weekly

Analytics Export

BigQuery

Future

---

# Sync Strategy

Priority

1

User Data

Priority

2

Favorites

Priority

3

Downloads

Priority

4

Analytics

Priority

5

Recommendations

Offline changes sync automatically.

Conflict Resolution

Latest Timestamp Wins.

---

# Data Retention

Analytics

365 Days

Crash Reports

90 Days

Feedback

2 Years

Photos

Until user deletes

Favorites

Unlimited

Downloads

Unlimited

---

# Privacy

Never store

❌ Passwords

❌ Raw camera frames

❌ Biometric identifiers

❌ Facial recognition templates

❌ Continuous location history

Only collect data required for app functionality.

---

# Performance Targets

Firestore Read

<150ms

Firestore Write

<200ms

Local Query

<10ms

Sync

Background

Cold Cache

<2 seconds

---

# Future Tables

```
creator_profiles

community_posts

comments

likes

achievements

badges

daily_challenges

ar_models

custom_ai_models

shared_albums
```

---

# AI Coding Rules

Database implementation must

✓ Use Firestore converters

✓ Strong TypeScript interfaces

✓ Offline persistence

✓ Batch writes where possible

✓ Transactions for critical updates

✓ Secure Firestore rules

✓ Lazy loading

✓ Pagination

✓ Indexed queries

✓ Optimized reads

✓ Follow Google Play Data Safety requirements

---

# Acceptance Criteria

✓ Offline-first architecture

✓ Fast local access

✓ Secure cloud synchronization

✓ Scalable to millions of users

✓ Optimized Firestore costs

✓ Production-ready schema

✓ Easy migration support

✓ AI-friendly structure

---

END OF DATABASE_SCHEMA.md