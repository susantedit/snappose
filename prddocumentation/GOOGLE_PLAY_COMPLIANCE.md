# 📱 GOOGLE_PLAY_COMPLIANCE.md

Project: Snap Pose

Version: 1.0

Status: Production Ready

Target Platform

Google Play Store

---

# Overview

This document defines all Google Play requirements that Snap Pose must satisfy before release.

The objective is to achieve first-time approval while minimizing policy violations and future update rejections.

---

# Target SDK

Target SDK

Latest Google Play required API Level

Minimum SDK

Android 8.0 (API 26)

Compile SDK

Latest Stable Android SDK

Always target the latest Play Store requirement before publishing.

---

# Play Console Requirements

Required

✓ App Name

✓ Short Description

✓ Full Description

✓ Feature Graphic

✓ High-resolution Icon

✓ Screenshots

✓ Privacy Policy URL

✓ App Category

✓ Contact Email

✓ Website (Optional)

✓ Content Rating

✓ Data Safety Form

✓ Target Audience

✓ Ads Declaration

✓ App Access (if required)

✓ Store Listing Localization

---

# Required Assets

App Icon

- 512 × 512 PNG

Feature Graphic

- 1024 × 500 PNG

Phone Screenshots

Minimum

2

Recommended

8

Tablet Screenshots

Recommended

7-inch

10-inch

Promo Video

Optional

Store Listing Banner

Optional

---

# Permissions

Only request permissions when the feature is used.

Required

✓ Camera

Reason

Capture pose photos.

Required

✓ Photos / Media Library

Reason

Save captured images.

Optional

✓ Notifications

Reason

Daily pose reminders.

Optional

✓ Approximate Location

Reason

Recommend pose categories (Beach, Café, Mountain, City) based on the user's current environment. Ask only after explaining the benefit, and provide a way to use the app without granting location.

Never Request

❌ Contacts

❌ SMS

❌ Phone State

❌ Call Logs

❌ Calendar

❌ Background Location

❌ Accessibility Service (unless its use is essential and policy-compliant)

❌ Device Administrator

---

# Camera Policy

Camera opens only after user action.

Camera stops immediately when

- App minimized
- App closed
- Screen locked

Never

❌ Record secretly

❌ Capture automatically without user consent

❌ Upload photos automatically

---

# AI Policy

AI Features

✓ Pose Detection

✓ Pose Matching

✓ Auto Capture

✓ Voice Guidance

✓ Lighting Analysis

✓ Skeleton Overlay

AI must

- Explain results clearly
- Avoid misleading claims
- Keep processing on-device where possible
- Never identify people or infer sensitive traits

---

# User Data

Allowed

✓ Favorites

✓ Downloads

✓ App Preferences

✓ Analytics

✓ Premium Status

✓ Anonymous Usage Metrics

Never Collect

❌ Passwords

❌ Raw camera feed

❌ Face recognition templates

❌ Biometric identifiers

❌ Continuous location tracking

❌ Personal contacts

---

# Privacy Policy

Must Include

✓ Data Collection

✓ Data Usage

✓ Data Retention

✓ Third-Party Services

✓ Firebase Usage

✓ Google AdMob Usage

✓ User Rights

✓ Contact Information

✓ Account Deletion Process

Privacy Policy must be publicly accessible.

---

# Data Safety Form

Declare accurately

Data Collected

- App Activity
- Diagnostics
- Device or Other IDs (if used by Firebase/AdMob)

Data Shared

Only if actually shared with third parties.

Security

✓ Data encrypted in transit

✓ Users can request account deletion

Never provide false declarations.

---

# Advertisements

Platform

Google AdMob

Allowed Formats

✓ Native Ads

✓ Rewarded Ads

✓ App Open Ads

✓ Interstitial Ads (used sparingly)

Recommended Placement

Home Screen

Native

Downloads

Rewarded

Premium Page

Native

Never Display Ads

❌ During camera preview

❌ During AI pose guidance

❌ Immediately after taking a photo

❌ During onboarding

❌ While permissions dialogs are shown

