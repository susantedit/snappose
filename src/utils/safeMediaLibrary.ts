import * as MediaLibrary from 'expo-media-library';
import { useState, useEffect, useCallback } from 'react';

/**
 * Safely get MediaLibrary permissions without throwing uncaught rejections in Expo Go (Android).
 */
export async function getSafeMediaLibraryPermission(): Promise<MediaLibrary.PermissionResponse> {
  try {
    return await MediaLibrary.getPermissionsAsync();
  } catch (error) {
    console.warn('[MediaLibrary] getPermissionsAsync unavailable/restricted (e.g. Expo Go Android):', error);
    return {
      status: MediaLibrary.PermissionStatus.GRANTED,
      granted: true,
      canAskAgain: true,
      expires: 'never',
    };
  }
}

/**
 * Safely request MediaLibrary permissions without throwing uncaught rejections in Expo Go (Android).
 */
export async function requestSafeMediaLibraryPermission(
  writeOnly = false,
  granularPermissions?: MediaLibrary.GranularPermission[]
): Promise<MediaLibrary.PermissionResponse> {
  try {
    return await MediaLibrary.requestPermissionsAsync(writeOnly, granularPermissions);
  } catch (error) {
    console.warn('[MediaLibrary] requestPermissionsAsync unavailable/restricted (e.g. Expo Go Android):', error);
    return {
      status: MediaLibrary.PermissionStatus.GRANTED,
      granted: true,
      canAskAgain: true,
      expires: 'never',
    };
  }
}

/**
 * React hook replacement for MediaLibrary.usePermissions that avoids uncaught promise rejections on Expo Go Android.
 */
export function useSafeMediaPermissions(options?: Parameters<typeof MediaLibrary.usePermissions>[0]) {
  const [permission, setPermission] = useState<MediaLibrary.PermissionResponse | null>(null);

  const requestPermission = useCallback(async () => {
    const res = await requestSafeMediaLibraryPermission(
      options?.writeOnly,
      options?.granularPermissions
    );
    setPermission(res);
    return res;
  }, [options?.writeOnly, options?.granularPermissions]);

  useEffect(() => {
    let isMounted = true;
    getSafeMediaLibraryPermission().then((res) => {
      if (isMounted) {
        setPermission(res);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  return [permission, requestPermission] as const;
}

/**
 * Safely save to photo library without failing execution flows.
 */
export async function saveToLibraryAsyncSafe(localUri: string): Promise<boolean> {
  try {
    await MediaLibrary.saveToLibraryAsync(localUri);
    return true;
  } catch (error) {
    console.warn('[MediaLibrary] saveToLibraryAsync failed (e.g. Expo Go Android):', error);
    return false;
  }
}
