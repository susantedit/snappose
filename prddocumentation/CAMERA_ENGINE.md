# 📸 CAMERA_ENGINE.md

Project: Snap Pose
Version: 1.0
Status: Production Ready

---

# Overview

The Camera Engine is the core module of Snap Pose. It combines the device camera, AI pose estimation, overlay rendering, auto-capture, and real-time guidance to help users recreate professional-looking poses.

---

# Objectives

- Fast camera startup (<1 second)
- Smooth 60 FPS preview
- AI-assisted pose matching
- Real-time visual guidance
- Automatic capture
- Offline functionality
- Battery-efficient processing

---

# Technology Stack

## Camera

- Expo Camera
- Expo Image Picker
- Expo Media Library

## AI

- Google MediaPipe Pose Landmarker
- TensorFlow Lite (Future)
- ONNX Runtime (Future)

## Graphics

- React Native Skia
- React Native SVG
- React Native Reanimated
- React Native Gesture Handler

## Image Processing

- Expo ImageManipulator
- FastImage
- BlurHash

---

# Architecture

```
Camera
      │
      ▼
Preview Stream
      │
      ▼
AI Pose Detection
      │
      ├────────────► Pose Match Score
      │
      ├────────────► Skeleton Overlay
      │
      ├────────────► Voice Guidance
      │
      ├────────────► Distance Meter
      │
      ├────────────► Lighting Analysis
      │
      ▼
Auto Capture Engine
      │
      ▼
Image Processing
      │
      ▼
Gallery
```

---

# Camera Permissions

Required

- Camera
- Media Library

Optional

- Microphone (voice commands)
- Location (pose recommendations)

Never request permissions until needed.

---

# Camera Modes

Default

Portrait

Future

- Landscape
- Manual
- Burst
- Night
- Selfie

---

# Supported Resolutions

Preview

720p

Capture

1080p

Optional

4K (High-end devices)

---

# Supported Aspect Ratios

- 1:1
- 4:5
- 3:4
- 9:16
- 16:9

Default

9:16

---

# Camera Controls

Top Bar

- Back
- Flash
- HDR
- Settings
- Grid
- Golden Ratio

Bottom Bar

- Gallery
- Capture
- Flip Camera
- Timer

---

# Overlay Engine

Overlay Types

- Static PNG
- SVG Overlay
- Skeleton Overlay

Controls

- Move
- Rotate
- Scale
- Opacity
- Lock
- Reset
- Mirror

Overlay opacity

0–100%

Default

55%

---

# Gesture Support

Single Tap

Focus

Double Tap

Reset Overlay

Long Press

Lock Overlay

Pinch

Resize Overlay

Rotate

Rotate Overlay

Drag

Move Overlay

---

# Grid System

Support

- Rule of Thirds
- Golden Ratio
- Center Cross
- Square Grid

---

# Pose Detection

Engine

MediaPipe Pose

Tracked Landmarks

33

Tracking Speed

Real Time

Target FPS

30–60 FPS

---

# Pose Match Algorithm

Inputs

- Joint Angles
- Limb Length Ratios
- Head Rotation
- Torso Orientation
- Body Symmetry

Output

0–100%

Score Colors

0–40

Red

41–70

Orange

71–90

Light Green

91–100

Dark Green

---

# Skeleton Rendering

Draw

- Head
- Neck
- Shoulders
- Elbows
- Wrists
- Spine
- Hips
- Knees
- Ankles
- Feet

Line Width

3px

Rounded joints

Enabled

---

# AI Voice Guidance

Examples

"Raise your left arm."

"Move backward."

"Look at the camera."

"Turn slightly right."

"Perfect!"

Voice should be short, natural, and non-intrusive.

---

# Distance Estimation

Display

- Too Close
- Good Distance
- Too Far

Visual Meter

Green

Optimal

Orange

Close

Red

Far

---

# Lighting Analysis

Analyze

- Brightness
- Contrast
- Face Illumination
- Shadow Direction

Suggestions

"Turn toward the light."

"Increase exposure."

"Avoid backlight."

---

# Auto Capture

Capture only when:

✓ Pose score ≥95

✓ Face detected

✓ Eyes visible

✓ Camera stable

✓ Lighting acceptable

✓ Smile detected (optional)

Countdown

3 → 2 → 1

Then capture automatically.

---

# Manual Capture

Always available.

Works even if AI score is low.

---

# Image Processing

After capture

- Compress image
- Preserve quality
- Generate thumbnail
- Save EXIF
- Save pose metadata

---

# Metadata

Store

- Pose ID
- Category
- AI Score
- Capture Date
- Device
- Camera
- Lens
- Resolution

---

# Gallery Integration

Captured images appear instantly.

Support

- Share
- Delete
- Favorite
- Export

---

# Offline Support

Available Offline

✓ Camera

✓ Overlay

✓ Downloads

✓ Favorites

✓ Gallery

Not Available Offline

- Cloud Sync
- Premium Validation
- Online Recommendations

---

# Performance Targets

Camera startup

<1 second

Capture delay

<150ms

Overlay latency

<16ms

AI inference

<100ms

Memory usage

Optimized

Battery impact

Low

---

# Error Handling

Camera unavailable

Show retry option.

Permission denied

Explain reason and link to Settings.

AI initialization failed

Disable AI and allow manual capture.

Storage full

Prompt user to free space.

---

# Security

Never upload photos without consent.

Store files in app-private storage.

Encrypt sensitive metadata.

Use HTTPS for cloud sync.

---

# Accessibility

Support

- TalkBack
- VoiceOver
- Large touch targets
- High contrast
- Reduce Motion

---

# Testing Checklist

✓ Camera opens successfully

✓ Front camera works

✓ Rear camera works

✓ Flash functions

✓ HDR functions

✓ Overlay moves correctly

✓ Overlay scales correctly

✓ Overlay rotates correctly

✓ AI detects pose

✓ Score updates

✓ Voice guidance works

✓ Auto capture triggers

✓ Photos save correctly

✓ Gallery updates instantly

✓ Offline mode works

✓ Permissions handled gracefully

---

# Future Enhancements

- Multi-person pose detection
- AR avatar guidance
- 3D pose visualization
- Depth estimation
- Gesture-based controls
- Video pose coaching
- AI composition assistant
- AI background analysis
- AI framing suggestions
- Camera calibration

---

# AI Coding Rules

The Camera Engine must:

- Use Expo Camera APIs
- Use React Native Reanimated
- Use React Native Gesture Handler
- Use React Native Skia for overlays
- Keep UI responsive at 60 FPS
- Separate camera, AI, and UI into independent modules
- Avoid blocking the UI thread
- Cache assets locally
- Support offline operation
- Follow Google Play camera and privacy policies

---

END OF CAMERA_ENGINE.md