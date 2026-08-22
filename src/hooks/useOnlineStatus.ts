/**
 * useOnlineStatus & useNetworkState — Robust network state monitoring hooks.
 *
 * Implements tri-state connection status: 'ONLINE' | 'OFFLINE' | 'CONNECTING'.
 * Listens to AppState changes and performs throttled probes with timeout protection.
 * Never throws errors or crashes during network disconnects.
 *
 * [Req 4.4, Part 6]
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { AppState, type AppStateStatus } from 'react-native';

export type NetworkState = 'ONLINE' | 'OFFLINE' | 'CONNECTING';

const PROBE_URL = 'https://clients3.google.com/generate_204';
const POLL_INTERVAL_MS = 15_000; // recheck every 15s when active
const PROBE_TIMEOUT_MS = 3_000;

async function probeConnectivity(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), PROBE_TIMEOUT_MS);
    const res = await fetch(PROBE_URL, {
      method: 'HEAD',
      cache: 'no-store',
      signal: controller.signal as any,
    });
    clearTimeout(timer);
    return res.status === 204 || res.ok;
  } catch {
    return false;
  }
}

/**
 * Returns 'ONLINE' | 'OFFLINE' | 'CONNECTING' tri-state network status.
 */
export function useNetworkState(): NetworkState {
  const [networkState, setNetworkState] = useState<NetworkState>('ONLINE');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);

  const check = useCallback(async () => {
    setNetworkState((prev) => (prev === 'OFFLINE' ? 'CONNECTING' : prev));
    const online = await probeConnectivity();
    setNetworkState(online ? 'ONLINE' : 'OFFLINE');
  }, []);

  useEffect(() => {
    check();

    intervalRef.current = setInterval(() => {
      if (appStateRef.current === 'active') {
        check();
      }
    }, POLL_INTERVAL_MS);

    const sub = AppState.addEventListener('change', (nextState) => {
      appStateRef.current = nextState;
      if (nextState === 'active') {
        check();
      }
    });

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      sub.remove();
    };
  }, [check]);

  return networkState;
}

/**
 * Backwards-compatible boolean online status hook.
 */
export function useOnlineStatus(): boolean {
  const state = useNetworkState();
  return state === 'ONLINE';
}
