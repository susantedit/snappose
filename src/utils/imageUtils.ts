import { Image, ImageSourcePropType } from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import { POSE_IMAGE_REGISTRY, extractDriveId } from './poseImageRegistry';

const TONY_STARK_ASSET = require('../../assets/images/tony_stark_tpose.png');

/**
 * Rewrites known image-host URLs to request a smaller variant sized for the
 * surface that renders it. The pose dataset ships 1000px-wide originals, but
 * cards render ~150–300px cells — downscaling at the source cuts transfer
 * bytes and native decode time dramatically. Unknown hosts pass through.
 */
export function getSizedImageUrl(url: string, targetWidth?: number): string {
  if (!targetWidth || targetWidth <= 0) return url;
  const w = Math.round(targetWidth);
  if (url.includes('drive.google.com')) {
    if (/[?&]sz=w\d+/.test(url)) return url.replace(/([?&]sz=w)\d+/, `$1${w}`);
    return url + (url.includes('?') ? '&' : '?') + `sz=w${w}`;
  }
  if (url.includes('images.unsplash.com') && /[?&]w=\d+/.test(url)) {
    return url.replace(/([?&]w=)\d+/, `$1${w}`);
  }
  return url;
}

export function getPoseImageSource(
  imageUrl?: string | number | null,
  targetWidth?: number,
): ImageSourcePropType {
  if (!imageUrl) {
    return TONY_STARK_ASSET;
  }
  if (typeof imageUrl === 'number') {
    return imageUrl;
  }
  if (
    imageUrl === 'tony_stark_tpose' ||
    imageUrl.includes('tony_stark') ||
    imageUrl.includes('tony') ||
    imageUrl.includes('media_1786949700646')
  ) {
    return TONY_STARK_ASSET;
  }
  // Resolve Google Drive URLs to locally bundled assets (no network at all)
  if (imageUrl.includes('drive.google.com')) {
    const driveId = extractDriveId(imageUrl);
    if (driveId && POSE_IMAGE_REGISTRY[driveId]) {
      return POSE_IMAGE_REGISTRY[driveId];
    }
  }
  return { uri: getSizedImageUrl(imageUrl, targetWidth) };
}

export function getPoseImageUri(imageUrl?: string | number | null): string {
  if (!imageUrl || imageUrl === 'tony_stark_tpose' || (typeof imageUrl === 'string' && (imageUrl.includes('tony_stark') || imageUrl.includes('tony')))) {
    try {
      const resolved = Image.resolveAssetSource(TONY_STARK_ASSET);
      if (resolved?.uri) return resolved.uri;
    } catch {}
    return 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&auto=format&fit=crop&q=80';
  }
  if (typeof imageUrl === 'number') {
    try {
      const resolved = Image.resolveAssetSource(imageUrl);
      if (resolved?.uri) return resolved.uri;
    } catch {}
  }
  // Resolve Google Drive URLs to local asset URIs
  if (typeof imageUrl === 'string' && imageUrl.includes('drive.google.com')) {
    const driveId = extractDriveId(imageUrl);
    if (driveId && POSE_IMAGE_REGISTRY[driveId]) {
      try {
        const resolved = Image.resolveAssetSource(POSE_IMAGE_REGISTRY[driveId]);
        if (resolved?.uri) return resolved.uri;
      } catch {}
    }
  }
  return typeof imageUrl === 'string' ? imageUrl : '';
}

/**
 * Warms the expo-image memory+disk cache (the same cache SPFastImage reads
 * from) for the given pose image sources, so they render instantly when
 * scrolled/navigated into view. Sources that resolve to bundled local assets
 * are skipped — there is nothing to fetch. Fire-and-forget.
 */
export function prefetchPoseImages(
  sources: Array<string | number | null | undefined>,
  targetWidth?: number,
): void {
  const urls: string[] = [];
  for (const s of sources) {
    if (typeof s !== 'string' || !s) continue;
    const resolved = getPoseImageSource(s, targetWidth);
    if (resolved && typeof resolved === 'object' && 'uri' in resolved && (resolved as any).uri) {
      urls.push((resolved as any).uri as string);
    }
  }
  if (urls.length > 0) {
    // Default cachePolicy is memory-disk, matching SPFastImage.
    ExpoImage.prefetch(urls);
  }
}

