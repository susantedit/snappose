/**
 * Auth feature types.
 * [Req 3, 26]
 */

export type AuthProvider = 'google' | 'email' | 'anonymous';

export interface AppUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  provider: AuthProvider;
  isAnonymous: boolean;
}
