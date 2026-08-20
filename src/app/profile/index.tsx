/**
 * ProfileScreen — POSEHANUM
 *
 * Comprehensive Creator & Director Profile Page:
 *  - Header: Avatar, Name, @username, Bio, Level, XP Progress, Streak, Signature Poses
 *  - 5 Content Tabs: Templates, Remixes, Favorites, Achievements, Photos
 *  - Edit Profile modal (avatar, username, bio)
 *  - Privacy & Account Actions: GDPR Personal Data Export, Delete Account, Sign Out
 */

import React, { useCallback, useState, useMemo } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';

import { useTheme } from '@/constants/theme';
import { Colors, Spacing, BorderRadius } from '@/constants/designTokens';
import { SPIcon } from '@/components/atoms/SPIcon';
import { SPButton } from '@/components/atoms/SPButton';
import { AnimatedPressable } from '@/components/motion/AnimatedPressable';

import { useAuthStore } from '@/stores/authStore';
import { useHistoryStore } from '@/stores/historyStore';
import { useFavorites } from '@/features/favorites/hooks/useFavorites';
import { useTemplateStore } from '@/features/templates/stores/templateStore';
import { useCreatorStore } from '@/stores/creatorStore';
import { useGamificationStore } from '@/stores/gamificationStore';
import { privacyDataService } from '@/features/privacy/infrastructure/PrivacyDataServiceImpl';
import { GamificationEngine } from '@/features/gamification/domain/GamificationEngine';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PHOTO_GRID_SIZE = (SCREEN_WIDTH - Spacing.md * 2 - 16) / 3;

type ProfileTab = 'templates' | 'remixes' | 'favorites' | 'achievements' | 'photos';

