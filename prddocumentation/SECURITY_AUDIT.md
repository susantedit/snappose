# 🛡️ POSEHANUM — Security & Privacy Defensive Audit

**Audit Date**: August 2026  
**Auditor**: Senior Lead Mobile, AI & Systems Engineer  
**Scope**: Full codebase audit of authentication tokens, API exposure, secrets, data deletion, and client-server boundaries.

---

## 1. Secrets & Private Key Quarantining

- **Client Bundle Cleanliness**: Verified that zero Firebase private service account JSON keys exist in `src/` or bundled assets.
- **Git Ignore**: `.gitignore` explicitly filters `*.json` service keys and `.env` files.
- **API Keys**: Client uses public web API keys restricted by Android Package Name (`com.snappose.app`) and SHA-1 signing fingerprints.

---

## 2. Authentication & Authorization

- **Bearer Token Authorization**: Axios API client automatically attaches Bearer tokens via `setTokenProvider` from SecureStore.
- **Owner-Restricted Template Mutations**: `PUT /api/templates/:id` and `DELETE /api/templates/:id` verify that `existing.creatorId === req.user.uid`.
- **Offline Queue Sanitization**: Tested in `SecurityDefensiveAudit.test.ts` to reject prototype pollution keys (`__proto__`, `constructor`).

---

## 3. Biometric & AI Privacy Safeguards

- **100% Local Inference**: Pose landmark detection, Gaussian scoring, and AutoCapture execute strictly on-device without streaming camera frames to remote servers.
- **Ethical Face Switch Architecture**: `FaceSwitchProvider` mandates explicit user consent, user-owned portrait validation, and mandatory AI disclosure watermarks before any processing.
- **Data Export & Deletion**: Personal data export generates an offline JSON archive; account deletion drops SQLite records and purges MMKV local storage.
