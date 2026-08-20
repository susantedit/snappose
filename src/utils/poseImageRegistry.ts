/**
 * poseImageRegistry.ts
 *
 * Maps Google Drive file IDs to locally bundled assets.
 * React Native's Metro bundler requires static `require()` calls,
 * so all pose images must be listed here explicitly.
 *
 * Usage: `getPoseImageSource()` in imageUtils.ts reads this registry
 * to resolve Drive URLs → local assets without any code changes to posesData.ts.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const POSE_IMAGE_REGISTRY: Record<string, any> = {
  // ── Meme images ──────────────────────────────────────────────────────────
  '1mYLUXBtR9vaS6TVvlgzQDEwpGAWeOBaE': require('../../assets/images/poses/meme_1mYLUXB.jpg'),
  '1KDzpQFLbWUQNcIkR_i6_DFwvUpvaOTK3': require('../../assets/images/poses/meme_1KDzpQF.jpg'),
  '1RWJKwlpA-3wXYaR5zloZiXiYNFFrW6AK': require('../../assets/images/poses/meme_1RWJKwl.jpg'),
  '1s8gJBflAeIX3Efj8JRnuc7aU200yhiWh': require('../../assets/images/poses/meme_1s8gJBf.jpg'),
  '1ULjTYo9gvjPAEFkV5MKjl5FLqr4YyHvW': require('../../assets/images/poses/meme_1ULjTYo.jpg'),
  '18y8PLa4Kx7slCwzMhFrQds1CMuHF7CM2': require('../../assets/images/poses/meme_18y8PLa.jpg'),
  '1Glhv5H9I3BQjL4T_tUvOcjgdFtiNgNBr': require('../../assets/images/poses/meme_1Glhv5H.png'),
  '1JFzGguDH98a5muWky39kJgPIvrQ7zU8o': require('../../assets/images/poses/meme_1JFzGgu.jpg'),

  // ── Couple images ─────────────────────────────────────────────────────────
  '1dMo_aHWPRAP1Qt_muh4rxLnseLvSCymT': require('../../assets/images/poses/couple_1dMo_aH.jpg'),
  '1I6fMvzpXZIQV1npiEqsGbZ4ts_N1osgZ': require('../../assets/images/poses/couple_1I6fMvz.jpg'),
  '18uGJ1pVlzGwwslYIEkwz-yz3EY25h14S': require('../../assets/images/poses/couple_18uGJ1p.jpg'),
  '1WAmdYuOVqfRsZOFxLMbJxojUGRTfXmu1': require('../../assets/images/poses/couple_1WAmdYu.jpg'),
  '1xsK8gwwoaIuDM25haJ67dgDVALCEVFlz': require('../../assets/images/poses/couple_1xsK8gw.jpg'),
  '1ZFIIt9R6Koqzkb0O6YGudsBfsC7Dc1aF': require('../../assets/images/poses/couple_1ZFIIt9.jpg'),
  '1s5FqjgbwP-GJI2WrDCvu91i7bJxbGVDu': require('../../assets/images/poses/couple_1s5FqjgB.jpg'),
  '1LWiZ63Z4f-FRzSyj3XZyEWvC7fW5KJgm': require('../../assets/images/poses/couple_1LWiZ63.jpg'),
  '1gdpEjnuiyB-7tRQu4SvkwNDaSthMnlA5': require('../../assets/images/poses/couple_1gdpEjn.jpg'),
};

/**
 * Extracts the Google Drive file ID from a drive.google.com URL.
 * Handles formats:
 *   - https://drive.google.com/thumbnail?id=FILE_ID&sz=w1000
 *   - https://drive.google.com/uc?export=download&id=FILE_ID
 */
export function extractDriveId(url: string): string | null {
  const match = url.match(/[?&]id=([A-Za-z0-9_-]+)/);
  return match ? match[1] : null;
}
