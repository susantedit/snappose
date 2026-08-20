export interface CategoryItem {
  id: string;
  name: string;
  subtitle: string;
  image: string;
  totalPoses: number;
  tags: string[];
}

export const SNAP_POSE_CATEGORIES: CategoryItem[] = [
  {
    id: 'beach',
    name: 'Beach',
    subtitle: 'Golden hour silhouettes, coast strolls & relaxed summer vibes',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
    totalPoses: 24,
    tags: ['outdoor', 'summer', 'sunset', 'ocean'],
  },
  {
    id: 'mountain',
    name: 'Mountain',
    subtitle: 'Epic summits, rugged viewpoints & dramatic landscapes',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80',
    totalPoses: 32,
    tags: ['adventure', 'nature', 'panoramic', 'standing'],
  },
  {
    id: 'cafe',
    name: 'Cafe',
    subtitle: 'Cozy table compositions, coffee portraits & indoor lifestyle',
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80',
    totalPoses: 18,
    tags: ['indoor', 'casual', 'sitting', 'aesthetic'],
  },
  {
    id: 'city',
    name: 'City & Street',
    subtitle: 'Urban architecture, modern street style & crosswalk motion',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80',
    totalPoses: 40,
    tags: ['streetwear', 'urban', 'walking', 'leaning'],
  },
  {
    id: 'nature',
    name: 'Nature & Forest',
    subtitle: 'Enchanted woods, misty paths & tranquil botanical scenery',
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop&q=80',
    totalPoses: 26,
    tags: ['greenery', 'serene', 'sunlight', 'standing'],
  },
  {
    id: 'travel',
    name: 'Travel & Landmarks',
    subtitle: 'Iconic monuments, airport wanderlust & world exploration',
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&auto=format&fit=crop&q=80',
    totalPoses: 35,
    tags: ['explore', 'destination', 'culture', 'backpack'],
  },
  {
    id: 'selfie',
    name: 'Selfie & Mirror',
    subtitle: 'Flattering high-angles, hand framing & editorial mirror shots',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
    totalPoses: 22,
    tags: ['close-up', 'expression', 'portrait', 'lighting'],
  },
  {
    id: 'fashion',
    name: 'Fashion & Runway',
    subtitle: 'High-couture silhouettes, power stances & magazine elegance',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80',
    totalPoses: 28,
    tags: ['editorial', 'chic', 'minimal', 'bold'],
  },
  {
    id: 'wedding',
    name: 'Wedding & Formal',
    subtitle: 'Romantic ballroom gazes, veil compositions & celebration',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80',
    totalPoses: 30,
    tags: ['love', 'formal', 'ceremony', 'timeless'],
  },
  {
    id: 'couple',
    name: 'Couple & Romance',
    subtitle: 'Intimate embraces, forehead leans & playful candid chemistry',
    image: '/IMG_20260818_112337.jpg',
    totalPoses: 25,
    tags: ['duo', 'intimate', 'connection', 'romantic'],
  },
  {
    id: 'friends',
    name: 'Friends & Group',
    subtitle: 'Dynamic squad formations, laughing candid walks & party vibes',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop&q=80',
    totalPoses: 20,
    tags: ['group', 'fun', 'spontaneous', 'energy'],
  },
  {
    id: 'traditional',
    name: 'Traditional & Cultural',
    subtitle: 'Heritage outfits, elegant drapery & cultural posture nuance',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80',
    totalPoses: 16,
    tags: ['heritage', 'grace', 'attire', 'expressive'],
  },
  {
    id: 'gym',
    name: 'Gym & Fitness',
    subtitle: 'Athletic muscle definition, workout focus & movement power',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
    totalPoses: 19,
    tags: ['fitness', 'workout', 'strength', 'active'],
  },
  {
    id: 'office',
    name: 'Office & Business',
    subtitle: 'Executive headshots, modern workspace & confident posture',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80',
    totalPoses: 15,
    tags: ['corporate', 'confident', 'desk', 'profile'],
  },
  {
    id: 'luxury',
    name: 'Luxury & Nightlife',
    subtitle: 'Rooftop golden hours, sports car poses & cocktail glam',
    image: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=800&auto=format&fit=crop&q=80',
    totalPoses: 21,
    tags: ['night', 'glamour', 'chic', 'rooftop'],
  },
];
