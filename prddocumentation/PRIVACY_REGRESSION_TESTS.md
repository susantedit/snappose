# 🧪 POSEHANUM — Privacy & Data Control Regression Testing Specification

**Date**: August 2026  
**Auditor**: Senior Security & QA Lead  
**Scope**: Automated and manual test assertions guaranteeing zero data leakage, complete permanent deletion, and privacy invariant enforcement.

---

## 1. 🛡️ Core Privacy Invariants & Regression Tests

### TEST-PRV-1: Complete Account Deletion Purge
- **Precondition**: User has 5 capture attempts in `historyStore`, 3 custom poses in `customPoseStore`, 4 favorites in `SQLiteFavoritesRepository`, and an active learned preference profile in `personalizationStore`.
- **Action**: Call `privacyDataService.deleteAccountPermanent()`.
- **Assertions**:
  - `useHistoryStore.getState().attempts` is empty (`[]`).
  - `useCustomPoseStore.getState().customPoses` is empty (`[]`).
  - `usePersonalizationStore.getState().profile.interactionsCount` is `0`.
  - `useNotificationStore.getState().history` is empty (`[]`).
  - `SQLiteFavoritesRepository.getAllFavoriteIds()` returns `[]`.
  - All `snappose_*` / `posehanum_*` keys deleted from MMKV.
  - `useAuthStore.getState().user` is `null`.
  - Function returns `success: true` with zero errors.

### TEST-PRV-2: Sanitized User Data Export
- **Action**: Call `privacyDataService.exportUserData()`.
- **Assertions**:
  - Returned `UserDataExportBundle` contains user profile, preferences, attempt counts, custom pose metadata, and notification state.
  - Export bundle contains **NO** private tokens, API keys, passwords, or security secrets.
  - Export bundle contains correct `appName: 'POSEHANUM'` and active `appVersion`.

### TEST-PRV-3: Selective Data Deletion Granularity
- **Action 1**: Call `privacyDataService.clearHistory()`.
  - *Assertion*: History is cleared, but favorites and custom poses remain intact.
- **Action 2**: Call `privacyDataService.clearCustomPoses()`.
  - *Assertion*: Custom poses are cleared, but history remains intact.
- **Action 3**: Call `privacyDataService.resetPersonalization()`.
  - *Assertion*: Machine learning preference profile is reset to baseline zero weights without affecting saved photos.

### TEST-PRV-4: Camera Frame Zero-Cloud-Transmission Invariant
- **Assertion**: No network requests (`fetch`, `XMLHttpRequest`, `WebSocket`, `Axios`) are dispatched from `MediaPipePoseDetector.ts` or `CameraView` during live camera streaming.
- **Verification**: Code review and network interceptor unit tests confirm 100% offline local processing.

### TEST-PRV-5: Audio Text-to-Speech Output-Only Invariant
- **Assertion**: `VoiceCoachService.ts` only invokes `expo-speech.speak()`. No microphone audio recording APIs are accessed.
