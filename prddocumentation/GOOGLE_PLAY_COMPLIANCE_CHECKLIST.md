# 📋 GOOGLE PLAY COMPLIANCE CHECKLIST — POSEHANUM

**App Name**: POSEHANUM — AI Pose Coach  
**Package ID**: `com.example.snappose`  
**Target SDK**: Android 14 / 15 (API Level 34+)  
**Review Status**: Codebase Implementation Ready  

---

## 1. 🛡️ Google Play Policy Verification Checklist

| Policy Requirement | Implementation in Repository | Status | Play Console Action Required |
|---|---|:---:|---|
| **Privacy Policy Link** | Hosted at `https://posehanum.app/privacy` | `[x]` | Paste URL into Console |
| **Account Deletion In-App** | Settings &rarr; Privacy & Data &rarr; Delete Account & All Data | `[x]` | Ready |
| **Account Deletion Web URL** | Hosted at `https://posehanum.app/delete-account` | `[x]` | Paste URL into Data Safety Form |
| **Data Safety Declaration** | Documented in `GOOGLE_PLAY_DATA_SAFETY.md` | `[x]` | Complete questionnaire in Console |
| **Ads Declaration** | AdMob adapter with camera suppression implemented | `[x]` | Declare "App contains ads" in Console |
| **Sensitive Permissions (Camera)** | `CAMERA` permission usage strings updated in `app.config.ts` | `[x]` | Declare core camera feature |
| **Media Permissions** | `READ_MEDIA_IMAGES` / Photo library access usage strings updated | `[x]` | Declare photo gallery access |
| **Microphone Permission** | Removed unnecessary microphone recording permission since TTS is output-only | `[x]` | Not requesting microphone |
| **Target Audience & Content Rating** | Suitable for Everyone (13+ / Creators) | `[x]` | Complete IARC Rating questionnaire |
| **App Access & Reviewer Credentials** | Anonymous guest sign-in enabled out of the box with zero barrier | `[x]` | Specify "All features available without login" |
| **Google Play Billing** | Google Play subscription store integration structure defined | `[~]` | Set up in-app products in Play Console |
| **Release Signing Key** | Production `.keystore` / Google Play App Signing | `[!]` | Generate release signing key in CI |
| **Production AdMob IDs** | Separated in brand/app config | `[!]` | Link Play Store app in AdMob Console |
| **Production Firebase JSON** | `google-services.json` hook configured | `[!]` | Download production JSON from Firebase |
