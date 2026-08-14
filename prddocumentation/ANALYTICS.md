# 📊 ANALYTICS.md

Project: Snap Pose

Version: 1.0

Status: Production Ready

Analytics Platform

- Firebase Analytics
- Firebase Crashlytics
- Firebase Performance Monitoring
- Google BigQuery (Future)
- Google Looker Studio (Future)

---

# Overview

Analytics helps understand user behavior, improve AI recommendations, optimize the user experience, measure monetization, and make product decisions.

Analytics must be privacy-first and compliant with Google Play policies.

---

# Goals

✓ Understand user behavior

✓ Improve AI recommendations

✓ Measure retention

✓ Increase Premium conversions

✓ Optimize advertisements

✓ Improve onboarding

✓ Detect crashes

✓ Improve performance

---

# User Lifecycle

```
Install

↓

First Open

↓

Onboarding

↓

Browse Categories

↓

Open Pose

↓

Camera

↓

AI Guidance

↓

Photo Capture

↓

Favorite

↓

Download

↓

Premium Purchase

↓

Retention
```

---

# User Properties

Track

```
User Type

Anonymous

Google

Premium

Country

Language

Theme

App Version

Device Model

Android Version

First Install Date

Premium Status
```

Never store

❌ Passwords

❌ Photos

❌ Camera Frames

❌ Personal Messages

---

# Core Events

## App Events

```
app_install

app_open

session_start

session_end

app_update

app_background

app_foreground
```

---

## Onboarding

```
onboarding_start

onboarding_skip

onboarding_complete
```

---

## Navigation

```
screen_view

tab_change

back_navigation
```

---

## Search

```
search_started

search_completed

search_failed

filter_used

sort_used
```

---

## Categories

```
category_open

category_scroll

category_complete
```

---

## Pose Events

```
pose_open

pose_favorite

pose_unfavorite

pose_download

pose_share

pose_preview
```

---

## Camera Events

```
camera_open

camera_close

camera_flip

camera_flash

camera_capture

camera_timer

camera_grid
```

---

## AI Events

```
pose_detection_started

pose_score_updated

voice_guidance_played

lighting_tip_shown

distance_warning

smile_detected

eye_contact_detected

auto_capture
```

---

## Gallery

```
gallery_open

photo_saved

photo_deleted

photo_shared
```

---

## Premium

```
premium_page

subscription_click

purchase_started

purchase_success

purchase_failed

restore_purchase
```

---

## Ads

```
native_ad_loaded

native_ad_clicked

rewarded_loaded

rewarded_completed

interstitial_loaded

interstitial_shown

app_open_ad
```

---

## Notifications

```
notification_received

notification_opened

notification_dismissed
```

---

## Settings

```
theme_changed

language_changed

notification_changed

cache_cleared
```

---

# Funnels

## First-Time User Funnel

```
Install

↓

Open

↓

Onboarding

↓

Browse

↓

Camera

↓

Capture

↓

Retention
```

---

## Premium Funnel

```
Free User

↓

Premium Screen

↓

Purchase Click

↓

Payment

↓

Subscription Active
```

---

## AI Funnel

```
Camera

↓

Pose Detection

↓

Voice Guidance

↓

95% Score

↓

Auto Capture
```

---

# Retention Metrics

Track

Day 1

Day 3

Day 7

Day 14

Day 30

Day 90

Goal

```
D1 > 45%

D7 > 25%

D30 > 15%
```

---

# Engagement Metrics

Track

- Daily Active Users (DAU)
- Weekly Active Users (WAU)
- Monthly Active Users (MAU)
- Average Session Length
- Screens Per Session
- Photos Captured
- Downloads
- Favorites

---

# AI Metrics

Track

Average Pose Score

Average Detection Time

Average Auto Capture Time

Lighting Success

Smile Detection Success

Voice Guidance Usage

Pose Recommendation Click Rate

---

# Performance Metrics

Track

Startup Time

Camera Launch Time

AI Initialization

FPS

Memory Usage

Battery Usage

Firestore Reads

Storage Downloads

API Latency

---

# Advertisement Metrics

Track

Ad Impressions

Ad Clicks

Rewarded Completion Rate

Fill Rate

eCPM

Revenue

CTR

Frequency

---

# Premium Metrics

Track

Monthly Revenue

Annual Revenue

Conversion Rate

Renewal Rate

Cancellation Rate

Lifetime Value (LTV)

Average Revenue Per User (ARPU)

---

# Error Tracking

Log

JavaScript Errors

Native Crashes

API Failures

Firestore Errors

Download Failures

Permission Denials

AI Initialization Failures

Storage Errors

---

# Privacy Rules

Analytics must never collect

❌ Passwords

❌ Emails

❌ Photos

❌ Camera Frames

❌ Biometric Data

❌ Exact GPS History

All analytics should comply with Google Play Data Safety requirements and applicable privacy regulations.

---

# Dashboard KPIs

Display

✓ DAU

✓ MAU

✓ Session Duration

✓ AI Accuracy

✓ Premium Revenue

✓ Ad Revenue

✓ Crash-Free Users

✓ Retention

✓ Downloads

✓ Favorites

✓ Camera Usage

✓ Auto Capture Success

---

# Alerts

Notify Admin if

Crash Rate > 1%

ANR > 0.47%

Startup > 3 sec

API Error Rate > 5%

Purchase Failure > 2%

Firestore Failure > 2%

---

# A/B Testing (Future)

Test

- Onboarding Flow
- Home Layout
- Premium Pricing
- Ad Frequency
- AI Voice Style
- Auto Capture Threshold
- Button Colors
- Category Ordering

---

# Data Retention

Analytics Events

365 Days

Crash Reports

90 Days

Performance Metrics

180 Days

Aggregated Reports

Unlimited

---

# Success Targets

Crash-Free Users

>99.5%

Average Rating

4.7+

Premium Conversion

3–5%

D30 Retention

>15%

AI Detection Accuracy

>95%

Camera Success Rate

>99%

---

# Acceptance Criteria

✓ Firebase Analytics Integrated

✓ Crashlytics Enabled

✓ Performance Monitoring Enabled

✓ Privacy Compliant

✓ Google Play Compliant

✓ Production Ready

---

END OF ANALYTICS.md