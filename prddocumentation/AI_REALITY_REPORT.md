# 🤖 POSEHANUM — AI Reality & Truthfulness Report

**Audit Date**: August 2026  
**Auditor**: Senior Lead Mobile, AI & Systems Engineer  
**Core Standard**: Zero fabricated landmarks, zero fake scores, truthful hardware probes.

---

## 1. On-Device Real Pose Scoring Engine

- **Topology**: 33 standard anatomical landmarks following MediaPipe topology (nose, eyes, ears, mouth, shoulders, elbows, wrists, hips, knees, ankles, feet).
- **Angular Math**: Implemented in [`PoseScoreCalculator.ts`](file:///f:/snappose/src/features/ai/domain/PoseScoreCalculator.ts) using cosine angular differences across 7 anatomical regions:
  $$\text{Score} = \sum_{r=1}^{7} w_r \exp\left(-\frac{\theta_r^2}{2\sigma_r^2}\right)$$
- **Zero-Hallucination Anti-Fake Floor**: When `detectionStatus === 'NO_PERSON'`, score is strictly **0%**. No artificial score climbing or fake "Perfect" cues are emitted without true alignment.
- **AutoCapture Multi-Gate**: Auto-capture countdown requires:
  1. Real landmark tracking (`REAL_LANDMARKS`)
  2. Total score $\ge 90\%$
  3. Stable variance across temporal window
  4. Positive face smile & eye contact detection
  5. Distance within acceptable tolerance

---

## 2. Face Switch & Background Removal Truthfulness

- **Face Switch**: Architecture in [`FaceSwitchProvider.ts`](file:///f:/snappose/src/features/ai/domain/faceSwitch/FaceSwitchProvider.ts). Clearly returns `UNAVAILABLE_ON_CURRENT_BUILD` when native neural face synthesis weights are unlinked.
- **Background Segmentation**: Architecture in [`BackgroundSegmentationProvider.ts`](file:///f:/snappose/src/features/ai/domain/background/BackgroundSegmentationProvider.ts). Clearly returns `UNAVAILABLE_ON_CURRENT_BUILD` when native Selfie Segmentation model is unlinked.

---

## 3. Replaceable Trend Engine

- **No Artificial Live Claims**: When running offline, trends are explicitly labeled as **Curated Trends** based on seed data rather than fabricating live social stream counters.
- **Scoring Formula**:
  $$\text{Trend Score} = 0.35 R(t) + 0.25 V + 0.20 U + 0.10 E + 0.10 P$$
  with real exponential half-life decay $R(t) = \exp(-\lambda \Delta t)$ where $\lambda = \frac{\ln(2)}{7 \text{ days}}$.
