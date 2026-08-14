/**
 * Firebase Authentication implementation of AuthAdapter.
 * Uses @react-native-firebase/auth with Expo SecureStore for token caching.
 * [Req 3, 26, 47.5]
 */

import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import * as SecureStore from 'expo-secure-store';
import type { AuthAdapter } from '../domain/interfaces/AuthAdapter';
import type { AppUser, AuthProvider } from '../types';

const SECURE_STORE_TOKEN_KEY = 'sp_firebase_id_token';
const SECURE_STORE_UID_KEY = 'sp_firebase_uid';

function mapFirebaseUser(user: FirebaseAuthTypes.User | null): AppUser | null {
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
    displayName: user.displayName,
    email: user.email,
    photoURL: user.photoURL,
    provider,
    isAnonymous: user.isAnonymous,
  };
}

export class FirebaseAuthAdapter implements AuthAdapter {
  private static instance: FirebaseAuthAdapter;

  private constructor() {}

  public static getInstance(): FirebaseAuthAdapter {
    if (!FirebaseAuthAdapter.instance) {
      FirebaseAuthAdapter.instance = new FirebaseAuthAdapter();
    }
    return FirebaseAuthAdapter.instance;
  }

  async signInAnonymously(): Promise<AppUser> {
    try {
      const userCredential = await auth().signInAnonymously();
      const token = await userCredential.user.getIdToken();
      await this.saveTokens(userCredential.user.uid, token);
      const appUser = mapFirebaseUser(userCredential.user);
      if (!appUser) throw new Error('Failed to map user after anonymous sign-in');
      return appUser;
    } catch (error) {
      console.warn('[FirebaseAuthAdapter] signInAnonymously error:', error);
      throw error;
    }
  }

  async signInWithGoogle(): Promise<AppUser> {
    try {
      // In production with Google Sign-In native module:
      // const { idToken } = await GoogleSignin.signIn();
      // const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      // const userCredential = await auth().signInWithCredential(googleCredential);
      const currentUser = auth().currentUser;
      if (!currentUser) {
        throw new Error('Google Sign-In requires active Google authentication flow');
      }
      const token = await currentUser.getIdToken();
      await this.saveTokens(currentUser.uid, token);
      const appUser = mapFirebaseUser(currentUser);
      if (!appUser) throw new Error('Failed to map user after Google sign-in');
      return appUser;
    } catch (error) {
      console.warn('[FirebaseAuthAdapter] signInWithGoogle error:', error);
      throw error;
    }
  }

  async signInWithEmail(email: string, password: string): Promise<AppUser> {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      const token = await userCredential.user.getIdToken();
      await this.saveTokens(userCredential.user.uid, token);
      const appUser = mapFirebaseUser(userCredential.user);
      if (!appUser) throw new Error('Failed to map user after email sign-in');
      return appUser;
    } catch (error) {
      console.warn('[FirebaseAuthAdapter] signInWithEmail error:', error);
      throw error;
    }
  }

  async signOut(): Promise<void> {
    try {
      await auth().signOut();
      await this.clearTokens();
    } catch (error) {
      console.warn('[FirebaseAuthAdapter] signOut error:', error);
      throw error;
    }
  }

  getCurrentUser(): AppUser | null {
    return mapFirebaseUser(auth().currentUser);
  }

  async getIdToken(): Promise<string> {
    const currentUser = auth().currentUser;
    if (currentUser) {
      try {
        const token = await currentUser.getIdToken(false);
        await this.saveTokens(currentUser.uid, token);
        return token;
      } catch {
        // Fallback to secure store cached token if network/refresh fails
        const cached = await SecureStore.getItemAsync(SECURE_STORE_TOKEN_KEY);
        if (cached) return cached;
      }
    }
    const cachedToken = await SecureStore.getItemAsync(SECURE_STORE_TOKEN_KEY);
    return cachedToken || '';
  }

  onAuthStateChanged(callback: (user: AppUser | null) => void): () => void {
    return auth().onAuthStateChanged((user) => {
      const appUser = mapFirebaseUser(user);
      callback(appUser);
    });
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
