/**
 * Firebase Authentication implementation of AuthAdapter.
 * Uses @react-native-firebase/auth with Expo SecureStore for token caching.
 * Safely falls back to local guest user when native Firebase is unavailable.
 * [Req 3, 26, 47.5]
 */

import { NativeModules, Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import type { AuthAdapter } from '../domain/interfaces/AuthAdapter';
import type { AppUser, AuthProvider } from '../types';

const SECURE_STORE_TOKEN_KEY = 'sp_firebase_id_token';
const SECURE_STORE_UID_KEY = 'sp_firebase_uid';

function isNativeFirebaseAvailable(): boolean {
  if (Platform.OS === 'web') return false;
  return Boolean(
    NativeModules &&
    (NativeModules.RNFBAppModule || NativeModules.RNFBAuthModule)
  );
}

let authModuleInstance: any = undefined;

function getAuth() {
  if (authModuleInstance !== undefined) {
    return authModuleInstance;
  }

  if (!isNativeFirebaseAvailable()) {
    authModuleInstance = null;
    return null;
  }

  try {
    const m = require('@react-native-firebase/auth');
    const fn = m?.default || m;
    authModuleInstance = typeof fn === 'function' ? fn : null;
  } catch {
    authModuleInstance = null;
  }
  return authModuleInstance;
}

function mapFirebaseUser(user: any): AppUser | null {
  if (!user) return null;

  let provider: AuthProvider = 'anonymous';
  if (user.providerData && user.providerData.length > 0) {
    const providerId = user.providerData[0].providerId;
    if (providerId.includes('google')) {
      provider = 'google';
    } else if (providerId.includes('password')) {
      provider = 'email';
    }
  }

  return {
    uid: user.uid,
    displayName: user.displayName || 'POSEHANUM User',
    email: user.email || null,
    photoURL: user.photoURL || null,
    provider,
    isAnonymous: user.isAnonymous ?? true,
  };
}

export class FirebaseAuthAdapter implements AuthAdapter {
  private static instance: FirebaseAuthAdapter;
  private localUser: AppUser | null = {
    uid: 'guest_user_snappose',
    displayName: 'Guest Photographer',
    email: null,
    photoURL: null,
    provider: 'anonymous',
    isAnonymous: true,
  };

  private constructor() {}

  public static getInstance(): FirebaseAuthAdapter {
    if (!FirebaseAuthAdapter.instance) {
      FirebaseAuthAdapter.instance = new FirebaseAuthAdapter();
    }
    return FirebaseAuthAdapter.instance;
  }

  async signInAnonymously(): Promise<AppUser> {
    const authFn = getAuth();
    if (!authFn) {
      return this.localUser!;
    }
    try {
      const userCredential = await authFn().signInAnonymously();
      const token = await userCredential.user.getIdToken();
      await this.saveTokens(userCredential.user.uid, token);
      const appUser = mapFirebaseUser(userCredential.user);
      if (!appUser) throw new Error('Failed to map user after anonymous sign-in');
      this.localUser = appUser;
      return appUser;
    } catch (error) {
      console.warn('[FirebaseAuthAdapter] signInAnonymously fallback to local:', error);
      return this.localUser!;
    }
  }

  async signInWithGoogle(): Promise<AppUser> {
    const authFn = getAuth();
    if (!authFn) {
      const googleUser: AppUser = {
        uid: 'user_google_demouser',
        displayName: 'Google Photographer',
        email: 'user@gmail.com',
        photoURL: null,
        provider: 'google',
        isAnonymous: false,
      };
      this.localUser = googleUser;
      await this.saveTokens(googleUser.uid, 'mock_google_token');
      return googleUser;
    }
    try {
      const currentUser = authFn().currentUser;
      if (!currentUser) {
        throw new Error('Google Sign-In requires active Google authentication flow');
      }
      const token = await currentUser.getIdToken();
      await this.saveTokens(currentUser.uid, token);
      const appUser = mapFirebaseUser(currentUser);
      if (!appUser) throw new Error('Failed to map user after Google sign-in');
      this.localUser = appUser;
      return appUser;
    } catch (error) {
      console.warn('[FirebaseAuthAdapter] signInWithGoogle error:', error);
      throw error;
    }
  }

  async signInWithEmail(email: string, password: string): Promise<AppUser> {
    const authFn = getAuth();
    if (!authFn) {
      const emailUser: AppUser = {
        uid: `user_${email.replace(/[^a-zA-Z0-9]/g, '_')}`,
        displayName: email.split('@')[0] || 'Photographer',
        email,
        photoURL: null,
        provider: 'email',
        isAnonymous: false,
      };
      this.localUser = emailUser;
      await this.saveTokens(emailUser.uid, 'mock_email_token');
      return emailUser;
    }
    try {
      const userCredential = await authFn().signInWithEmailAndPassword(email, password);
      const token = await userCredential.user.getIdToken();
      await this.saveTokens(userCredential.user.uid, token);
      const appUser = mapFirebaseUser(userCredential.user);
      if (!appUser) throw new Error('Failed to map user after email sign-in');
      this.localUser = appUser;
      return appUser;
    } catch (error) {
      console.warn('[FirebaseAuthAdapter] signInWithEmail error:', error);
      throw error;
    }
  }

  async signOut(): Promise<void> {
    const authFn = getAuth();
    if (authFn) {
      try {
        await authFn().signOut();
      } catch {}
    }
    await this.clearTokens();
    this.localUser = null;
  }

  getCurrentUser(): AppUser | null {
    const authFn = getAuth();
    if (!authFn) {
      return this.localUser;
    }
    try {
      return mapFirebaseUser(authFn().currentUser) ?? this.localUser;
    } catch {
      return this.localUser;
    }
  }

  async getIdToken(): Promise<string> {
    const authFn = getAuth();
    if (authFn) {
      try {
        const currentUser = authFn().currentUser;
        if (currentUser) {
          const token = await currentUser.getIdToken(false);
          await this.saveTokens(currentUser.uid, token);
          return token;
        }
      } catch {}
    }
    const cachedToken = await SecureStore.getItemAsync(SECURE_STORE_TOKEN_KEY);
    return cachedToken || 'guest_token';
  }

  onAuthStateChanged(callback: (user: AppUser | null) => void): () => void {
    const authFn = getAuth();
    if (!authFn) {
      callback(this.localUser);
      return () => {};
    }
    try {
      return authFn().onAuthStateChanged((user: any) => {
        const appUser = mapFirebaseUser(user);
        callback(appUser);
      });
    } catch {
      callback(this.localUser);
      return () => {};
    }
  }

  async signUp(email: string, password: string, displayName?: string): Promise<AppUser> {
    const authFn = getAuth();
    if (!authFn) {
      const guest: AppUser = {
        uid: `local_user_${Date.now()}`,
        displayName: displayName || email.split('@')[0] || 'POSEHANUM User',
        email,
        photoURL: null,
        provider: 'email',
        isAnonymous: false,
      };
      this.localUser = guest;
      await this.saveTokens(guest.uid, 'mock_signup_token');
      return guest;
    }
    try {
      const userCredential = await authFn().createUserWithEmailAndPassword(email, password);
      if (displayName) {
        try {
          await userCredential.user.updateProfile({ displayName });
        } catch {}
      }
      const token = await userCredential.user.getIdToken();
      await this.saveTokens(userCredential.user.uid, token);
      const appUser = mapFirebaseUser({ ...userCredential.user, displayName: displayName || userCredential.user.displayName });
      if (!appUser) throw new Error('Failed to map user after sign-up');
      this.localUser = appUser;
      return appUser;
    } catch (error) {
      console.warn('[FirebaseAuthAdapter] signUp error:', error);
      throw error;
    }
  }

  async sendPasswordReset(email: string): Promise<void> {
    const authFn = getAuth();
    if (!authFn) return;
    try {
      await authFn().sendPasswordResetEmail(email);
    } catch (error) {
      console.warn('[FirebaseAuthAdapter] sendPasswordReset error:', error);
      throw error;
    }
  }

  async sendEmailVerification(): Promise<void> {
    const authFn = getAuth();
    if (!authFn) return;
    try {
      const currentUser = authFn().currentUser;
      if (currentUser) {
        await currentUser.sendEmailVerification();
      }
    } catch (error) {
      console.warn('[FirebaseAuthAdapter] sendEmailVerification error:', error);
    }
  }

  async deleteAccount(): Promise<void> {
    const authFn = getAuth();
    if (authFn) {
      try {
        const currentUser = authFn().currentUser;
        if (currentUser) {
          await currentUser.delete();
        }
      } catch (error) {
        console.warn('[FirebaseAuthAdapter] deleteAccount error:', error);
        throw error;
      }
    }
    await this.clearTokens();
    this.localUser = null;
  }

  private async saveTokens(uid: string, token: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(SECURE_STORE_TOKEN_KEY, token);
      await SecureStore.setItemAsync(SECURE_STORE_UID_KEY, uid);
    } catch (e) {
      console.warn('[FirebaseAuthAdapter] Failed to save token to SecureStore:', e);
    }
  }

  private async clearTokens(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(SECURE_STORE_TOKEN_KEY);
      await SecureStore.deleteItemAsync(SECURE_STORE_UID_KEY);
    } catch (e) {
      console.warn('[FirebaseAuthAdapter] Failed to delete token from SecureStore:', e);
    }
  }
}

export const firebaseAuthAdapter = FirebaseAuthAdapter.getInstance();
