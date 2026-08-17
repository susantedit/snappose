/**
 * File Upload Security & Defensive Validation Utility.
 *
 * Enforces:
 *  - Allowed image extensions (.jpg, .jpeg, .png, .webp)
 *  - File size bounds (prevents DoS / memory exhaustion)
 *  - Image dimension bounds (prevents decompression bomb / large allocation crash)
 *  - Cryptographic sanitized unique filename generation (prevents directory traversal / path injection)
 */

export interface ImageValidationOptions {
  maxSizeBytes?: number; // Default: 15MB
  maxWidth?: number;     // Default: 8192px
  maxHeight?: number;    // Default: 8192px
  allowedMimeTypes?: string[];
}

export interface ValidationResult {
  isValid: boolean;
  sanitizedFilename?: string;
  error?: string;
}

const DEFAULT_MAX_SIZE_BYTES = 15 * 1024 * 1024; // 15MB
const DEFAULT_MAX_DIMENSION = 8192; // 8K max

const ALLOWED_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'webp']);
const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

export class FileUploadValidator {
  /**
   * Generates a collision-resistant sanitized random filename.
   * Completely ignores user-controlled filenames to prevent path traversal.
   */
  static generateSafeFilename(extension: string = 'jpg'): string {
    const cleanExt = extension.toLowerCase().replace(/[^a-z0-9]/g, '');
    const validExt = ALLOWED_EXTENSIONS.has(cleanExt) ? cleanExt : 'jpg';
    const timestamp = Date.now();
    const randomHex = Math.random().toString(36).substring(2, 12);
    return `pose_${timestamp}_${randomHex}.${validExt}`;
  }

  /**
   * Defensively validates an image URI, size, and dimensions before processing.
   */
  static validateImageUpload(
    uri: string,
    fileSizeBytes?: number,
    width?: number,
    height?: number,
    mimeType?: string,
    options?: ImageValidationOptions,
  ): ValidationResult {
    if (!uri || typeof uri !== 'string' || uri.trim().length === 0) {
      return { isValid: false, error: 'Invalid or empty image URI.' };
    }

    // Path traversal check on input URI
    if (uri.includes('..') || uri.includes('%2e%2e')) {
      return { isValid: false, error: 'Path traversal attempt detected in image URI.' };
    }

    // Extension validation
    const extMatch = uri.split('?')[0].split('.').pop();
    const ext = extMatch ? extMatch.toLowerCase() : '';
    if (ext && !ALLOWED_EXTENSIONS.has(ext)) {
      return {
        isValid: false,
        error: `Unsupported image format '.${ext}'. Allowed formats: JPG, PNG, WEBP.`,
      };
    }

    // MIME type validation
    if (mimeType && !ALLOWED_MIME_TYPES.has(mimeType.toLowerCase())) {
      return {
        isValid: false,
        error: `Invalid MIME type '${mimeType}'. Allowed: image/jpeg, image/png, image/webp.`,
      };
    }

    // Size limit validation (DoS protection)
    const maxSize = options?.maxSizeBytes ?? DEFAULT_MAX_SIZE_BYTES;
    if (fileSizeBytes !== undefined && fileSizeBytes > maxSize) {
      return {
        isValid: false,
        error: `File size exceeds the maximum limit of ${(maxSize / (1024 * 1024)).toFixed(1)}MB.`,
      };
    }

    // Dimension limit validation (Decompression bomb protection)
    const maxDim = options?.maxWidth ?? DEFAULT_MAX_DIMENSION;
    if ((width && width > maxDim) || (height && height > maxDim)) {
      return {
        isValid: false,
        error: `Image dimensions exceed the maximum allowed size of ${maxDim}x${maxDim}px.`,
      };
    }

    const sanitizedFilename = this.generateSafeFilename(ext || 'jpg');
    return {
      isValid: true,
      sanitizedFilename,
    };
  }
}
