
export interface DemoPose {
  id: string;
  title: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  imageUrl: string;
  description: string;
  matchTarget: number;
  tags: string[];
  coachingCue: string;
}

export const SHOWCASE_POSES: DemoPose[] = [
  {
    id: 'pose-1',
    title: 'Urban Wall Lean',
    category: 'City',
    difficulty: 'easy',
    imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80',
    description: 'Casual shoulder rest against architectural lines with 70% weight back shift.',
    matchTarget: 94,
    tags: ['street', 'casual', 'standing'],
    coachingCue: 'Relax your left arm and tilt chin 10° away from the lens.',
  },
  {
    id: 'pose-2',
    title: 'Cafe Table Reflection',
    category: 'Cafe',
    difficulty: 'easy',
    imageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80',
    description: 'Intimate forearm resting on wooden tabletop with relaxed coffee cup hold.',
    matchTarget: 91,
    tags: ['cafe', 'sitting', 'aesthetic'],
    coachingCue: 'Lean forward slightly to create natural depth with the cup.',
  },
  {
    id: 'pose-3',
    title: 'Summit Horizon Look',
    category: 'Mountain',
    difficulty: 'medium',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80',
    description: 'Panoramic 3/4 turn towards natural side lighting with one hand adjusting jacket.',
    matchTarget: 96,
    tags: ['mountain', 'adventure', 'nature'],
    coachingCue: 'Square your hips with the ridge line for a strong silhouette.',
  },
  {
    id: 'pose-4',
    title: 'Golden Sunset Stroll',
    category: 'Beach',
    difficulty: 'easy',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
    description: 'Dynamic mid-stride beach walking pose capturing natural shoreline motion.',
    matchTarget: 92,
    tags: ['beach', 'summer', 'walking'],
    coachingCue: 'Keep your stride wide and look down towards the water.',
  },
  {
    id: 'pose-5',
    title: 'Editorial Trench Stance',
    category: 'Fashion',
    difficulty: 'hard',
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80',
    description: 'High-fashion angular posture with collar hold and sharp chin alignment.',
    matchTarget: 98,
    tags: ['fashion', 'streetwear', 'formal'],
    coachingCue: 'Drop right shoulder 15° and maintain direct lens gaze.',
  },
  {
    id: 'pose-6',
    title: 'Forest Pathway Wander',
    category: 'Nature',
    difficulty: 'medium',
    imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop&q=80',
    description: 'Serene over-the-shoulder posture caught between tall pines and morning mist.',
    matchTarget: 93,
    tags: ['nature', 'serene', 'standing'],
    coachingCue: 'Turn your torso 45° away and gently turn head towards camera.',
  },
];
