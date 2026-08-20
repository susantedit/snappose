/**
 * Creator System Types — POSEHANUM
 */

export interface CreatorProfile {
  uid: string;
  handle: string;
  displayName: string;
  avatarUrl: string | null;
  bio: string;
  isVerified: boolean;
  totalViews: number;
  totalRemixes: number;
  followerCount: number;
  publishedTemplateIds: string[];
}
