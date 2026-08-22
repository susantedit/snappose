/**
 * SPSearchBar — debounced search input with clear button.
 * Used on the Home and Search screens.
 * Debounce delay configurable (default 200 ms per Req 6.1).
 * All icons rendered via crisp SVG SPIcon components.
 * [Req 4.1, 6.1]
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  TextInput,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useTheme } from '@/constants/theme';
import { BorderRadius, Colors, Spacing, Typography } from '@/constants/designTokens';
import { SPIcon } from '@/components/atoms/SPIcon';

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
  const inputRef = useRef<TextInput>(null);
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
    inputRef.current?.focus();
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
  const placeholderColor = isDark ? '#888888' : Colors.textDisabled;

  const handleContainerPress = () => {
    if (readOnly) {
      onPress?.();
    } else {
      inputRef.current?.focus();
    }
  };

  return (
    <Pressable
      onPress={handleContainerPress}
      style={[styles.container, { backgroundColor: bgColor, borderColor }, style]}
      accessibilityRole="search"
      accessibilityLabel={accessibilityLabel}
    >
      <SPIcon name="search" size={18} color={placeholderColor} strokeWidth={2.2} />
      <TextInput
        ref={inputRef}
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
        editable={!readOnly}
      />
      {localText.length > 0 && !readOnly && (
        <Pressable
          onPress={handleClear}
          style={styles.clearButton}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Clear search"
        >
          <SPIcon name="close" size={14} color={placeholderColor} strokeWidth={2.4} />
        </Pressable>
      )}
    </Pressable>
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
    gap: Spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: Typography.sizes.body,
    paddingVertical: 0,
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
});
