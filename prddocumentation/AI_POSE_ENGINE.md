# 🤖 AI_POSE_ENGINE.md

Project: Snap Pose
Version: 1.0
Status: Production Ready

---

# Overview

The AI Pose Engine is the intelligence layer of Snap Pose. It detects the user's body pose in real time, compares it with a reference pose, provides visual and voice guidance, calculates a match score, recommends corrections, and automatically captures the photo when the pose is correctly aligned.

The engine is designed to work primarily **on-device** for privacy, speed, and offline support.

---

# Objectives

- Real-time pose estimation
- AI pose similarity scoring
- Voice-guided coaching
- Visual correction suggestions
- Automatic photo capture
- Offline AI inference
- Low battery consumption
- High accuracy across body types

---

# Technology Stack

## AI Models

Primary
- Google MediaPipe Pose Landmarker

Future
- TensorFlow Lite
- ONNX Runtime
- MediaPipe Tasks Vision
- Google Gemini Nano (future on-device AI)

---

## Framework

- React Native
- Expo
- TypeScript

---

## Rendering

- React Native Skia
- React Native SVG
- Reanimated
- Gesture Handler

---

## Local Storage

- MMKV
- SQLite
- AsyncStorage (non-critical)

---

# AI Pipeline

```
Camera Preview
        │
        ▼
Frame Extraction
        │
        ▼
Pose Detection
        │
        ▼
33 Body Landmarks
        │
        ▼
Pose Normalization
        │
        ▼
Similarity Engine
        │
        ▼
Pose Score
        │
 ┌──────┼─────────────┐
 ▼      ▼             ▼
Voice   Overlay      Suggestions
Guide   Feedback     Auto Capture
```

---

# Body Landmark Detection

Track 33 landmarks including:

- Nose
- Eyes
- Ears
- Mouth
- Neck
- Shoulders
- Elbows
- Wrists
- Fingers
- Spine
- Hips
- Knees
- Ankles
- Heels
- Toes

Update Rate

30–60 FPS

---

# Pose Normalization

Normalize all coordinates before comparison.

Normalize by

- Body scale
- Camera distance
- Rotation
- Aspect ratio
- Orientation

Ignore

- Device resolution
- Zoom level
- Camera model

---

# Pose Similarity Algorithm

Inputs

- Joint angles
- Limb orientation
- Relative body proportions
- Head direction
- Torso rotation
- Hand position
- Leg position
- Symmetry

Outputs

Pose Score

0–100

---

# Pose Score Scale

0–20

Very Poor

Color

Red

---

21–40

Needs Improvement

Orange

---

41–60

Average

Yellow

---

61–80

Good

Light Green

---

81–94

Excellent

Green

---

95–100

Perfect

Dark Green

Trigger auto capture.

---

# Weighted Scoring

Shoulders

15%

Arms

20%

Hands

10%

Torso

20%

Legs

20%

Head

10%

Feet

5%

Total

100%

---

# Confidence Threshold

Ignore landmarks with confidence below

0.60

Pause scoring below

0.45

Resume once confidence recovers.

---

# Real-Time Guidance

The engine continuously compares the user against the reference pose and provides correction suggestions.

Examples

- Raise left arm
- Lower right shoulder
- Turn body slightly left
- Rotate head toward camera
- Straighten your back
- Bend right knee
- Move left foot forward
- Extend your right arm

Only display the highest-priority correction.

---

# Voice Coaching

Speech Frequency

Maximum

One instruction every 2 seconds

Voice Style

- Calm
- Friendly
- Short
- Natural

Examples

"Raise your left arm."

"Move slightly backward."

"Look toward the camera."

"Perfect."

Never repeat identical commands continuously.

---

# Visual Coaching

Highlight incorrect body parts.

Green

Correct

Orange

Nearly Correct

Red

Incorrect

Animate corrections smoothly.

---

# Distance Estimation

Estimate distance using

- Shoulder width
- Hip width
- Body bounding box
- Camera field of view

Suggestions

- Move closer
- Move farther
- Perfect distance

---

# Lighting Analysis

Evaluate

- Brightness
- Face visibility
- Exposure
- Contrast
- Backlighting
- Shadow intensity

Suggestions

- Turn toward the light
- Face the window
- Avoid strong backlight
- Increase lighting

---

# Smile Detection

Detect

- Smile probability
- Closed mouth
- Open smile

Display

😊 Nice smile!

Optional requirement for Auto Capture.

---

# Eye Contact Detection

Verify

- Eyes open
- Looking toward camera
- Face centered

Suggestions

"Look at the camera."

---

# Body Visibility

Verify all required joints are visible.

Warn user if

- Hands missing
- Feet outside frame
- Face cropped
- Body partially hidden

---

# Auto Capture Engine

Capture only when

✓ Pose score ≥95

✓ Face visible

✓ Eyes detected

✓ Camera stable

✓ Required body landmarks visible

✓ Lighting acceptable

Optional

✓ Smile detected

Countdown

3

↓

2

↓

1

↓

Capture

Cancel if score drops below threshold.

---

# AI Pose Recommendations

Generate recommendations based on

- Selected category
- Gender (optional, user-selected; never inferred)
- Outfit type (selected by user)
- Location category (beach, café, mountain, city, studio)
- Time of day
- Weather (optional)

Never infer sensitive personal attributes.

---

# Location-Aware Suggestions

Examples

Beach

Relaxed standing poses

Mountain

Wide landscape poses

Cafe

Seated aesthetic poses

Street

Walking poses

Forest

Nature poses

---

# Learning Engine

Track

- Frequently used categories
- Favorite poses
- Successful captures
- Download history

Recommend similar poses locally.

No biometric profile is stored.

---

# Offline AI

Available Offline

✓ Pose Detection

✓ Skeleton Tracking

✓ Pose Score

✓ Voice Coaching

✓ Overlay

✓ Auto Capture

Unavailable Offline

- Cloud recommendations
- Remote model updates

---

# Performance Targets

Pose Detection

<100 ms

Pose Score Update

<50 ms

Overlay Refresh

60 FPS

Camera Launch

<1 second

Battery Usage

Optimized

Memory Usage

<250 MB during active camera session

---

# Error Handling

No person detected

Show

"Step into the frame."

Poor lighting

Show lighting suggestion.

Low confidence

Pause scoring.

Camera blocked

Prompt to clean lens or adjust framing.

AI initialization failed

Disable AI features and allow manual capture.

---

# Privacy

All AI inference runs on-device whenever possible.

Photos are never uploaded without explicit user action.

No facial recognition.

No identity recognition.

No biometric authentication.

No continuous background camera access.

---

# Security

Encrypt locally stored AI metadata.

Use HTTPS for any cloud communication.

Validate all model downloads.

Protect model files from tampering where practical.

---

# Accessibility

Support

- Voice guidance
- High contrast indicators
- Large UI controls
- Reduce motion
- Screen reader compatibility

---

# Testing Checklist

✓ Detect single person

✓ Ignore background objects

✓ Stable landmark tracking

✓ Accurate pose scoring

✓ Voice guidance triggers correctly

✓ Overlay aligns correctly

✓ Auto capture triggers only at threshold

✓ Works offline

✓ Low-light behavior tested

✓ Front and rear camera tested

✓ Battery usage acceptable

✓ No crashes during long sessions

---

# Future Enhancements

- Multi-person pose support
- 3D skeletal visualization
- AR body overlay
- AI-generated custom poses
- Video pose coaching
- Live composition assistant
- Outfit-aware pose suggestions
- Scene recognition
- Hand gesture recognition
- Personalized coaching history

---

# AI Coding Rules

The AI Pose Engine must:

- Use MediaPipe Pose Landmarker as the default model
- Run inference on-device whenever possible
- Keep inference asynchronous to avoid blocking the UI thread
- Update pose scores smoothly without flickering
- Use modular architecture (Detection, Scoring, Guidance, Auto Capture)
- Cache reference pose data locally
- Support offline operation
- Minimize battery and CPU usage
- Respect user privacy by default
- Follow Google Play AI, Camera, Privacy, and Data Safety policies

---

# Success Criteria

The AI Pose Engine is considered production-ready when it:

✓ Detects poses accurately in real time

✓ Maintains smooth 60 FPS UI

✓ Provides meaningful guidance

✓ Automatically captures correctly aligned poses

✓ Works without internet

✓ Protects user privacy

✓ Passes all functional and performance tests

✓ Meets Google Play compliance requirements

---

END OF AI_POSE_ENGINE.md