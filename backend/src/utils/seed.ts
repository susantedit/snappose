import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { CategoryModel } from '../models/Category';
import { PoseModel } from '../models/Pose';
import { AppConfigModel } from '../models/AppConfig';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/snap-pose';

const CATEGORIES = [
  { id: 'cat_solo_f', name: 'Solo (Female)', slug: 'solo-female', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800', icon: 'person', color: '#65744A', totalPoses: 12, sortOrder: 1 },
  { id: 'cat_solo_m', name: 'Solo (Male)', slug: 'solo-male', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800', icon: 'person-outline', color: '#4F5B38', totalPoses: 10, sortOrder: 2 },
  { id: 'cat_couples', name: 'Couples & Romance', slug: 'couples-romance', image: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800', icon: 'heart', color: '#B3541E', totalPoses: 15, sortOrder: 3 },
  { id: 'cat_cafe', name: 'Cafe & Coffee Shop', slug: 'cafe-coffee-shop', image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800', icon: 'cafe', color: '#8D6E63', totalPoses: 8, sortOrder: 4 },
  { id: 'cat_urban', name: 'Urban & Street', slug: 'urban-street', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800', icon: 'business', color: '#37474F', totalPoses: 14, sortOrder: 5 },
  { id: 'cat_beach', name: 'Beach & Coastal', slug: 'beach-coastal', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800', icon: 'sunny', color: '#00838F', totalPoses: 12, sortOrder: 6 },
  { id: 'cat_nature', name: 'Nature & Mountains', slug: 'nature-mountains', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800', icon: 'leaf', color: '#2E7D32', totalPoses: 11, sortOrder: 7 },
  { id: 'cat_sunset', name: 'Golden Hour & Sunset', slug: 'golden-hour-sunset', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800', icon: 'partly-sunny', color: '#EF6C00', totalPoses: 9, sortOrder: 8 },
  { id: 'cat_minimalist', name: 'Minimalist & Architecture', slug: 'minimalist-architecture', image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800', icon: 'square-outline', color: '#546E7A', totalPoses: 7, sortOrder: 9 },
  { id: 'cat_mirror', name: 'Mirror Selfies & Casual', slug: 'mirror-selfies', image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800', icon: 'camera-reverse', color: '#7E57C2', totalPoses: 8, sortOrder: 10 },
  { id: 'cat_friends', name: 'Friends & Group', slug: 'friends-group', image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800', icon: 'people', color: '#C2185B', totalPoses: 6, sortOrder: 11 },
  { id: 'cat_fitness', name: 'Fitness & Active', slug: 'fitness-active', image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800', icon: 'barbell', color: '#D32F2F', totalPoses: 9, sortOrder: 12 },
  { id: 'cat_business', name: 'Business & Professional', slug: 'business-professional', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800', icon: 'briefcase', color: '#1A237E', totalPoses: 8, sortOrder: 13 },
  { id: 'cat_traditional', name: 'Traditional & Cultural', slug: 'traditional-cultural', image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800', icon: 'sparkles', color: '#AD1457', totalPoses: 6, sortOrder: 14 },
  { id: 'cat_wedding', name: 'Weddings & Celebrations', slug: 'weddings-celebrations', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800', icon: 'gift', color: '#880E4F', totalPoses: 10, sortOrder: 15 },
  { id: 'cat_night', name: 'Night & Low Light', slug: 'night-low-light', image: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800', icon: 'moon', color: '#263238', totalPoses: 7, sortOrder: 16 },
  { id: 'cat_travel', name: 'Travel & Tourist', slug: 'travel-tourist', image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800', icon: 'airplane', color: '#0097A7', totalPoses: 12, sortOrder: 17 },
  { id: 'cat_studio', name: 'Studio & Fashion', slug: 'studio-fashion', image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800', icon: 'flash', color: '#6A1B9A', totalPoses: 10, sortOrder: 18 },
  { id: 'cat_creative', name: 'Creative & Abstract', slug: 'creative-abstract', image: 'https://images.unsplash.com/photo-1500485035595-cbe6f645feb1?w=800', icon: 'color-palette', color: '#F57F17', totalPoses: 5, sortOrder: 19 },
  { id: 'cat_sitting', name: 'Sitting & Relaxed', slug: 'sitting-relaxed', image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=800', icon: 'body', color: '#5D4037', totalPoses: 11, sortOrder: 20 },
  { id: 'cat_standing', name: 'Standing & Confident', slug: 'standing-confident', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800', icon: 'walk', color: '#455A64', totalPoses: 14, sortOrder: 21 },
  { id: 'cat_dynamic', name: 'Dynamic & Movement', slug: 'dynamic-movement', image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800', icon: 'bicycle', color: '#00796B', totalPoses: 6, sortOrder: 22 },
  { id: 'cat_portrait', name: 'Close-Up & Portrait', slug: 'close-up-portrait', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800', icon: 'happy', color: '#E64A19', totalPoses: 15, sortOrder: 23 },
];

const POSES = [
  {
    id: 'pose_over_shoulder_01',
    categoryId: 'cat_solo_f',
    title: 'Over the Shoulder Glance',
    description: 'Turn your torso away from the camera, looking gently back over your lead shoulder with relaxed posture.',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800',
    overlayImage: 'https://raw.githubusercontent.com/snap-pose/assets/main/overlays/over_shoulder.png',
    thumbnailUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
    difficulty: 'easy',
    indoor: false,
    tags: ['solo', 'portrait', 'glance', 'outdoor'],
    views: 1240,
    downloads: 380,
    favorites: 215,
    estimatedDistance: 2.2,
    cameraAngle: 'Eye Level',
    lighting: 'Soft 45-degree Golden Hour',
    orientation: 'portrait',
  },
  {
    id: 'pose_walking_casual_01',
    categoryId: 'cat_urban',
    title: 'Walking Mid-Stride Casual',
    description: 'Walk forward slowly with natural arm sway, tilting head slightly down before smiling upward.',
    imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800',
    overlayImage: 'https://raw.githubusercontent.com/snap-pose/assets/main/overlays/walking_casual.png',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300',
    difficulty: 'easy',
    indoor: false,
    tags: ['walking', 'urban', 'candid', 'street'],
    views: 2100,
    downloads: 512,
    favorites: 430,
    estimatedDistance: 3.5,
    cameraAngle: 'Low Angle (Hip Level)',
    lighting: 'Open Shade or Backlight',
    orientation: 'portrait',
  },
  {
    id: 'pose_seated_cafe_01',
    categoryId: 'cat_cafe',
    title: 'Seated Cafe Lean & Sip',
    description: 'Sit diagonally at table, one hand holding cup, elbow resting gently on tabletop with soft smile.',
    imageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800',
    overlayImage: 'https://raw.githubusercontent.com/snap-pose/assets/main/overlays/seated_cafe.png',
    thumbnailUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=300',
    difficulty: 'medium',
    indoor: true,
    tags: ['cafe', 'sitting', 'coffee', 'lifestyle'],
    views: 1870,
    downloads: 440,
    favorites: 310,
    estimatedDistance: 1.8,
    cameraAngle: 'Slightly Elevated 15°',
    lighting: 'Window Diffused Daylight',
    orientation: 'portrait',
  },
  {
    id: 'pose_mirror_selfie_01',
    categoryId: 'cat_mirror',
    title: 'Clean Minimalist Mirror Stance',
    description: 'Weight shifted to back leg, phone held at chest height angled slightly forward for slimming silhouette.',
    imageUrl: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800',
    overlayImage: 'https://raw.githubusercontent.com/snap-pose/assets/main/overlays/mirror_selfie.png',
    thumbnailUrl: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=300',
    difficulty: 'easy',
    indoor: true,
    tags: ['mirror', 'selfie', 'outfit', 'indoor'],
    views: 3420,
    downloads: 980,
    favorites: 750,
    estimatedDistance: 1.5,
    cameraAngle: 'Chest Level Flat',
    lighting: 'Even Warm Ambient',
    orientation: 'portrait',
  },
  {
    id: 'pose_couple_embrace_01',
    categoryId: 'cat_couples',
    title: 'Forehead Touch Embrace',
    description: 'Stand close with gentle forehead contact, partner hands on waist and shoulder, eyes softly closed.',
    imageUrl: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800',
    overlayImage: 'https://raw.githubusercontent.com/snap-pose/assets/main/overlays/couple_embrace.png',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=300',
    difficulty: 'medium',
    indoor: false,
    tags: ['couple', 'romance', 'sunset', 'wedding'],
    views: 4120,
    downloads: 1200,
    favorites: 920,
    estimatedDistance: 2.5,
    cameraAngle: 'Eye Level Medium Close',
    lighting: 'Golden Hour Rim Lighting',
    orientation: 'portrait',
  }
];

export async function seedDatabase() {
  try {
    console.log('[Seed] Connecting to MongoDB:', MONGODB_URI);
    await mongoose.connect(MONGODB_URI);
    console.log('[Seed] Connected successfully.');

    // Seed Categories
    console.log('[Seed] Upserting 23 categories...');
    for (const cat of CATEGORIES) {
      await CategoryModel.findOneAndUpdate({ id: cat.id }, cat, { upsert: true, new: true });
    }
    console.log(`[Seed] Successfully seeded ${CATEGORIES.length} categories.`);

    // Seed Poses
    console.log('[Seed] Upserting starter poses...');
    for (const pose of POSES) {
      await PoseModel.findOneAndUpdate({ id: pose.id }, pose, { upsert: true, new: true });
    }
    console.log(`[Seed] Successfully seeded ${POSES.length} starter poses.`);

    // Seed AppConfig
    console.log('[Seed] Upserting default AppConfig...');
    await AppConfigModel.findOneAndUpdate(
      { key: 'global' },
      {
        key: 'global',
        maintenanceMode: false,
        minimumVersion: '1.0.0',
        latestVersion: '1.0.0',
        adsEnabled: true,
        autoCaptureThreshold: 94,
        voiceGuidanceEnabled: true,
      },
      { upsert: true, new: true }
    );
    console.log('[Seed] AppConfig successfully seeded.');

    console.log('[Seed] Database initialization complete!');
    await mongoose.disconnect();
  } catch (error) {
    console.error('[Seed] Error seeding database:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  seedDatabase();
}
