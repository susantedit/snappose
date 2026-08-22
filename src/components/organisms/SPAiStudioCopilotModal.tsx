/**
 * SPAiStudioCopilotModal — Interactive Conversational AI Photography Director.
 *
 * Features:
 *  • Real-time conversational AI chat interface (Gemini / LLM powered)
 *  • Natural language parsing for environment, vibe, outfit, and body dynamics
 *  • Quick Prompt Inspiration Pills
 *  • Rich Interactive Recommendation Cards with "Launch in Camera 🚀"
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  Pressable,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

import { useTheme } from '@/constants/theme';
import { Colors, Spacing } from '@/constants/designTokens';
import { SPIcon } from '@/components/atoms/SPIcon';
import { AnimatedPressable } from '@/components/motion/AnimatedPressable';
import { aiDirectorService, type AiSearchResultItem } from '@/services/ai/AiDirectorService';
import { getPoseImageSource } from '@/utils/imageUtils';

export interface CopilotChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  recommendations?: AiSearchResultItem[];
  timestamp: string;
}

export interface SPAiStudioCopilotModalProps {
  visible: boolean;
  onClose: () => void;
}

const QUICK_PROMPTS = [
  '☕ Cozy cafe candid with coffee cup',
  '🕶️ Confident boss suit pose for LinkedIn',
  '🌅 Sunset beach couple with height difference',
  '🏃 Street style moving candid walk',
  '💪 Gym fitness power flex',
];

export function SPAiStudioCopilotModal({ visible, onClose }: SPAiStudioCopilotModalProps) {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const isDark = theme.mode === 'dark';

  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const [messages, setMessages] = useState<CopilotChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'ai',
      text: "👋 Hey there! I'm your **AI Studio Director**. Tell me what you're wearing, where you're shooting, or what vibe you want, and I'll direct the perfect pose and camera setup!",
      timestamp: 'Just now',
    },
  ]);

  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 200);
    }
  }, [visible, messages]);

  const handleSendMessage = useCallback(async (queryText?: string) => {
    const textToSend = (queryText || inputQuery).trim();
    if (!textToSend) return;

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}

    const userMsg: CopilotChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    // AI Semantic Direction Analysis
    try {
      const searchRes = await aiDirectorService.searchPoses(textToSend);
      const topPicks = searchRes.results.slice(0, 3);

      const aiMsg: CopilotChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: searchRes.directorOverview,
        recommendations: topPicks,
        timestamp: 'Just now',
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'ai',
          text: 'I analyzed your request and picked our top recommended reference poses for you below!',
          recommendations: [],
          timestamp: 'Just now',
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  }, [inputQuery]);

  const handleLaunchPose = useCallback((poseId: string) => {
    onClose();
    setTimeout(() => {
      router.push({
        pathname: '/(tabs)/camera',
        params: { poseId },
      });
    }, 250);
  }, [onClose]);

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={[
            styles.modalContainer,
            {
              backgroundColor: isDark ? '#181A15' : '#FAF6F0',
              borderColor: isDark ? '#2E3326' : '#E6DECeed',
              paddingTop: insets.top + Spacing.sm,
              paddingBottom: insets.bottom + Spacing.sm,
            },
          ]}
        >
          {/* Header */}
          <View style={styles.headerRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={styles.botIconBadge}>
                <SPIcon name="sparkles" size={20} color="#000" strokeWidth={2.4} />
              </View>
              <View>
                <Text style={[styles.headerTitle, { color: isDark ? '#FFF' : Colors.textPrimary }]}>
                  AI PHOTO DIRECTOR
                </Text>
                <Text style={styles.headerSubtitle}>Conversational Studio Copilot</Text>
              </View>
            </View>
            <Pressable onPress={onClose} style={styles.closeBtn} hitSlop={12}>
              <SPIcon name="close" size={18} color={isDark ? '#FFF' : '#333'} />
            </Pressable>
          </View>

          {/* Chat Messages */}
          <ScrollView
            ref={scrollViewRef}
            style={styles.chatScroll}
            contentContainerStyle={styles.chatContent}
            showsVerticalScrollIndicator={false}
          >
            {messages.map((msg) => {
              const isAi = msg.sender === 'ai';
              return (
                <Animated.View
                  key={msg.id}
                  entering={FadeInUp.duration(300)}
                  style={[
                    styles.messageWrap,
                    isAi ? styles.aiMessageWrap : styles.userMessageWrap,
                  ]}
                >
                  <View
                    style={[
                      styles.messageBubble,
                      isAi
                        ? [
                            styles.aiBubble,
                            {
                              backgroundColor: isDark ? '#23271E' : '#FFFFFF',
                              borderColor: isDark ? '#38402F' : '#E2D9C8',
                            },
                          ]
                        : [styles.userBubble, { backgroundColor: Colors.olive }],
                    ]}
                  >
                    <Text
                      style={[
                        styles.messageText,
                        { color: isAi ? (isDark ? '#E5E5EA' : Colors.textPrimary) : '#FFFFFF' },
                      ]}
                    >
                      {msg.text}
                    </Text>

                    {/* Rich Pose Recommendations Cards */}
                    {msg.recommendations && msg.recommendations.length > 0 && (
                      <View style={styles.recsContainer}>
                        <Text style={styles.recsHeaderTitle}>RECOMMENDED POSES FOR YOU:</Text>
                        {msg.recommendations.map((rec) => (
                          <View
                            key={rec.pose.id}
                            style={[
                              styles.recCard,
                              {
                                backgroundColor: isDark ? '#191C16' : '#F7F3EB',
                                borderColor: isDark ? '#31382A' : '#DED5C5',
                              },
                            ]}
                          >
                            <Image
                              source={getPoseImageSource(rec.pose.imageUrl)}
                              style={styles.recThumbnail}
                              resizeMode="cover"
                            />
                            <View style={styles.recInfo}>
                              <Text
                                style={[styles.recTitle, { color: isDark ? '#FFF' : Colors.textPrimary }]}
                                numberOfLines={1}
                              >
                                {rec.pose.title}
                              </Text>
                              <Text style={styles.recMatchReason} numberOfLines={2}>
                                {rec.aiMatchReason}
                              </Text>
                              <AnimatedPressable
                                onPress={() => handleLaunchPose(rec.pose.id)}
                                scaleTo={0.92}
                                style={styles.recLaunchBtn}
                              >
                                <SPIcon name="camera" size={13} color="#FFF" strokeWidth={2.4} />
                                <Text style={styles.recLaunchText}>Try in Camera</Text>
                              </AnimatedPressable>
                            </View>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                </Animated.View>
              );
            })}

            {/* Typing indicator */}
            {isTyping && (
              <View style={styles.typingWrap}>
                <View style={styles.typingDot} />
                <View style={[styles.typingDot, { opacity: 0.7 }]} />
                <View style={[styles.typingDot, { opacity: 0.4 }]} />
                <Text style={styles.typingText}>AI Director analyzing lighting & anatomy...</Text>
              </View>
            )}
          </ScrollView>

          {/* Quick Prompts Ribbon */}
          <View style={styles.promptsRibbon}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.promptsScroll}>
              {QUICK_PROMPTS.map((prompt, idx) => (
                <Pressable
                  key={idx}
                  onPress={() => handleSendMessage(prompt)}
                  style={[
                    styles.promptPill,
                    {
                      backgroundColor: isDark ? '#23271E' : '#FFFFFF',
                      borderColor: isDark ? '#3D4435' : '#DDD4C4',
                    },
                  ]}
                >
                  <Text style={[styles.promptPillText, { color: isDark ? '#D2DECA' : Colors.textPrimary }]}>
                    {prompt}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {/* Input Bar */}
          <View
            style={[
              styles.inputBar,
              {
                backgroundColor: isDark ? '#22251D' : '#FFFFFF',
                borderColor: isDark ? '#3B4232' : '#DED5C5',
              },
            ]}
          >
            <TextInput
              value={inputQuery}
              onChangeText={setInputQuery}
              placeholder="Ask AI Director (e.g. moody sunset pose)..."
              placeholderTextColor={isDark ? '#777' : '#999'}
              returnKeyType="send"
              onSubmitEditing={() => handleSendMessage()}
              style={[styles.textInput, { color: isDark ? '#FFF' : Colors.textPrimary }]}
            />
            <AnimatedPressable
              onPress={() => handleSendMessage()}
              disabled={!inputQuery.trim()}
              scaleTo={0.88}
              style={[
                styles.sendBtn,
                { backgroundColor: inputQuery.trim() ? Colors.olive : isDark ? '#333' : '#DDD' },
              ]}
            >
              <SPIcon name="arrowUp" size={16} color="#FFF" strokeWidth={2.6} />
            </AnimatedPressable>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  modalContainer: {
    flex: 1,
    paddingHorizontal: Spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  botIconBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.olive,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#888',
    fontWeight: '500',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatScroll: {
    flex: 1,
  },
  chatContent: {
    paddingVertical: Spacing.md,
    gap: 12,
  },
  messageWrap: {
    width: '100%',
  },
  aiMessageWrap: {
    alignItems: 'flex-start',
  },
  userMessageWrap: {
    alignItems: 'flex-end',
  },
  messageBubble: {
    maxWidth: '88%',
    borderRadius: 18,
    padding: 14,
  },
  aiBubble: {
    borderWidth: 1,
  },
  userBubble: {
    borderBottomRightRadius: 4,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '400',
  },
  recsContainer: {
    marginTop: 12,
    gap: 8,
  },
  recsHeaderTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.olive,
    letterSpacing: 0.6,
  },
  recCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 14,
    borderWidth: 1,
    gap: 10,
  },
  recThumbnail: {
    width: 54,
    height: 68,
    borderRadius: 8,
    backgroundColor: '#000',
  },
  recInfo: {
    flex: 1,
    gap: 4,
  },
  recTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  recMatchReason: {
    fontSize: 11,
    color: '#888',
    lineHeight: 15,
  },
  recLaunchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.olive,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    alignSelf: 'flex-start',
    gap: 4,
    marginTop: 2,
  },
  recLaunchText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '800',
  },
  typingWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.olive,
  },
  typingText: {
    fontSize: 11,
    color: '#888',
    fontStyle: 'italic',
  },
  promptsRibbon: {
    paddingVertical: 8,
  },
  promptsScroll: {
    gap: 8,
  },
  promptPill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14,
    borderWidth: 1,
  },
  promptPillText: {
    fontSize: 11,
    fontWeight: '600',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 6,
    gap: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 6,
  },
  sendBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
