/**
 * useAutoCapture — Real-time auto-capture state machine hook.
 *
 * Integrates AutoCaptureEngine with camera store and triggers
 * auto-capture countdown and capture callback when all gates pass.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  AutoCaptureEngine,
  type AutoCaptureConfig,
  type AutoCaptureGates,
  type CountdownState,
} from '../domain/AutoCaptureEngine';

export interface UseAutoCaptureOptions {
  config?: Partial<AutoCaptureConfig>;
  onCapture: () => void;
  enabled?: boolean;
}

export function useAutoCapture({
  config,
  onCapture,
  enabled = true,
}: UseAutoCaptureOptions) {
  const [countdownState, setCountdownState] = useState<CountdownState>({ phase: 'idle' });
  const engineRef = useRef<AutoCaptureEngine | null>(null);

  if (!engineRef.current) {
    engineRef.current = new AutoCaptureEngine(config);
  }

  useEffect(() => {
    if (config && engineRef.current) {
      engineRef.current.updateConfig(config);
    }
  }, [config]);

  useEffect(() => {
    const engine = engineRef.current;
    if (!engine) return;

    engine.onCountdownChange((state: CountdownState) => {
      setCountdownState(state);
    });

    engine.onCapture(() => {
      if (enabled) {
        onCapture();
      }
    });

    return () => {
      engine.reset();
    };
  }, [onCapture, enabled]);

  const tick = useCallback(
    (gates: AutoCaptureGates) => {
      if (!enabled) {
        if (countdownState.phase !== 'idle') {
          engineRef.current?.reset();
          setCountdownState({ phase: 'idle' });
        }
        return;
      }
      engineRef.current?.tick(gates);
    },
    [enabled, countdownState.phase],
  );

  const cancel = useCallback(() => {
    engineRef.current?.reset();
    setCountdownState({ phase: 'idle' });
  }, []);

  return {
    countdownState,
    tick,
    cancel,
    isCounting: countdownState.phase === 'counting',
    remainingSeconds: countdownState.phase === 'counting' ? countdownState.remaining : 0,
  };
}
