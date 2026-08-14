import type { AppUser } from '../../types';

/**
 * Abstract Firebase Auth interface.
 * [Req 47]
 */
export interface AuthAdapter {
  signInAnonymously(): Promise<AppUser>;
  signInWithGoogle(): Promise<AppUser>;
  signInWithEmail(email: string, password: string): Promise<AppUser>;
  signOut(): Promise<void>;
  getCurrentUser(): AppUser | null;
  getIdToken(): Promise<string>;
  onAuthStateChanged(callback: (user: AppUser | null) => void): () => void;
}
