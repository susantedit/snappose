package expo.modules.posedetector

import android.os.Bundle
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

/**
 * ExpoPoseDetectorModule — POSEHANUM Native Pose Detection
 *
 * Bridges CameraX + MediaPipe PoseLandmarker to the React Native JS thread via
 * Expo Modules Core event emitters.
 *
 * JS API (via modules/expo-pose-detector/index.ts):
 *  isAvailable()       → boolean — whether native detection is available on this device
 *  startDetection()    → boolean — starts CameraX + MediaPipe inference
 *  stopDetection()     → boolean — stops CameraX + MediaPipe and clears resources
 *  flipCamera()        → boolean — toggles front/back camera while detection is running
 *
 * Events emitted:
 *  "onPoseDetected" — fires every detected frame with status, personCount, inferenceMs, landmarks[]
 *  "onError"        — fires on initialization or inference failure
 *
 * Model asset:
 *  The MediaPipe PoseLandmarker requires "pose_landmarker_full.task" bundled in the APK's assets.
 *  Download from: https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_full/float16/latest/pose_landmarker_full.task
 *  Place at: android/app/src/main/assets/pose_landmarker_full.task
 */
class ExpoPoseDetectorModule : Module(), PoseLandmarkerHelper.LandmarkerListener {
    private var cameraXProcessor: CameraXPoseProcessor? = null

    override fun definition() = ModuleDefinition {
        Name("ExpoPoseDetector")

        Events("onPoseDetected", "onError")

        Function("isAvailable") {
            // Native detection is available on all Android devices running API 26+
            // (enforced by minSdkVersion in build.gradle)
            true
        }

        Function("startDetection") {
            val context = appContext.reactContext ?: run {
                sendEvent("onError", Bundle().apply { putString("error", "React context unavailable") })
                return@Function false
            }

            if (cameraXProcessor != null) {
                // Already running — no-op
                return@Function true
            }

            val lifecycleOwner = appContext.currentActivity as? androidx.lifecycle.LifecycleOwner
            if (lifecycleOwner == null) {
                sendEvent("onError", Bundle().apply {
                    putString("error", "Current activity does not implement LifecycleOwner")
                })
                return@Function false
            }

            cameraXProcessor = CameraXPoseProcessor(context, this@ExpoPoseDetectorModule)
            cameraXProcessor!!.start(lifecycleOwner)
            true
        }

        Function("stopDetection") {
            cameraXProcessor?.stop()
            cameraXProcessor = null
            true
        }

        Function("flipCamera") {
            val lifecycleOwner = appContext.currentActivity as? androidx.lifecycle.LifecycleOwner
                ?: return@Function false
            cameraXProcessor?.flipCamera(lifecycleOwner)
            true
        }
    }

    // Called from PoseLandmarkerHelper on every successfully detected frame
    override fun onResults(resultBundle: PoseLandmarkerHelper.ResultBundle) {
        val payload = Bundle().apply {
            putString("status", resultBundle.status)
            putInt("personCount", resultBundle.personCount)
            putLong("inferenceMs", resultBundle.inferenceTime)

            val landmarksList = ArrayList<Bundle>()
            if (resultBundle.results.isNotEmpty() && resultBundle.results[0].landmarks().isNotEmpty()) {
                val person = resultBundle.results[0].landmarks()[0]
                for (lm in person) {
                    val lmBundle = Bundle().apply {
                        putDouble("x", lm.x().toDouble())
                        putDouble("y", lm.y().toDouble())
                        putDouble("z", lm.z().toDouble())
                        // Use presence() as the visibility equivalent in MediaPipe Tasks Vision
                        putDouble("visibility", lm.presence().orElse(1.0f).toDouble())
                    }
                    landmarksList.add(lmBundle)
                }
            }
            putParcelableArrayList("landmarks", landmarksList)
        }

        sendEvent("onPoseDetected", payload)
    }

    // Called from PoseLandmarkerHelper on MediaPipe initialization or inference errors
    override fun onError(error: String) {
        sendEvent("onError", Bundle().apply { putString("error", error) })
    }
}
