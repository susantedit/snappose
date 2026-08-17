# 🧠 AI_PERSONALIZATION_ENGINE.md

**Project:** Snap Pose  
**Version:** 1.0  
**Status:** Production Ready  
**Architecture:** Privacy-First On-Device Personalization & Recommendation Engine  

---

## 1. Overview & Core Philosophy

The Snap Pose Personalization & Machine Learning Engine learns user preferences dynamically over time while strictly adhering to privacy-first principles.

Instead of serving identical static catalogs to all users, Snap Pose analyzes user behavior signals (favorites, captures, pose tries, skips, matches, dwell time, outfit selections, and explicit likes/dislikes) and scores candidate poses in real time.

### Core Privacy Guarantees
- **100% On-Device Processing**: Pose scoring, vector math, and candidate ranking execute locally on the device with an execution latency under **15ms**.
- **Zero Raw Camera Frames**: Camera frames, biometric landmarks, facial identifiers, and photos are never uploaded or used for surveillance.
- **Explainable AI**: Recommendations feature human-readable reason badges (*"Because you love street poses"*, *"You matched 94% with this style"*, *"Try something new"*).
- **User Control & Instant Reset**: Full Settings toggles to disable personalization or wipe the behavioral profile instantly.

---

## 2. Dynamic User Preference Profile Vector

The user's taste and skill evolve through an on-device preference vector:

```typescript
export interface UserPreferenceProfile {
  preferredCategories: Record<string, number>;    // e.g. { street: 0.88, cafe: 0.45, nature: 0.92 }
  preferredPoseTypes: Record<string, number>;     // e.g. { standing: 0.94, sitting: 0.31 }
  preferredCameraAngles: Record<string, number>;  // e.g. { eye-level: 0.74, low-angle: 0.82 }
  difficultyPreference: number;                   // 0.0 (easy) to 1.0 (hard)
  averageMatchScore: number;                      // 0 to 100
  favoritePoseStyle: PoseStyle;                   // 'natural' | 'aesthetic' | 'professional' | 'creative' | 'casual'
  preferredOutfit?: OutfitCategory;               // 'casual' | 'formal' | 'streetwear' | 'summer' | ...
  experienceLevel: ExperienceLevel;               // 'beginner' | 'intermediate' | 'advanced'
  voiceCoachUsage: number;                        // 0.0 to 1.0
  autoCaptureUsage: number;                       // 0.0 to 1.0
  totalInteractions: number;
  totalSuccessfulCaptures: number;
  lastUpdated: string;
  modelVersion: string;                           // 'v1'
}
```

---

## 3. Mathematical Scoring Model

Every candidate pose $P$ is scored according to a multi-factor weighted equation:

$$\text{Score}(P) = w_{\text{cat}} C + w_{\text{type}} T + w_{\text{angle}} A + w_{\text{success}} S + w_{\text{match}} M + w_{\text{recent}} R + w_{\text{ctx}} X + w_{\text{novelty}} N$$

### Weight Matrix Configuration (`v1`):
| Factor | Weight | Description |
| :--- | :---: | :--- |
| **$w_{\text{cat}}$** (Category Affinity) | $0.20$ | Affinity for the pose's category (clamped $[0.0, 1.0]$) |
| **$w_{\text{type}}$** (Pose Type / Tags) | $0.15$ | Average affinity across pose tags (`standing`, `candid`, etc.) |
| **$w_{\text{angle}}$** (Camera Angle) | $0.10$ | Match for preferred camera perspective (`eye-level`, `low-angle`, etc.) |
| **$w_{\text{success}}$** (Historical Success) | $0.20$ | Skill suitability and difficulty match |
| **$w_{\text{match}}$** (Achievability Score) | $0.15$ | Historical similarity match probability |
| **$w_{\text{recent}}$** (Session Interest) | $0.10$ | Dwell and engagement in active session |
| **$w_{\text{ctx}}$** (Context Relevance) | $0.05$ | Indoor/outdoor, outfit, and orientation alignment |
| **$w_{\text{novelty}}$** (Novelty / Exploration) | $0.05$ | Exploration boost for unseen poses |

---

## 4. Exploitation vs. Exploration (80/20 Rule)

To prevent recommendation fatigue and filter bubbles:
- **80% Familiar (Exploitation)**: Poses matching the user's highest affinity categories and verified styles.
- **20% Discovery (Exploration)**: High-novelty poses outside dominant categories with the badge *"Try something new"*.

---

## 5. Behavioral Learning & Learning Rates

Interaction signals update the preference vector using Exponential Moving Average (EMA):

$$w_{t+1} = \text{clamp}(w_t + \Delta, 0.0, 1.0)$$

| Signal Type | Delta ($\Delta$) | Signal Strength |
| :--- | :---: | :--- |
| `EXPLICIT_LIKE` | $+0.22$ | Strong Positive |
| `FEEDBACK_MORE_LIKE_THIS` | $+0.20$ | Strong Positive |
| `POSE_SHARED` | $+0.20$ | Strong Positive |
| `POSE_CAPTURED` | $+0.18$ | Strong Positive |
| `POSE_FAVORITED` | $+0.16$ | Strong Positive |
| `POSE_DOWNLOADED` | $+0.10$ | Medium Positive |
| `POSE_OPENED` | $+0.05$ | Medium Positive |
| `POSE_SKIPPED` | $-0.04$ | Soft Damped Negative |
| `POSE_UNFAVORITED` | $-0.12$ | Negative |
| `EXPLICIT_DISLIKE` | $-0.25$ | Strong Negative |
| `FEEDBACK_DONT_RECOMMEND` | $-0.35$ | Suppression |

---

## 6. Cold Start Architecture

New users without behavioral history receive:
1. **Optional Onboarding Survey**:
   - Photo Goals (Travel, Selfies, Fashion, Nature, Cafe, Couple, Friends)
   - Preferred Aesthetic Style (Natural, Aesthetic, Professional, Creative, Casual)
   - Experience Level (Beginner, Intermediate, Advanced)
2. **Neutral Fallback Baseline**: Initialized with equal $0.5$ weights across all 12 categories.

---

## 7. Storage & Offline Resilience

- **Primary Local State**: MMKV key `userPreferenceProfile` for zero-latency synchronous reads.
- **Explicit Feedback**: MMKV key `explicitFeedback` for instant exclusion of disliked poses.
- **SQLite History**: Table `user_pose_interactions` for historical interaction logs and auditing.

---

## 8. Telemetry & Analytics Events

All telemetry adheres to strict non-sensitive parameter sanitization:
1. `personalization_enabled`
2. `personalization_disabled`
3. `recommendation_shown`
4. `recommendation_clicked`
5. `recommendation_accepted`
6. `recommendation_rejected`
7. `recommendation_feedback`
8. `preference_updated`
9. `recommendation_session_started`
10. `recommendation_session_completed`
