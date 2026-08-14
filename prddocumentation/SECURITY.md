# 🔒 SECURITY.md

Project: Snap Pose

Version: 1.0

Status: Production Ready

---

# Overview

This document defines the complete security architecture of Snap Pose.

Objectives

- Protect user data
- Secure authentication
- Secure cloud communication
- Protect AI models
- Prevent unauthorized access
- Meet Google Play security requirements
- Support privacy-first design

---

# Security Principles

Snap Pose follows

✓ Zero Trust

✓ Least Privilege

✓ Privacy by Design

✓ Secure by Default

✓ Defense in Depth

✓ Offline First

---

# Authentication

Supported Methods

- Anonymous Authentication
- Google Sign-In
- Apple Sign-In (iOS)
- Email & Password

Requirements

✓ Firebase Authentication only

✓ JWT Token Validation

✓ Automatic Token Refresh

✓ Secure Logout

✓ Session Expiration

---

# Authorization

Users can only access

- Their profile
- Their favorites
- Their downloads
- Their captured photos
- Their subscription

Admins can access

- Pose management
- Categories
- Analytics dashboards
- App configuration
- Content moderation

Never trust client-side authorization.

---

# Secure Storage

Sensitive Data

Store using

- Expo SecureStore
- Android Keystore
- iOS Keychain

Examples

- Authentication Token
- Refresh Token
- Premium Status
- Session ID

Never store sensitive information in AsyncStorage.

---

# Local Data Protection

Encrypt

✓ User preferences

✓ Premium cache

✓ Local metadata

Do NOT encrypt

- Public pose assets
- Public thumbnails
- Static app resources

---

# Network Security

Requirements

✓ HTTPS Only

✓ TLS 1.2+

✓ Certificate validation

✓ Secure Firebase SDK

Never

- Use HTTP
- Ignore SSL errors
- Disable certificate checks

---

# API Security

Every request must include

Authorization

```
Bearer <Firebase_ID_Token>
```

Requirements

✓ Validate JWT

✓ Validate request body

✓ Rate limiting

✓ Input sanitization

✓ Authentication middleware

---

# Firebase Security Rules

Firestore

Users

Read

Own Data

Write

Own Data

Public

Read Categories

Read Poses

Admins

Full Access

Storage

Public

Read

Pose Assets

Users

Upload

Own Photos

Feedback Images

Never allow public write access.

---

# Input Validation

Validate

- Email
- Username
- Search input
- Feedback messages
- File names
- Upload size
- API parameters

Reject

- SQL Injection
- XSS Payloads
- Invalid JSON
- Malformed Requests

---

# File Upload Security

Allowed Types

- JPG
- PNG
- WEBP

Maximum Size

20 MB

Block

- EXE
- APK
- ZIP
- JavaScript
- HTML
- PHP

Future

Virus scanning for uploaded files.

---

# AI Model Security

Protect

- AI model files
- Landmark data
- Scoring algorithm

Requirements

✓ Validate model version

✓ Verify downloaded models

✓ Prevent unauthorized replacement

Never expose internal AI logic through APIs.

---

# Camera Privacy

The camera

✓ Works only while the app is active

✓ Stops immediately when backgrounded

✓ Never records without user action

✓ Never uploads photos automatically

Photos remain on-device unless the user explicitly chooses to upload or back them up.

---

# Permission Management

Request only when needed

Required

- Camera
- Photos/Media Library

Optional

- Notifications
- Location (for location-based pose suggestions)

Never request unnecessary permissions.

---

# Password Policy

If Email Login is enabled

Minimum

- 8 characters
- One uppercase letter
- One lowercase letter
- One number
- One special character

Passwords are never stored by the app. Authentication is handled by Firebase Authentication.

---

# Data Privacy

Collect only

- App preferences
- Favorites
- Downloads
- Subscription status
- Anonymous analytics

Never collect

❌ Raw camera frames

❌ Facial recognition data

❌ Biometric templates

❌ Background microphone recordings

❌ Continuous location history

---

# Analytics Privacy

Allowed Events

- App Open
- Screen View
- Search
- Download
- Camera Open
- Photo Capture
- Purchase

Never log

- Passwords
- Emails
- Photos
- Search text containing personal information
- Authentication tokens

---

# Crash Reporting

Use Firebase Crashlytics

Allowed

- Stack traces
- Device model
- OS version
- App version

Never include

- Personal photos
- User messages
- Authentication tokens

---

# App Integrity

Enable

✓ Firebase App Check

Android

Play Integrity API

iOS

App Attest / DeviceCheck

Reject requests from unverified apps whenever possible.

---

# Rate Limiting

Anonymous

60 requests/minute

Authenticated

300 requests/minute

Admin

1000 requests/minute

Prevent

- API abuse
- Brute-force attacks
- Spam

---

# Secure Coding Practices

Use

✓ TypeScript

✓ ESLint

✓ Dependency auditing

✓ Input validation

✓ Error boundaries

✓ Parameterized queries (if applicable)

Never

- Hardcode secrets
- Commit API keys
- Disable security checks

---

# Dependency Security

Run regularly

```
npm audit

npm outdated

expo doctor
```

Update vulnerable dependencies promptly.

---

# Environment Variables

Store securely

```
EXPO_PUBLIC_FIREBASE_API_KEY

EXPO_PUBLIC_FIREBASE_PROJECT_ID

EXPO_PUBLIC_FIREBASE_APP_ID

EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET

EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID
```

Secrets (private keys, service accounts) must never be included in the client app.

Use EAS Secrets or secure CI/CD secret management.

---

# Logging Policy

Allowed

- Errors
- Warnings
- Performance metrics

Never log

- Tokens
- Passwords
- Personal images
- Sensitive user data

Disable verbose logging in production.

---

# Google Play Compliance

Comply with

✓ Google Play Developer Program Policies

✓ User Data Policy

✓ Data Safety Form

✓ Permissions Policy

✓ Play Integrity requirements

✓ Google Play Billing (for digital purchases)

Provide

- Privacy Policy
- Terms & Conditions
- Data deletion option

---

# Incident Response

If a security issue is detected

1. Log the incident
2. Notify administrators
3. Disable affected services if necessary
4. Patch the vulnerability
5. Release an update
6. Inform users if required

---

# Security Testing

Perform

✓ Authentication testing

✓ Authorization testing

✓ Permission testing

✓ API security testing

✓ Firestore rule testing

✓ Storage rule testing

✓ Dependency vulnerability scans

✓ Penetration testing (before major releases)

✓ Play Integrity verification

---

# Acceptance Criteria

The application is considered secure when

✓ All communication uses HTTPS/TLS

✓ Authentication is handled securely

✓ Sensitive data is encrypted

✓ Firebase Security Rules are enforced

✓ App Check is enabled

✓ Permissions follow least-privilege principles

✓ No sensitive information is exposed in logs

✓ Security testing passes

✓ Google Play security requirements are met

✓ Privacy-first architecture is maintained

---

END OF SECURITY.md