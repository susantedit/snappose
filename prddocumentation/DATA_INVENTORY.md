# 📋 POSEHANUM — Comprehensive Data Inventory & Privacy Classification

**Document Version**: 1.0 (POSEHANUM Release Candidate)  
**Date**: August 2026  
**Auditor**: Senior Privacy Engineer & Security Lead  

---

## 1. 🏷️ Complete Data Inventory Matrix

| Data Category | Specific Data Element | Purpose / Need | Processing Location | Storage Location | Retention Policy | Deletion Mechanism | Exportable? | Consent Required? | Play Data Safety Category |
|---|---|---|---|---|---|---|:---:|:---:|---|
| **Account & Profile** | User ID (`uid`) | Associate favorites & custom poses | On-Device / Cloud Auth | Local MMKV & Firebase Auth | Account Lifetime | In-App / Web Delete Account | Yes | Yes (Terms) | User IDs (Personal info) |
| **Account & Profile** | Display Name | Greeting in settings & profile | On-Device / Cloud Auth | Local MMKV & Firebase Auth | Account Lifetime | In-App / Web Delete Account | Yes | Yes | Name (Personal info) |
| **Account & Profile** | Email Address | Sign-in & account recovery | Cloud Auth | Firebase Auth | Account Lifetime | In-App / Web Delete Account | Yes | Yes | Email (Personal info) |
| **Account & Profile** | Anonymous Auth Token | Session validation | Memory / MMKV | Local MMKV | Session Lifetime | Sign out / Clear Data | No (Security) | Implicit | Account Auth |
| **Camera & Vision** | Live Camera Video Frames | Real-time pose overlay & alignment | 100% On-Device (GPU/RAM) | **NEVER Persisted** (Discarded immediately) | 0 seconds (Ephemeral) | Immediate memory release | No | Yes (CAMERA perm) | **Not Collected** |
| **Camera & Vision** | 33-Landmark Pose Coordinates (`x,y,z,visibility`) | Calculate pose match score against reference | 100% On-Device | Memory / Ephemeral (unless saved in Custom Pose) | Duration of camera session | Cleared on session end | Yes (if saved) | Implicit | **Not Collected / App Functionality** |
| **Camera & Vision** | Face Smile Ratio & Eye Gaze | Auto-capture countdown triggering | 100% On-Device | Memory (RAM only) | Ephemeral (<100ms) | Discarded on frame end | No | Implicit | **Not Collected** |
| **Camera & Vision** | Lighting & Distance Estimation | Flash & framing coaching | 100% On-Device | Memory (RAM only) | Ephemeral (<100ms) | Discarded on frame end | No | Implicit | **Not Collected** |
| **Photos & Media** | User Captured Photos | Saved to device gallery for user access | 100% On-Device | Device Photo Gallery / Local App Storage | User Controlled | Delete Photos / Device Gallery | Yes | Yes (MEDIA perm) | Photos and Videos |
| **Photos & Media** | Custom Uploaded Pose Images | Reusable pose guide reference | 100% On-Device | Local App Cache & MMKV Metadata | User Controlled | Delete Custom Poses | Yes | Yes (Picker) | Photos and Videos |
| **Photos & Media** | Captured Attempt Match Scores | Before/after comparison & history review | 100% On-Device | Local MMKV (`snappose_history_attempts_v1`) | User Controlled | Clear History / Delete Account | Yes | Implicit | App Functionality |
| **User Behavior** | Pose Interaction Signals (Captures, Favorites, Skips, Shares) | On-device personalization & style recommendations | 100% On-Device | Local MMKV (`snappose_personalization_v1`) | Until Reset / 90-day decay | Reset Personalization | Yes | Implicit | App Interactions |
| **User Behavior** | Learned Category Weight Vector | Tailor home feed recommendations | 100% On-Device | Local MMKV (`snappose_personalization_v1`) | Until Reset | Reset Personalization | Yes | Implicit | App Interactions |
| **User Behavior** | Favorite Poses Bookmarks | Quick access to preferred poses | Local & Cloud Sync | Local MMKV & SQLite (MongoDB optional) | User Controlled | Delete Favorites / Delete Account | Yes | Implicit | Favorites / App Functionality |
| **Notifications** | Scheduled Notification Log & Open Events | Fatigue backoff & avoid repetitive notifications | 100% On-Device | Local MMKV (`snappose_notif_history_v1`) | 30 Days rolling window | Clear Notification History | Yes | Yes (POST_NOTIFICATIONS) | App Interactions |
| **Notifications** | Quiet Hours & Notification Preferences | Respect user sleep hours and preferred times | 100% On-Device | Local MMKV (`snappose_notif_preferences_v1`) | Account Lifetime | Reset Settings / Delete Account | Yes | Implicit | App Preferences |
| **Diagnostics** | Crash Logs & Stack Traces | Bug fixing & stability monitoring | Firebase SDK (Cloud) | Firebase Crashlytics Server | 90 Days | Auto-purged by Firebase | No (Technical) | Yes (Crash reporting) | Crash Logs / Diagnostics |
| **Diagnostics** | App Performance Metrics | Monitor frame drops & camera startup latency | On-Device | Ephemeral / Debug log | 7 Days | Auto-purged | No | Implicit | Diagnostics |
| **Advertising** | Advertising Identifier (GAID) | Display AdMob interstitial & rewarded ads | AdMob SDK (Google) | Google AdMob Servers | Google Policy | Managed via Android OS Ads Settings | No | Yes (AdMob terms) | Device or other IDs |

---

## 2. 🔒 Privacy Guarantees & Non-Collection Assertions

1. **Zero Camera Cloud Transmission**: Raw camera video frames and biometric facial geometry NEVER leave the user's device. Frame analysis runs 100% on the local CPU/GPU and frames are discarded in under 16ms.
2. **No Secret Audio Recording**: POSEHANUM's Voice Coach uses on-device Text-to-Speech (`expo-speech`) to generate guidance audio. It does NOT record or upload ambient microphone audio.
3. **No Unencrypted Storage**: Local sensitive settings and authentication tokens are persisted in protected sandboxed storage (MMKV encrypted partition / private SQLite).
4. **No Cross-App Tracking**: POSEHANUM does not link user data to third-party data brokers or use invasive tracking SDKs.
