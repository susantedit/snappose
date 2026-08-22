/**
 * CircuitBreaker — Resilience pattern for external network dependencies.
 *
 * Prevents cascading slowness or failures from dragging down the application.
 * States:
 *  - CLOSED: Requests pass through normally.
 *  - OPEN: Requests fail fast immediately or return fallback result.
 *  - HALF_OPEN: Trial state after resetTimeout to test if dependency recovered.
 */

export type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

export interface CircuitBreakerOptions {
  failureThreshold?: number; // Number of consecutive failures before tripping (default: 3)
  resetTimeoutMs?: number;   // Time in ms before testing recovery (default: 10000ms)
  requestTimeoutMs?: number; // Timeout for individual request in ms (default: 4000ms)
}

export class CircuitBreaker {
  private state: CircuitState = 'CLOSED';
  private failureCount = 0;
  private nextAttempt = Date.now();
  private readonly failureThreshold: number;
  private readonly resetTimeoutMs: number;
  private readonly requestTimeoutMs: number;

  constructor(options: CircuitBreakerOptions = {}) {
    this.failureThreshold = options.failureThreshold ?? 3;
    this.resetTimeoutMs = options.resetTimeoutMs ?? 10000;
    this.requestTimeoutMs = options.requestTimeoutMs ?? 4000;
  }

  public getState(): CircuitState {
    if (this.state === 'OPEN' && Date.now() >= this.nextAttempt) {
      this.state = 'HALF_OPEN';
    }
    return this.state;
  }

  public async execute<T>(
    requestFn: () => Promise<T>,
    fallbackFn?: () => T | Promise<T>
  ): Promise<T> {
    const currentState = this.getState();

    if (currentState === 'OPEN') {
      console.warn('[CircuitBreaker] Circuit is OPEN — fast failing to fallback.');
      if (fallbackFn) return await fallbackFn();
      throw new Error('CircuitBreaker: Service unavailable (circuit open)');
    }

    try {
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('CircuitBreaker: Request timed out')), this.requestTimeoutMs);
      });

      const response = await Promise.race([requestFn(), timeoutPromise]);
      this.onSuccess();
      return response;
    } catch (err) {
      this.onFailure();
      if (fallbackFn) {
        console.warn('[CircuitBreaker] Request failed — returning fallback response:', err);
        return await fallbackFn();
      }
      throw err;
    }
  }

  private onSuccess(): void {
    this.failureCount = 0;
    this.state = 'CLOSED';
  }

  private onFailure(): void {
    this.failureCount += 1;
    if (this.failureCount >= this.failureThreshold || this.state === 'HALF_OPEN') {
      this.state = 'OPEN';
      this.nextAttempt = Date.now() + this.resetTimeoutMs;
      console.warn(`[CircuitBreaker] Failure threshold met. Tripping circuit to OPEN for ${this.resetTimeoutMs}ms`);
    }
  }
}
