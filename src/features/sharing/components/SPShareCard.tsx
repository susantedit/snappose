/**
 * SPShareCard — Beautiful high-res exportable card for sharing alignments, pose completions, and templates.
 */

import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { Colors, Spacing, BorderRadius } from '@/constants/designTokens';
import { SPIcon } from '@/components/atoms/SPIcon';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = Math.min(360, SCREEN_WIDTH - Spacing.md * 2);

interface SPShareCardProps {
  photoUri: string;
  poseTitle: string;
  score: number;
  dateStr?: string;
  authorName?: string;
}

export function SPShareCard({
  photoUri,
  poseTitle,
  score,
  dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
  authorName = 'POSEHANUM Director',
}: SPShareCardProps) {
  return (
    <View style={styles.card}>
      {/* Photo Frame */}
      <View style={styles.photoContainer}>
        <Image source={{ uri: photoUri }} style={styles.image} resizeMode="cover" />
        <View style={styles.scoreBadge}>
          <Text style={styles.scoreText}>{score}% MATCH</Text>
        </View>
      </View>

      {/* Footer Branding Bar */}
      <View style={styles.footer}>
        <View>
          <Text style={styles.poseTitle}>{poseTitle}</Text>
          <Text style={styles.author}>{authorName} • {dateStr}</Text>
        </View>
        <View style={styles.logoBadge}>
          <SPIcon name="sparkles" size={14} color={Colors.lime} />
          <Text style={styles.brand}>POSEHANUM</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#181818',
    borderRadius: BorderRadius.card,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  photoContainer: {
    width: '100%',
    height: CARD_WIDTH * 1.25,
    position: 'relative',
    backgroundColor: '#000',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  scoreBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(23, 24, 19, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.lime,
  },
  scoreText: {
    color: Colors.lime,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    backgroundColor: '#1F201B',
  },
  poseTitle: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  author: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 11,
  },
  logoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(101,116,74,0.3)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  brand: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
});
