# ============================================================
# Snap Pose — ProGuard / R8 rules for release builds
# ============================================================

# ---------- React Native core ----------
-keep class com.facebook.react.** { *; }
-keep class com.facebook.hermes.** { *; }
-keep class com.facebook.jni.** { *; }
-dontwarn com.facebook.react.**
-dontwarn com.facebook.hermes.**

# Keep all native modules registered with @ReactModule
-keep @com.facebook.react.bridge.ReactModule class * { *; }

# Keep JS entry point
-keep class com.facebook.react.devsupport.** { *; }

# ---------- Expo modules ----------
-keep class expo.modules.** { *; }
-dontwarn expo.modules.**

# expo-camera
-keep class expo.modules.camera.** { *; }

# expo-file-system
-keep class expo.modules.filesystem.** { *; }

# expo-media-library
-keep class expo.modules.medialibrary.** { *; }

# expo-sqlite
-keep class expo.modules.sqlite.** { *; }

# expo-secure-store
-keep class expo.modules.securestore.** { *; }

# expo-updates (OTA)
-keep class expo.modules.updates.** { *; }
-keep class expo.modules.manifests.** { *; }

# ---------- Firebase ----------
-keep class com.google.firebase.** { *; }
-keep class com.google.android.gms.** { *; }
-dontwarn com.google.firebase.**
-dontwarn com.google.android.gms.**

# Firebase Crashlytics
-keepattributes SourceFile,LineNumberTable
-keep public class * extends java.lang.Exception
-keep class com.google.firebase.crashlytics.** { *; }

# Firebase Auth
-keep class com.google.firebase.auth.** { *; }

# ---------- AdMob / Google Mobile Ads ----------
-keep class com.google.android.gms.ads.** { *; }
-keep class com.google.ads.** { *; }
-keep class com.reactnativegooglemobileads.** { *; }
-dontwarn com.google.android.gms.ads.**

# UMP (User Messaging Platform — GDPR/CCPA consent)
-keep class com.google.android.ump.** { *; }
-dontwarn com.google.android.ump.**

# ---------- React Native Skia ----------
-keep class com.shopify.reactnative.skia.** { *; }
-dontwarn com.shopify.reactnative.skia.**

# ---------- MMKV ----------
-keep class com.tencent.mmkv.** { *; }
-dontwarn com.tencent.mmkv.**

# ---------- React Native Reanimated ----------
-keep class com.swmansion.reanimated.** { *; }
-dontwarn com.swmansion.reanimated.**

# ---------- React Native Gesture Handler ----------
-keep class com.swmansion.gesturehandler.** { *; }
-dontwarn com.swmansion.gesturehandler.**

# ---------- Shopify FlashList ----------
-keep class com.shopify.shadowlistview.** { *; }
-dontwarn com.shopify.shadowlistview.**

# ---------- OkHttp / Networking ----------
-dontwarn okhttp3.**
-dontwarn okio.**
-keep class okhttp3.** { *; }
-keep class okio.** { *; }

# ---------- Hermes engine ----------
-keep class com.facebook.hermes.unicode.** { *; }
-keep class com.facebook.jni.** { *; }

# ---------- General Android ----------
# Keep Parcelable implementations
-keepclassmembers class * implements android.os.Parcelable {
    static ** CREATOR;
}

# Keep Serializable classes
-keepclassmembers class * implements java.io.Serializable {
    private static final java.io.ObjectStreamField[] serialPersistentFields;
    private void writeObject(java.io.ObjectOutputStream);
    private void readObject(java.io.ObjectInputStream);
    java.lang.Object writeReplace();
    java.lang.Object readResolve();
}

# Keep annotation-processed classes (Kotlin data classes, etc.)
-keepattributes *Annotation*
-keepattributes RuntimeVisibleAnnotations
-keepattributes RuntimeInvisibleAnnotations
-keepattributes RuntimeVisibleParameterAnnotations
-keepattributes RuntimeInvisibleParameterAnnotations

# Keep Kotlin metadata for reflection
-keep class kotlin.Metadata { *; }
-dontwarn kotlin.**
-keepclassmembers class **$WhenMappings {
    <fields>;
}
-keepclassmembers class kotlin.Lazy {
    <fields>;
}

# ---------- Source map / debug info ----------
# Preserve original source file names and line numbers for crash reports
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile
