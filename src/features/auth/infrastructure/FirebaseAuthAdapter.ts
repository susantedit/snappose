/**
 * Firebase Authentication implementation of AuthAdapter.
 * Uses @react-native-firebase/auth with Expo SecureStore for token caching on native builds,
 * and Firebase Identity Toolkit REST API for online authentication in Expo Go / Web environments.
 * [Req 3, 26, 47.5]
 */

import { NativeModules, Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import type { AuthAdapter } from '../domain/interfaces/AuthAdapter';
import type { AppUser, AuthProvider } from '../types';

const SECURE_STORE_TOKEN_KEY = 'sp_firebase_id_token';
const SECURE_STORE_UID_KEY = 'sp_firebase_uid';
const SECURE_STORE_USER_KEY = 'sp_firebase_user_data';

const FIREBASE_API_KEY =
  process.env.EXPO_PUBLIC_FIREBASE_API_KEY || 'AIzaSyC_7gMLSA2-OoAUgmtSQA9GHTgbFbfHWrE';
const REST_BASE_URL = 'https://identitytoolkit.googleapis.com/v1/accounts';

// ---------------------------------------------------------------------------
// Storage Helpers (SecureStore / Web localStorage fallback)
// ---------------------------------------------------------------------------

async function storageGet(key: string): Promise<string | null> {
  try {
    if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
      return localStorage.getItem(key);
    }
    return await SecureStore.getItemAsync(key);
  } catch {
    return null;
  }
}

async function storageSet(key: string, val: string): Promise<void> {
  try {
    if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
      localStorage.setItem(key, val);
      return;
    }
    await SecureStore.setItemAsync(key, val);
  } catch {}
}

async function storageDelete(key: string): Promise<void> {
  try {
    if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
      localStorage.removeItem(key);
      return;
    }
    await SecureStore.deleteItemAsync(key);
  } catch {}
}

// ---------------------------------------------------------------------------
// REST Error Mapping
// ---------------------------------------------------------------------------

function parseFirebaseRestError(errorJson: any, defaultMsg: string): string {
  const code = errorJson?.error?.message;
  if (!code) return defaultMsg;

  if (code.includes('INVALID_LOGIN_CREDENTIALS') || code.includes('INVALID_PASSWORD') || code.includes('EMAIL_NOT_FOUND')) {
    return 'Invalid email or password.';
  }
  if (code.includes('EMAIL_EXISTS')) {
    return 'An account with this email address already exists.';
  }
  if (code.includes('WEAK_PASSWORD')) {
    return 'Password should be at least 6 characters.';
  }
  if (code.includes('USER_DISABLED')) {
    return 'This user account has been disabled.';
  }
  if (code.includes('TOO_MANY_ATTEMPTS_TRY_LATER')) {
    return 'Access to this account has been temporarily disabled due to many failed attempts. Please try again later.';
  }
  if (code.includes('INVALID_EMAIL')) {
    return 'Please enter a valid email address.';
  }
  return typeof code === 'string' ? code.replace(/_/g, ' ') : defaultMsg;
}

// ---------------------------------------------------------------------------
// Native Firebase Availability Check
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Adapter Class Implementation
// ---------------------------------------------------------------------------

export class FirebaseAuthAdapter implements AuthAdapter {
  private static instance: FirebaseAuthAdapter;
  private currentUserState: AppUser | null = null;
  private authListeners: Array<(user: AppUser | null) => void> = [];

  private constructor() {
    this.restoreSession();
  }

  public static getInstance(): FirebaseAuthAdapter {
    if (!FirebaseAuthAdapter.instance) {
      FirebaseAuthAdapter.instance = new FirebaseAuthAdapter();
    }
    return FirebaseAuthAdapter.instance;
  }

  private async restoreSession(): Promise<void> {
    try {
      const storedUserData = await storageGet(SECURE_STORE_USER_KEY);
      if (storedUserData) {
        this.currentUserState = JSON.parse(storedUserData);
        this.notifyListeners();
      }
    } catch {}
  }

