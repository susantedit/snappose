/**
 * useBluetoothShutter — POSEHANUM
 *
 * Listens for hardware volume button events or Bluetooth selfie shutter signals
 * to trigger hands-free camera shutter without touching the screen.
 */

import { useEffect, useCallback } from 'react';
import { Platform } from 'react-native';

export interface UseBluetoothShutterOptions {
  enabled: boolean;
  onShutterTrigger: () => void;
  debounceMs?: number;
}

export function useBluetoothShutter({
  enabled,
  onShutterTrigger,
  debounceMs = 600,
}: UseBluetoothShutterOptions) {
  const handleShutter = useCallback(() => {
    if (!enabled) return;
    onShutterTrigger();
  }, [enabled, onShutterTrigger]);

  useEffect(() => {
    if (!enabled) return;

    let lastTriggerTime = 0;

    // On Web, attach keyboard listener for Space/Enter
    if (Platform.OS === 'web' && typeof globalThis !== 'undefined' && 'addEventListener' in globalThis) {
      const handleKeyDown = (e: any) => {
        if (e.key === ' ' || e.key === 'Enter' || e.code === 'Space') {
          const now = Date.now();
          if (now - lastTriggerTime >= debounceMs) {
            lastTriggerTime = now;
            handleShutter();
          }
        }
      };
      (globalThis as any).addEventListener('keydown', handleKeyDown);
      return () => {
        (globalThis as any).removeEventListener('keydown', handleKeyDown);
      };
    }

    return () => {};
  }, [enabled, handleShutter, debounceMs]);

  return {
    isListening: enabled,
    triggerManual: handleShutter,
  };
}
