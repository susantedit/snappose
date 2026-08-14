/**
 * Unit tests for OverlayTransformEngine.
 * All pure functions — no React Native imports needed.
 * [Req 9.2, 9.3, 9.4, 9.5]
 */

import {
  DEFAULT_OVERLAY_TRANSFORM,
  MIN_SCALE,
  MAX_SCALE,
  MIN_ROTATION,
  MAX_ROTATION,
  applyPan,
  applyPinch,
  applyRotation,
  applyOpacity,
  applyMirror,
  resetTransform,
  toggleLock,
} from '../OverlayTransformEngine';
import type { OverlayTransform } from '@/features/camera/types';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeTransform(overrides: Partial<OverlayTransform> = {}): OverlayTransform {
  return { ...DEFAULT_OVERLAY_TRANSFORM, ...overrides };
}

// ---------------------------------------------------------------------------
// applyPan
// ---------------------------------------------------------------------------

describe('applyPan', () => {
  it('moves x and y by the given deltas', () => {
    const t = makeTransform({ x: 10, y: 20 });
    const result = applyPan(t, 5, -8);
    expect(result.x).toBe(15);
    expect(result.y).toBe(12);
  });

  it('does not mutate the input transform', () => {
    const t = makeTransform({ x: 0, y: 0 });
    applyPan(t, 10, 10);
    expect(t.x).toBe(0);
    expect(t.y).toBe(0);
  });

  it('has no effect when locked', () => {
    const t = makeTransform({ x: 0, y: 0, locked: true });
    const result = applyPan(t, 50, 50);
    expect(result).toBe(t); // same reference — locked returns t unchanged
  });

  it('preserves all other fields', () => {
    const t = makeTransform({ scale: 1.5, rotation: 0.3, opacity: 70, mirrored: true });
    const result = applyPan(t, 1, 1);
    expect(result.scale).toBe(1.5);
    expect(result.rotation).toBe(0.3);
    expect(result.opacity).toBe(70);
    expect(result.mirrored).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// applyPinch — clamping is the critical behaviour [Req 9.2]
// ---------------------------------------------------------------------------

describe('applyPinch', () => {
  it('multiplies the current scale by the factor', () => {
    const t = makeTransform({ scale: 1.0 });
    const result = applyPinch(t, 1.5);
    expect(result.scale).toBeCloseTo(1.5);
  });

  it('clamps scale minimum to MIN_SCALE (0.25)', () => {
    const t = makeTransform({ scale: 0.3 });
    // Factor that would push below minimum
    const result = applyPinch(t, 0.1);
    expect(result.scale).toBe(MIN_SCALE);
  });

  it('clamps scale maximum to MAX_SCALE (2.5)', () => {
    const t = makeTransform({ scale: 2.4 });
    // Factor that would push above maximum
    const result = applyPinch(t, 2.0);
    expect(result.scale).toBe(MAX_SCALE);
  });

  it('stays at exactly MIN_SCALE when factor would go below', () => {
    const t = makeTransform({ scale: MIN_SCALE });
    const result = applyPinch(t, 0.5);
    expect(result.scale).toBe(MIN_SCALE);
  });

  it('stays at exactly MAX_SCALE when factor would go above', () => {
    const t = makeTransform({ scale: MAX_SCALE });
    const result = applyPinch(t, 2.0);
    expect(result.scale).toBe(MAX_SCALE);
  });

  it('does not mutate the input transform', () => {
    const t = makeTransform({ scale: 1.0 });
    applyPinch(t, 1.5);
    expect(t.scale).toBe(1.0);
  });

  it('has no effect when locked', () => {
    const t = makeTransform({ scale: 1.0, locked: true });
    const result = applyPinch(t, 2.0);
    expect(result).toBe(t);
  });
});

// ---------------------------------------------------------------------------
// applyRotation — clamping is the critical behaviour [Req 9.2]
// ---------------------------------------------------------------------------

describe('applyRotation', () => {
  it('adds the delta to the current rotation', () => {
    const t = makeTransform({ rotation: 0.5 });
    const result = applyRotation(t, 0.3);
    expect(result.rotation).toBeCloseTo(0.8);
  });

  it('clamps rotation to MIN_ROTATION (-π)', () => {
    const t = makeTransform({ rotation: -Math.PI + 0.1 });
    const result = applyRotation(t, -1.0); // pushes below -π
    expect(result.rotation).toBe(MIN_ROTATION);
  });

  it('clamps rotation to MAX_ROTATION (+π)', () => {
    const t = makeTransform({ rotation: Math.PI - 0.1 });
    const result = applyRotation(t, 1.0); // pushes above +π
    expect(result.rotation).toBe(MAX_ROTATION);
  });

  it('stays at exactly MIN_ROTATION (-π) when already at minimum', () => {
    const t = makeTransform({ rotation: MIN_ROTATION });
    const result = applyRotation(t, -0.5);
    expect(result.rotation).toBe(MIN_ROTATION);
  });

  it('stays at exactly MAX_ROTATION (+π) when already at maximum', () => {
    const t = makeTransform({ rotation: MAX_ROTATION });
    const result = applyRotation(t, 0.5);
    expect(result.rotation).toBe(MAX_ROTATION);
  });

  it('does not mutate the input transform', () => {
    const t = makeTransform({ rotation: 0 });
    applyRotation(t, 1.0);
    expect(t.rotation).toBe(0);
  });

  it('has no effect when locked', () => {
    const t = makeTransform({ rotation: 0, locked: true });
    const result = applyRotation(t, Math.PI);
    expect(result).toBe(t);
  });
});

// ---------------------------------------------------------------------------
// resetTransform — must return a COPY equal to defaults [Req 9.5]
// ---------------------------------------------------------------------------

describe('resetTransform', () => {
  it('returns a value equal to DEFAULT_OVERLAY_TRANSFORM', () => {
    const result = resetTransform();
    expect(result).toEqual(DEFAULT_OVERLAY_TRANSFORM);
  });

  it('returns a new object (not the same reference as DEFAULT_OVERLAY_TRANSFORM)', () => {
    const result = resetTransform();
    expect(result).not.toBe(DEFAULT_OVERLAY_TRANSFORM);
  });

  it('returns a new object each call (not the same reference)', () => {
    const a = resetTransform();
    const b = resetTransform();
    expect(a).not.toBe(b);
  });

  it('returned copy can be mutated without affecting DEFAULT_OVERLAY_TRANSFORM', () => {
    const result = resetTransform();
    (result as OverlayTransform & { x: number }).x = 999;
    // DEFAULT_OVERLAY_TRANSFORM must remain unchanged
    expect(DEFAULT_OVERLAY_TRANSFORM.x).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// toggleLock — flips locked flag [Req 9.4]
// ---------------------------------------------------------------------------

describe('toggleLock', () => {
  it('sets locked to true when it was false', () => {
    const t = makeTransform({ locked: false });
    const result = toggleLock(t);
    expect(result.locked).toBe(true);
  });

  it('sets locked to false when it was true', () => {
    const t = makeTransform({ locked: true });
    const result = toggleLock(t);
    expect(result.locked).toBe(false);
  });

  it('does not mutate the input transform', () => {
    const t = makeTransform({ locked: false });
    toggleLock(t);
    expect(t.locked).toBe(false);
  });

  it('preserves all other fields', () => {
    const t = makeTransform({ x: 10, y: 20, scale: 1.5, rotation: 0.5, opacity: 80, mirrored: true });
    const result = toggleLock(t);
    expect(result.x).toBe(10);
    expect(result.y).toBe(20);
    expect(result.scale).toBe(1.5);
    expect(result.rotation).toBe(0.5);
    expect(result.opacity).toBe(80);
    expect(result.mirrored).toBe(true);
  });

  it('double-toggle returns locked to original state', () => {
    const t = makeTransform({ locked: false });
    const result = toggleLock(toggleLock(t));
    expect(result.locked).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// applyOpacity
// ---------------------------------------------------------------------------

describe('applyOpacity', () => {
  it('sets opacity to the given value within range', () => {
    const t = makeTransform({ opacity: 55 });
    const result = applyOpacity(t, 80);
    expect(result.opacity).toBe(80);
  });

  it('clamps opacity to 0 for values below 0', () => {
    const t = makeTransform({ opacity: 55 });
    const result = applyOpacity(t, -10);
    expect(result.opacity).toBe(0);
  });

  it('clamps opacity to 100 for values above 100', () => {
    const t = makeTransform({ opacity: 55 });
    const result = applyOpacity(t, 150);
    expect(result.opacity).toBe(100);
  });
});

// ---------------------------------------------------------------------------
// applyMirror
// ---------------------------------------------------------------------------

describe('applyMirror', () => {
  it('sets mirrored to true', () => {
    const t = makeTransform({ mirrored: false });
    const result = applyMirror(t, true);
    expect(result.mirrored).toBe(true);
  });

  it('sets mirrored to false', () => {
    const t = makeTransform({ mirrored: true });
    const result = applyMirror(t, false);
    expect(result.mirrored).toBe(false);
  });

  it('does not mutate the input', () => {
    const t = makeTransform({ mirrored: false });
    applyMirror(t, true);
    expect(t.mirrored).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// DEFAULT_OVERLAY_TRANSFORM — smoke check
// ---------------------------------------------------------------------------

describe('DEFAULT_OVERLAY_TRANSFORM', () => {
  it('has x=0, y=0, scale=1, rotation=0, opacity=55, locked=false, mirrored=false', () => {
    expect(DEFAULT_OVERLAY_TRANSFORM.x).toBe(0);
    expect(DEFAULT_OVERLAY_TRANSFORM.y).toBe(0);
    expect(DEFAULT_OVERLAY_TRANSFORM.scale).toBe(1);
    expect(DEFAULT_OVERLAY_TRANSFORM.rotation).toBe(0);
    expect(DEFAULT_OVERLAY_TRANSFORM.opacity).toBe(55);
    expect(DEFAULT_OVERLAY_TRANSFORM.locked).toBe(false);
    expect(DEFAULT_OVERLAY_TRANSFORM.mirrored).toBe(false);
  });
});
