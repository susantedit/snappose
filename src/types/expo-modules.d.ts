declare module 'expo-image' {
  import React from 'react';
  import { ImageStyle, StyleProp } from 'react-native';

  export type ImageSource =
    | string
    | number
    | {
        uri?: string;
        width?: number;
        height?: number;
        headers?: Record<string, string>;
      };

  export interface ImageProps {
    source?: ImageSource | ImageSource[] | null;
    style?: StyleProp<ImageStyle>;
    contentFit?: 'cover' | 'contain' | 'fill' | 'scale-down' | 'none';
    transition?: number;
    cachePolicy?: 'memory-disk' | 'disk' | 'memory' | 'none';
    priority?: 'low' | 'normal' | 'high';
    recyclingKey?: string;
    onLoad?: (event: any) => void;
    onError?: (event: any) => void;
    accessibilityLabel?: string;
    accessibilityElementsHidden?: boolean;
    children?: React.ReactNode;
  }

  export interface ImagePrefetchOptions {
    cachePolicy?: 'memory-disk' | 'disk' | 'memory' | 'none';
    headers?: Record<string, string>;
  }

  export const Image: React.ComponentType<ImageProps> & {
    prefetch(urls: string | string[], options?: ImagePrefetchOptions): Promise<boolean>;
    clearMemoryCache(): Promise<boolean>;
    clearDiskCache(): Promise<boolean>;
  };
}

declare module 'expo-notifications' {
  export enum AndroidNotificationPriority {
    MIN = 'min',
    LOW = 'low',
    DEFAULT = 'default',
    HIGH = 'high',
    MAX = 'max',
  }

  export enum AndroidImportance {
    UNKNOWN = 0,
    UNSPECIFIED = 1,
    NONE = 2,
    MIN = 3,
    LOW = 4,
    DEFAULT = 5,
    HIGH = 6,
    MAX = 7,
  }

  export enum AndroidNotificationVisibility {
    UNKNOWN = 0,
    PUBLIC = 1,
    PRIVATE = 2,
    SECRET = 3,
  }

  export interface NotificationChannelInput {
    name: string;
    importance: AndroidImportance;
    vibrationPattern?: number[];
    sound?: string | null;
    lockscreenVisibility?: AndroidNotificationVisibility;
    enableVibrate?: boolean;
    enableLights?: boolean;
    lightColor?: string;
  }

  export interface NotificationContentInput {
    title?: string;
    body?: string;
    data?: Record<string, any>;
    sound?: boolean | string;
    priority?: AndroidNotificationPriority;
    vibrate?: number[];
  }

  export interface NotificationRequestInput {
    content: NotificationContentInput;
    trigger?: null | { seconds?: number };
  }

  export function setNotificationHandler(handler: {
    handleNotification: () => Promise<{
      shouldShowAlert?: boolean;
      shouldShowBanner?: boolean;
      shouldShowList?: boolean;
      shouldPlaySound: boolean;
      shouldSetBadge: boolean;
      priority?: AndroidNotificationPriority;
    }>;
  }): void;

  export function getPermissionsAsync(): Promise<{ status: 'granted' | 'denied' | 'undetermined' }>;
  export function requestPermissionsAsync(): Promise<{ status: 'granted' | 'denied' | 'undetermined' }>;
  export function scheduleNotificationAsync(request: NotificationRequestInput): Promise<string>;
  export function cancelAllScheduledNotificationsAsync(): Promise<void>;
  export function setNotificationChannelAsync(
    channelId: string,
    channel: NotificationChannelInput,
  ): Promise<NotificationChannelInput | null>;
}
