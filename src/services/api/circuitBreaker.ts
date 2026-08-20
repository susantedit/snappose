/**
 * CircuitBreaker — Fault-Tolerance & Cascading Failure Protection.
 *
 * Prevents slow or failing remote dependencies (e.g. backend sync, cloud endpoints, external APIs)
 * from exhausting app resources, hanging UI threads, or holding open socket connections.
 *
 * States:
 *  - CLOSED: Normal operation. All calls pass through.
 *  - OPEN: Fast-fail immediately with fallback or error without making network calls.
 *  - HALF_OPEN: Trial period allowing a probe call to test if remote dependency has recovered.
 */

export type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

export interface CircuitBreakerOptions {
  failureThreshold?: number;    // Number of failures before tripping (default: 5)
  cooldownPeriodMs?: number;    // Time to wait in OPEN before attempting HALF_OPEN (default: 15,000ms)
  timeoutMs?: number;           // Request execution timeout (default: 5,000ms)
  fallback?: <T>() => T | Promise<T>; // Optional fallback value/handler
}

export class CircuitBreakerOpenError extends Error {
  constructor(message = 'Circuit breaker is OPEN. Dependency unavailable; failing fast.') {
    super(message);
    this.name = 'CircuitBreakerOpenError';
  }
}

export class CircuitBreakerTimeoutError extends Error {
  constructor(message = 'Operation timed out by CircuitBreaker.') {
    super(message);
    this.name = 'CircuitBreakerTimeoutError';
  }
}

export class CircuitBreaker {
  private name: string;
  private state: CircuitState = 'CLOSED';
  private failureCount = 0;
  private successCount = 0;
  private lastFailureTime = 0;
  private failureThreshold: number;
  private cooldownPeriodMs: number;
  private timeoutMs: number;
  private fallback?: <T>() => T | Promise<T>;

  constructor(name: string, options: CircuitBreakerOptions = {}) {
    this.name = name;
    this.failureThreshold = options.failureThreshold ?? 5;
    this.cooldownPeriodMs = options.cooldownPeriodMs ?? 15000;
    this.timeoutMs = options.timeoutMs ?? 5000;
    this.fallback = options.fallback;
  }

  public getState(): CircuitState {
    if (this.state === 'OPEN') {
      const now = Date.now();
      if (now - this.lastFailureTime >= this.cooldownPeriodMs) {
        this.state = 'HALF_OPEN';
      }
    }
    return this.state;
  }

  public getFailureCount(): number {
    return this.failureCount;
  }

  public reset(): void {
    this.state = 'CLOSED';
    this.failureCount = 0;
    this.successCount = 0;
    this.lastFailureTime = 0;
  }

  public async execute<T>(action: () => Promise<T>, customFallback?: () => T | Promise<T>): Promise<T> {
    const currentState = this.getState();

    if (currentState === 'OPEN') {
      if (customFallback) {
        return await customFallback();
      }
      if (this.fallback) {
        return await (this.fallback as () => Promise<T>)();
      }
      throw new CircuitBreakerOpenError(`[${this.name}] Circuit is OPEN. Remote dependency is down.`);
    }

    try {
      // Execute with timeout race
      const result = await Promise.race([
        action(),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new CircuitBreakerTimeoutError(`[${this.name}] Request timed out after ${this.timeoutMs}ms`)), this.timeoutMs)
        ),
      ]);

      this.onSuccess();
      return result;
    } catch (err) {
      this.onFailure();
      if (customFallback) {
        return await customFallback();
      }
      if (this.fallback) {
        return await (this.fallback as () => Promise<T>)();
      }
      throw err;
    }
  }

  private onSuccess(): void {
    if (this.state === 'HALF_OPEN') {
      this.successCount++;
      if (this.successCount >= 2) {
        this.reset();
      }
    } else {
      this.failureCount = 0;
    }
  }

  private onFailure(): void {
    this.lastFailureTime = Date.now();
    this.failureCount++;

    if (this.state === 'HALF_OPEN' || this.failureCount >= this.failureThreshold) {
      this.state = 'OPEN';
      this.successCount = 0;
    }
  }
}

// Pre-configured shared circuit breakers
export const apiCircuitBreaker = new CircuitBreaker('SnapPoseApiGateway', {
  failureThreshold: 4,
  cooldownPeriodMs: 12000,
  timeoutMs: 6000,
});
