/**
 * SPLightingSimulator — AI Virtual Lighting & Time-of-Day Environment Simulator.
 *
 * Capabilities:
 *  • Real-time camera color grading overlays (Golden Hour, Tokyo Neon, Editorial Noir, Studio Flash)
 *  • Live Exposure Recipe suggestions (ISO, Shutter, White Balance, Lighting Direction)
 *  • Interactive quick lighting preset switcher for Camera and Pose Detail screens
 */

import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { Colors } from '@/constants/designTokens';
import { SPIcon } from '@/components/atoms/SPIcon';
import { AnimatedPressable } from '@/components/motion/AnimatedPressable';

export type LightingMode =
  | 'natural'
  | 'golden_hour'
  | 'cinematic_neon'
  | 'editorial_noir'
  | 'studio_flash';

export interface LightingPresetConfig {
  id: LightingMode;
  name: string;
  icon: string;
  colorTemperature: string;
  overlayColor: string;
  isoAdvice: string;
  shutterAdvice: string;
  directionAdvice: string;
}

export const LIGHTING_PRESETS: LightingPresetConfig[] = [
  {
    id: 'natural',
    name: 'Natural Daylight',
    icon: 'sun',
    colorTemperature: '5500K',
    overlayColor: 'transparent',
    isoAdvice: 'ISO 100 - 200',
    shutterAdvice: '1/250s',
    directionAdvice: 'Place subject 45° to soft ambient window light',
  },
  {
    id: 'golden_hour',
    name: 'Golden Hour Sunset',
    icon: 'sparkles',
    colorTemperature: '2800K Warm',
    overlayColor: 'rgba(255, 120, 0, 0.18)',
    isoAdvice: 'ISO 200 - 400',
    shutterAdvice: '1/160s',
    directionAdvice: 'Position sun directly behind subject for glowing rim backlight',
  },
  {
    id: 'cinematic_neon',
    name: 'Tokyo Cyberpunk',
    icon: 'sparkles',
    colorTemperature: '6800K Cool',
    overlayColor: 'rgba(0, 180, 255, 0.14)',
    isoAdvice: 'ISO 800 - 1200',
    shutterAdvice: '1/60s',
    directionAdvice: 'Accentuate shadows with dramatic side-profile rim lighting',
  },
  {
    id: 'editorial_noir',
    name: 'Editorial B&W Noir',
    icon: 'sparkles',
    colorTemperature: 'Monochrome',
    overlayColor: 'rgba(20, 20, 20, 0.35)',
    isoAdvice: 'ISO 400',
    shutterAdvice: '1/125s',
    directionAdvice: 'High contrast key lighting to sculpt jawline and torso lines',
  },
  {
    id: 'studio_flash',
    name: '5600K Studio Strobe',
    icon: 'sun',
    colorTemperature: '5600K Flash',
    overlayColor: 'rgba(255, 255, 255, 0.10)',
    isoAdvice: 'ISO 100',
    shutterAdvice: '1/200s Sync',
    directionAdvice: 'Softbox positioned overhead at 45° butterfly lighting angle',
  },
];

export interface SPLightingSimulatorProps {
  selectedMode: LightingMode;
  onSelectMode: (mode: LightingMode) => void;
  style?: StyleProp<ViewStyle>;
}

export function SPLightingSimulator({
  selectedMode,
  onSelectMode,
  style,
}: SPLightingSimulatorProps) {
  const currentPreset = LIGHTING_PRESETS.find((p) => p.id === selectedMode) || LIGHTING_PRESETS[0];

  return (
    <View style={[styles.container, style]}>
      {/* Scrollable Lighting Preset Strip */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {LIGHTING_PRESETS.map((preset) => {
          const isSelected = preset.id === selectedMode;
          return (
            <AnimatedPressable
              key={preset.id}
              onPress={() => {
                try {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                } catch {}
                onSelectMode(preset.id);
              }}
              scaleTo={0.92}
              style={[
                styles.presetPill,
                isSelected && styles.presetPillActive,
              ]}
              accessibilityLabel={`Select ${preset.name} lighting mode`}
            >
              <SPIcon
                name={preset.icon}
                size={13}
                color={isSelected ? '#000' : '#FFF'}
                strokeWidth={2.2}
              />
              <Text
                style={[
                  styles.presetText,
                  isSelected && styles.presetTextActive,
                ]}
              >
                {preset.name}
              </Text>
            </AnimatedPressable>
          );
        })}
      </ScrollView>

      {/* Pro Shot Recipe Badge */}
      <Animated.View entering={FadeIn.duration(200)} style={styles.recipeBadge}>
        <View style={styles.recipeRow}>
          <Text style={styles.recipeTag}>PRO RECIPE:</Text>
          <Text style={styles.recipeValues}>
            {currentPreset.isoAdvice} • {currentPreset.shutterAdvice} • {currentPreset.colorTemperature}
          </Text>
        </View>
        <Text style={styles.recipeDirection} numberOfLines={1}>
          💡 {currentPreset.directionAdvice}
        </Text>
      </Animated.View>
    </View>
  );
}

/**
 * Fullscreen Viewfinder Tint Layer
 */
export function SPLightingOverlay({ mode }: { mode: LightingMode }) {
  const preset = LIGHTING_PRESETS.find((p) => p.id === mode);
  if (!preset || preset.overlayColor === 'transparent') return null;

  return (
    <View
      style={[
        StyleSheet.absoluteFillObject,
        { backgroundColor: preset.overlayColor },
      ]}
      pointerEvents="none"
    />
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  scrollContent: {
    gap: 6,
    paddingHorizontal: 4,
  },
  presetPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    gap: 5,
  },
  presetPillActive: {
    backgroundColor: Colors.olive,
    borderColor: Colors.olive,
  },
  presetText: {
    color: '#DDD',
    fontSize: 10,
    fontWeight: '700',
  },
  presetTextActive: {
    color: '#000',
  },
  recipeBadge: {
    backgroundColor: 'rgba(18, 20, 15, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    gap: 2,
  },
  recipeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  recipeTag: {
    color: Colors.olive,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  recipeValues: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
  },
  recipeDirection: {
    color: '#AAA',
    fontSize: 10,
    fontWeight: '500',
  },
});
