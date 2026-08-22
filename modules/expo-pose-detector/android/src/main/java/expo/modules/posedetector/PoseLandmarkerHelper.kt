package expo.modules.posedetector

import android.content.Context
import android.graphics.Bitmap
import android.os.SystemClock
import android.util.Log
import com.google.mediapipe.framework.image.BitmapImageBuilder
import com.google.mediapipe.framework.image.MPImage
import com.google.mediapipe.tasks.core.BaseOptions
import com.google.mediapipe.tasks.vision.core.RunningMode
import com.google.mediapipe.tasks.vision.poselandmarker.PoseLandmarker
import com.google.mediapipe.tasks.vision.poselandmarker.PoseLandmarkerResult

class PoseLandmarkerHelper(
    private val context: Context,
    private val poseLandmarkerListener: LandmarkerListener? = null
) {
    private var poseLandmarker: PoseLandmarker? = null

    interface LandmarkerListener {
        fun onError(error: String)
        fun onResults(resultBundle: ResultBundle)
    }

    data class ResultBundle(
        val results: List<PoseLandmarkerResult>,
        val inferenceTime: Long,
        val inputImageHeight: Int,
        val inputImageWidth: Int,
        val personCount: Int,
        val status: String
    )

    init {
        setupPoseLandmarker()
    }

    fun setupPoseLandmarker() {
        val baseOptionBuilder = BaseOptions.builder()
            .setModelAssetPath("pose_landmarker_full.task")

        val optionsBuilder = PoseLandmarker.PoseLandmarkerOptions.builder()
            .setBaseOptions(baseOptionBuilder.build())
            .setMinPoseDetectionConfidence(0.5f)
            .setMinPosePresenceConfidence(0.5f)
            .setMinTrackingConfidence(0.5f)
            .setRunningMode(RunningMode.LIVE_STREAM)
            .setResultListener { result, inputImage ->
                val inferenceTime = SystemClock.uptimeMillis() - (result.timestampMs())
                val persons = result.landmarks().size

                val status = when {
                    persons == 0 -> "NO_PERSON"
                    persons > 1 -> "MULTIPLE_PEOPLE"
                    else -> {
                        val firstPerson = result.landmarks()[0]
                        val visibleCount = firstPerson.count { it.presence().orElse(1.0f) >= 0.5f }
                        if (visibleCount < 16) "LOW_CONFIDENCE" else "REAL_LANDMARKS"
                    }
                }

                poseLandmarkerListener?.onResults(
                    ResultBundle(
                        results = listOf(result),
                        inferenceTime = inferenceTime,
                        inputImageHeight = inputImage.height,
                        inputImageWidth = inputImage.width,
                        personCount = persons,
                        status = status
                    )
                )
            }
            .setErrorListener { error ->
                poseLandmarkerListener?.onError(error.message ?: "Unknown MediaPipe Error")
            }

        try {
            poseLandmarker = PoseLandmarker.createFromOptions(context, optionsBuilder.build())
        } catch (e: Exception) {
            Log.e(TAG, "MediaPipe PoseLandmarker initialization failed: ${e.message}")
            poseLandmarkerListener?.onError("MediaPipe init failed: ${e.message}")
        }
    }

    fun detectLiveStream(bitmap: Bitmap, timestampMs: Long) {
        val mpImage = BitmapImageBuilder(bitmap).build()
        poseLandmarker?.detectAsync(mpImage, timestampMs)
    }

    fun clear() {
        poseLandmarker?.close()
        poseLandmarker = null
    }

    companion object {
        private const val TAG = "PoseLandmarkerHelper"
    }
}
