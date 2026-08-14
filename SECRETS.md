# EAS Secrets — Snap Pose

This document lists every secret that must be set in the EAS dashboard (or via the `eas secret` CLI) before running a build. Secrets are injected as environment variables at build time and are never committed to version control.

> **Never put real values in this file.** Treat it as a reference guide only.

---

## Setting secrets via CLI

```bash
# Set a secret for all build profiles (project-wide)
eas secret:create --scope project --name SECRET_NAME --value "value"

# Set a secret for a specific build profile
eas secret:create --scope project --name SECRET_NAME --value "value" --build-profile production

# List existing secrets
eas secret:list

# Delete a secret
eas secret:delete --name SECRET_NAME
```

Alternatively, manage them at **expo.dev → Project → Secrets**.

---

## Required secrets

### API / Backend

| Secret name         | Description                                                                 | Example shape              |
|---------------------|-----------------------------------------------------------------------------|----------------------------|
| `MONGODB_API_URL`   | Base URL of the Snap Pose Node.js/Express backend that talks to MongoDB Atlas | `https://api.snappose.app` |

### AdMob

| Secret name              | Description                                                                 | Where to find it                         |
|--------------------------|-----------------------------------------------------------------------------|------------------------------------------|
| `ADMOB_APP_ID`           | AdMob Application ID (used in `google-services.json` and `AndroidManifest`) | AdMob console → App settings → App ID   |
| `ADMOB_NATIVE_ID`        | Ad Unit ID for the native in-feed ad (Home, Categories, Poses lists)        | AdMob console → Ad units                 |
| `ADMOB_REWARDED_ID`      | Ad Unit ID for the rewarded ad (unlock 5 bonus captures)                    | AdMob console → Ad units                 |
| `ADMOB_INTERSTITIAL_ID`  | Ad Unit ID for the interstitial ad (between browsing sessions)               | AdMob console → Ad units                 |
| `ADMOB_APP_OPEN_ID`      | Ad Unit ID for the app-open ad (first launch of the day)                    | AdMob console → Ad units                 |

### Firebase

| Secret name            | Description                                                                | How to obtain                                      |
|------------------------|----------------------------------------------------------------------------|----------------------------------------------------|
| `GOOGLE_SERVICES_JSON` | Full content of `google-services.json` from the Firebase project           | Firebase console → Project settings → google-services.json |

> For `GOOGLE_SERVICES_JSON`, paste the **entire JSON content** as the secret value. The EAS build process will write it to `./google-services.json` before the Gradle build runs.

### Expo / EAS

| Secret name    | Description                                             | Where to find it                    |
|----------------|---------------------------------------------------------|-------------------------------------|
| `EXPO_TOKEN`   | Expo access token for CI/CD (GitHub Actions)            | expo.dev → Account settings → Access tokens |

---

## GitHub Actions secrets

The following must also be set as **GitHub repository secrets** (Settings → Secrets and variables → Actions) for the CI pipeline to work:

| GitHub Secret name       | Maps to EAS secret / purpose                           |
|--------------------------|--------------------------------------------------------|
| `EXPO_TOKEN`             | Authenticates `eas` CLI in CI                          |
| `MONGODB_API_URL`        | Passed as env var to EAS builds triggered from CI      |
| `ADMOB_APP_ID`           | Passed as env var to EAS builds triggered from CI      |
| `ADMOB_NATIVE_ID`        | Passed as env var to EAS builds triggered from CI      |
| `ADMOB_REWARDED_ID`      | Passed as env var to EAS builds triggered from CI      |
| `ADMOB_INTERSTITIAL_ID`  | Passed as env var to EAS builds triggered from CI      |
| `ADMOB_APP_OPEN_ID`      | Passed as env var to EAS builds triggered from CI      |

---

## Runtime env vars (`.env` / `EXPO_PUBLIC_*`)

These are public-safe values used at **runtime** by the JS bundle. They are prefixed with `EXPO_PUBLIC_` and are NOT sensitive — they can live in `.env` (gitignored) or as EAS environment variables.

| Variable                        | Description                              |
|---------------------------------|------------------------------------------|
| `EXPO_PUBLIC_MONGODB_API_URL`   | Backend API base URL (same as `MONGODB_API_URL` for client use) |
| `EXPO_PUBLIC_ADMOB_APP_ID`      | AdMob App ID for `mobileAds().initialize()` |

See `.env.example` for the full list of `EXPO_PUBLIC_*` variables needed locally.

---

## Notes

- **AdMob test IDs:** During development, always use [AdMob test ad unit IDs](https://developers.google.com/admob/android/test-ads) to avoid invalid traffic. The `development` EAS profile should use test IDs set via EAS secrets or `.env`.
- **Proguard / R8:** The `production` build profile has `buildType: app-bundle` with Proguard enabled via `proguard-rules.pro`. Ensure AdMob and Firebase keep-rules are present (they are — see `proguard-rules.pro`).
- **google-services.json:** This file must be present at `./google-services.json` (relative to `snap-pose/`) before any Android build. For local development, download it manually from Firebase Console. For EAS builds, store the JSON content in the `GOOGLE_SERVICES_JSON` secret.
