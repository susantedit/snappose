/**
 * SPCameraGridOverlay — Skia-based camera grid overlay.
 *
 * Ports CameraGridOverlay.kt to React Native Skia.
 *
 * Modes:
 *   - 'thirds'  → Rule-of-Thirds: 2 vertical + 2 horizontal lines
 *   - 'golden'  → Golden Ratio: lines at 38.2% and 61.8% of each axis
 *   - 'none'    → Returns null — no rendering at all
 *
 * Always uses `pointerEvents="none"` so it never intercepts touches.
 * Line style: white, 1px stroke, 35% opacity.
 *
 * [Req 8.4]
 */

import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { Canvas, Line } from '@shopify/react-native-skia';

import type { GridType } from '@/features/camera/types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SPCameraGridOverlayProps {
  /** Which grid type to render. 'none' renders nothing. */
  type: GridType;
  /** Width of the camera preview in pixels. */
  width: number;
  /** Height of the camera preview in pixels. */
  height: number;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Golden ratio position (≈ 0.618) */
const PHI = 0.618;
/** Line paint colour */
const LINE_COLOR = 'rgba(255, 255, 255, 0.35)';
/** Line stroke width in pixels */
const LINE_WIDTH = 1;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

interface GridLine {
  key: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

function buildThirdsLines(w: number, h: number): GridLine[] {
  return [
    // Vertical thirds
    { key: 'v1', x1: w / 3,       y1: 0, x2: w / 3,       y2: h },
    { key: 'v2', x1: (w / 3) * 2, y1: 0, x2: (w / 3) * 2, y2: h },
    // Horizontal thirds
    { key: 'h1', x1: 0, y1: h / 3,       x2: w, y2: h / 3       },
    { key: 'h2', x1: 0, y1: (h / 3) * 2, x2: w, y2: (h / 3) * 2 },
  ];
}

function buildGoldenLines(w: number, h: number): GridLine[] {
  const smallPhi = 1 - PHI; // ≈ 0.382
  return [
    // Vertical golden ratio lines
    { key: 'gv1', x1: w * smallPhi, y1: 0, x2: w * smallPhi, y2: h },
    { key: 'gv2', x1: w * PHI,      y1: 0, x2: w * PHI,      y2: h },
    // Horizontal golden ratio lines
    { key: 'gh1', x1: 0, y1: h * smallPhi, x2: w, y2: h * smallPhi },
    { key: 'gh2', x1: 0, y1: h * PHI,      x2: w, y2: h * PHI      },
  ];
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Non-interactive Skia grid overlay — never intercepts touches. [Req 8.4]
 */
export function SPCameraGridOverlay({
  type,
  width,
  height,
}: SPCameraGridOverlayProps) {
  // Return null immediately for 'none' — no canvas allocation at all
  if (type === 'none' || width <= 0 || height <= 0) return null;

  // Memoize line data so it isn't recomputed every render
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const lines = useMemo<GridLine[]>(() => {
    if (type === 'thirds') return buildThirdsLines(width, height);
    if (type === 'golden') return buildGoldenLines(width, height);
    return [];
  }, [type, width, height]);

  return (
    // pointerEvents="none" ensures this overlay never intercepts touches [Req 8.4]
    <Canvas
      style={StyleSheet.absoluteFill}
      pointerEvents="none"
      accessibilityElementsHidden
    >
      {lines.map((l) => (
        <Line
          key={l.key}
          p1={{ x: l.x1, y: l.y1 }}
          p2={{ x: l.x2, y: l.y2 }}
          color={LINE_COLOR}
          strokeWidth={LINE_WIDTH}
          style="stroke"
        />
      ))}
    </Canvas>
  );
}