  private notifyListeners(): void {
    this.authListeners.forEach((fn) => {
      try {
        fn(this.currentUserState);
      } catch {}
    });
  }

  async signInAnonymously(): Promise<AppUser> {
    const authFn = getAuth();
    if (authFn) {
      try {
        const userCredential = await authFn().signInAnonymously();
        const token = await userCredential.user.getIdToken();
        const appUser = mapFirebaseUser(userCredential.user);
        if (!appUser) throw new Error('Failed to map user after anonymous sign-in');
        await this.saveSession(appUser, token);
        return appUser;
      } catch (error) {
        console.warn('[FirebaseAuthAdapter] Native signInAnonymously error:', error);
      }
    }

    // REST API fallback for online anonymous sign-in
    try {
      const res = await fetch(`${REST_BASE_URL}:signUp?key=${FIREBASE_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ returnSecureToken: true }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(parseFirebaseRestError(data, 'Anonymous sign-in failed.'));
      }

      const appUser: AppUser = {
        uid: data.localId,
        displayName: 'Guest Photographer',
        email: null,
        photoURL: null,
        provider: 'anonymous',
        isAnonymous: true,
      };
      await this.saveSession(appUser, data.idToken);
      return appUser;
    } catch (e: any) {
      // Offline fallback
      const guestUser: AppUser = {
        uid: `guest_${Date.now()}`,
        displayName: 'Guest Photographer',
        email: null,
        photoURL: null,
        provider: 'anonymous',
        isAnonymous: true,
      };
      await this.saveSession(guestUser, 'guest_token');
      return guestUser;
    }
  }

  async signInWithGoogle(): Promise<AppUser> {
    const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;

    try {
      const { GoogleSignin } = require('@react-native-google-signin/google-signin');
      const authModule = require('@react-native-firebase/auth');
      const auth = authModule.default || authModule;

      if (webClientId) {
        GoogleSignin.configure({ webClientId });
      } else {
        GoogleSignin.configure();
      }

      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const signInResult = await GoogleSignin.signIn();

      let idToken: string | null = null;
      if (signInResult && typeof signInResult === 'object') {
        if (signInResult.type === 'success' && signInResult.data?.idToken) {
          idToken = signInResult.data.idToken;
        } else if (signInResult.data?.idToken) {
          idToken = signInResult.data.idToken;
        } else if ((signInResult as any).idToken) {
          idToken = (signInResult as any).idToken;
        }
      }

      if (!idToken) {
        try {
          const tokens = await GoogleSignin.getTokens();
          idToken = tokens.idToken;
        } catch {}
      }

      if (idToken && auth?.GoogleAuthProvider) {
        const googleCredential = auth.GoogleAuthProvider.credential(idToken);
        const userCredential = await auth().signInWithCredential(googleCredential);
        const token = await userCredential.user.getIdToken();
        const appUser = mapFirebaseUser(userCredential.user);
        if (appUser) {
          await this.saveSession(appUser, token);
          return appUser;
        }
      }

      // If user info is available from GoogleSignin directly
      const googleUserObj = signInResult?.data?.user || (signInResult as any)?.user;
      if (googleUserObj) {
        const appUser: AppUser = {
          uid: googleUserObj.id || `google_${Date.now()}`,
          displayName: googleUserObj.name || 'Google User',
          email: googleUserObj.email || null,
          photoURL: googleUserObj.photo || null,
          provider: 'google',
          isAnonymous: false,
        };
        await this.saveSession(appUser, idToken || `google_token_${Date.now()}`);
        return appUser;
      }
    } catch (error: any) {
      console.warn('[FirebaseAuthAdapter] Google Sign-In error:', error);
      if (error?.code === 'SIGN_IN_CANCELLED' || error?.message?.includes('cancel')) {
        throw new Error('Google sign-in was cancelled.');
      }
      if (error?.code === 'PLAY_SERVICES_NOT_AVAILABLE') {
        throw new Error('Google Play Services is not available or outdated on this device.');
      }
      if (error?.code === 'DEVELOPER_ERROR' || error?.message?.includes('DEVELOPER_ERROR')) {
        throw new Error('Google Sign-In configuration error: Please check your SHA-1 fingerprint and Web Client ID in Firebase Console.');
      }
      throw new Error(error?.message || 'Google sign-in failed. Please try email or guest login.');
    }

    throw new Error('Google sign-in could not be completed. Please try with Email or Guest.');
  }

  async signInWithEmail(email: string, password: string): Promise<AppUser> {
    const authFn = getAuth();
    if (authFn) {
      try {
        const userCredential = await authFn().signInWithEmailAndPassword(email, password);
        const token = await userCredential.user.getIdToken();
        const appUser = mapFirebaseUser(userCredential.user);
        if (!appUser) throw new Error('Failed to map user after email sign-in');
        await this.saveSession(appUser, token);
        return appUser;
      } catch (error: any) {
        console.warn('[FirebaseAuthAdapter] Native signInWithEmail error:', error);
        throw new Error(error?.message || 'Email sign-in failed');
      }
    }

    // Online REST API implementation
    try {
      const res = await fetch(`${REST_BASE_URL}:signInWithPassword?key=${FIREBASE_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          password,
          returnSecureToken: true,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(parseFirebaseRestError(data, 'Email sign-in failed. Please check your credentials.'));
      }

      const appUser: AppUser = {
        uid: data.localId,
        displayName: data.displayName || email.split('@')[0] || 'Photographer',
        email: data.email || email,
        photoURL: null,
        provider: 'email',
        isAnonymous: false,
      };

      await this.saveSession(appUser, data.idToken);
      return appUser;
    } catch (err: any) {
      console.warn('[FirebaseAuthAdapter] Online REST signInWithEmail error:', err);
      throw err;
    }
  }

  async signUp(email: string, password: string, displayName?: string): Promise<AppUser> {
    const authFn = getAuth();
    if (authFn) {
      try {
        const userCredential = await authFn().createUserWithEmailAndPassword(email, password);
        if (displayName) {
          try {
            await userCredential.user.updateProfile({ displayName });
          } catch {}
        }
        const token = await userCredential.user.getIdToken();
        const appUser = mapFirebaseUser({
          ...userCredential.user,
          displayName: displayName || userCredential.user.displayName,
        });
        if (!appUser) throw new Error('Failed to map user after sign-up');
        await this.saveSession(appUser, token);
        return appUser;
      } catch (error: any) {
        console.warn('[FirebaseAuthAdapter] Native signUp error:', error);
        throw new Error(error?.message || 'Sign-up failed');
      }
    }

    // Online REST API implementation for sign up
    try {
      const res = await fetch(`${REST_BASE_URL}:signUp?key=${FIREBASE_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          password,
          returnSecureToken: true,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(parseFirebaseRestError(data, 'Sign-up failed. Please check your information.'));
      }

      let finalDisplayName = displayName || email.split('@')[0] || 'POSEHANUM User';

      // Update display name if provided
      if (displayName) {
        try {
          await fetch(`${REST_BASE_URL}:update?key=${FIREBASE_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              idToken: data.idToken,
              displayName,
              returnSecureToken: true,
            }),
          });
        } catch {}
      }

      const appUser: AppUser = {
        uid: data.localId,
        displayName: finalDisplayName,
        email: data.email || email,
        photoURL: null,
        provider: 'email',
        isAnonymous: false,
      };

      await this.saveSession(appUser, data.idToken);
      return appUser;
    } catch (err: any) {
      console.warn('[FirebaseAuthAdapter] Online REST signUp error:', err);
      throw err;
    }
  }

  async sendPasswordReset(email: string): Promise<void> {
    const cleanEmail = email.trim();

    // 1. Native Firebase Auth password reset — sends the email via Firebase's
    //    own delivery service and hosted reset page. This works in production
    //    (incl. Render/Vercel deployments) with no extra mail infrastructure,
    //    because the reset link points at the always-authorized
    //    <project>.firebaseapp.com hosted action handler.
    const authFn = getAuth();
    if (authFn) {
      await authFn().sendPasswordResetEmail(cleanEmail);
      return;
    }

    // 2. Identity Toolkit REST fallback (Expo Go / web) — also triggers a real
    //    Firebase password-reset email via the same delivery path.
    const res = await fetch(`${REST_BASE_URL}:sendOobCode?key=${FIREBASE_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        requestType: 'PASSWORD_RESET',
        email: cleanEmail,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(parseFirebaseRestError(data, 'Failed to send password reset email.'));
    }

    // Note: the backend /api/auth/forgot-password endpoint exists but only
    // generates a reset link server-side (no mailer wired). It is intentionally
    // NOT on the critical path so a "success" there can't suppress the actual
    // email send above. Re-introduce it only once a backend mailer is configured.
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

  async updateProfile(displayName: string): Promise<AppUser> {
    const authFn = getAuth();
    if (authFn) {
      try {
        const currentUser = authFn().currentUser;
        if (currentUser) {
          await currentUser.updateProfile({ displayName });
        }
      } catch (e) {
        console.warn('[FirebaseAuthAdapter] native updateProfile error:', e);
      }
    }

    // REST API update (works in Expo Go / web too)
    try {
      const token = await storageGet(SECURE_STORE_TOKEN_KEY);
      if (token && token !== 'guest_token') {
        await fetch(`${REST_BASE_URL}:update?key=${FIREBASE_API_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            idToken: token,
            displayName,
            returnSecureToken: false,
          }),
        });
      }
    } catch (e) {
      console.warn('[FirebaseAuthAdapter] REST updateProfile error:', e);
    }

    const updated: AppUser = {
      ...(this.currentUserState as AppUser),
      displayName,
    };
    await this.saveSession(updated, (await storageGet(SECURE_STORE_TOKEN_KEY)) || 'guest_token');
    return updated;
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
    await this.clearSession();
  }

  async signOut(): Promise<void> {
    const authFn = getAuth();
    if (authFn) {
      try {
        await authFn().signOut();
      } catch {}
    }
    await this.clearSession();
  }

  getCurrentUser(): AppUser | null {
    const authFn = getAuth();
    if (authFn) {
      try {
        return mapFirebaseUser(authFn().currentUser) ?? this.currentUserState;
      } catch {
        return this.currentUserState;
      }
    }
    return this.currentUserState;
  }

  async getIdToken(): Promise<string> {
    const authFn = getAuth();
    if (authFn) {
      try {
        const currentUser = authFn().currentUser;
        if (currentUser) {
          const token = await currentUser.getIdToken(false);
          await storageSet(SECURE_STORE_TOKEN_KEY, token);
          return token;
        }
      } catch {}
    }
    const cachedToken = await storageGet(SECURE_STORE_TOKEN_KEY);
    return cachedToken || 'guest_token';
  }

  onAuthStateChanged(callback: (user: AppUser | null) => void): () => void {
    this.authListeners.push(callback);
    callback(this.getCurrentUser());

    const authFn = getAuth();
    if (authFn) {
      try {
        const nativeUnsub = authFn().onAuthStateChanged((user: any) => {
          const appUser = mapFirebaseUser(user);
          this.currentUserState = appUser;
          callback(appUser);
        });
        return () => {
          this.authListeners = this.authListeners.filter((cb) => cb !== callback);
          nativeUnsub();
        };
      } catch {}
    }

    return () => {
      this.authListeners = this.authListeners.filter((cb) => cb !== callback);
    };
  }

  private async saveSession(user: AppUser, token: string): Promise<void> {
    this.currentUserState = user;
    await storageSet(SECURE_STORE_TOKEN_KEY, token);
    await storageSet(SECURE_STORE_UID_KEY, user.uid);
    await storageSet(SECURE_STORE_USER_KEY, JSON.stringify(user));
    this.notifyListeners();
  }

  private async clearSession(): Promise<void> {
    this.currentUserState = null;
    await storageDelete(SECURE_STORE_TOKEN_KEY);
    await storageDelete(SECURE_STORE_UID_KEY);
    await storageDelete(SECURE_STORE_USER_KEY);
    this.notifyListeners();
  }
}

export const firebaseAuthAdapter = FirebaseAuthAdapter.getInstance();
