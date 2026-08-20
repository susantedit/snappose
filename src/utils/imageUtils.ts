import { Image, ImageSourcePropType } from 'react-native';
import { POSE_IMAGE_REGISTRY, extractDriveId } from './poseImageRegistry';

const TONY_STARK_ASSET = require('../../assets/images/tony_stark_tpose.png');

export function getPoseImageSource(imageUrl?: string | number | null): ImageSourcePropType {
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
  // Resolve Google Drive URLs to locally bundled assets
  if (imageUrl.includes('drive.google.com')) {
    const driveId = extractDriveId(imageUrl);
    if (driveId && POSE_IMAGE_REGISTRY[driveId]) {
      return POSE_IMAGE_REGISTRY[driveId];
    }
  }
  return { uri: imageUrl };
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

