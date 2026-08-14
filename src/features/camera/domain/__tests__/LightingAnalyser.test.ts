/**
 * Unit tests for LightingAnalyser.
 * [Req 15]
 */

import { analyseFrame, scoreFromMetrics } from '../LightingAnalyser';
import type { LightingAnalysisResult } from '../LightingAnalyser';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Build an RGBA pixel buffer with a uniform luminance value. */
function makeUniformPixels(luminance: number, width = 4, height = 4): Uint8Array {
  const pixels = new Uint8Array(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    pixels[i * 4] = luminance;     // R
    pixels[i * 4 + 1] = luminance; // G
    pixels[i * 4 + 2] = luminance; // B
    pixels[i * 4 + 3] = 255;       // A
  }
  return pixels;
}

/** Build pixels where 50% are very bright (backlit simulation). */
function makeBacklitPixels(width = 4, height = 4): Uint8Array {
  const pixels = new Uint8Array(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    const bright = i % 2 === 0;
    const val = bright ? 240 : 60;
    pixels[i * 4] = val;
    pixels[i * 4 + 1] = val;
    pixels[i * 4 + 2] = val;
    pixels[i * 4 + 3] = 255;
  }
  return pixels;
}

// ---------------------------------------------------------------------------
// analyseFrame — empty / degenerate inputs
// ---------------------------------------------------------------------------

describe('analyseFrame — degenerate inputs', () => {
  it('returns score 50 for empty pixel array', () => {
    const result = analyseFrame(new Uint8Array(0), 0, 0);
    expect(result.score).toBe(50);
  });

  it('returns acceptable: false for empty pixel array', () => {
    const result = analyseFrame(new Uint8Array(0), 0, 0);
    expect(result.acceptable).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// analyseFrame — lighting conditions
// ---------------------------------------------------------------------------

describe('analyseFrame — lighting conditions', () => {
  it('detects TOO_DARK for very dark frame (lum=10)', () => {
    const result = analyseFrame(makeUniformPixels(10), 4, 4);
    expect(result.condition).toBe('TOO_DARK');
    expect(result.acceptable).toBe(false);
  });

  it('suggests Increase exposure for extremely dark frame (lum<20)', () => {
    const result = analyseFrame(makeUniformPixels(5), 4, 4);
    expect(result.suggestion).toBe('Increase exposure.');
  });

  it('suggests Face the window for moderately dark frame (20≤lum<45)', () => {
    const result = analyseFrame(makeUniformPixels(30), 4, 4);
    expect(result.suggestion).toBe('Face the window.');
  });

  it('returns GOOD for well-lit frame (lum=128)', () => {
    const result = analyseFrame(makeUniformPixels(128), 4, 4);
    expect(result.condition).toBe('GOOD');
    expect(result.suggestion).toBeNull();
    expect(result.acceptable).toBe(true);
  });

  it('returns OVEREXPOSED for very bright frame (lum=250)', () => {
    const result = analyseFrame(makeUniformPixels(250), 4, 4);
    expect(result.condition).toBe('OVEREXPOSED');
  });

  it('detects BACKLIT when many pixels are very bright', () => {
    const result = analyseFrame(makeBacklitPixels(16, 16), 16, 16);
    expect(result.condition).toBe('BACKLIT');
    expect(result.suggestion).toBe('Avoid backlight.');
    expect(result.acceptable).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// scoreFromMetrics — score range invariant
// ---------------------------------------------------------------------------

describe('scoreFromMetrics — score range', () => {
  const testCases: [number, number, number][] = [
    [0, 0, 0],       // very dark
    [10, 5, 0],      // dark
    [128, 40, 0],    // good
    [200, 60, 0],    // bright
    [250, 70, 0],    // overexposed
    [128, 60, 0.5],  // backlit
    [80, 10, 0],     // low contrast
  ];

  it.each(testCases)(
    'score is in [0, 100] for brightness=%i contrast=%i backlight=%f',
    (brightness, contrast, backlightRatio) => {
      const result = scoreFromMetrics(brightness, contrast, backlightRatio);
      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.score).toBeLessThanOrEqual(100);
    },
  );
});

// ---------------------------------------------------------------------------
// scoreFromMetrics — suggestion–condition coherence
// ---------------------------------------------------------------------------

describe('scoreFromMetrics — condition coherence', () => {
  it('has null suggestion when condition is GOOD', () => {
    const result = scoreFromMetrics(128, 40, 0);
    expect(result.condition).toBe('GOOD');
    expect(result.suggestion).toBeNull();
  });

  it('has non-null suggestion when condition is not GOOD', () => {
    const dark = scoreFromMetrics(10, 5, 0);
    expect(dark.condition).not.toBe('GOOD');
    expect(dark.suggestion).not.toBeNull();
  });

  it('acceptable is true iff score ≥ 60', () => {
    // Score exactly 60 → acceptable
    const mid = scoreFromMetrics(128, 40, 0);
    expect(mid.score).toBeGreaterThanOrEqual(60);
    expect(mid.acceptable).toBe(true);

    const dark = scoreFromMetrics(10, 5, 0);
    expect(dark.score).toBeLessThan(60);
    expect(dark.acceptable).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Type shape
// ---------------------------------------------------------------------------

describe('LightingAnalysisResult shape', () => {
  it('has all required fields', () => {
    const result: LightingAnalysisResult = analyseFrame(makeUniformPixels(128), 4, 4);
    expect(result).toHaveProperty('score');
    expect(result).toHaveProperty('condition');
    expect(result).toHaveProperty('suggestion');
    expect(result).toHaveProperty('acceptable');
  });
});
