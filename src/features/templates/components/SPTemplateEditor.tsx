/**
 * SPTemplateEditor — Creative canvas editor for templates.
 * Allows adding/moving text captions, emojis/stickers, adjusting canvas filters, and saving/exporting.
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TextInput,
  ScrollView,
  Pressable,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

import { Colors, Spacing, BorderRadius } from '@/constants/designTokens';
import { SPIcon } from '@/components/atoms/SPIcon';
import { SPButton } from '@/components/atoms/SPButton';
import type { TextLayer, StickerLayer, Template } from '../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CANVAS_WIDTH = SCREEN_WIDTH - Spacing.md * 2;
const CANVAS_HEIGHT = CANVAS_WIDTH * 1.25;

const STICKER_PALETTE = ['✨', '🔥', '📸', '💫', '⚡️', '🌟', '🤍', '👑', '🕊️', '🌿', '💎', '🎬'];
const COLOR_PALETTE = ['#FFFFFF', '#181818', Colors.lime, Colors.cyan, Colors.gold, '#FF4B4B', '#9C27B0'];

interface DraggableTextProps {
  layer: TextLayer;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onUpdate: (id: string, updates: Partial<TextLayer>) => void;
}

function DraggableText({ layer, isSelected, onSelect, onUpdate }: DraggableTextProps) {
  const translateX = useSharedValue(layer.x);
  const translateY = useSharedValue(layer.y);

  const dragGesture = Gesture.Pan()
    .onStart(() => {
      onSelect(layer.id);
    })
    .onUpdate((e) => {
      translateX.value = layer.x + e.translationX;
      translateY.value = layer.y + e.translationY;
    })
    .onEnd((e) => {
      onUpdate(layer.id, {
        x: layer.x + e.translationX,
        y: layer.y + e.translationY,
      });
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  return (
    <GestureDetector gesture={dragGesture}>
      <Animated.View
        style={[
          styles.textLayerWrapper,
          isSelected && styles.selectedLayer,
          animatedStyle,
        ]}
      >
        <Text
          style={[
            styles.textLayerContent,
            {
              fontSize: layer.fontSize,
              color: layer.color,
              fontWeight: layer.fontWeight,
            },
          ]}
        >
          {layer.text}
        </Text>
      </Animated.View>
    </GestureDetector>
  );
}

interface DraggableStickerProps {
  layer: StickerLayer;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onUpdate: (id: string, updates: Partial<StickerLayer>) => void;
}

function DraggableSticker({ layer, isSelected, onSelect, onUpdate }: DraggableStickerProps) {
  const translateX = useSharedValue(layer.x);
  const translateY = useSharedValue(layer.y);

  const dragGesture = Gesture.Pan()
    .onStart(() => {
      onSelect(layer.id);
    })
    .onUpdate((e) => {
      translateX.value = layer.x + e.translationX;
      translateY.value = layer.y + e.translationY;
    })
    .onEnd((e) => {
      onUpdate(layer.id, {
        x: layer.x + e.translationX,
        y: layer.y + e.translationY,
      });
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  return (
    <GestureDetector gesture={dragGesture}>
      <Animated.View
        style={[
          styles.stickerLayerWrapper,
          isSelected && styles.selectedLayer,
          animatedStyle,
        ]}
      >
        <Text style={{ fontSize: layer.size }}>{layer.emoji}</Text>
      </Animated.View>
    </GestureDetector>
  );
}

interface SPTemplateEditorProps {
  initialTemplate: Template;
  onSave: (template: Template) => void;
  onCancel: () => void;
}

export function SPTemplateEditor({ initialTemplate, onSave, onCancel }: SPTemplateEditorProps) {
  const insets = useSafeAreaInsets();

  const [textLayers, setTextLayers] = useState<TextLayer[]>(initialTemplate.textLayers || []);
  const [stickerLayers, setStickerLayers] = useState<StickerLayer[]>(initialTemplate.stickerLayers || []);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'text' | 'stickers' | 'adjust'>('text');
  const [newText, setNewText] = useState('');
  const [textColor, setTextColor] = useState('#FFFFFF');

  const handleAddText = useCallback(() => {
    if (!newText.trim()) return;
    const newLayer: TextLayer = {
      id: `txt_${Date.now()}`,
      text: newText.trim(),
      fontSize: 24,
      fontWeight: '700',
      color: textColor,
      alignment: 'center',
      opacity: 1,
      rotation: 0,
      x: CANVAS_WIDTH / 4,
      y: CANVAS_HEIGHT / 3,
    };
    setTextLayers((prev) => [...prev, newLayer]);
    setSelectedLayerId(newLayer.id);
    setNewText('');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [newText, textColor]);

  const handleAddSticker = useCallback((emoji: string) => {
    const newLayer: StickerLayer = {
      id: `stk_${Date.now()}`,
      emoji,
      size: 40,
      x: CANVAS_WIDTH / 3,
      y: CANVAS_HEIGHT / 3,
      rotation: 0,
      opacity: 1,
    };
    setStickerLayers((prev) => [...prev, newLayer]);
    setSelectedLayerId(newLayer.id);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  const handleUpdateText = useCallback((id: string, updates: Partial<TextLayer>) => {
    setTextLayers((prev) =>
      prev.map((layer) => (layer.id === id ? { ...layer, ...updates } : layer))
    );
  }, []);

  const handleUpdateSticker = useCallback((id: string, updates: Partial<StickerLayer>) => {
    setStickerLayers((prev) =>
      prev.map((layer) => (layer.id === id ? { ...layer, ...updates } : layer))
    );
  }, []);

  const handleDeleteSelected = useCallback(() => {
    if (!selectedLayerId) return;
    setTextLayers((prev) => prev.filter((l) => l.id !== selectedLayerId));
    setStickerLayers((prev) => prev.filter((l) => l.id !== selectedLayerId));
    setSelectedLayerId(null);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, [selectedLayerId]);

  const handleFinish = () => {
    const updated: Template = {
      ...initialTemplate,
      textLayers,
      stickerLayers,
      updatedAt: new Date().toISOString(),
    };
    onSave(updated);
  };

  return (
    <View style={[styles.container, { backgroundColor: Colors.dark }]}>
      {/* Header bar */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={onCancel} style={styles.headerBtn}>
          <SPIcon name="close" size={20} color="#FFF" />
        </Pressable>
        <Text style={styles.headerTitle}>Template Canvas Studio</Text>
        <Pressable onPress={handleFinish} style={styles.headerSaveBtn}>
          <Text style={styles.saveBtnText}>Save</Text>
        </Pressable>
      </View>

      {/* Editor Canvas */}
      <View style={styles.canvasContainer}>
        <View style={styles.canvas}>
          <Image
            source={{ uri: initialTemplate.imageUrl }}
            style={StyleSheet.absoluteFill}
            resizeMode="cover"
          />
          {textLayers.map((layer) => (
            <DraggableText
              key={layer.id}
              layer={layer}
              isSelected={selectedLayerId === layer.id}
              onSelect={setSelectedLayerId}
              onUpdate={handleUpdateText}
            />
          ))}
          {stickerLayers.map((layer) => (
            <DraggableSticker
              key={layer.id}
              layer={layer}
              isSelected={selectedLayerId === layer.id}
              onSelect={setSelectedLayerId}
              onUpdate={handleUpdateSticker}
            />
          ))}
        </View>
      </View>

      {/* Bottom Tool Panels */}
      <View style={[styles.toolsPanel, { paddingBottom: insets.bottom + 12 }]}>
        {/* Tab switchers */}
        <View style={styles.tabHeader}>
          <Pressable
            onPress={() => setActiveTab('text')}
            style={[styles.tabBtn, activeTab === 'text' && styles.activeTabBtn]}
          >
            <SPIcon name="edit" size={16} color={activeTab === 'text' ? Colors.lime : '#FFF'} />
            <Text style={[styles.tabText, activeTab === 'text' && { color: Colors.lime }]}>Text</Text>
          </Pressable>

          <Pressable
            onPress={() => setActiveTab('stickers')}
            style={[styles.tabBtn, activeTab === 'stickers' && styles.activeTabBtn]}
          >
            <SPIcon name="sparkles" size={16} color={activeTab === 'stickers' ? Colors.lime : '#FFF'} />
            <Text style={[styles.tabText, activeTab === 'stickers' && { color: Colors.lime }]}>Stickers</Text>
          </Pressable>

          {selectedLayerId && (
            <Pressable onPress={handleDeleteSelected} style={styles.deleteLayerBtn}>
              <SPIcon name="trash" size={16} color={Colors.error} />
              <Text style={{ color: Colors.error, fontSize: 12, fontWeight: '700' }}>Delete</Text>
            </Pressable>
          )}
        </View>

        {/* Tab Content */}
        {activeTab === 'text' && (
          <View style={styles.toolBody}>
            <View style={styles.inputRow}>
              <TextInput
                value={newText}
                onChangeText={setNewText}
                placeholder="Add text caption..."
                placeholderTextColor="rgba(255,255,255,0.4)"
                style={styles.textInput}
              />
              <SPButton
                label="Add"
                variant="primary"
                size="sm"
                onPress={handleAddText}
                disabled={!newText.trim()}
                accessibilityLabel="Add text caption"
              />
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.colorRow}>
              {COLOR_PALETTE.map((color) => (
                <Pressable
                  key={color}
                  onPress={() => setTextColor(color)}
                  style={[
                    styles.colorDot,
                    { backgroundColor: color },
                    textColor === color && styles.selectedColorDot,
                  ]}
                />
              ))}
            </ScrollView>
          </View>
        )}

        {activeTab === 'stickers' && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.stickerScroll}>
            {STICKER_PALETTE.map((emoji) => (
              <Pressable
                key={emoji}
                onPress={() => handleAddSticker(emoji)}
                style={styles.stickerBtn}
              >
                <Text style={{ fontSize: 26 }}>{emoji}</Text>
              </Pressable>
            ))}
          </ScrollView>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
    backgroundColor: '#1E1E1E',
  },
  headerBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
  headerSaveBtn: {
    backgroundColor: Colors.olive,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  saveBtnText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },
  canvasContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.md,
  },
  canvas: {
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    backgroundColor: '#000',
    position: 'relative',
  },
  textLayerWrapper: {
    position: 'absolute',
    padding: 6,
  },
  textLayerContent: {
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  stickerLayerWrapper: {
    position: 'absolute',
    padding: 4,
  },
  selectedLayer: {
    borderWidth: 1.5,
    borderColor: Colors.lime,
    borderStyle: 'dashed',
    borderRadius: 6,
  },
  toolsPanel: {
    backgroundColor: '#1E1E1E',
    borderTopLeftRadius: BorderRadius.lg,
    borderTopRightRadius: BorderRadius.lg,
    padding: Spacing.md,
  },
  tabHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: Spacing.md,
  },
  tabBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  activeTabBtn: {
    backgroundColor: 'rgba(183,255,0,0.15)',
    borderWidth: 1,
    borderColor: Colors.lime,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFF',
  },
  deleteLayerBtn: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: 'rgba(244,67,54,0.15)',
  },
  toolBody: {
    gap: 12,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    color: '#FFF',
    fontSize: 14,
  },
  colorRow: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 4,
  },
  colorDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedColorDot: {
    borderColor: '#FFF',
    transform: [{ scale: 1.15 }],
  },
  stickerScroll: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 8,
  },
  stickerBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
});
