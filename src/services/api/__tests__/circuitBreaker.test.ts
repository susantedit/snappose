import { CircuitBreaker, CircuitBreakerOpenError } from '../circuitBreaker';

describe('CircuitBreaker', () => {
  it('should start in CLOSED state and execute actions successfully', async () => {
    const breaker = new CircuitBreaker('TestBreaker', { failureThreshold: 3, timeoutMs: 1000 });
    expect(breaker.getState()).toBe('CLOSED');

    const result = await breaker.execute(async () => 'success_value');
    expect(result).toBe('success_value');
    expect(breaker.getState()).toBe('CLOSED');
  });

  it('should transition to OPEN state after reaching failure threshold', async () => {
    const breaker = new CircuitBreaker('FailBreaker', {
      failureThreshold: 2,
      cooldownPeriodMs: 500,
      timeoutMs: 1000,
    });

    const failingAction = async () => {
      throw new Error('Network failure');
    };

    // 1st failure
    await expect(breaker.execute(failingAction)).rejects.toThrow('Network failure');
    expect(breaker.getState()).toBe('CLOSED');

    // 2nd failure -> trips breaker
    await expect(breaker.execute(failingAction)).rejects.toThrow('Network failure');
    expect(breaker.getState()).toBe('OPEN');

    // Subsequent calls fast-fail immediately without calling action
    let called = false;
    await expect(
      breaker.execute(async () => {
        called = true;
        return 'should_not_run';
      })
    ).rejects.toBeInstanceOf(CircuitBreakerOpenError);

    expect(called).toBe(false);
  });

  it('should use fallback when provided during OPEN or failure state', async () => {
    const breaker = new CircuitBreaker('FallbackBreaker', {
      failureThreshold: 1,
      cooldownPeriodMs: 1000,
      fallback: () => 'default_fallback',
    });

    // Failing call triggers fallback
    const result = await breaker.execute(async () => {
      throw new Error('DB Down');
    });
    expect(result).toBe('default_fallback');
    expect(breaker.getState()).toBe('OPEN');

    // When OPEN, fallback is served immediately
    const fastFallback = await breaker.execute(async () => 'ignored');
    expect(fastFallback).toBe('default_fallback');
  });
});
