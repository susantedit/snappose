/**
 * PerformanceService — Safe wrapper around @react-native-firebase/performance.
 *
 * Instruments API call latency, image load times, and custom computation traces.
 * In Expo Go / Web, all calls are no-ops so performance monitoring never breaks the app.
 *
 * Usage:
 *   // Trace an API call
 *   const trace = PerformanceService.startTrace('pose_score_computation');
 *   // ... do work ...
 *   trace?.putMetric('landmark_count', 33);
 *   trace?.stop();
 *
 *   // Instrument an HTTP metric
 *   const metric = PerformanceService.newHttpMetric('https://api.example.com/poses', 'GET');
 *   metric?.start();
 *   // ... fetch ...
 *   metric?.setHttpResponseCode(200);
 *   metric?.setResponseContentType('application/json');
 *   metric?.setResponsePayloadSize(bytes);
 *   metric?.stop();
 */

import { NativeModules, Platform } from 'react-native';

function isNativeFirebaseAvailable(): boolean {
  if (Platform.OS === 'web') return false;
  return Boolean(
    NativeModules &&
    (NativeModules.RNFBAppModule || NativeModules.RNFBPerfModule),
  );
}

let perfInstance: any = undefined;

function getPerf() {
  if (perfInstance !== undefined) return perfInstance;

  if (!isNativeFirebaseAvailable()) {
    perfInstance = null;
    return null;
  }

  try {
    const m = require('@react-native-firebase/perf');
    const fn = m?.default || m;
    perfInstance = typeof fn === 'function' ? fn() : null;
  } catch (err) {
    if (__DEV__) {
      console.warn('[PerformanceService] Firebase Performance not available:', err);
    }
    perfInstance = null;
  }
  return perfInstance;
}

/** A minimal no-op trace so callers don't need to null-check */
const NO_OP_TRACE = {
  start: async () => {},
  stop: async () => {},
  putMetric: (_name: string, _value: number) => {},
  putAttribute: (_name: string, _value: string) => {},
  getMetric: (_name: string) => 0,
};

/** A minimal no-op HTTP metric */
const NO_OP_HTTP_METRIC = {
  start: async () => {},
  stop: async () => {},
  setHttpResponseCode: (_code: number) => {},
  setResponseContentType: (_type: string) => {},
  setResponsePayloadSize: (_size: number) => {},
  setRequestPayloadSize: (_size: number) => {},
};

export const PerformanceService = {
  /**
   * Start a custom trace to measure a block of code execution time.
   * Always returns a trace-like object — no null checks needed on the caller side.
   *
   * @param traceName Descriptive trace name (e.g. 'pose_score_calculation')
   */
  startTrace(traceName: string) {
    try {
      const perf = getPerf();
      if (perf?.startTrace) {
        const trace = perf.newTrace(traceName);
        trace.start().catch(() => {});
        return {
          stop: () => trace.stop().catch(() => {}),
          putMetric: (name: string, value: number) => {
            try { trace.putMetric(name, value); } catch {}
          },
          putAttribute: (name: string, value: string) => {
            try { trace.putAttribute(name, value); } catch {}
          },
          getMetric: (name: string) => {
            try { return trace.getMetric(name); } catch { return 0; }
          },
        };
      }
      if (__DEV__) {
        const startMs = Date.now();
        return {
          stop: () => {
            console.debug(`[Perf:Dev] Trace "${traceName}" took ${Date.now() - startMs}ms`);
          },
          putMetric: (name: string, value: number) => {
            console.debug(`[Perf:Dev] Metric ${name}=${value}`);
          },
          putAttribute: (_name: string, _value: string) => {},
          getMetric: (_name: string) => 0,
        };
      }
      return NO_OP_TRACE;
    } catch {
      return NO_OP_TRACE;
    }
  },

  /**
   * Create an HTTP metric to instrument network request latency and payload sizes.
   * Use in Axios interceptors or fetch wrappers.
   *
   * @param url        Full request URL
   * @param httpMethod HTTP method (GET, POST, etc.)
   */
  newHttpMetric(url: string, httpMethod: string) {
    try {
      const perf = getPerf();
      if (perf?.newHttpMetric) {
        const metric = perf.newHttpMetric(url, httpMethod);
        return {
          start: () => metric.start().catch(() => {}),
          stop: () => metric.stop().catch(() => {}),
          setHttpResponseCode: (code: number) => {
            try { metric.setHttpResponseCode(code); } catch {}
          },
          setResponseContentType: (type: string) => {
            try { metric.setResponseContentType(type); } catch {}
          },
          setResponsePayloadSize: (size: number) => {
            try { metric.setResponsePayloadSize(size); } catch {}
          },
          setRequestPayloadSize: (size: number) => {
            try { metric.setRequestPayloadSize(size); } catch {}
          },
        };
      }
      return NO_OP_HTTP_METRIC;
    } catch {
      return NO_OP_HTTP_METRIC;
    }
  },

  /**
   * Record a one-shot metric value (no start/stop).
   * Useful for recording discrete measurements like image decode time.
   */
  recordMetric(traceName: string, metricName: string, value: number): void {
    try {
      const perf = getPerf();
      if (perf) {
        const trace = perf.newTrace(traceName);
        trace.start()
          .then(() => {
            trace.putMetric(metricName, value);
            return trace.stop();
          })
          .catch(() => {});
      } else if (__DEV__) {
        console.debug(`[Perf:Dev] ${traceName}.${metricName} = ${value}`);
      }
    } catch {}
  },
};
