/**
 * usePrivacyData — React Hook providing GDPR / Google Play Data Control actions.
 */

import { useState, useCallback } from 'react';
import { Share } from 'react-native';
import { privacyDataService } from '../infrastructure/PrivacyDataServiceImpl';
import type { DeletionResult, UserDataExportBundle } from '../domain/interfaces/PrivacyService';

export function usePrivacyData() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastExport, setLastExport] = useState<UserDataExportBundle | null>(null);

  const deleteAccountPermanent = useCallback(async (): Promise<DeletionResult> => {
    setIsProcessing(true);
    try {
      const result = await privacyDataService.deleteAccountPermanent();
      return result;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const exportUserData = useCallback(async (): Promise<UserDataExportBundle | null> => {
    setIsProcessing(true);
    try {
      const data = await privacyDataService.exportUserData();
      setLastExport(data);

      // Trigger native share dialog with formatted JSON string
      const jsonString = JSON.stringify(data, null, 2);
      await Share.share({
        title: 'POSEHANUM Personal Data Export',
        message: jsonString,
      });

      return data;
    } catch (err) {
      console.warn('[usePrivacyData] Export failed:', err);
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const clearHistory = useCallback(async () => {
    return privacyDataService.clearHistory();
  }, []);

  const clearFavorites = useCallback(async () => {
    return privacyDataService.clearFavorites();
  }, []);

  const clearCustomPoses = useCallback(async () => {
    return privacyDataService.clearCustomPoses();
  }, []);

  const resetPersonalization = useCallback(async () => {
    return privacyDataService.resetPersonalization();
  }, []);

  const clearNotificationHistory = useCallback(async () => {
    return privacyDataService.clearNotificationHistory();
  }, []);

  return {
    isProcessing,
    lastExport,
    deleteAccountPermanent,
    exportUserData,
    clearHistory,
    clearFavorites,
    clearCustomPoses,
    resetPersonalization,
    clearNotificationHistory,
  };
}
