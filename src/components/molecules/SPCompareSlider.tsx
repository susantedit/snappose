/**
 * SPCompareSlider — Interactive Draggable Before/After Split-Screen Comparison Slider.
 *
 * Left side displays the reference pose; right side displays the captured photo.
 * Users drag the handle horizontally to reveal and compare alignment quality.
 */

import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  PanResponder,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { BorderRadius, Colors, Spacing, Typography } from '@/constants/designTokens';
import { SPIcon } from '@/components/atoms/SPIcon';

interface SPCompareSliderProps {
  referenceUri: string;
  capturedUri: string;
  matchScore: number;
  containerWidth?: number;
  containerHeight?: number;
  initialSplitRatio?: number; // 0.0 to 1.0 (default 0.5)
}

const { width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT } = Dimensions.get('window');

export const SPCompareSlider: React.FC<SPCompareSliderProps> = ({
  referenceUri,
  capturedUri,
  matchScore,
  containerWidth = DEFAULT_WIDTH,
  containerHeight = DEFAULT_HEIGHT * 0.72,
  initialSplitRatio = 0.5,
}) => {
  const [splitRatio, setSplitRatio] = useState(initialSplitRatio);
  const [isDragging, setIsDragging] = useState(false);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      setIsDragging(true);
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {}
    },
    onPanResponderMove: (_, gestureState) => {
      const newX = gestureState.moveX;
      const ratio = Math.max(0.05, Math.min(0.95, newX / containerWidth));
      setSplitRatio(ratio);
    },
    onPanResponderRelease: () => {
      setIsDragging(false);
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {}
    },
  });

  const dividerPosition = splitRatio * containerWidth;

  const scoreColor =
    matchScore >= 95
      ? '#2E7D32'
      : matchScore >= 85
        ? '#4CAF50'
        : matchScore >= 71
          ? '#7E9261'
          : matchScore >= 41
            ? '#FF8A00'
            : '#FFB300';

  return (
    <View style={[styles.root, { width: containerWidth, height: containerHeight }]}>
      {/* Captured Photo (Background Layer) */}
      <View style={StyleSheet.absoluteFillObject}>
        <Image
          source={{ uri: capturedUri }}
          style={styles.fullImage}
          resizeMode="cover"
        />
        <View style={styles.capturedTag}>
          <Text style={styles.tagText}>CAPTURED</Text>
        </View>
      </View>

      {/* Reference Image (Clipped Left Layer) */}
      <View
        style={[
          styles.referenceClippedContainer,
          { width: dividerPosition, height: containerHeight },
        ]}
      >
        <Image
          source={{ uri: referenceUri }}
          style={[styles.referenceImage, { width: containerWidth, height: containerHeight }]}
          resizeMode="cover"
        />
        <View style={styles.referenceTag}>
          <Text style={styles.tagText}>REFERENCE</Text>
        </View>
      </View>

      {/* Score Badge */}
      <View style={[styles.scoreBadge, { borderColor: scoreColor }]}>
        <SPIcon name="sparkles" size={14} color={scoreColor} />
        <Text style={[styles.scoreText, { color: scoreColor }]}>{matchScore}% MATCH</Text>
      </View>

      {/* Draggable Divider Line & Handle */}
      <View
        {...panResponder.panHandlers}
        style={[
          styles.dividerContainer,
          { left: dividerPosition - 20, height: containerHeight },
        ]}
      >
        <View style={[styles.dividerLine, isDragging && styles.dividerLineActive]} />
        <View style={[styles.dividerHandle, isDragging && styles.dividerHandleActive]}>
          <View style={styles.handleArrowLeft} />
          <View style={styles.handleArrowRight} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    overflow: 'hidden',
    borderRadius: BorderRadius.card,
    backgroundColor: '#0A0E0C',
    position: 'relative',
  },
  fullImage: {
    width: '100%',
    height: '100%',
  },
  referenceClippedContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    overflow: 'hidden',
    borderRightWidth: 1.5,
    borderRightColor: '#FFFFFF90',
  },
  referenceImage: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  referenceTag: {
    position: 'absolute',
    top: Spacing.md,
    left: Spacing.md,
    backgroundColor: 'rgba(10, 14, 12, 0.82)',
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: '#FFFFFF30',
  },
  capturedTag: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    backgroundColor: 'rgba(10, 14, 12, 0.82)',
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: '#FFFFFF30',
  },
  tagText: {
    color: '#FFFFFF',
    fontSize: Typography.sizes.caption,
    fontWeight: Typography.weights.bold,
    letterSpacing: 1,
  },
  scoreBadge: {
    position: 'absolute',
    bottom: Spacing.md,
    left: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: 'rgba(10, 14, 12, 0.90)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: BorderRadius.avatar,
    borderWidth: 1.5,
  },
  scoreText: {
    fontSize: Typography.sizes.caption,
    fontWeight: Typography.weights.bold,
    letterSpacing: 0.8,
  },
  dividerContainer: {
    position: 'absolute',
    top: 0,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  dividerLine: {
    width: 2,
    height: '100%',
    backgroundColor: '#FFFFFF',
  },
  dividerLineActive: {
    backgroundColor: Colors.lime,
    width: 3,
  },
  dividerHandle: {
    position: 'absolute',
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(10, 14, 12, 0.92)',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5,
  },
  dividerHandleActive: {
    borderColor: Colors.lime,
    transform: [{ scale: 1.15 }],
  },
  handleArrowLeft: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderTopWidth: 5,
    borderRightWidth: 6,
    borderBottomWidth: 5,
    borderLeftWidth: 0,
    borderTopColor: 'transparent',
    borderRightColor: '#FFFFFF',
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
  },
  handleArrowRight: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderTopWidth: 5,
    borderRightWidth: 0,
    borderBottomWidth: 5,
    borderLeftWidth: 6,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: '#FFFFFF',
  },
});
