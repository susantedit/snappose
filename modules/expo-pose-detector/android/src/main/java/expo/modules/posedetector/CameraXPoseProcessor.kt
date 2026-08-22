package expo.modules.posedetector

import android.content.Context
import android.graphics.Bitmap
import android.graphics.Matrix
import android.os.SystemClock
import android.util.Log
import androidx.camera.core.*
import androidx.camera.lifecycle.ProcessCameraProvider
import androidx.core.content.ContextCompat
import androidx.lifecycle.LifecycleOwner
import java.nio.ByteBuffer
import java.util.concurrent.ExecutorService
import java.util.concurrent.Executors
import java.util.concurrent.TimeUnit

/**
 * CameraXPoseProcessor — POSEHANUM Live Pose Detection
 *
 * Manages the CameraX ImageAnalysis use case and feeds decoded Bitmaps to
 * PoseLandmarkerHelper at approximately 30 FPS (throttled with a minimum
 * frame interval to avoid overloading the MediaPipe inference thread).
 *
 * Lifecycle:
 *  1. start(context, lifecycleOwner, facing, callback) — binds CameraX and starts analysis
 *  2. flipCamera(facing) — rebinds with the opposite CameraSelector
 *  3. stop() — unbinds CameraX and releases the analysis thread
 */
class CameraXPoseProcessor(
    private val context: Context,
    private val poseListener: PoseLandmarkerHelper.LandmarkerListener,
) {
    private var cameraProvider: ProcessCameraProvider? = null
    private var analysisExecutor: ExecutorService? = null
    private var poseLandmarkerHelper: PoseLandmarkerHelper? = null

    // Target approximately 30 FPS — minimum 33 ms between frames
    private val minFrameIntervalMs: Long = 33L
    private var lastFrameTimestamp: Long = 0L

    // Current camera facing
    private var currentFacing: Int = CameraSelector.LENS_FACING_BACK

    companion object {
        private const val TAG = "CameraXPoseProcessor"
    }

    /**
     * Starts CameraX and binds ImageAnalysis with pose detection.
     *
     * @param lifecycleOwner The Activity or Fragment lifecycle owner
     * @param lensFacing CameraSelector.LENS_FACING_BACK or LENS_FACING_FRONT
     */
    fun start(lifecycleOwner: LifecycleOwner, lensFacing: Int = CameraSelector.LENS_FACING_BACK) {
        currentFacing = lensFacing
        analysisExecutor = Executors.newSingleThreadExecutor()
        poseLandmarkerHelper = PoseLandmarkerHelper(context, poseListener)

        val cameraProviderFuture = ProcessCameraProvider.getInstance(context)
        cameraProviderFuture.addListener({
            try {
                cameraProvider = cameraProviderFuture.get()
                bindAnalysis(lifecycleOwner)
            } catch (e: Exception) {
                Log.e(TAG, "CameraX Provider error: ${e.message}", e)
                poseListener.onError("CameraX initialization failed: ${e.message}")
            }
        }, ContextCompat.getMainExecutor(context))
    }

    /**
     * Switches between front and back cameras.
     * Re-binds CameraX with the new selector while keeping inference running.
     */
    fun flipCamera(lifecycleOwner: LifecycleOwner) {
        currentFacing = if (currentFacing == CameraSelector.LENS_FACING_BACK) {
            CameraSelector.LENS_FACING_FRONT
        } else {
            CameraSelector.LENS_FACING_BACK
        }

        try {
            cameraProvider?.unbindAll()
            bindAnalysis(lifecycleOwner)
        } catch (e: Exception) {
            Log.e(TAG, "Camera flip error: ${e.message}", e)
            poseListener.onError("Camera flip failed: ${e.message}")
        }
    }

    /**
     * Stops CameraX and releases all resources.
     */
    fun stop() {
        try {
            cameraProvider?.unbindAll()
        } catch (e: Exception) {
            Log.w(TAG, "CameraX unbind error (non-fatal): ${e.message}")
        }
        poseLandmarkerHelper?.clear()
        poseLandmarkerHelper = null

        analysisExecutor?.shutdown()
        try {
            analysisExecutor?.awaitTermination(1, TimeUnit.SECONDS)
        } catch (_: InterruptedException) {}
        analysisExecutor = null
    }

    // ---------------------------------------------------------------------------
    // Internal
    // ---------------------------------------------------------------------------

    private fun bindAnalysis(lifecycleOwner: LifecycleOwner) {
        val provider = cameraProvider ?: return
        val executor = analysisExecutor ?: return

        val cameraSelector = CameraSelector.Builder()
            .requireLensFacing(currentFacing)
            .build()

        val imageAnalysis = ImageAnalysis.Builder()
            .setTargetResolution(android.util.Size(640, 480))
            .setBackpressureStrategy(ImageAnalysis.STRATEGY_KEEP_ONLY_LATEST)
            .setOutputImageFormat(ImageAnalysis.OUTPUT_IMAGE_FORMAT_YUV_420_888)
            .build()

        imageAnalysis.setAnalyzer(executor) { imageProxy ->
            processFrame(imageProxy)
        }

        try {
            provider.unbindAll()
            provider.bindToLifecycle(
                lifecycleOwner,
                cameraSelector,
                imageAnalysis,
            )
            Log.d(TAG, "CameraX analysis bound. Lens: $currentFacing")
        } catch (e: Exception) {
            Log.e(TAG, "Camera bind error: ${e.message}", e)
            poseListener.onError("Camera bind failed: ${e.message}")
        }
    }

    /**
     * Called for each camera frame from the CameraX analysis executor.
     * Throttles to minFrameIntervalMs and converts YUV_420_888 to Bitmap before
     * passing to MediaPipe.
     */
    private fun processFrame(imageProxy: ImageProxy) {
        try {
            val now = SystemClock.uptimeMillis()
            if (now - lastFrameTimestamp < minFrameIntervalMs) {
                imageProxy.close()
                return
            }
            lastFrameTimestamp = now

            val bitmap = imageProxyToBitmap(imageProxy) ?: run {
                imageProxy.close()
                return
            }

            // Mirror front camera so left/right landmarks are correct from user perspective
            val finalBitmap = if (currentFacing == CameraSelector.LENS_FACING_FRONT) {
                mirrorBitmap(bitmap)
            } else {
                bitmap
            }

            poseLandmarkerHelper?.detectLiveStream(finalBitmap, now)
        } catch (e: Exception) {
            Log.e(TAG, "Frame processing error: ${e.message}", e)
        } finally {
            imageProxy.close()
        }
    }

    /**
     * Converts an ImageProxy in YUV_420_888 format to an ARGB_8888 Bitmap.
     * Handles rotation metadata from the camera so the output is always upright.
     */
    private fun imageProxyToBitmap(imageProxy: ImageProxy): Bitmap? {
        return try {
            val yBuffer: ByteBuffer = imageProxy.planes[0].buffer
            val uBuffer: ByteBuffer = imageProxy.planes[1].buffer
            val vBuffer: ByteBuffer = imageProxy.planes[2].buffer

            val ySize = yBuffer.remaining()
            val uSize = uBuffer.remaining()
            val vSize = vBuffer.remaining()

            val nv21 = ByteArray(ySize + uSize + vSize)
            yBuffer.get(nv21, 0, ySize)
            vBuffer.get(nv21, ySize, vSize)
            uBuffer.get(nv21, ySize + vSize, uSize)

            val yuvImage = android.graphics.YuvImage(
                nv21,
                android.graphics.ImageFormat.NV21,
                imageProxy.width,
                imageProxy.height,
                null,
            )

            val out = java.io.ByteArrayOutputStream()
            yuvImage.compressToJpeg(
                android.graphics.Rect(0, 0, imageProxy.width, imageProxy.height),
                85,
                out,
            )
            val jpegBytes = out.toByteArray()
            val rawBitmap = android.graphics.BitmapFactory.decodeByteArray(jpegBytes, 0, jpegBytes.size)
                ?: return null

            // Apply camera rotation so the bitmap is correctly oriented
            val rotationDegrees = imageProxy.imageInfo.rotationDegrees
            if (rotationDegrees == 0) {
                rawBitmap
            } else {
                val matrix = Matrix().apply { postRotate(rotationDegrees.toFloat()) }
                Bitmap.createBitmap(rawBitmap, 0, 0, rawBitmap.width, rawBitmap.height, matrix, true)
            }
        } catch (e: Exception) {
            Log.e(TAG, "YUV→Bitmap conversion failed: ${e.message}", e)
            null
        }
    }

    /**
     * Horizontally mirrors a bitmap so front-camera pose landmarks are correctly
     * oriented (left arm = left side of UI).
     */
    private fun mirrorBitmap(bitmap: Bitmap): Bitmap {
        val matrix = Matrix().apply { preScale(-1f, 1f) }
        return Bitmap.createBitmap(bitmap, 0, 0, bitmap.width, bitmap.height, matrix, true)
    }
}
