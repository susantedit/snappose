# 📱 GOOGLE PLAY DATA SAFETY — POSEHANUM Official Console Questionnaire Guide

**Purpose**: Exact responses to enter into the Google Play Console Data Safety Form for POSEHANUM.  
**Version**: 1.0 (POSEHANUM Launch Preparation)  
**Status**: Ready for Manual Play Console Entry  

---

## 1. Overview Questions

- **Does your app collect or share any of the required user data types?**  
  👉 **YES** (Photos/Videos, User IDs, App Activity / Interactions, Crash Logs)
- **Is all of the user data collected by your app encrypted in transit?**  
  👉 **YES** (All cloud communication uses HTTPS / TLS 1.3 encryption)
- **Do you provide a way for users to request that their data be deleted?**  
  👉 **YES** (Both in-app at Settings &rarr; Privacy & Data &rarr; Delete Account, AND external web URL at `https://posehanum.app/delete-account`)

---

## 2. Data Types Breakdown for Play Console

### A. Location
- **Collected**: NO
- **Shared**: NO

### B. Personal Info
1. **Name**:
   - **Collected**: YES (Optional if user signs in with Google/Email; absent in guest mode)
   - **Shared**: NO
   - **Purposes**: Account management, App functionality
   - **Optional/Required**: Optional
2. **Email Address**:
   - **Collected**: YES (Optional if user signs in with Google/Email)
   - **Shared**: NO
   - **Purposes**: Account management
   - **Optional/Required**: Optional
3. **User IDs**:
   - **Collected**: YES (Firebase Auth UID)
   - **Shared**: NO
   - **Purposes**: Account management, Cloud bookmark synchronization
   - **Optional/Required**: Optional

### C. Photos and Videos
1. **Photos**:
   - **Collected**: YES (User-captured photos saved to local device photo library; user-uploaded custom pose references)
   - **Shared**: NO
   - **Purposes**: App functionality
   - **Optional/Required**: Optional (User-driven action)
   - **Ephemeral**: User-controlled on-device storage

### D. Audio Files
- **Collected**: NO
- **Shared**: NO
- *Note*: Voice coach uses local Text-to-Speech output; no microphone audio is collected or recorded.

### E. App Activity
1. **App Interactions**:
   - **Collected**: YES (Pose category selections, favorites, attempt match scores, personalization signals)
   - **Shared**: NO
   - **Purposes**: On-device personalization, App functionality
   - **Optional/Required**: Required for core app functionality (can be reset anytime)

### F. App Info and Performance
1. **Crash Logs**:
   - **Collected**: YES (Firebase Crashlytics)
   - **Shared**: NO (Processed by Google Cloud / Firebase on developer's behalf)
   - **Purposes**: Analytics, Diagnostics
   - **Optional/Required**: Required

### G. Device or Other IDs
1. **Device or other IDs**:
   - **Collected**: YES (Google Advertising ID - GAID by Google Mobile Ads SDK)
   - **Shared**: YES (To Google AdMob for ad serving)
   - **Purposes**: Advertising or marketing
   - **Optional/Required**: Required for ad-supported free tier

---

## 3. Account Deletion URL for Play Console Entry

```text
https://posehanum.app/delete-account
```

## 4. Privacy Policy URL for Play Console Entry

```text
https://posehanum.app/privacy
```
