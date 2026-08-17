/**
 * Automated Defensive Security & Invariant Test Suite for POSEHANUM.
 *
 * Verifies:
 *  1. File upload validation & path traversal rejection
 *  2. Image dimension and file size bounds (DoS / decompression bomb protection)
 *  3. Cryptographic safe filename generation
 *  4. Offline mutation queue bounded ring buffer & prototype pollution defense
 *  5. Export data sanitization (ensuring zero tokens/credentials leaked)
 */

import { FileUploadValidator } from '@/features/camera/utils/fileUploadValidator';
import {
  enqueueMutation,
  getOfflineQueue,
  saveOfflineQueue,
} from '@/stores/offlineQueueStore';
import { PrivacyDataServiceImpl } from '@/features/privacy/infrastructure/PrivacyDataServiceImpl';

// Mock dependencies
jest.mock('@/features/favorites/infrastructure/SQLiteFavoritesRepository', () => ({
  SQLiteFavoritesRepository: jest.fn().mockImplementation(() => ({
    findAll: jest.fn().mockResolvedValue([]),
    remove: jest.fn().mockResolvedValue(undefined),
  })),
}));

jest.mock('@/features/auth/infrastructure/FirebaseAuthAdapter', () => ({
  firebaseAuthAdapter: {
    signOut: jest.fn().mockResolvedValue(undefined),
    getCurrentUser: jest.fn().mockReturnValue(null),
    onAuthStateChanged: jest.fn().mockReturnValue(() => {}),
  },
}));

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn().mockResolvedValue(null),
  setItemAsync: jest.fn().mockResolvedValue(undefined),
  deleteItemAsync: jest.fn().mockResolvedValue(undefined),
}));

describe('Defensive Security & Hardening Test Suite', () => {
  describe('FileUploadValidator', () => {
    it('rejects path traversal attempts in image URIs', () => {
      const result = FileUploadValidator.validateImageUpload('../../../etc/passwd');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Path traversal');
    });

    it('rejects URL encoded path traversal attempts', () => {
      const result = FileUploadValidator.validateImageUpload('%2e%2e%2fmalicious.jpg');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Path traversal');
    });

    it('rejects disallowed file extensions (e.g. .exe, .sh, .svg, .html)', () => {
      const result = FileUploadValidator.validateImageUpload('file:///tmp/payload.exe');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Unsupported image format');
    });

    it('rejects oversized files exceeding the size limit (DoS protection)', () => {
      const result = FileUploadValidator.validateImageUpload(
        'file:///tmp/giant.jpg',
        20 * 1024 * 1024, // 20MB > 15MB limit
      );
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('File size exceeds the maximum limit');
    });

    it('rejects images exceeding dimension limits (decompression bomb protection)', () => {
      const result = FileUploadValidator.validateImageUpload(
        'file:///tmp/bomb.jpg',
        1024 * 1024,
        12000, // Width 12000px > 8192px limit
        12000,
      );
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Image dimensions exceed');
    });

    it('generates a safe, randomized filename for valid images', () => {
      const result = FileUploadValidator.validateImageUpload(
        'file:///storage/emulated/0/DCIM/photo.jpg',
        2 * 1024 * 1024,
        1920,
        1080,
        'image/jpeg',
      );
      expect(result.isValid).toBe(true);
      expect(result.sanitizedFilename).toMatch(/^pose_\d+_[a-z0-9]+\.jpg$/);
      expect(result.sanitizedFilename).not.toContain('photo.jpg'); // Strips user-supplied basename
    });
  });

  describe('OfflineQueueStore Security', () => {
    beforeEach(() => {
      saveOfflineQueue([]);
    });

    it('enforces maximum queue size bounds (DoS mitigation)', () => {
      // Enqueue 110 items
      for (let i = 0; i < 110; i++) {
        enqueueMutation('TOGGLE_FAVORITE', { poseId: `pose-${i}`, isFavorite: true });
      }

      const queue = getOfflineQueue();
      expect(queue.length).toBeLessThanOrEqual(100);
    });

    it('rejects payloads with prototype pollution keys', () => {
      const initialLength = getOfflineQueue().length;
      const unsafePayload = JSON.parse('{"__proto__": {"polluted": true}}');

      enqueueMutation('SUBMIT_FEEDBACK', unsafePayload);

      const afterQueue = getOfflineQueue();
      expect(afterQueue.length).toBe(initialLength);
    });
  });

  describe('Data Export Sanitization Invariant', () => {
    it('guarantees that exported user bundles contain no tokens or sensitive auth secrets', async () => {
      const privacyService = PrivacyDataServiceImpl.getInstance();
      const exportBundle = await privacyService.exportUserData();

      const rawExportString = JSON.stringify(exportBundle);

      expect(rawExportString).not.toContain('privateKey');
      expect(rawExportString).not.toContain('idToken');
      expect(rawExportString).not.toContain('accessToken');
      expect(rawExportString).not.toContain('password');
      expect(rawExportString).not.toContain('client_secret');
    });
  });
});
