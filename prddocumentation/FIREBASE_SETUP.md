# 🔥 FIREBASE_SETUP.md

Project: Snap Pose

Version: 1.0

Status: Production Ready

---

# Overview

Snap Pose uses Firebase as its Backend-as-a-Service (BaaS). Firebase provides authentication, database, storage, analytics, crash reporting, push notifications, remote configuration, and performance monitoring.

This document defines the complete Firebase architecture and setup process.

---

# Firebase Services Used

## Required

- Firebase Authentication
- Cloud Firestore
- Firebase Storage
- Firebase Analytics
- Firebase Crashlytics
- Firebase Performance Monitoring
- Firebase Cloud Messaging (FCM)
- Firebase Remote Config
- Firebase App Check

## Optional (Future)

- Firebase AI Logic
- Firebase Vertex AI Integration
- Firebase Extensions

---

# Firebase Project

Project Name

```
Snap Pose
```

Project ID

```
snap-pose
```

Environment

```
Development

Staging

Production
```

Each environment must have a separate Firebase project.

---

# Install Packages

```bash
npx expo install firebase

npx expo install @react-native-firebase/app

npx expo install @react-native-firebase/auth

npx expo install @react-native-firebase/firestore

npx expo install @react-native-firebase/storage

npx expo install @react-native-firebase/analytics

npx expo install @react-native-firebase/crashlytics

npx expo install @react-native-firebase/perf

npx expo install @react-native-firebase/messaging

npx expo install @react-native-firebase/remote-config

npx expo install @react-native-firebase/app-check
```

---

# Firebase Folder Structure

```
src/

firebase/

firebase.ts

auth.ts

firestore.ts

storage.ts

analytics.ts

crashlytics.ts

messaging.ts

remoteConfig.ts

appCheck.ts

functions.ts

config.ts
```

---

# Authentication

Supported Providers

✓ Anonymous

✓ Google

✓ Apple (iOS)

✓ Email & Password

Future

- Phone Authentication

- GitHub Login

- Facebook Login

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

notifications

feedback

analytics

app_config
```

---

# Storage Buckets

```
storage/

poses/

categories/

overlays/

thumbnails/

premium/

avatars/

photos/

feedback/

models/

assets/
```

---

# Firestore Rules

Users

Can read

Public pose data

Categories

Own profile

Own favorites

Own photos

Own downloads

Admins

Can modify

Categories

Poses

Premium Packs

Configurations

Models

---

# Storage Rules

Users may

Upload

Own photos

Feedback screenshots

Read

Public assets

Premium assets after purchase verification

Cannot

Access another user's private files

---

# Firebase Authentication Flow

```
App

↓

Anonymous Login

↓

User Browses App

↓

Optional Google Login

↓

Firestore User Document

↓

Premium Purchase

↓

Subscription Sync
```

---

# Offline Persistence

Enable

✓ Firestore Cache

✓ Local Database

✓ Download Queue

✓ Background Sync

Conflict Strategy

```
Last Write Wins
```

---

# Cloud Functions

Deploy

```
syncFavorites()

verifyPurchase()

generateRecommendations()

sendFeedback()

cleanupStorage()

checkAppVersion()

sendPushNotifications()

syncAnalytics()
```

---

# Analytics Events

Track

```
app_open

screen_view

pose_open

pose_download

camera_open

photo_capture

favorite_add

favorite_remove

premium_click

premium_purchase

search

notification_open

share_photo
```

Do NOT log

- Passwords
- Email content
- Camera frames
- Personal images
- Biometric data

---

# Crashlytics

Enable

✓ JavaScript crashes

✓ Native crashes

✓ ANRs (Android)

✓ Fatal Errors

✓ Non-Fatal Errors

Log custom keys

```
App Version

Device Model

OS Version

User Type

Premium Status

Current Screen
```

---

# Performance Monitoring

Monitor

✓ App startup

✓ Screen rendering

✓ Firestore reads

✓ Firestore writes

✓ Network latency

✓ Storage downloads

✓ AI initialization

---

# Cloud Messaging (FCM)

Notification Types

- Daily pose suggestions
- Trending poses
- New categories
- Premium offers
- App updates

Never send spam notifications.

Allow users to disable notifications.

---

# Remote Config

Control remotely

```
maintenanceMode

latestVersion

minimumVersion

adsEnabled

premiumEnabled

aiModelVersion

featuredCategory

autoCaptureThreshold

voiceGuidanceEnabled
```

No app update required for these changes.

---

# App Check

Enable

✓ Play Integrity API (Android)

✓ DeviceCheck / App Attest (iOS)

Protect

- Firestore
- Storage
- Cloud Functions

---

# Security Best Practices

✓ Enable App Check

✓ Use Firestore Security Rules

✓ Validate Cloud Function requests

✓ Never expose Admin SDK

✓ Store API keys using Expo Secrets / EAS Secrets

✓ Use HTTPS only

✓ Validate Firebase ID Tokens

✓ Restrict Storage access

---

# Backup Strategy

Firestore

Daily Backup

Storage

Weekly Backup

Crash Reports

Automatic

Analytics

Export to BigQuery (Future)

---

# Cost Optimization

Use pagination

Cache frequently accessed data

Batch Firestore writes

Lazy load images

Compress uploaded images

Delete unused storage files

Avoid unnecessary document reads

---

# Development Workflow

Development

↓

Firebase Emulator (Optional)

↓

Testing

↓

Staging Firebase Project

↓

Production Firebase Project

---

# Environment Variables

Store securely

```
EXPO_PUBLIC_FIREBASE_API_KEY

EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN

EXPO_PUBLIC_FIREBASE_PROJECT_ID

EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET

EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID

EXPO_PUBLIC_FIREBASE_APP_ID

EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID
```

Never hardcode secrets.

---

# Google Play Compliance

Must comply with

✓ Data Safety Form

✓ User Data Policy

✓ Runtime Permission Policy

✓ Billing Policy

✓ Privacy Policy

✓ Target API Level requirements

---

# Testing Checklist

✓ Authentication works

✓ Firestore syncs correctly

✓ Storage uploads succeed

✓ Downloads work

✓ Offline mode works

✓ Push notifications received

✓ Crashlytics logs crashes

✓ Analytics events recorded

✓ Remote Config updates

✓ App Check enforced

---

# Acceptance Criteria

✓ Firebase configured correctly

✓ Offline-first architecture enabled

✓ Secure authentication

✓ Secure Firestore rules

✓ Storage protected

✓ Cloud Functions operational

✓ Analytics enabled

✓ Crash reporting enabled

✓ Push notifications functional

✓ Google Play compliant

✓ Production-ready

---

END OF FIREBASE_SETUP.md