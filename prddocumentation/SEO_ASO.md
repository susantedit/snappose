# 🌐 POSEHANUM — Complete SEO & ASO Strategy & Technical Guide

**Brand Name**: POSEHANUM  
**Meaning**: "Hanum" is inspired by the Nepali expression for "let's do/take it." POSEHANUM = "Let's take the pose / Let's capture the shot."  
**Core Brand Promise**: "POSEHANUM guides you from 'How should I pose?' to 'That's the shot.'"  
**Primary Tagline**: "Pose Garौँ. Perfect Shot Lिऔँ."  
**English Tagline**: "Let's Pose. Let's Capture."  
**Secondary Tagline**: "Pose Smarter. Capture Better."  

---

## 1. 🎯 Target Keywords & Search Intent Matrix

| Keyword Category | Primary Keywords | Search Intent | Landing Page Target |
|---|---|---|---|
| **Core Brand** | `POSEHANUM`, `POSEHANUM app`, `POSEHANUM AI` | Navigational | Homepage (`/`) |
| **AI Photography Assistant** | `AI pose coach`, `AI photography assistant`, `AI camera guidance`, `pose matching app` | High Commercial / Download | Homepage (`#ai-coach`, `#how-it-works`) |
| **Posing Guidance** | `how to pose for photos`, `pose ideas`, `photography pose guide`, `standing poses` | Informational / Problem-Solving | Pose Categories (`#categories`) |
| **Niche Styles** | `travel photo poses`, `cafe poses`, `streetwear poses`, `couple portrait poses` | Contextual Discovery | Categories / Context Suggester |
| **Feature Specific** | `hands free camera timer`, `auto capture pose`, `AR skeleton camera`, `3D pose viewer` | Solution Seeking | Features (`#auto-capture`, `#ar-skeleton`) |

---

## 2. 🏗️ Website Technical SEO Architecture

### Title & Meta Tag Strategy
- **Homepage Title**: `POSEHANUM — AI Pose Coach & Photography Assistant` (under 60 chars)
- **Meta Description**: `POSEHANUM is your visual path to the perfect shot. Pose Garौँ. Perfect Shot Lिऔँ. Real-time AI pose matching, AR skeleton guidance, voice coaching, and smart auto capture.` (under 160 chars)
- **Canonical URL**: `https://posehanum.app` (configured in Next.js metadataBase)

### Heading Hierarchy
- Single `<h1>`: `STOP SAYING "I DON'T KNOW HOW TO POSE."`
- `<h2>` sections:
  - `HOW POSEHANUM WORKS.`
  - `LIKE HAVING A PRO PHOTOGRAPHER IN YOUR EAR.`
  - `AR SKELETON TRACKING.`
  - `BEFORE & AFTER POSEHANUM.`
  - `AI RECOMMENDATION ENGINE.`
  - `FROM STATIC POSES TO YOUR SIGNATURE STYLE.`
  - `YOUR NEXT GREAT PHOTO IS ONE POSE AWAY.`
- `<h3>` and `<h4>` subsections for feature cards, FAQs, and step breakdowns.

### Structured Data (Schema.org JSON-LD)
Valid Schema.org graph implemented on the website:
- `SoftwareApplication`: Defines POSEHANUM as a PhotographyApplication on Android/iOS with free pricing.
- `MobileApplication`: Detailed mobile app schema with operatingSystem and applicationCategory.
- `Organization`: Brand organization schema with logo, founder (Susant Luitel), and social profile links.
- `WebSite`: Website name, description, and publisher graph linkages.

### Crawlability & Indexing
- **Robots.txt**: `https://posehanum.app/robots.txt` allowing all search engines and referencing the XML sitemap.
- **Sitemap.xml**: `https://posehanum.app/sitemap.xml` dynamically generated via Next.js metadata route.
- **Favicon & Icons**: Modern SVG, WebP, and PNG icons generated and linked.

---

## 3. 📱 Google Play Store ASO Strategy

### On-Metadata Optimization
1. **Title**: `POSEHANUM — AI Pose Coach` (Keyword density: `AI`, `Pose`, `Coach`).
2. **Short Description**: `AI pose guidance, real-time pose matching, voice coaching & smart photo capture.` (Hits 4 high-value search queries within 80 chars).
3. **Long Description**: Structured with benefit-driven headings, bullet points, and technical differentiators (33-landmark tracking, 100% on-device privacy guarantee).

### Conversion Rate Optimization (CRO)
- **Visual Contrast**: Brand colors (Neon Lime `#B7FF00`, Cream `#F6F1E7`, Olive `#65744A`, Dark `#181818`) create high contrast on both light and dark Google Play themes.
- **First 3 Screenshots**: Focus on immediate visual proofs (1. Live skeleton alignment score, 2. Voice coach in ear, 3. Draggable before/after slider).

---

## 4. 🔒 Privacy & Compliance Assurance

- **Zero Cloud Video Streaming**: All landmark computation is strictly on-device via MediaPipe.
- **No Face Geometry / Biometrics Upload**: Verified in privacy policy and Google Play Data Safety declaration.
- **App Permissions**: Clean list restricted to `CAMERA`, `VIBRATE`, and optional `READ_MEDIA_IMAGES` / `RECORD_AUDIO`.

---

## 5. 📊 Measurement & Future Localization

### Analytics Tracking
- `pose_viewed`, `pose_matched`, `photo_captured`, `voice_coach_toggled`, `custom_pose_uploaded`.
- On-device telemetry privacy-isolated through MMKV state.

### Future Internationalization (i18n)
- Core `src/i18n/en.json` prepared for localization into Nepali (`ne`), Hindi (`hi`), Spanish (`es`), Japanese (`ja`), Korean (`ko`), French (`fr`), and German (`de`).
