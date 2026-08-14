/**
 * SPSearchBar — debounced search input with clear button.
 * Used on the Home and Search screens.
 * Debounce delay configurable (default 200 ms per Req 6.1).
 * [Req 4.1, 6.1]
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useTheme } from '@/constants/theme';
import { BorderRadius, Colors, Spacing, Typography } from '@/constants/designTokens';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SPSearchBarProps {
  /** Placeholder text shown when empty. */
  placeholder?: string;
  /** Current raw value (controlled). */
  value?: string;
  /** Called immediately on every keystroke (unthrottled). */
  onChangeText?: (text: string) => void;
  /** Called after the debounce window elapses. */
  onDebouncedChange?: (text: string) => void;
  /** Debounce delay in ms. Defaults to 200. */
  debounceMs?: number;
  /** Called when the input is focused. */
  onFocus?: () => void;
  /** Called when the input loses focus. */
  onBlur?: () => void;
  /** Additional container style. */
  style?: StyleProp<ViewStyle>;
  /** Whether the search bar is read-only / non-interactive (e.g. tappable header). */
  readOnly?: boolean;
  /** Called when the bar is pressed in readOnly mode. */
  onPress?: () => void;
  /** accessibilityLabel override. */
  accessibilityLabel?: string;
}

// ---------------------------------------------------------------------------
// SPSearchBar
// ---------------------------------------------------------------------------

export function SPSearchBar({
  placeholder = 'Search poses…',
  value,
  onChangeText,
  onDebouncedChange,
  debounceMs = 200,
  onFocus,
  onBlur,
  style,
  readOnly = false,
  onPress,
  accessibilityLabel = 'Search poses',
}: SPSearchBarProps) {
  const { theme } = useTheme();
  const [localText, setLocalText] = useState(value ?? '');
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep local state in sync when controlled value changes externally
  useEffect(() => {
    if (value !== undefined && value !== localText) {
      setLocalText(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleChange = useCallback(
    (text: string) => {
      setLocalText(text);
      onChangeText?.(text);

      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => {
        onDebouncedChange?.(text);
      }, debounceMs);
    },
    [onChangeText, onDebouncedChange, debounceMs],
  );

  const handleClear = useCallback(() => {
    handleChange('');
  }, [handleChange]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  const isDark = theme.mode === 'dark';
  const bgColor = isDark ? '#2A2A2A' : '#FFFFFF';
  const borderColor = isDark ? Colors.borderDark : Colors.border;
  const textColor = isDark ? '#FFFFFF' : Colors.textPrimary;
  const placeholderColor = isDark ? '#666666' : Colors.textDisabled;

  if (readOnly) {
    return (
      <Pressable
        onPress={onPress}
        style={[styles.container, { backgroundColor: bgColor, borderColor }, style]}
        accessibilityRole="search"
        accessibilityLabel={accessibilityLabel}
        accessibilityHint="Tap to search poses"
      >
        <Text style={[styles.searchIcon, { color: placeholderColor }]}>🔍</Text>
        <Text style={[styles.placeholder, { color: placeholderColor }]}>{placeholder}</Text>
      </Pressable>
    );
  }

  return (
    <View
      style={[styles.container, { backgroundColor: bgColor, borderColor }, style]}
      accessibilityRole="search"
    >
      <Text style={[styles.searchIcon, { color: placeholderColor }]}>🔍</Text>
      <TextInput
        value={localText}
        onChangeText={handleChange}
        placeholder={placeholder}
        placeholderTextColor={placeholderColor}
        style={[styles.input, { color: textColor }]}
        onFocus={onFocus}
        onBlur={onBlur}
        returnKeyType="search"
        clearButtonMode="never"
        accessibilityLabel={accessibilityLabel}
        accessibilityHint="Type to search for poses"
        autoCorrect={false}
        autoCapitalize="none"
      />
      {localText.length > 0 && (
        <Pressable
          onPress={handleClear}
          style={styles.clearButton}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Clear search"
        >
          <Text style={[styles.clearIcon, { color: placeholderColor }]}>✕</Text>
        </Pressable>
      )}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    gap: Spacing.xs,
  },
  searchIcon: {
    fontSize: 16,
    lineHeight: 20,
    flexShrink: 0,
  },
  input: {
    flex: 1,
    fontSize: Typography.sizes.body,
    paddingVertical: 0, // remove Android top/bottom padding
  },
  placeholder: {
    flex: 1,
    fontSize: Typography.sizes.body,
  },
  clearButton: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  clearIcon: {
    fontSize: 12,
    fontWeight: '600',
  },
});
