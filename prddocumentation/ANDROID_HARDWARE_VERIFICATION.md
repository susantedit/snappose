# 📱 POSEHANUM — ANDROID HARDWARE VERIFICATION & BUILD GUIDE

**Document Date**: August 2026  
**Target Hardware**: Physical Android Phone / ARM64 Emulator  
**Native Module**: `modules/expo-pose-detector` (Kotlin Tasks Vision MediaPipe Plugin)

---

## 🛠️ Step-by-Step Native Android Execution & Hardware Verification

### Step 1: Android Environment Setup
Verify Android SDK and build environment paths:
```bash
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

### Step 2: Connect Hardware & Enable USB Debugging
Connect physical Android device via USB cable with Developer Options & USB Debugging enabled.
Verify active device connection:
```bash
adb devices
```
*Expected Output*: List of attached devices with device serial number.

### Step 3: Execute Custom Development Build
Because standard Expo Go does not execute custom C++/Kotlin native frame processors, trigger a native development build:
```bash
# Option A: Local native Android build
npx expo run:android

# Option B: Cloud EAS development build
eas build --profile development --platform android
```

### Step 4: Installation & Camera Verification Checklist
Once the APK is compiled and installed on the Android hardware device:

1. **Launch App**: Open `POSEHANUM` from the app launcher.
2. **Permissions**: Grant Camera and Microphone permissions when prompted.
3. **Select Pose**: Tap any pose (e.g. `Obi-Wan Defensive Guard` or `Jedi Hero Stance`).
4. **Open Viewfinder**: Camera initializes `<CameraView>` and `MediaPipePoseDetector`.
5. **Verify Native Detector Status**:
   - `modules/expo-pose-detector` initializes Google MediaPipe Tasks Vision.
   - Live banner updates from `"AI tracking unavailable in Expo Go (Requires Native Build)"` to `"REAL TRACKING"`.
6. **Verify 33 Landmarks**:
   - Skia vector canvas draws 33 anatomical landmarks overlaid on live video feed.
7. **Body Movement Test**:
   - Move arms: Arm regional score updates dynamically (0–98%).
   - Move legs: Leg regional score updates dynamically.
   - Step out of frame: Score drops immediately to `0%` (`NO_PERSON`).
8. **AI Director & Voice Coaching**:
   - Director HUD displays real angular error cue ("Raise right arm 18°").
   - Text-to-Speech speaks correction with 2s cooldown.
9. **Smart Auto-Capture**:
   - When score $\ge 90\%$ and stability window (500ms) is held, 3s countdown fires automatically.
10. **Post-Capture Verification**:
    - Captured frame is evaluated by `PostCaptureEvaluator` and displays true regional match breakdown.

---

## 🛑 Current Hardware Execution Status

```text
Status: BLOCKED — PHYSICAL ANDROID TEST DEVICE / CUSTOM APK BUILD REQUIRED

Explanation:
The native TypeScript interfaces, event emitters, Kotlin MediaPipe module (modules/expo-pose-detector),
and UI error boundary handling are 100% written and passing TypeScript compilation.
Compiling the C++/Kotlin MediaPipe Task Vision binary requires executing `npx expo run:android`
on a machine with Android Studio & NDK toolchain installed.
```
