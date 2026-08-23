/**
 * SPFastImage — High-performance native image component built on expo-image.
 *
 * Features:
 *  - Memory + Disk dual-layer native caching (SDWebImage / Glide)
 *  - Smooth cross-fade transition on load
 *  - Progressive fallback and placeholder support
 *  - Hardware-accelerated decoding for zero-lag grid scrolling
 */

import React, { memo } from 'react';
import { StyleSheet, ImageStyle, StyleProp } from 'react-native';
import { Image as ExpoImage, ImageProps as ExpoImageProps, ImageSource } from 'expo-image';
import { getPoseImageSource } from '@/utils/imageUtils';

export interface SPFastImageProps extends Omit<ExpoImageProps, 'source' | 'style'> {
  source: string | number | ImageSource | ImageSource[] | null | undefined;
  style?: StyleProp<ImageStyle | any>;
  contentFit?: 'cover' | 'contain' | 'fill' | 'scale-down' | 'none';
  transitionDuration?: number;
  priority?: 'low' | 'normal' | 'high';
  /**
   * Approximate render width in px. When set, string sources are rewritten to
   * request a downscaled host variant (e.g. Drive sz=w1000 → sz=w{targetWidth}),
   * cutting transfer bytes and native decode cost for grid/list cells.
   */
  targetWidth?: number;
}

export const SPFastImage = memo(function SPFastImage({
  source,
  style,
  contentFit = 'cover',
  transitionDuration = 200,
  priority = 'high',
  cachePolicy = 'memory-disk',
  targetWidth,
  ...props
}: SPFastImageProps) {
  const resolvedSource = typeof source === 'string'
    ? getPoseImageSource(source, targetWidth)
    : source;

  return (
    <ExpoImage
      source={resolvedSource as ImageSource}
      style={[styles.defaultStyle, style]}
      contentFit={contentFit}
      transition={transitionDuration}
      cachePolicy={cachePolicy}
      priority={priority}
      recyclingKey={typeof source === 'string' ? source : undefined}
      {...props}
    />
  );
});

const styles = StyleSheet.create({
  defaultStyle: {
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
});
