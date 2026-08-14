# 📋 PRODUCT REQUIREMENTS DOCUMENT (PRD)

# Snap Pose

Version: 1.0

Status: Draft

Owner: Susant Luitel

Platform:
- Android (MVP)
- iOS (Future)

Framework:
- React Native (Expo)
- TypeScript

---

# 1. Purpose

This document defines every functional and non-functional requirement for Snap Pose.

It serves as the primary implementation reference for designers, developers, QA engineers, AI coding agents, and future contributors.

All implementation decisions should align with this document unless superseded by a newer version.

---

# 2. Product Summary

Snap Pose is an AI-powered photography assistant that helps users recreate aesthetic poses using:

- Live camera overlays
- AI pose matching
- Voice coaching
- Automatic capture
- Lighting analysis
- Distance guidance
- Smart pose recommendations

The application should feel premium, intuitive, and production-ready.

---

# 3. Product Objectives

Primary Objectives

✓ Help users take professional-looking photos.

✓ Reduce failed photography attempts.

✓ Enable solo travelers to capture beautiful images.

✓ Improve confidence while posing.

✓ Create an enjoyable photography experience.

Secondary Objectives

✓ Build a scalable pose library.

✓ Increase user retention.

✓ Generate recurring revenue.

✓ Support offline photography.

---

# 4. Success Criteria

The product is successful when:

- Users can recreate poses accurately.
- Camera experience remains smooth.
- AI guidance feels natural.
- App rating exceeds 4.8.
- Crash-free sessions exceed 99%.
- Camera launches in under 1 second.
- AI feedback latency remains under 200ms (where feasible).

---

# 5. Feature Priority

## MUST HAVE (MVP)

Home

Categories

Search

Favorites

Downloads

Pose Details

Camera Overlay

Gallery

Settings

Firebase

Offline Pose Packs

Pose Match Score

Voice Coaching

Auto Capture

AdMob

Premium

Analytics

Privacy Policy

Terms

Dark Mode

Accessibility

---

## SHOULD HAVE

Lighting Analysis

Distance Guidance

Eye Contact Detection

Smile Detection

Trending Poses

Recommended Poses

Recent Poses

Downloads Manager

Cloud Backup

---

## COULD HAVE

Community

Challenges

Achievements

Creator Profiles

Pose Marketplace

Photo Editing

Video Guides

---

## WON'T HAVE (v1)

Social Messaging

Video Calls

Live Streaming

Photo Printing

NFT Marketplace

---

# 6. Functional Requirements

Every requirement below is mandatory unless marked otherwise.

---

## FR-001

The application shall display a splash screen on launch.

Priority: Must

Acceptance Criteria:

- Displays logo.
- Smooth fade animation.
- Launch completes in under 2 seconds.

---

## FR-002

The application shall display onboarding only during first launch.

Acceptance Criteria

- Three onboarding pages.
- Skip button.
- Continue button.
- Progress indicator.
- Never shown again unless reset.

---

## FR-003

Users shall browse pose categories.

Acceptance Criteria

Display categories:

- Beach
- Cafe
- Mountain
- Nature
- Wedding
- Festival
- Friends
- Couple
- Solo
- Selfie
- Luxury
- Car
- Bike
- Gym
- Office
- Traditional
- Fashion
- Camping
- Forest
- Snow
- Golden Hour
- Night
- Travel

---

## FR-004

Users shall search poses.

Acceptance Criteria

Search by

Category

Difficulty

Keywords

Trending

Recently Added

---

## FR-005

Users shall open a pose detail page.

Must display

Photo

Overlay Preview

Lighting Tips

Camera Angle

Difficulty

Recommended Lens

Body Direction

Face Direction

Estimated Time

Favorite Button

Download Button

Use Pose Button

---

## FR-006

Users shall launch the camera from the pose detail page.

Acceptance Criteria

Camera opens within one second.

Overlay automatically loads.

---

## FR-007

The camera shall display a transparent pose overlay.

Acceptance Criteria

Overlay supports

Move

Rotate

Resize

Opacity

Flip

Lock

Reset

Snap to Center

---

## FR-008

Users shall capture photos manually.

---

## FR-009

The application shall automatically capture photos when AI similarity exceeds the configured threshold.

Default Threshold

95%

Configurable.

---

## FR-010

Users shall receive voice coaching.

Examples

Raise left arm.

Move backward.

Turn right.

Smile.

Perfect.

---

## FR-011

Users shall view live pose similarity.

Range

0–100%

Visualized as

Circular Progress

Color Coding

Red

Orange

Green

---

## FR-012

Users shall save captured photos locally.

---

## FR-013

Users shall favorite poses.

---

## FR-014

Users shall download pose packs for offline use.

---

## FR-015

The application shall recommend poses.

Based on

Location (optional)

Category

History

Favorites

Time of day

Occasion

---

## FR-016

The application shall detect smiles.

---

## FR-017

The application shall detect eye contact.

---

## FR-018

The application shall estimate camera distance.

---

## FR-019

The application shall analyze lighting conditions.

Suggestions include

Move toward sunlight

Reduce exposure

Increase brightness

Turn slightly

---

## FR-020

Users shall share photos.

Supported

Instagram

WhatsApp

Facebook

X

Pinterest

TikTok

System Share Sheet

---

# 7. Non-Functional Requirements

Performance

- 60 FPS camera preview.
- Memory efficient.
- Battery optimized.
- Smooth animations.

Reliability

- Crash-free target 99%.

Scalability

- Modular architecture.

Security

- Encrypted local storage.
- Secure authentication.
- Least-privilege permissions.

Accessibility

- Screen reader support.
- Dynamic font scaling.
- High-contrast mode.

---

# 8. User Stories

As a solo traveler,

I want an overlay pose,

so that I can recreate aesthetic travel photos without another person.

---

As a content creator,

I want AI feedback,

so that my poses look professional.

---

As a beginner,

I want voice guidance,

so I know exactly how to move.

---

# 9. Edge Cases

Camera permission denied.

Microphone unavailable.

No internet.

Storage full.

Overlay asset missing.

Low battery.

Unsupported device.

AI initialization failure.

Downloaded pack corrupted.

---

# 10. Dependencies

Vision Camera

MediaPipe

Firebase

MMKV

Reanimated

Gesture Handler

FastImage

Expo Router

---

# 11. Out of Scope

Desktop support

Web application

Video recording

Messaging

Social feed

---

# 12. Definition of Done

A feature is complete only if:

✓ Implemented

✓ Reviewed

✓ Tested

✓ Accessible

✓ Documented

✓ Production-ready

✓ Play Store compliant

✓ No known critical bugs

---

End of Product Requirements.