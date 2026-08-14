import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useTheme } from '@/constants/theme';
import { Spacing, Typography, BorderRadius, Colors } from '@/constants/designTokens';

/**
 * Category screen — displays the filtered pose list for a given category slug.
 *
 * Full implementation delivered in Task 10 (2-column FlashList grid, shared-
 * element hero transition, SQLite-first + API background refresh).
 *
 * Deep-link entry: snappose://category/[slug]   [Req 47.2]
 * [Req 5]
 */
export default function CategoryScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { theme } = useTheme();

  // ---------------------------------------------------------------------------
  // The data-fetching hook is wired in Task 10. Represent mandatory states so
  // the screen is never blank. [Req 35.7]
  // ---------------------------------------------------------------------------
  const isLoading = false;
  const isError = false;
  const isEmpty = !slug;

  if (isLoading) {
    return (
      <View
        style={[styles.centred, { backgroundColor: theme.colors.background }]}
        accessibilityLabel="Loading category poses"
      >
        <ActivityIndicator
          size="large"
          color={theme.colors.olive}
          accessibilityElementsHidden
        />
        <Text
          style={[styles.stateText, { color: theme.colors.textSecondary }]}
          accessibilityLiveRegion="polite"
        >
          Loading poses…
        </Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View
        style={[styles.centred, { backgroundColor: theme.colors.background }]}
      >
        <Text style={[styles.errorTitle, { color: theme.colors.textPrimary }]}>
          Something went wrong
        </Text>
        <Text style={[styles.stateText, { color: theme.colors.textSecondary }]}>
          We couldn't load this category. Check your connection and try again.
        </Text>
        <Pressable
          style={[styles.button, { backgroundColor: theme.colors.olive }]}
          accessibilityRole="button"
          accessibilityLabel="Retry loading category"
          onPress={() => {
            // retry wired in Task 10
          }}
        >
          <Text style={styles.buttonText}>Retry</Text>
        </Pressable>
        <Pressable
          style={styles.backLink}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={() => router.back()}
        >
          <Text style={[styles.backLinkText, { color: theme.colors.olive }]}>
            ← Go back
          </Text>
        </Pressable>
      </View>
    );
  }

  if (isEmpty) {
    return (
      <View
        style={[styles.centred, { backgroundColor: theme.colors.background }]}
      >
        <Text style={[styles.errorTitle, { color: theme.colors.textPrimary }]}>
          No poses found
        </Text>
        <Text style={[styles.stateText, { color: theme.colors.textSecondary }]}>
          There are no poses in this category yet.
        </Text>
        <Pressable
          style={[styles.button, { backgroundColor: theme.colors.olive }]}
          accessibilityRole="button"
          accessibilityLabel="Explore all categories"
          onPress={() => router.push('/(tabs)/search')}
        >
          <Text style={styles.buttonText}>Explore Categories</Text>
        </Pressable>
      </View>
    );
  }

  // ---------------------------------------------------------------------------
  // Content state — scaffold replaced by full FlashList grid in Task 10.
  // ---------------------------------------------------------------------------
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Back navigation */}
      <Pressable
        style={styles.backLink}
        accessibilityRole="button"
        accessibilityLabel="Go back"
        onPress={() => router.back()}
      >
        <Text style={[styles.backLinkText, { color: theme.colors.olive }]}>
          ← Back
        </Text>
      </Pressable>

      {/* Category header */}
      <Text
        style={[styles.categoryTitle, { color: theme.colors.textPrimary }]}
        accessibilityRole="header"
      >
        {slug
          ? slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ')
          : 'Category'}
      </Text>

      <Text style={[styles.stateText, { color: theme.colors.textSecondary }]}>
        Full grid with FlashList implemented in Task 10.
      </Text>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.md,
  },
  centred: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  stateText: {
    fontSize: Typography.sizes.body,
    textAlign: 'center',
    marginTop: Spacing.xs,
    lineHeight: 24,
  },
  errorTitle: {
    fontSize: Typography.sizes.h3,
    fontWeight: Typography.weights.semibold,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  button: {
    marginTop: Spacing.lg,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.button,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: Colors.textInverse,
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.semibold,
  },
  backLink: {
    paddingVertical: Spacing.sm,
    minHeight: 48,
    justifyContent: 'center',
  },
  backLinkText: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.medium,
  },
  categoryTitle: {
    fontSize: Typography.sizes.h2,
    fontWeight: Typography.weights.bold,
    marginBottom: Spacing.sm,
    marginTop: Spacing.xs,
  },
});
