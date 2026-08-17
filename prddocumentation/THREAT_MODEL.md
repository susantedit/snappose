# 🛡️ POSEHANUM — Comprehensive STRIDE Threat Model

**Document Version**: 1.0 (Defensive Hardening Review)  
**Date**: August 2026  
**Auditor**: Senior Security & Privacy Engineer  

---

## 1. 🎯 Assets, Trust Boundaries & Attack Surfaces

### Primary Assets
1. **Camera Frame Buffers**: Ephemeral video streams containing user physical image & surroundings.
2. **User Photo Gallery**: High-resolution user captures and custom pose reference uploads.
3. **On-Device Personalization Vector**: Learned aesthetic and category affinities.
4. **Authentication Credentials**: Firebase Auth session tokens and User IDs.
5. **Billing & Entitlements**: Pro feature status and daily capture allocation counters.

### Trust Boundaries
- **TB-1 (Native Hardware & GPU &rarr; JavaScript App Engine)**: Camera video streams passing into MediaPipe pose model.
- **TB-2 (Local Device Storage &rarr; External Cloud Services)**: REST synchronization queue and Firebase Auth.
- **TB-3 (Third-Party Web Browser &rarr; Showcase Website & API)**: Web user visiting `/`, `/privacy`, `/terms`, `/delete-account`.

---

## 2. 📋 STRIDE Threat Classification Matrix

| Threat Category | Asset / Surface | Threat Scenario | Impact | Likelihood | Existing / Added Protection | Status |
|---|---|---|:---:|:---:|---|:---:|
| **Spoofing (S)** | Firebase Auth Sessions | Attacker attempts to impersonate another user via forged token | High | Low | Secure token storage in `expo-secure-store`; Firebase token signature verification | **[x] FIXED** |
| **Tampering (T)** | Custom Pose Uploads | Malicious user supplies path traversal payload (`../../evil.jpg`) | Medium | Medium | `FileUploadValidator.validateImageUpload()` strips paths & generates random alphanumeric names | **[x] FIXED** |
| **Tampering (T)** | Offline Mutation Queue | Malicious payload with `__proto__` injection or unbounded items | Medium | Low | Prototype pollution checks & `MAX_QUEUE_SIZE = 100` ring buffer | **[x] FIXED** |
| **Repudiation (R)** | Permanent Account Deletion | User claims data was deleted without authorization | Medium | Low | Explicit double-confirmation alert + atomic log records | **[x] FIXED** |
| **Information Disclosure (I)** | Camera Frames | Raw camera frames uploaded to cloud or logged to analytics | Critical | Low | 100% on-device MediaPipe inference; frames released in memory within 16ms | **[x] FIXED** |
| **Information Disclosure (I)** | Website Headers | Clickjacking via iframe framing / Cross-site script injection | High | Medium | Enforced strict CSP, `X-Frame-Options: DENY`, `nosniff`, `HSTS` | **[x] FIXED** |
| **Information Disclosure (I)** | User Export Bundle | Export bundle contains API secrets or credentials | High | Low | `PrivacyDataServiceImpl` strictly bundles user-owned records and explicitly omits auth tokens | **[x] FIXED** |
| **Denial of Service (D)** | Image Decompression Bombs | Uploading 50,000x50,000px image crashing app memory | High | Medium | Dimension bounds (`8192px`) & 15MB file size limits enforced before tensor processing | **[x] FIXED** |
| **Elevation of Privilege (E)** | Local Pro Entitlements | Tampering with local MMKV boolean to bypass Play Billing | Medium | Medium | Google Play Billing receipt validation architecture separation | **[x] FIXED** |

---

## 3. 🔐 Security Verification Sign-Off

All high-risk threat scenarios in the STRIDE matrix have verified mitigations enforced either in local TypeScript validation utilities, secure storage adapters, or enterprise HTTP security headers.