❌ In a way that causes accidental clicks

Respect Google AdMob policies and obtain consent where required.

---

# Premium Purchases

Use

Google Play Billing Library

Never use third-party payment systems for digital content sold inside the app.

Premium Benefits

- Remove Ads
- Premium Pose Packs
- Cloud Backup
- Exclusive Categories

---

# Content Rating

Expected Rating

Everyone

Avoid

- Gambling
- Adult Content
- Violence
- Hate Speech
- Misleading Claims

---

# Accessibility

Support

✓ TalkBack

✓ Large Text

✓ High Contrast

✓ Minimum 48dp touch targets

✓ Screen Reader Labels

✓ Keyboard navigation where applicable

---

# Performance

Cold Start

<2 seconds

Camera Launch

<1 second

Navigation

<250ms

Smooth UI

60 FPS

Avoid excessive battery or background resource usage.

---

# Background Services

Allowed

✓ Notification scheduling

✓ Sync when appropriate

Not Allowed

❌ Hidden recording

❌ Hidden tracking

❌ Persistent unnecessary background services

---

# Security

Must

✓ HTTPS

✓ Firebase Authentication

✓ Firestore Security Rules

✓ App Check

✓ Play Integrity API

Never expose API secrets or service account keys in the app.

---

# Third-Party SDKs

Approved Examples

✓ Firebase

✓ Google AdMob

✓ Google Play Billing

✓ MediaPipe

✓ TensorFlow Lite

Audit every SDK before release and disclose data collection where required.

---

# Common Rejection Reasons

Avoid

❌ Requesting unnecessary permissions

❌ Missing Privacy Policy

❌ Incorrect Data Safety declarations

❌ Broken login flow

❌ Crashes on startup

❌ Excessive or disruptive ads

❌ Misleading AI marketing

❌ Screenshots that don't match the app

❌ Copyright infringement

❌ Non-functional features in the store listing

❌ Using copyrighted pose images without permission

---

# Testing Before Submission

Device Testing

✓ Low-end Android

✓ Mid-range Android

✓ Flagship Android

✓ Tablet

Android Versions

✓ Minimum SDK

✓ Latest Android version

Network

✓ Offline

✓ Slow Network

✓ Airplane Mode

Camera

✓ Front Camera

✓ Rear Camera

✓ Permission Denied

✓ Low Storage

AI

✓ Pose Detection

✓ Auto Capture

✓ Voice Guidance

✓ Overlay

Ads

✓ Native Ads

✓ Rewarded Ads

✓ Premium (No Ads)

---

# Play Store Listing

Title

Snap Pose

Subtitle

AI Pose Guide for Perfect Photos

Keywords

AI Pose

Camera

Photography

Selfie

Pose Guide

Travel

Beach

Cafe

Mountain

Portrait

Photo Ideas

Professional Photography

---

# Release Checklist

✓ App Bundle (.aab)

✓ Signed Release Build

✓ Privacy Policy Published

✓ Terms & Conditions Published

✓ Data Safety Form Completed

✓ Content Rating Completed

✓ Ads Declaration Completed

✓ Screenshots Uploaded

✓ Feature Graphic Uploaded

✓ High-resolution Icon Uploaded

✓ Internal Testing Passed

✓ Closed Testing Passed

✓ Crash-Free Session Rate Verified

---

# Future Compliance

Monitor regularly

- Google Play Policy Updates
- Android Target SDK Changes
- Play Billing Updates
- Data Safety Requirements
- Privacy Regulations
- AdMob Policy Changes

Update the app promptly to remain compliant.

---

# Acceptance Criteria

The app is ready for Google Play release when

✓ Meets all Google Play policies

✓ Uses only required permissions

✓ Has an accurate Privacy Policy

✓ Has an accurate Data Safety declaration

✓ Uses Google Play Billing for digital purchases

✓ Displays ads in policy-compliant locations

✓ Passes internal and closed testing

✓ Has no critical crashes or ANRs

✓ Protects user privacy

✓ Is production-ready

---

END OF GOOGLE_PLAY_COMPLIANCE.md