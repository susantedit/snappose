/**
 * DeepLinkService — POSEHANUM
 *
 * Implements deep linking and web routing resolution for templates, poses, and creator profiles.
 *
 * Supported URI Schemes:
 *  - Custom scheme: posehanum://template/{id}
 *  - Web universal fallback: https://posehanum.com/template/{id}
 *  - Profile: posehanum://creator/{uid} or https://posehanum.com/creator/{uid}
 */

export interface ParsedDeepLink {
  type: 'TEMPLATE' | 'CREATOR' | 'POSE' | 'UNKNOWN';
  id?: string;
  url: string;
}

export class DeepLinkService {
  private static CUSTOM_SCHEME = 'posehanum://';
  private static WEB_ORIGIN = 'https://posehanum.com';

  /**
   * Generates a custom scheme deep link for a template.
   */
  static getTemplateDeepLink(templateId: string): string {
    return `${this.CUSTOM_SCHEME}template/${encodeURIComponent(templateId)}`;
  }

  /**
   * Generates a web universal link for a template.
   */
  static getTemplateWebUrl(templateId: string): string {
    return `${this.WEB_ORIGIN}/template/${encodeURIComponent(templateId)}`;
  }

  /**
   * Generates a creator profile link.
   */
  static getCreatorDeepLink(creatorUid: string): string {
    return `${this.CUSTOM_SCHEME}creator/${encodeURIComponent(creatorUid)}`;
  }

  /**
   * Parses an incoming deep link or universal link URL.
   */
  static parseUrl(url: string): ParsedDeepLink {
    if (!url) return { type: 'UNKNOWN', url: '' };

    const cleanUrl = url.trim();

    if (cleanUrl.startsWith(this.CUSTOM_SCHEME)) {
      const path = cleanUrl.slice(this.CUSTOM_SCHEME.length);
      const segments = path.split('/').filter(Boolean);

      if (segments[0] === 'template' && segments[1]) {
        return { type: 'TEMPLATE', id: decodeURIComponent(segments[1]), url: cleanUrl };
      }
      if (segments[0] === 'creator' && segments[1]) {
        return { type: 'CREATOR', id: decodeURIComponent(segments[1]), url: cleanUrl };
      }
      if (segments[0] === 'pose' && segments[1]) {
        return { type: 'POSE', id: decodeURIComponent(segments[1]), url: cleanUrl };
      }
    }

    if (cleanUrl.startsWith(this.WEB_ORIGIN)) {
      const path = cleanUrl.slice(this.WEB_ORIGIN.length);
      const segments = path.split('/').filter(Boolean);

      if (segments[0] === 'template' && segments[1]) {
        return { type: 'TEMPLATE', id: decodeURIComponent(segments[1]), url: cleanUrl };
      }
      if (segments[0] === 'creator' && segments[1]) {
        return { type: 'CREATOR', id: decodeURIComponent(segments[1]), url: cleanUrl };
      }
      if (segments[0] === 'pose' && segments[1]) {
        return { type: 'POSE', id: decodeURIComponent(segments[1]), url: cleanUrl };
      }
    }

    return { type: 'UNKNOWN', url: cleanUrl };
  }
}
