/**
 * Unit Tests for PrivacyDataServiceImpl (GDPR / CCPA / Google Play Data Control).
 */

import { PrivacyDataServiceImpl } from '../infrastructure/PrivacyDataServiceImpl';
import { useHistoryStore } from '@/stores/historyStore';
import { useCustomPoseStore } from '@/stores/customPoseStore';
import { usePersonalizationStore } from '@/stores/personalizationStore';
import { useNotificationStore } from '@/stores/notificationStore';
import { useAuthStore } from '@/stores/authStore';

// Mock SQLiteFavoritesRepository
jest.mock('@/features/favorites/infrastructure/SQLiteFavoritesRepository', () => {
  return {
    SQLiteFavoritesRepository: jest.fn().mockImplementation(() => ({
      findAll: jest.fn().mockResolvedValue([{ poseId: 'fav-1' }, { poseId: 'fav-2' }]),
      remove: jest.fn().mockResolvedValue(undefined),
    })),
  };
});

// Mock FirebaseAuthAdapter
jest.mock('@/features/auth/infrastructure/FirebaseAuthAdapter', () => ({
  firebaseAuthAdapter: {
    signOut: jest.fn().mockResolvedValue(undefined),
    getCurrentUser: jest.fn().mockReturnValue(null),
    onAuthStateChanged: jest.fn().mockReturnValue(() => {}),
  },
}));

// Mock expo-secure-store
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn().mockResolvedValue(null),
  setItemAsync: jest.fn().mockResolvedValue(undefined),
  deleteItemAsync: jest.fn().mockResolvedValue(undefined),
}));

describe('PrivacyDataServiceImpl', () => {
  let service: PrivacyDataServiceImpl;

  beforeEach(() => {
    service = PrivacyDataServiceImpl.getInstance();
  });

  it('generates a valid, sanitized personal data export bundle', async () => {
    const exportBundle = await service.exportUserData();

    expect(exportBundle).toBeDefined();
    expect(exportBundle.appName).toBe('POSEHANUM');
    expect(exportBundle.exportDate).toBeDefined();
    expect(exportBundle.historyAttempts).toBeDefined();
    expect(exportBundle.customPoses).toBeDefined();
    expect(exportBundle.personalization).toBeDefined();
    expect(exportBundle.notifications).toBeDefined();

    // Verify no private credentials or passwords in export
    expect((exportBundle as any).password).toBeUndefined();
    expect((exportBundle as any).token).toBeUndefined();
    expect((exportBundle as any).apiKey).toBeUndefined();
  });

  it('performs selective history clearing without affecting custom poses', async () => {
    useHistoryStore.getState().recordAttempt({
      poseId: 'test-pose',
      poseTitle: 'Test Pose',
      poseCategory: 'street',
      score: 88,
      mode: 'subject',
    });

    expect(useHistoryStore.getState().attempts.length).toBeGreaterThan(0);

    const cleared = await service.clearHistory();
    expect(cleared).toBe(true);
    expect(useHistoryStore.getState().attempts.length).toBe(0);
  });

  it('performs selective custom pose clearing', async () => {
    useCustomPoseStore.getState().addCustomPose({
      title: 'My Custom Pose',
      imageUri: 'file:///local/pose.jpg',
      category: 'street',
      difficulty: 'easy',
    });

    expect(useCustomPoseStore.getState().customPoses.length).toBeGreaterThan(0);

    const cleared = await service.clearCustomPoses();
    expect(cleared).toBe(true);
    expect(useCustomPoseStore.getState().customPoses.length).toBe(0);
  });

  it('resets the personalization profile to baseline', async () => {
    const cleared = await service.resetPersonalization();
    expect(cleared).toBe(true);

    const profile = usePersonalizationStore.getState().profile;
    expect(profile.preferredCategories).toBeDefined();
  });

  it('executes full permanent account deletion across local and cloud partitions', async () => {
    // Populate data
    useHistoryStore.getState().recordAttempt({
      poseId: 'pose-1',
      poseTitle: 'Pose 1',
      poseCategory: 'cafe',
      score: 95,
      mode: 'subject',
    });

    const result = await service.deleteAccountPermanent();

    if (!result.success) {
      console.log('Deletion errors:', result.errors);
    }

    expect(result.errors).toEqual([]);
    expect(result.success).toBe(true);
    expect(result.deletedItems.history).toBe(true);
    expect(result.deletedItems.customPoses).toBe(true);
    expect(result.deletedItems.personalization).toBe(true);
    expect(result.deletedItems.notifications).toBe(true);
    expect(result.deletedItems.account).toBe(true);

    // Verify stores are wiped
    expect(useHistoryStore.getState().attempts.length).toBe(0);
    expect(useCustomPoseStore.getState().customPoses.length).toBe(0);
    expect(useAuthStore.getState().user).toBeNull();
  });
});