export default function ProfileScreen() {
  const { theme } = useTheme();
  const isDark = theme.mode === 'dark';
  const insets = useSafeAreaInsets();

  const { user, signOut, deleteAccount } = useAuthStore();
  const historyStore = useHistoryStore();
  const { favorites } = useFavorites();
  const templateStore = useTemplateStore();
  const { profile: creatorProfile, updateBio } = useCreatorStore();
  const { profile: gamificationProfile, achievements } = useGamificationStore();

  const [activeTab, setActiveTab] = useState<ProfileTab>('templates');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState(user?.displayName || 'POSEHANUM Director');
  const [editHandle, setEditHandle] = useState(creatorProfile.handle.replace('@', ''));
  const [editBioText, setEditBioText] = useState(creatorProfile.bio);

  const levelProgress = useMemo(() => {
    return GamificationEngine.getXPProgressInLevel(
      gamificationProfile.xp,
      gamificationProfile.level
    );
  }, [gamificationProfile]);

  const userTemplates = templateStore.userCreatedTemplates;
  const userRemixes = userTemplates.filter((t) => Boolean(t.remixedFromId));
  const bestScore = historyStore.attempts.length > 0
    ? Math.max(...historyStore.attempts.map((a) => a.score))
    : 0;

  const handleSaveProfile = () => {
    updateBio(editBioText.trim());
    setIsEditModalOpen(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleSignOut = useCallback(() => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            await signOut();
            router.replace('/(auth)/onboarding');
          },
        },
      ]
    );
  }, [signOut]);

  const handleDeleteAccount = useCallback(() => {
    Alert.alert(
      'Delete Account',
      'This will permanently delete your account and all local data. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteAccount();
            router.replace('/(auth)/onboarding');
          },
        },
      ]
    );
  }, [deleteAccount]);

  const handleExportData = useCallback(async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const exportBundle = await privacyDataService.exportUserData();
      await Share.share({
        title: 'POSEHANUM Data Export',
        message: JSON.stringify(exportBundle, null, 2),
      });
    } catch {
      Alert.alert('Export Failed', 'Unable to export personal data at this time.');
    }
  }, []);

  const displayName = user?.displayName || editName;
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      {/* Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + 8,
            backgroundColor: theme.colors.background,
            borderBottomColor: isDark ? Colors.borderDark : Colors.border,
          },
        ]}
      >
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <SPIcon name="back" size={20} color={theme.colors.textPrimary} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: theme.colors.textPrimary }]}>
          Creator Profile
        </Text>
        <Pressable
          onPress={() => router.push('/(tabs)/settings')}
          style={styles.settingsBtn}
        >
          <SPIcon name="settings" size={20} color={theme.colors.textPrimary} />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: insets.bottom + 60 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <Animated.View entering={FadeInDown.duration(400)} style={styles.profileCard}>
          <View style={styles.profileTopRow}>
            <View style={[styles.avatar, { backgroundColor: Colors.forest }]}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
            <View style={styles.profileMeta}>
              <View style={styles.nameRow}>
                <Text style={[styles.displayName, { color: theme.colors.textPrimary }]}>
                  {displayName}
                </Text>
                {creatorProfile.isVerified && (
                  <View style={styles.verifiedBadge}>
                    <Text style={styles.verifiedText}>✓</Text>
                  </View>
                )}
              </View>
              <Text style={styles.handleText}>@{editHandle}</Text>

              {/* Edit Profile Button */}
              <AnimatedPressable
                onPress={() => setIsEditModalOpen(true)}
                style={[
                  styles.editProfileBtn,
                  { borderColor: isDark ? Colors.borderDark : Colors.border },
                ]}
              >
                <SPIcon name="edit" size={12} color={theme.colors.textPrimary} />
                <Text style={[styles.editProfileText, { color: theme.colors.textPrimary }]}>
                  Edit Profile
                </Text>
              </AnimatedPressable>
            </View>
          </View>

          {/* Bio */}
          <Text style={[styles.bioText, { color: theme.colors.textSecondary }]}>
            {creatorProfile.bio}
          </Text>

          {/* Gamification Level & XP Progress Bar */}
          <View style={[styles.levelCard, { backgroundColor: isDark ? 'rgba(101,116,74,0.15)' : 'rgba(101,116,74,0.08)' }]}>
            <View style={styles.levelHeader}>
              <View style={styles.levelBadge}>
                <SPIcon name="sparkles" size={14} color={Colors.lime} />
                <Text style={styles.levelBadgeText}>LEVEL {gamificationProfile.level}</Text>
              </View>
              <Text style={styles.streakText}>🔥 {gamificationProfile.streakDays} Day Streak</Text>
            </View>
            <View style={styles.xpTrack}>
              <View
                style={[
                  styles.xpFill,
                  { width: `${levelProgress.percentage}%` },
                ]}
              />
            </View>
            <Text style={styles.xpSubtext}>
              {Math.round(levelProgress.current)} / {levelProgress.target} XP to Level {gamificationProfile.level + 1}
            </Text>
          </View>

          {/* Stat summary counters */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={[styles.statNum, { color: theme.colors.textPrimary }]}>
                {userTemplates.length}
              </Text>
              <Text style={[styles.statLbl, { color: theme.colors.textSecondary }]}>
                Templates
              </Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statNum, { color: theme.colors.textPrimary }]}>
                {favorites.length}
              </Text>
              <Text style={[styles.statLbl, { color: theme.colors.textSecondary }]}>
                Favorites
              </Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statNum, { color: Colors.lime }]}>
                {bestScore}%
              </Text>
              <Text style={[styles.statLbl, { color: theme.colors.textSecondary }]}>
                Best Score
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* 5-Tab Segmented Bar */}
        <View style={[styles.tabBar, { borderBottomColor: isDark ? Colors.borderDark : Colors.border }]}>
          {(['templates', 'remixes', 'favorites', 'achievements', 'photos'] as ProfileTab[]).map((t) => {
            const active = activeTab === t;
            return (
              <Pressable
                key={t}
                onPress={() => {
                  setActiveTab(t);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
                style={[styles.tabBtn, active && styles.tabBtnActive]}
              >
                <Text
                  style={[
                    styles.tabBtnText,
                    active ? { color: Colors.lime, fontWeight: '800' } : { color: theme.colors.textSecondary },
                  ]}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Tab Content */}
        <View style={styles.tabBody}>
          {activeTab === 'templates' && (
            <View>
              {userTemplates.length === 0 ? (
                <View style={styles.emptyState}>
                  <SPIcon name="sparkles" size={32} color={Colors.muted} />
                  <Text style={[styles.emptyStateTitle, { color: theme.colors.textPrimary }]}>
                    No custom templates yet
                  </Text>
                  <Text style={[styles.emptyStateSub, { color: theme.colors.textSecondary }]}>
                    Design your own shot composition and publish it for others.
                  </Text>
                  <SPButton
                    label="+ Create Template"
                    variant="primary"
                    size="sm"
                    onPress={() => router.push('/template-creator')}
                    accessibilityLabel="Create Template"
                    style={{ marginTop: 12 }}
                  />
                </View>
              ) : (
                <View style={styles.templatesGrid}>
                  {userTemplates.map((tpl) => (
                    <AnimatedPressable
                      key={tpl.id}
                      onPress={() => router.push({ pathname: '/template/[id]', params: { id: tpl.id } })}
                      style={styles.templateCard}
                    >
                      <Image source={{ uri: tpl.imageUrl }} style={styles.templateImg} />
                      <View style={styles.templateOverlay} />
                      <Text style={styles.templateCardTitle} numberOfLines={2}>{tpl.title}</Text>
                    </AnimatedPressable>
                  ))}
                </View>
              )}
            </View>
          )}

          {activeTab === 'remixes' && (
            <View>
              {userRemixes.length === 0 ? (
                <View style={styles.emptyState}>
                  <SPIcon name="refresh" size={32} color={Colors.muted} />
                  <Text style={[styles.emptyStateTitle, { color: theme.colors.textPrimary }]}>
                    No remixes yet
                  </Text>
                  <Text style={[styles.emptyStateSub, { color: theme.colors.textSecondary }]}>
                    Explore trending templates and tap 'Remix' to add your unique touch.
                  </Text>
                </View>
              ) : (
                <View style={styles.templatesGrid}>
                  {userRemixes.map((tpl) => (
                    <AnimatedPressable
                      key={tpl.id}
                      onPress={() => router.push({ pathname: '/template/[id]', params: { id: tpl.id } })}
                      style={styles.templateCard}
                    >
                      <Image source={{ uri: tpl.imageUrl }} style={styles.templateImg} />
                      <Text style={styles.templateCardTitle} numberOfLines={2}>{tpl.title}</Text>
                    </AnimatedPressable>
                  ))}
                </View>
              )}
            </View>
          )}

          {activeTab === 'favorites' && (
            <View>
              {favorites.length === 0 ? (
                <View style={styles.emptyState}>
                  <SPIcon name="heart" size={32} color={Colors.muted} />
                  <Text style={[styles.emptyStateTitle, { color: theme.colors.textPrimary }]}>
                    No saved poses
                  </Text>
                  <Text style={[styles.emptyStateSub, { color: theme.colors.textSecondary }]}>
                    Heart poses and templates to access them quickly while shooting.
                  </Text>
                </View>
              ) : (
                <View style={styles.templatesGrid}>
                  {favorites.slice(0, 12).map((fav) => (
                    <AnimatedPressable
                      key={fav.id}
                      onPress={() => router.push({ pathname: '/pose/[id]', params: { id: fav.id } })}
                      style={styles.templateCard}
                    >
                      <Image source={{ uri: fav.imageUrl }} style={styles.templateImg} />
                      <Text style={styles.templateCardTitle} numberOfLines={2}>{fav.title}</Text>
                    </AnimatedPressable>
                  ))}
                </View>
              )}
            </View>
          )}

          {activeTab === 'achievements' && (
            <View style={styles.achievementsList}>
              {achievements.map((ach) => (
                <View
                  key={ach.id}
                  style={[
                    styles.achievementCard,
                    {
                      backgroundColor: isDark ? Colors.darkCardBackground : Colors.surface,
                      borderColor: ach.isUnlocked ? Colors.lime : isDark ? Colors.borderDark : Colors.border,
                    },
                  ]}
                >
                  <View style={[styles.achIcon, { backgroundColor: ach.isUnlocked ? Colors.olive : 'rgba(128,128,128,0.2)' }]}>
                    <SPIcon name={ach.icon as any} size={18} color={ach.isUnlocked ? '#FFF' : Colors.muted} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.achTitle, { color: theme.colors.textPrimary }]}>
                      {ach.title}
                    </Text>
                    <Text style={[styles.achDesc, { color: theme.colors.textSecondary }]}>
                      {ach.description}
                    </Text>
                  </View>
                  <Text style={[styles.achXp, { color: ach.isUnlocked ? Colors.lime : Colors.muted }]}>
                    +{ach.xpReward} XP
                  </Text>
                </View>
              ))}
            </View>
          )}

          {activeTab === 'photos' && (
            <View>
              {historyStore.attempts.length === 0 ? (
                <View style={styles.emptyState}>
                  <SPIcon name="camera" size={32} color={Colors.muted} />
                  <Text style={[styles.emptyStateTitle, { color: theme.colors.textPrimary }]}>
                    No captures yet
                  </Text>
                  <Text style={[styles.emptyStateSub, { color: theme.colors.textSecondary }]}>
                    Align with reference poses in the camera to record your attempts.
                  </Text>
                </View>
              ) : (
                <View style={styles.photosGrid}>
                  {historyStore.attempts.map((att) => (
                    <View key={att.id} style={styles.photoThumb}>
                      {att.photoUri ? (
                        <Image source={{ uri: att.photoUri }} style={StyleSheet.absoluteFill} />
                      ) : (
                        <View style={styles.photoPlaceholder}>
                          <SPIcon name="portrait" size={20} color={Colors.muted} />
                        </View>
                      )}
                      <View style={styles.photoScoreBadge}>
                        <Text style={styles.photoScoreText}>{att.score}%</Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}
        </View>

        {/* Account & GDPR Settings Section */}
        <View style={styles.accountSection}>
          <Text style={[styles.accountSectionTitle, { color: theme.colors.textSecondary }]}>
            PRIVACY & DATA CONTROLS
          </Text>

          <AnimatedPressable onPress={handleExportData} style={styles.accountRow}>
            <SPIcon name="download" size={16} color={Colors.olive} />
            <Text style={[styles.accountRowText, { color: theme.colors.textPrimary }]}>
              Export Personal Data (GDPR JSON)
            </Text>
            <SPIcon name="arrowRight" size={14} color={theme.colors.textSecondary} />
          </AnimatedPressable>

          <AnimatedPressable onPress={() => router.push('/(auth)/terms')} style={styles.accountRow}>
            <SPIcon name="info" size={16} color={theme.colors.textSecondary} />
            <Text style={[styles.accountRowText, { color: theme.colors.textPrimary }]}>
              Terms of Service
            </Text>
            <SPIcon name="arrowRight" size={14} color={theme.colors.textSecondary} />
          </AnimatedPressable>

          <AnimatedPressable onPress={() => router.push('/(auth)/privacy')} style={styles.accountRow}>
            <SPIcon name="privacy" size={16} color={theme.colors.textSecondary} />
            <Text style={[styles.accountRowText, { color: theme.colors.textPrimary }]}>
              Privacy Policy
            </Text>
            <SPIcon name="arrowRight" size={14} color={theme.colors.textSecondary} />
          </AnimatedPressable>

          <AnimatedPressable onPress={handleSignOut} style={styles.accountRow}>
            <SPIcon name="share" size={16} color={theme.colors.textSecondary} />
            <Text style={[styles.accountRowText, { color: theme.colors.textPrimary }]}>
              Sign Out
            </Text>
            <SPIcon name="arrowRight" size={14} color={theme.colors.textSecondary} />
          </AnimatedPressable>

          <AnimatedPressable onPress={handleDeleteAccount} style={styles.accountRow}>
            <SPIcon name="trash" size={16} color={Colors.error} />
            <Text style={[styles.accountRowText, { color: Colors.error }]}>
              Delete Account Permanently
            </Text>
            <SPIcon name="arrowRight" size={14} color={Colors.error} />
          </AnimatedPressable>
        </View>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal visible={isEditModalOpen} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <View
            style={[
              styles.modalSheet,
              {
                backgroundColor: isDark ? '#222' : '#FFF',
                paddingBottom: insets.bottom + Spacing.lg,
              },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.colors.textPrimary }]}>
                Edit Director Profile
              </Text>
              <Pressable onPress={() => setIsEditModalOpen(false)}>
                <SPIcon name="close" size={20} color={theme.colors.textPrimary} />
              </Pressable>
            </View>

            <View style={styles.modalInputGroup}>
              <Text style={styles.modalLabel}>DISPLAY NAME</Text>
              <TextInput
                value={editName}
                onChangeText={setEditName}
                style={[
                  styles.modalInput,
                  {
                    color: theme.colors.textPrimary,
                    borderColor: isDark ? Colors.borderDark : Colors.border,
                  },
                ]}
              />
            </View>

            <View style={styles.modalInputGroup}>
              <Text style={styles.modalLabel}>USERNAME HANDLE</Text>
              <TextInput
                value={editHandle}
                onChangeText={setEditHandle}
                style={[
                  styles.modalInput,
                  {
                    color: theme.colors.textPrimary,
                    borderColor: isDark ? Colors.borderDark : Colors.border,
                  },
                ]}
              />
            </View>

            <View style={styles.modalInputGroup}>
              <Text style={styles.modalLabel}>BIO</Text>
              <TextInput
                value={editBioText}
                onChangeText={setEditBioText}
                multiline
                numberOfLines={3}
                style={[
                  styles.modalInput,
                  {
                    color: theme.colors.textPrimary,
                    borderColor: isDark ? Colors.borderDark : Colors.border,
                    height: 70,
                    textAlignVertical: 'top',
                  },
                ]}
              />
            </View>

            <SPButton
              label="Save Changes"
              variant="primary"
              size="lg"
              onPress={handleSaveProfile}
              accessibilityLabel="Save profile changes"
              style={{ marginTop: 8 }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 16, fontWeight: '700' },
  settingsBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  scroll: { flex: 1 },
  profileCard: {
    padding: Spacing.md,
  },
  profileTopRow: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 24, fontWeight: '800', color: '#FFF' },
  profileMeta: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  displayName: { fontSize: 18, fontWeight: '800' },
  verifiedBadge: {
    backgroundColor: Colors.lime,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedText: { fontSize: 9, fontWeight: '800', color: '#000' },
  handleText: { fontSize: 12, color: Colors.olive, fontWeight: '700', marginTop: 1 },
  editProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  editProfileText: { fontSize: 11, fontWeight: '600' },
  bioText: { fontSize: 13, lineHeight: 18, marginVertical: Spacing.xs },
  levelCard: {
    padding: Spacing.md,
    borderRadius: BorderRadius.card,
    marginVertical: Spacing.sm,
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  levelBadgeText: { fontSize: 11, fontWeight: '800', color: Colors.lime, letterSpacing: 0.5 },
  streakText: { fontSize: 11, fontWeight: '700', color: '#FFA500' },
  xpTrack: {
    height: 5,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  xpFill: {
    height: '100%',
    backgroundColor: Colors.lime,
    borderRadius: 3,
  },
  xpSubtext: { fontSize: 10, color: 'rgba(255,255,255,0.5)', textAlign: 'right' },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: Spacing.sm,
  },
  statBox: { alignItems: 'center' },
  statNum: { fontSize: 18, fontWeight: '800' },
  statLbl: { fontSize: 11, marginTop: 2 },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingHorizontal: Spacing.md,
  },
  tabBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  tabBtnActive: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.lime,
  },
  tabBtnText: { fontSize: 12, fontWeight: '600' },
  tabBody: {
    padding: Spacing.md,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  emptyStateTitle: { fontSize: 15, fontWeight: '700', marginTop: 8 },
  emptyStateSub: { fontSize: 12, textAlign: 'center', marginTop: 4, paddingHorizontal: 20 },
  templatesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  templateCard: {
    width: (SCREEN_WIDTH - Spacing.md * 2 - 8) / 2,
    height: 160,
    borderRadius: BorderRadius.card,
    overflow: 'hidden',
    backgroundColor: '#222',
    position: 'relative',
    justifyContent: 'flex-end',
    padding: 8,
  },
  templateImg: {
    ...StyleSheet.absoluteFillObject,
  },
  templateOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  templateCardTitle: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  achievementsList: {
    gap: 8,
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.sm,
    borderRadius: BorderRadius.card,
    borderWidth: 1,
    gap: 12,
  },
  achIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  achTitle: { fontSize: 13, fontWeight: '700' },
  achDesc: { fontSize: 11, marginTop: 1 },
  achXp: { fontSize: 12, fontWeight: '800' },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  photoThumb: {
    width: PHOTO_GRID_SIZE,
    height: PHOTO_GRID_SIZE,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    backgroundColor: '#222',
    position: 'relative',
  },
  photoPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoScoreBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 6,
  },
  photoScoreText: { color: Colors.lime, fontSize: 9, fontWeight: '800' },
  accountSection: {
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.lg,
  },
  accountSectionTitle: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: Spacing.sm,
  },
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(128,128,128,0.15)',
    gap: 10,
  },
  accountRowText: { fontSize: 13, fontWeight: '600', flex: 1 },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    borderTopLeftRadius: BorderRadius.card,
    borderTopRightRadius: BorderRadius.card,
    padding: Spacing.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  modalTitle: { fontSize: 16, fontWeight: '800' },
  modalInputGroup: { marginBottom: Spacing.md },
  modalLabel: { fontSize: 10, fontWeight: '800', color: Colors.muted, marginBottom: 4 },
  modalInput: {
    borderWidth: 1,
    borderRadius: BorderRadius.card,
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    fontSize: 13,
  },
});
