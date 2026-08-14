/**
 * Zustand authStore — manages authentication state and session.
 * [Req 3, 26]
 */

import { create } from 'zustand';
import type { AppUser } from '../features/auth/types';
import { firebaseAuthAdapter } from '../features/auth/infrastructure/FirebaseAuthAdapter';

interface AuthState {
  user: AppUser | null;
  isLoading: boolean;
  error: string | null;
  initialize: () => () => void;
  signInAnonymously: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  error: null,

  initialize: () => {
    set({ isLoading: true });
    // Set initial user if exists
    const initialUser = firebaseAuthAdapter.getCurrentUser();
    if (initialUser) {
      set({ user: initialUser, isLoading: false });
    }

    const unsubscribe = firebaseAuthAdapter.onAuthStateChanged((user) => {
      set({ user, isLoading: false });
    });

    return unsubscribe;
  },

  signInAnonymously: async () => {
    set({ isLoading: true, error: null });
    try {
      const user = await firebaseAuthAdapter.signInAnonymously();
      set({ user, isLoading: false });
    } catch (err: any) {
      set({ error: err?.message || 'Anonymous sign-in failed', isLoading: false });
    }
  },

  signInWithGoogle: async () => {
    set({ isLoading: true, error: null });
    try {
      const user = await firebaseAuthAdapter.signInWithGoogle();
      set({ user, isLoading: false });
    } catch (err: any) {
      set({ error: err?.message || 'Google sign-in failed', isLoading: false });
    }
  },

  signInWithEmail: async (email: string, pass: string) => {
    set({ isLoading: true, error: null });
    try {
      const user = await firebaseAuthAdapter.signInWithEmail(email, pass);
      set({ user, isLoading: false });
    } catch (err: any) {
      set({ error: err?.message || 'Email sign-in failed', isLoading: false });
    }
  },

  signOut: async () => {
    set({ isLoading: true, error: null });
    try {
      await firebaseAuthAdapter.signOut();
      set({ user: null, isLoading: false });
    } catch (err: any) {
      set({ error: err?.message || 'Sign-out failed', isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
