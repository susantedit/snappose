/**
 * useLighting — React hook providing camera scene lighting analysis and suggestions.
 */

import { useState, useCallback } from 'react';
import {
  analyseFrame,
  type LightingAnalysisResult,
} from '../domain/LightingAnalyser';

export function useLighting() {
  const [lighting, setLighting] = useState<LightingAnalysisResult>({
    score: 85,
    condition: 'GOOD',
    suggestion: null,
    acceptable: true,
  });

  const processFrame = useCallback((pixels: Uint8Array, width: number, height: number) => {
    try {
      const result = analyseFrame(pixels, width, height);
      setLighting(result);
      return result;
    } catch {
      return lighting;
    }
  }, [lighting]);

  return {
    lighting,
    score: lighting.score,
    condition: lighting.condition,
    suggestion: lighting.suggestion,
    isAcceptable: lighting.acceptable,
    processFrame,
  };
}
