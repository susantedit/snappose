/**
 * Zustand authStore — manages authentication state and session.
 * [Req 3, 26]
 */

import { create } from 'zustand';
import type { AppUser } from '../features/auth/types';
import { firebaseAuthAdapter } from '../features/auth/infrastructure/FirebaseAuthAdapter';
import { setTokenProvider } from '../services/api/client';

interface AuthState {
  user: AppUser | null;
  isLoading: boolean;
  error: string | null;
  initialize: () => () => void;
  signInAnonymously: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUp: (email: string, pass: string, displayName?: string) => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  sendEmailVerification: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  error: null,

  initialize: () => {
    set({ isLoading: true });

    // Wire the API client so every request attaches a fresh Firebase ID token.
    // Without this, the request interceptor has no token provider and all
    // protected backend routes (captures, favorites, …) silently 401.
    setTokenProvider(() => firebaseAuthAdapter.getIdToken());

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

  signUp: async (email: string, pass: string, displayName?: string) => {
    set({ isLoading: true, error: null });
    try {
      const user = await firebaseAuthAdapter.signUp(email, pass, displayName);
      set({ user, isLoading: false });
    } catch (err: any) {
      set({ error: err?.message || 'Sign-up failed', isLoading: false });
    }
  },

  sendPasswordReset: async (email: string) => {
    set({ isLoading: true, error: null });
    try {
      await firebaseAuthAdapter.sendPasswordReset(email);
      set({ isLoading: false });
    } catch (err: any) {
      set({ error: err?.message || 'Password reset failed', isLoading: false });
    }
  },

  sendEmailVerification: async () => {
    set({ isLoading: true, error: null });
    try {
      await firebaseAuthAdapter.sendEmailVerification();
      set({ isLoading: false });
    } catch (err: any) {
      set({ error: err?.message || 'Failed to send verification email', isLoading: false });
    }
  },

  deleteAccount: async () => {
    set({ isLoading: true, error: null });
    try {
      await firebaseAuthAdapter.deleteAccount();
      set({ user: null, isLoading: false });
    } catch (err: any) {
      set({ error: err?.message || 'Delete account failed', isLoading: false });
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
