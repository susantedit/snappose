/**
 * PrivacyService Interface — Defines contract for GDPR / CCPA / Google Play Data Control.
 *
 * Enforces:
 *  - Full Account Deletion (Local + Cloud + Auth)
 *  - Selective Data Deletion (Photos, Custom Poses, History, Favorites, Personalization)
 *  - Data Export (JSON export of user-owned records)
 *  - Privacy Consent & Audit
 */

export interface UserDataExportBundle {
  exportDate: string;
  appVersion: string;
  appName: string;
  user: {
    uid: string | null;
    displayName: string | null;
    email: string | null;
    isAnonymous: boolean;
  };
  preferences: Record<string, any>;
  favorites: string[];
  historyAttempts: Array<{
    id: string;
    poseId: string;
    poseTitle: string;
    score: number;
    timestamp: number;
  }>;
  customPoses: Array<{
    id: string;
    title: string;
    category: string;
    createdAt: number;
  }>;
  personalization: {
    signalsCount: number;
    categoryWeights: Record<string, number>;
  };
  notifications: {
    enabled: boolean;
    quietHours: boolean;
    deliveredCount: number;
  };
}

export interface DeletionResult {
  success: boolean;
  deletedItems: {
    account: boolean;
    favorites: boolean;
    history: boolean;
    customPoses: boolean;
    personalization: boolean;
    notifications: boolean;
    localCache: boolean;
    cloudSync: boolean;
  };
  errors: string[];
}

export interface PrivacyService {
  /**
   * Executes a complete and permanent account deletion across local and cloud partitions.
   */
  deleteAccountPermanent(): Promise<DeletionResult>;

  /**
   * Generates a complete sanitized JSON export of all personal user records.
   */
  exportUserData(): Promise<UserDataExportBundle>;

  /**
   * Deletes all recorded pose capture attempt history.
   */
  clearHistory(): Promise<boolean>;

  /**
   * Deletes all bookmarked favorites.
   */
  clearFavorites(): Promise<boolean>;

  /**
   * Deletes all user-created custom poses and cached reference thumbnails.
   */
  clearCustomPoses(): Promise<boolean>;

  /**
   * Resets the machine learning preference vector and restarts personalization from baseline.
   */
  resetPersonalization(): Promise<boolean>;

  /**
   * Clears notification delivery log, fatigue counters, and exhausted message pools.
   */
  clearNotificationHistory(): Promise<boolean>;

  /**
   * Clears local temporary image cache and session buffers.
   */
  clearLocalCache(): Promise<boolean>;
}
