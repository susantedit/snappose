# POSEHANUM — API Key & Environment Secrets Audit

**Audit Date:** August 2026  
**Status:** Completed & Secured  

---

## 1. Inventory of AI & Cloud Keys

| Key / Secret Name | Configured Location | Used by Feature | Runs On-Device? | Key Required? | Status / Action |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GEMINI_API_KEY` | None | None | N/A | ❌ No | **Unused.** Core AI runs on-device without cloud LLMs. |
| `GOOGLE_API_KEY` | None | None | N/A | ❌ No | **Unused.** Not needed for on-device MediaPipe vision. |
| `VERTEX_API_KEY` | None | None | N/A | ❌ No | **Unused.** |
| `OPENAI_API_KEY` | None | None | N/A | ❌ No | **Unused.** |
| `ANTHROPIC_API_KEY` | None | None | N/A | ❌ No | **Unused.** |
| `HUGGINGFACE_TOKEN`| None | None | N/A | ❌ No | **Unused.** |
| `EXPO_PUBLIC_MONGODB_API_URL` | `.env` | Syncs custom community poses to MongoDB backend. | Remote HTTP | ✅ Optional (for cloud feed) | Configured in client `.env`. |
| `EXPO_PUBLIC_ADMOB_APP_ID` | `.env` | Google Mobile Ads SDK initialization. | Client SDK | ✅ Required for Ads | Configured in client `.env`. |
| `EXPO_PUBLIC_ADMOB_*_ID` | `.env` | Ad unit IDs (Native, Rewarded, Interstitial, App Open). | Client SDK | ✅ Required for Ads | Configured in client `.env`. |
| `EXPO_PUBLIC_FIREBASE_API_KEY` | `.env` | Firebase Client SDK App identification. | Client SDK | ✅ Optional (Auth/Analytics) | Public client key (Not a secret). |
| `EXPO_PUBLIC_FIREBASE_PROJECT_ID`| `.env` | Firebase Project identifier. | Client SDK | ✅ Optional | Public client config. |
| `EXPO_PUBLIC_FIREBASE_APP_ID` | `.env` | Firebase App identifier. | Client SDK | ✅ Optional | Public client config. |
| `FIREBASE_PRIVATE_KEY` | `backend/.env` | Server-side JWT token verification (`firebase-admin`). | Server only | ✅ Required for Server Auth | **Keep in backend ONLY.** |
| `FIREBASE_CLIENT_EMAIL` | `backend/.env` | Server-side Service Account email. | Server only | ✅ Required for Server Auth | **Keep in backend ONLY.** |
| `snap-pose-*-adminsdk-*.json` | Client Root (Old) | Server Admin credentials. | Server only | ❌ NOT in Client | **DELETED from mobile client root.** |

---

## 2. Security Separation: Client Config vs Server Secrets

### A. Client-Side Identifiers (Safe in Mobile Bundle)
The following are **public identifiers** by Google/Firebase design:
- `EXPO_PUBLIC_FIREBASE_API_KEY` (identifies project to Google endpoints; protected by Google Play package name / SHA-1 fingerprint restriction).
- `EXPO_PUBLIC_FIREBASE_PROJECT_ID`
- `EXPO_PUBLIC_FIREBASE_APP_ID`
- `EXPO_PUBLIC_ADMOB_APP_ID` / Ad Unit IDs

### B. Server-Side Private Secrets (NEVER in Mobile Client)
- `FIREBASE_PRIVATE_KEY` / Service Account JSON: Grants full database read/write/admin rights. Must **never** be packaged into an APK or client bundle.
- `MONGODB_URI`: Database connection string with database credentials. Lives strictly in `backend/.env`.

---

## 3. Policy & Future Key Requests

> [!CAUTION]
> **No further AI API keys will be requested for core features.**
> POSEHANUM's core value proposition is instant, private, offline, sub-20ms on-device pose tracking. Any future cloud AI features (e.g. generative AI scene remixing) must be explicitly requested by the product roadmap and proxied through a secure backend service.
