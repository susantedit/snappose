/**
 * Type declarations for expo-router.
 */

declare module 'expo-router' {
  import React from 'react';

  export interface Router {
    push: (href: string | { pathname: string; params?: Record<string, any> }) => void;
    replace: (href: string | { pathname: string; params?: Record<string, any> }) => void;
    back: () => void;
    canGoBack: () => boolean;
    setParams: (params: Record<string, any>) => void;
    navigate: (href: string | { pathname: string; params?: Record<string, any> }) => void;
  }

  export const router: Router;
  export function useRouter(): Router;
  export function useLocalSearchParams<T extends Record<string, any> = Record<string, any>>(): T;
  export function useGlobalSearchParams<T extends Record<string, any> = Record<string, any>>(): T;
  export function usePathname(): string;
  export function useSegments(): string[];
  export function useFocusEffect(effect: React.EffectCallback): void;

  export const Stack: any;
  export const Tabs: any;
  export const Slot: any;
  export const Link: any;
  export const Redirect: any;
}
