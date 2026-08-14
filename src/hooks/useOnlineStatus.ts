/**
 * useOnlineStatus — lightweight connectivity hook.
 *
 * Since neither @react-native-community/netinfo nor expo-network is installed,
 * we poll a lightweight HEAD request to detect online/offline state.
 * Falls back gracefully so the app never crashes on network errors.
 *
 * [Req 4.4]
 */

import { useEffect, useRef, useState } from 'react';
import { AppState, type AppStateStatus } from 'react-native';

const PROBE_URL = 'https://clients3.google.com/generate_204';
const POLL_INTERVAL_MS = 10_000; // recheck every 10 s when active
const PROBE_TIMEOUT_MS = 5_000;

async function probeConnectivity(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), PROBE_TIMEOUT_MS);
    const res = await fetch(PROBE_URL, {
      method: 'HEAD',
      cache: 'no-store',
      signal: controller.signal,
    });
    clearTimeout(timer);
    return res.status === 204 || res.ok;
  } catch {
    return false;
  }
}

export function useOnlineStatus(): boolean {
  const [isOnline, setIsOnline] = useState(true); // optimistic start
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);

  const check = () => {
    probeConnectivity().then((online) => {
      setIsOnline(online);
    });
  };

  useEffect(() => {
    // Initial check
    check();

    // Poll while app is active
    intervalRef.current = setInterval(() => {
      if (appStateRef.current === 'active') {
        check();
      }
    }, POLL_INTERVAL_MS);

    const sub = AppState.addEventListener('change', (nextState) => {
      appStateRef.current = nextState;
      if (nextState === 'active') {
        // Immediate recheck when app comes to foreground
        check();
      }
    });

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      sub.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return isOnline;
}
