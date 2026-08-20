/**
 * Snap Pose comprehensive dataset — Curated photography reference poses across lifestyle categories.
 * Curated for Beach, Cafe, Nature, Trek, Selfie, Gym, Street, City, Portrait, Couple, and Meme Templates.
 */

import type { Pose, Category } from '../types';

export const SNAP_POSE_CATEGORIES: Category[] = [
  {
    "id": "all",
    "name": "All",
    "slug": "all",
    "image": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80",
    "icon": "all",
    "color": "#65744A",
    "totalPoses": 259,
    "sortOrder": 0
  },
  {
    "id": "couple",
    "name": "Couple",
    "slug": "couple",
    "image": "https://drive.google.com/thumbnail?id=1dMo_aHWPRAP1Qt_muh4rxLnseLvSCymT&sz=w1000",
    "icon": "couple",
    "color": "#E1306C",
    "totalPoses": 29,
    "sortOrder": 1
  },
  {
    "id": "meme",
    "name": "Meme Templates",
    "slug": "meme",
    "image": "https://drive.google.com/thumbnail?id=1mYLUXBtR9vaS6TVvlgzQDEwpGAWeOBaE&sz=w1000",
    "icon": "sparkles",
    "color": "#FF6B6B",
    "totalPoses": 22,
    "sortOrder": 2
  },
  {
    "id": "beach",
    "name": "Beach",
    "slug": "beach",
    "image": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80",
    "icon": "beach",
    "color": "#00D9FF",
    "totalPoses": 24,
    "sortOrder": 3
  },
  {
    "id": "cafe",
    "name": "Cafe",
    "slug": "cafe",
    "image": "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&auto=format&fit=crop&q=80",
    "icon": "cafe",
    "color": "#8A6B47",
    "totalPoses": 22,
    "sortOrder": 4
  },
  {
    "id": "nature",
    "name": "Nature",
    "slug": "nature",
    "image": "https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&auto=format&fit=crop&q=80",
    "icon": "nature",
    "color": "#3B5E3C",
    "totalPoses": 24,
    "sortOrder": 5
  },
  {
    "id": "trek",
    "name": "Trek",
    "slug": "trek",
    "image": "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&auto=format&fit=crop&q=80",
    "icon": "trek",
    "color": "#FF8A00",
    "totalPoses": 22,
    "sortOrder": 6
  },
  {
    "id": "selfie",
    "name": "Selfie",
    "slug": "selfie",
    "image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80",
    "icon": "selfie",
    "color": "#9E7E52",
    "totalPoses": 25,
    "sortOrder": 7
  },
  {
    "id": "gym",
    "name": "Gym",
    "slug": "gym",
    "image": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80",
    "icon": "gym",
    "color": "#00D9FF",
    "totalPoses": 22,
    "sortOrder": 8
  },
  {
    "id": "street",
    "name": "Street",
    "slug": "street",
    "image": "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&auto=format&fit=crop&q=80",
    "icon": "street",
    "color": "#4F5B38",
    "totalPoses": 23,
    "sortOrder": 9
  },
  {
    "id": "city",
    "name": "City",
    "slug": "city",
    "image": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80",
    "icon": "city",
    "color": "#4F5B38",
    "totalPoses": 22,
    "sortOrder": 10
  },
  {
    "id": "portrait",
    "name": "Portrait",
    "slug": "portrait",
    "image": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80",
    "icon": "portrait",
    "color": "#7E9261",
    "totalPoses": 24,
    "sortOrder": 11
  },
  {
    "id": "cinematic",
    "name": "Cinematic & Sci-Fi",
    "slug": "cinematic",
    "image": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80",
    "icon": "sparkles",
    "color": "#FF8A00",
    "totalPoses": 7,
    "sortOrder": 12
  },
  {
    "id": "men",
    "name": "Men's Style",
    "slug": "men",
    "image": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=80",
    "icon": "user",
    "color": "#4A6572",
    "totalPoses": 5,
    "sortOrder": 13
  }
];

export const SNAP_POSE_DATASET: Pose[] = [
  {
    "id": "pose-tony-stark-tpose",
    "categoryId": "portrait",
    "category": "Portrait",
    "title": "The Power T-Pose (Tony Stark Stance)",
    "description": "Iconic arms-outstretched confident stance with palms facing up, sunglasses, and head held high against an epic horizon.",
    "imageUrl": "tony_stark_tpose",
    "thumbnailUrl": "tony_stark_tpose",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "t-pose",
      "tony-stark",
      "boss",
      "power",
      "confident",
      "editorial",
      "outdoor",
      "mountain"
    ],
    "views": 28940,
    "downloads": 14120,
    "favorites": 11450,
    "estimatedDistance": 2.2,
    "cameraAngle": "chest-height",
    "lighting": "direct sunlight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Stand upright with feet shoulder-width apart.",
      "Extend both arms straight horizontally to the sides, palms turned facing up.",
      "Tilt chin up 10° with a confident gaze through sunglasses.",
      "Position camera at chest height angled slightly upward to emphasize authority."
    ],
    "tips": [
      "Palms turned upward create an open, commanding presence.",
      "Suit jacket or structured shirt works best."
    ],
    "poseDna": {
      "energy": "intense",
      "body": "front",
      "head": "straight",
      "hands": "gesture",
      "legs": "straight",
      "camera": "chest height",
      "distance": "2.2m",
      "framing": "medium shot",
      "light": "face toward light",
      "environment": "mountain",
      "difficulty": "easy",
      "style": "Power Boss Stance",
      "motionLevel": "static"
    }
  },
  {
    "id": "pose-couple-drive-1",
    "categoryId": "couple",
    "category": "Couple",
    "title": "Sunset Serenade & Romantic Hold",
    "description": "Breathtaking intimate couple pose leaning together in warm ambient glow with gentle embrace.",
    "imageUrl": "https://drive.google.com/thumbnail?id=1dMo_aHWPRAP1Qt_muh4rxLnseLvSCymT&sz=w1000",
    "thumbnailUrl": "https://drive.google.com/thumbnail?id=1dMo_aHWPRAP1Qt_muh4rxLnseLvSCymT&sz=w1000",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "couple",
      "romantic",
      "sunset",
      "embrace",
      "drive-pose",
      "trending"
    ],
    "views": 16924,
    "downloads": 7963,
    "favorites": 2617,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Stand close with shoulders touching and turn slightly inward.",
      "One partner places a hand tenderly along the other’s waist or shoulder.",
      "Tilt heads gently toward each other with soft, genuine expressions.",
      "Allow natural warm backlighting to create a radiant rim around hair and shoulders."
    ],
    "tips": [
      "Keep body language soft and unstrained.",
      "Breathe naturally for a candid feeling."
    ]
  },
  {
    "id": "pose-couple-drive-2",
    "categoryId": "couple",
    "category": "Couple",
    "title": "Playful Cheek Pinch & Candid Gaze",
    "description": "Charming and fun candid duo moment filled with authentic smiles and joyful connection.",
    "imageUrl": "https://drive.google.com/thumbnail?id=1I6fMvzpXZIQV1npiEqsGbZ4ts_N1osgZ&sz=w1000",
    "thumbnailUrl": "https://drive.google.com/thumbnail?id=1I6fMvzpXZIQV1npiEqsGbZ4ts_N1osgZ&sz=w1000",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "couple",
      "candid",
      "playful",
      "smile",
      "joy",
      "trending"
    ],
    "views": 19105,
    "downloads": 3615,
    "favorites": 4710,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Stand cheek-to-cheek and break out into an inside joke.",
      "Gently touch cheek or chin with a playful grin.",
      "Look directly at the camera with sparkling, happy eyes."
    ],
    "tips": [
      "Spontaneous laughter looks best on camera.",
      "Shoot in burst mode to catch peak laughter."
    ]
  },
  {
    "id": "pose-couple-drive-3",
    "categoryId": "couple",
    "category": "Couple",
    "title": "Golden Hour Back Embrace",
    "description": "Heartwarming hug from behind with interlaced fingers during golden sunset lighting.",
    "imageUrl": "https://drive.google.com/thumbnail?id=18uGJ1pVlzGwwslYIEkwz-yz3EY25h14S&sz=w1000",
    "thumbnailUrl": "https://drive.google.com/thumbnail?id=18uGJ1pVlzGwwslYIEkwz-yz3EY25h14S&sz=w1000",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "couple",
      "hug",
      "golden-hour",
      "embrace",
      "romantic",
      "trending"
    ],
    "views": 18665,
    "downloads": 5446,
    "favorites": 4446,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "One partner stands facing forward while the other wraps both arms around from behind.",
      "Rest chin softly on the partner’s shoulder.",
      "Gaze warmly into the lens or glance sideways toward the setting sun."
    ],
    "tips": [
      "Keep hands relaxed rather than tight.",
      "Great for showing off watches or rings."
    ]
  },
  {
    "id": "pose-couple-drive-4",
    "categoryId": "couple",
    "category": "Couple",
    "title": "Intimate Nose-to-Nose Silhouette",
    "description": "Cinematic silhouette holding hands with foreheads touching in dramatic atmospheric light.",
    "imageUrl": "https://drive.google.com/thumbnail?id=1WAmdYuOVqfRsZOFxLMbJxojUGRTfXmu1&sz=w1000",
    "thumbnailUrl": "https://drive.google.com/thumbnail?id=1WAmdYuOVqfRsZOFxLMbJxojUGRTfXmu1&sz=w1000",
    "overlayImage": "",
    "difficulty": "medium",
    "indoor": false,
    "tags": [
      "couple",
      "silhouette",
      "forehead-touch",
      "cinematic",
      "intimate"
    ],
    "views": 11674,
    "downloads": 4242,
    "favorites": 6046,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Turn completely into side profile so facial silhouettes are crisp.",
      "Touch foreheads and noses gently without pressing tightly.",
      "Keep lips slightly parted with peaceful closed eyes."
    ],
    "tips": [
      "Expose for the bright background to deepen the foreground silhouette."
    ]
  },
  {
    "id": "pose-couple-drive-5",
    "categoryId": "couple",
    "category": "Couple",
    "title": "Urban Stroll & Shared Laughter",
    "description": "Dynamic street walk holding hands and looking at each other with beaming smiles.",
    "imageUrl": "https://drive.google.com/thumbnail?id=1xsK8gwwoaIuDM25haJ67dgDVALCEVFlz&sz=w1000",
    "thumbnailUrl": "https://drive.google.com/thumbnail?id=1xsK8gwwoaIuDM25haJ67dgDVALCEVFlz&sz=w1000",
    "overlayImage": "",
    "difficulty": "medium",
    "indoor": false,
    "tags": [
      "couple",
      "street",
      "walking",
      "lifestyle",
      "fashion",
      "trending"
    ],
    "views": 11692,
    "downloads": 3510,
    "favorites": 5221,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Walk slowly towards the camera in step.",
      "Hold hands casually and turn your heads to laugh together mid-stride.",
      "Let coats or scarves flow naturally with movement."
    ],
    "tips": [
      "Use a shutter speed of 1/250s or faster to freeze foot motion."
    ]
  },
  {
    "id": "pose-couple-drive-6",
    "categoryId": "couple",
    "category": "Couple",
    "title": "Cozy Jacket Wrap Dip",
    "description": "Passionate and stylish dip wrapped in an oversized winter coat or cozy shawl.",
    "imageUrl": "https://drive.google.com/thumbnail?id=1ZFIIt9R6Koqzkb0O6YGudsBfsC7Dc1aF&sz=w1000",
    "thumbnailUrl": "https://drive.google.com/thumbnail?id=1ZFIIt9R6Koqzkb0O6YGudsBfsC7Dc1aF&sz=w1000",
    "overlayImage": "",
    "difficulty": "hard",
    "indoor": false,
    "tags": [
      "couple",
      "dip",
      "winter",
      "cozy",
      "editorial",
      "trending"
    ],
    "views": 5675,
    "downloads": 2703,
    "favorites": 3396,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Lead partner bends knees with firm footing and supports back gently.",
      "Second partner arches gracefully while holding the jacket lapel.",
      "Tilt chin up for a dramatic romantic pose."
    ],
    "tips": [
      "Bend with legs, not back, for stability and safety."
    ]
  },
  {
    "id": "pose-couple-drive-7",
    "categoryId": "couple",
    "category": "Couple",
    "title": "Sweet Hand Kiss & Horizon Look",
    "description": "Timeless vintage romance with a tender hand kiss looking across an open scenic horizon.",
    "imageUrl": "https://drive.google.com/thumbnail?id=1s5FqjgbwP-GJI2WrDCvu91i7bJxbGVDu&sz=w1000",
    "thumbnailUrl": "https://drive.google.com/thumbnail?id=1s5FqjgbwP-GJI2WrDCvu91i7bJxbGVDu&sz=w1000",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "couple",
      "hand-kiss",
      "scenic",
      "fairytale",
      "elegance",
      "trending"
    ],
    "views": 8726,
    "downloads": 4828,
    "favorites": 3690,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Stand side-by-side overlooking the scenic view.",
      "Lift partner’s hand gently and place a tender kiss on knuckles.",
      "Second partner glances back with a loving, subtle smile."
    ],
    "tips": [
      "A medium shot works best to capture both expression and scenery."
    ]
  },
  {
    "id": "pose-couple-golden-embrace",
    "categoryId": "couple",
    "category": "Couple",
    "title": "Golden Hour Forehead Kiss",
    "description": "Tender forehead kiss with hands gently framing the face bathed in warm golden sunset backlight.",
    "imageUrl": "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "couple",
      "romantic",
      "sunset",
      "golden hour",
      "intimate",
      "embrace"
    ],
    "views": 18211,
    "downloads": 5162,
    "favorites": 6370,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-couple-whisper-giggle",
    "categoryId": "couple",
    "category": "Couple",
    "title": "The Whisper & Candid Laugh",
    "description": "Playful and spontaneous moment where one partner whispers a funny secret, sparking a joyful laugh.",
    "imageUrl": "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "couple",
      "candid",
      "laugh",
      "playful",
      "joy",
      "smile"
    ],
    "views": 9179,
    "downloads": 6201,
    "favorites": 4076,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-couple-hand-in-hand-stroll",
    "categoryId": "couple",
    "category": "Couple",
    "title": "Hand-in-Hand Sunset Walk",
    "description": "Dreamy stroll holding hands with fingers interlocked, glancing back over the shoulder.",
    "imageUrl": "https://images.unsplash.com/photo-1494774157365-9e04c6720e47?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1494774157365-9e04c6720e47?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "couple",
      "walking",
      "travel",
      "cinematic",
      "beach",
      "sunset"
    ],
    "views": 13543,
    "downloads": 5454,
    "favorites": 6455,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-couple-slow-dance-spin",
    "categoryId": "couple",
    "category": "Couple",
    "title": "The Slow Dance Twirl",
    "description": "Graceful slow-dance spin with one hand raised, capturing movement, elegance, and romantic charm.",
    "imageUrl": "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "couple",
      "dance",
      "twirl",
      "elegance",
      "fairytale",
      "motion"
    ],
    "views": 15258,
    "downloads": 2781,
    "favorites": 6407,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-couple-cafe-cozy",
    "categoryId": "couple",
    "category": "Couple",
    "title": "Cozy Cafe Window Date",
    "description": "Intimate coffee date seated closely by a warm window, sharing a quiet gaze across artisan coffee.",
    "imageUrl": "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "couple",
      "cafe",
      "cozy",
      "indoor",
      "lifestyle",
      "coffee date"
    ],
    "views": 16949,
    "downloads": 3894,
    "favorites": 2777,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-couple-playful-lift",
    "categoryId": "couple",
    "category": "Couple",
    "title": "The Joyful Lift & Hug",
    "description": "High-energy romance with one partner lifting the other up into an embrace filled with laughter.",
    "imageUrl": "https://images.unsplash.com/photo-1519741497674-611481863552?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1519741497674-611481863552?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "couple",
      "playful",
      "lift",
      "hug",
      "joy",
      "vibrant"
    ],
    "views": 15901,
    "downloads": 5456,
    "favorites": 2055,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-couple-rainy-umbrella-kiss",
    "categoryId": "couple",
    "category": "Couple",
    "title": "Rainy City Umbrella Kiss",
    "description": "Cinematic rain kiss under a clear umbrella with glowing streetlamps and sparkling wet pavement.",
    "imageUrl": "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "couple",
      "kiss",
      "rain",
      "umbrella",
      "city",
      "night",
      "cinematic"
    ],
    "views": 5280,
    "downloads": 6743,
    "favorites": 3310,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-couple-beach-sunset-kiss",
    "categoryId": "couple",
    "category": "Couple",
    "title": "Shoreline Sunset Silhouette Kiss",
    "description": "Breathtaking silhouette kiss at the ocean shoreline with gentle tides washing over the sand.",
    "imageUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "couple",
      "kiss",
      "beach",
      "sunset",
      "silhouette",
      "coastal",
      "ocean"
    ],
    "views": 19940,
    "downloads": 3944,
    "favorites": 2883,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-couple-snowy-mountain-kiss",
    "categoryId": "couple",
    "category": "Couple",
    "title": "Snowy Alpine Mist Kiss",
    "description": "Cozy winter romance wrapped in woolen scarves and parkas overlooking a snow-dusted pine peak.",
    "imageUrl": "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "couple",
      "kiss",
      "snow",
      "winter",
      "mountains",
      "cozy",
      "nature"
    ],
    "views": 10377,
    "downloads": 6932,
    "favorites": 6300,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-couple-rooftop-skyline-kiss",
    "categoryId": "couple",
    "category": "Couple",
    "title": "Midnight Rooftop Skyline Kiss",
    "description": "Glamorous night romance on an urban skyscraper terrace overlooking illuminated city towers.",
    "imageUrl": "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "couple",
      "kiss",
      "rooftop",
      "city",
      "night",
      "skyline",
      "luxury"
    ],
    "views": 10851,
    "downloads": 5600,
    "favorites": 5896,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-couple-car-hood-stargazing",
    "categoryId": "couple",
    "category": "Couple",
    "title": "Vintage Car Hood Stargazing Kiss",
    "description": "Nostalgic retro romance sitting together on a classic car hood under twinkling starry skies.",
    "imageUrl": "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "couple",
      "kiss",
      "roadtrip",
      "retro",
      "vintage",
      "stargazing",
      "adventure"
    ],
    "views": 8384,
    "downloads": 7952,
    "favorites": 5853,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-couple-greenhouse-dip-kiss",
    "categoryId": "couple",
    "category": "Couple",
    "title": "Botanical Greenhouse Dip Kiss",
    "description": "Ethereal garden dip kiss surrounded by cascading tropical palms and streaming sunbeams.",
    "imageUrl": "https://images.unsplash.com/photo-1533038590840-1cde6e668a91?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1533038590840-1cde6e668a91?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "couple",
      "kiss",
      "dip",
      "greenhouse",
      "nature",
      "botanical",
      "elegance"
    ],
    "views": 16820,
    "downloads": 4899,
    "favorites": 2247,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-couple-piggyback-beach",
    "categoryId": "couple",
    "category": "Couple",
    "title": "Sunset Piggyback Ride",
    "description": "Energetic and playful piggyback ride along the ocean surf during sunset.",
    "imageUrl": "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "couple",
      "piggyback",
      "beach",
      "fun",
      "playful",
      "energy"
    ],
    "views": 14992,
    "downloads": 5908,
    "favorites": 5016,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-couple-picnic-basket-gaze",
    "categoryId": "couple",
    "category": "Couple",
    "title": "Sunny Park Blanket Picnic",
    "description": "Relaxed afternoon picnic lying on a gingham blanket sharing strawberries and soft gazes.",
    "imageUrl": "https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "couple",
      "picnic",
      "park",
      "relaxed",
      "summer",
      "cozy"
    ],
    "views": 7150,
    "downloads": 2350,
    "favorites": 3824,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-couple-museum-gallery-hold",
    "categoryId": "couple",
    "category": "Couple",
    "title": "Art Gallery Whispered Insight",
    "description": "Sophisticated museum date standing arm-in-arm admiring large classical canvas paintings.",
    "imageUrl": "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "couple",
      "art",
      "museum",
      "aesthetic",
      "indoor",
      "culture"
    ],
    "views": 14180,
    "downloads": 3974,
    "favorites": 2728,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-couple-bicycle-tandem-ride",
    "categoryId": "couple",
    "category": "Couple",
    "title": "Vintage Bicycle Duo Ride",
    "description": "Charming European city ride with flowers in the basket and coordinated pastel outfits.",
    "imageUrl": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "couple",
      "bicycle",
      "vintage",
      "travel",
      "european",
      "summer"
    ],
    "views": 11695,
    "downloads": 5840,
    "favorites": 6317,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-couple-ferris-wheel-kiss",
    "categoryId": "couple",
    "category": "Couple",
    "title": "Fairground Ferris Wheel Kiss",
    "description": "Magical amusement park night kiss in a glowing Ferris wheel cart high above festive lights.",
    "imageUrl": "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "couple",
      "ferris-wheel",
      "carnival",
      "lights",
      "night",
      "magic"
    ],
    "views": 6867,
    "downloads": 2399,
    "favorites": 4397,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-couple-library-aisle-peek",
    "categoryId": "couple",
    "category": "Couple",
    "title": "Old Library Bookshelf Peeking",
    "description": "Sweet intellectual romance peeking between vintage book stacks with soft smiles.",
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "couple",
      "library",
      "books",
      "cozy",
      "retro",
      "indoor"
    ],
    "views": 14721,
    "downloads": 6607,
    "favorites": 2319,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-couple-campfire-marshmallow",
    "categoryId": "couple",
    "category": "Couple",
    "title": "Campfire Blanket Snuggle",
    "description": "Roasting marshmallows wrapped in a thick wool blanket by a crackling wilderness fire.",
    "imageUrl": "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "couple",
      "campfire",
      "camping",
      "wilderness",
      "cozy",
      "night"
    ],
    "views": 17275,
    "downloads": 6630,
    "favorites": 1767,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-couple-cooking-kitchen-candid",
    "categoryId": "couple",
    "category": "Couple",
    "title": "Morning Kitchen Cooking Dance",
    "description": "Candid lifestyle romance preparing morning coffee and pancakes in relaxed matching loungewear.",
    "imageUrl": "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "couple",
      "kitchen",
      "cooking",
      "morning",
      "lifestyle",
      "candid"
    ],
    "views": 13153,
    "downloads": 2932,
    "favorites": 3367,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-couple-record-store-listening",
    "categoryId": "couple",
    "category": "Couple",
    "title": "Vinyl Record Store Headphone Share",
    "description": "Retro music date sharing a single pair of vintage headphones browsing vinyl album racks.",
    "imageUrl": "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "couple",
      "vinyl",
      "music",
      "retro",
      "aesthetic",
      "indoor"
    ],
    "views": 19862,
    "downloads": 4451,
    "favorites": 4659,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-couple-bridge-golden-gaze",
    "categoryId": "couple",
    "category": "Couple",
    "title": "Historic Stone Bridge Sunset",
    "description": "Elegantly leaning over an ancient stone bridge parapet watching reflections on the river.",
    "imageUrl": "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "couple",
      "bridge",
      "sunset",
      "historic",
      "travel",
      "cinematic"
    ],
    "views": 15113,
    "downloads": 3061,
    "favorites": 1672,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-meme-drive-1",
    "categoryId": "meme",
    "category": "Meme Templates",
    "title": "The Shocked Reaction Stance",
    "description": "Iconic wide-eyed jaw drop reaction pose with hands on cheeks for viral expressive memes.",
    "imageUrl": "https://drive.google.com/thumbnail?id=1mYLUXBtR9vaS6TVvlgzQDEwpGAWeOBaE&sz=w1000",
    "thumbnailUrl": "https://drive.google.com/thumbnail?id=1mYLUXBtR9vaS6TVvlgzQDEwpGAWeOBaE&sz=w1000",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "meme",
      "reaction",
      "shocked",
      "funny",
      "viral",
      "template"
    ],
    "views": 11536,
    "downloads": 3758,
    "favorites": 5663,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Drop your jaw in dramatic surprise.",
      "Place both palms lightly against cheeks with wide eyes.",
      "Position camera slightly below eye level for maximum comedic impact."
    ],
    "tips": [
      "Go all out on facial expressions — the bigger the surprise, the funnier the template."
    ]
  },
  {
    "id": "pose-meme-drive-2",
    "categoryId": "meme",
    "category": "Meme Templates",
    "title": "The Confident Smirk & Point",
    "description": "Smug confident finger-guns point with a knowing wink for humorous flexing templates.",
    "imageUrl": "https://drive.google.com/thumbnail?id=1KDzpQFLbWUQNcIkR_i6_DFwvUpvaOTK3&sz=w1000",
    "thumbnailUrl": "https://drive.google.com/thumbnail?id=1KDzpQFLbWUQNcIkR_i6_DFwvUpvaOTK3&sz=w1000",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "meme",
      "smug",
      "finger-guns",
      "confident",
      "viral",
      "template"
    ],
    "views": 11733,
    "downloads": 2676,
    "favorites": 3803,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Point directly at the camera lens with two finger guns.",
      "Cock one eyebrow up with a knowing sideways smirk.",
      "Lean weight back casually on one hip."
    ],
    "tips": [
      "Sharp eye contact makes this template immediately relatable."
    ]
  },
  {
    "id": "pose-meme-drive-3",
    "categoryId": "meme",
    "category": "Meme Templates",
    "title": "The Dramatic Overthinker Lean",
    "description": "Exaggerated dramatic thinker pose staring intently into the distance pondering life choices.",
    "imageUrl": "https://drive.google.com/thumbnail?id=1RWJKwlpA-3wXYaR5zloZiXiYNFFrW6AK&sz=w1000",
    "thumbnailUrl": "https://drive.google.com/thumbnail?id=1RWJKwlpA-3wXYaR5zloZiXiYNFFrW6AK&sz=w1000",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "meme",
      "thinker",
      "overthinking",
      "dramatic",
      "relatable",
      "template"
    ],
    "views": 8945,
    "downloads": 7615,
    "favorites": 4458,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Rest chin on closed fist like the classical Thinker statue.",
      "Stare deeply into the distance with a puzzled or existential expression.",
      "Tilt head 25 degrees toward the light."
    ],
    "tips": [
      "Add an intense furrowed brow for dramatic comedic effect."
    ]
  },
  {
    "id": "pose-meme-drive-4",
    "categoryId": "meme",
    "category": "Meme Templates",
    "title": "The Suspicious Glare & Squint",
    "description": "Hilarious narrow-eyed squint judging something suspicious or questioning obvious claims.",
    "imageUrl": "https://drive.google.com/thumbnail?id=1s8gJBflAeIX3Efj8JRnuc7aU200yhiWh&sz=w1000",
    "thumbnailUrl": "https://drive.google.com/thumbnail?id=1s8gJBflAeIX3Efj8JRnuc7aU200yhiWh&sz=w1000",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "meme",
      "suspicious",
      "glare",
      "squint",
      "funny",
      "template"
    ],
    "views": 6621,
    "downloads": 3791,
    "favorites": 3399,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Narrow your eyes into a sharp skeptical squint.",
      "Slightly purse lips and tilt chin downward.",
      "Gaze intently sideways toward the edge of the frame."
    ],
    "tips": [
      "Keep lighting even so the narrow eye expression is crystal clear."
    ]
  },
  {
    "id": "pose-meme-drive-5",
    "categoryId": "meme",
    "category": "Meme Templates",
    "title": "The Ultimate Facepalm Stance",
    "description": "Classic palm-to-forehead facepalm expressing hilarious disbelief, exhaustion, or second-hand cringe.",
    "imageUrl": "https://drive.google.com/thumbnail?id=1ULjTYo9gvjPAEFkV5MKjl5FLqr4YyHvW&sz=w1000",
    "thumbnailUrl": "https://drive.google.com/thumbnail?id=1ULjTYo9gvjPAEFkV5MKjl5FLqr4YyHvW&sz=w1000",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "meme",
      "facepalm",
      "cringe",
      "exhausted",
      "viral",
      "template"
    ],
    "views": 10725,
    "downloads": 5331,
    "favorites": 3923,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Place open palm firmly across forehead and bridge of nose.",
      "Drop your shoulders slightly in total resignation.",
      "Slightly shake head or tilt downward."
    ],
    "tips": [
      "Let fingers slightly part so one eye or expression is partially visible."
    ]
  },
  {
    "id": "pose-meme-drive-6",
    "categoryId": "meme",
    "category": "Meme Templates",
    "title": "The Mindblown Realization Pose",
    "description": "Hands expanding outward from temples representing sudden mind-shattering realizations.",
    "imageUrl": "https://drive.google.com/thumbnail?id=18y8PLa4Kx7slCwzMhFrQds1CMuHF7CM2&sz=w1000",
    "thumbnailUrl": "https://drive.google.com/thumbnail?id=18y8PLa4Kx7slCwzMhFrQds1CMuHF7CM2&sz=w1000",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "meme",
      "mindblown",
      "galaxy-brain",
      "realization",
      "viral",
      "template"
    ],
    "views": 12591,
    "downloads": 7865,
    "favorites": 1795,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Start with hands by your temples, then fling fingers open like an explosion.",
      "Widen eyes and mouth in utter awe and revelation.",
      "Position camera dead-center for symmetrical impact."
    ],
    "tips": [
      "Exaggerated hand motion creates instant meme recognition."
    ]
  },
  {
    "id": "pose-meme-drive-7",
    "categoryId": "meme",
    "category": "Meme Templates",
    "title": "The Sneaky Plan Rub & Grin",
    "description": "Rubbing hands together with a devious, mischievous grin concocting a genius viral scheme.",
    "imageUrl": "https://drive.google.com/thumbnail?id=1Glhv5H9I3BQjL4T_tUvOcjgdFtiNgNBr&sz=w1000",
    "thumbnailUrl": "https://drive.google.com/thumbnail?id=1Glhv5H9I3BQjL4T_tUvOcjgdFtiNgNBr&sz=w1000",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "meme",
      "sneaky",
      "scheming",
      "mischief",
      "funny",
      "template"
    ],
    "views": 11686,
    "downloads": 7961,
    "favorites": 5716,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Rub both hands together near chest height.",
      "Hunch shoulders slightly forward with a playful devious smile.",
      "Look slightly up from under your brow at the camera."
    ],
    "tips": [
      "Angle camera from slightly above to accentuate the sneaky eyebrow raise."
    ]
  },
  {
    "id": "pose-meme-drive-8",
    "categoryId": "meme",
    "category": "Meme Templates",
    "title": "The Iconic Victory / Mic Drop Walk",
    "description": "Striding away casually in sunglasses without looking back like an action movie meme legend.",
    "imageUrl": "https://drive.google.com/thumbnail?id=1JFzGguDH98a5muWky39kJgPIvrQ7zU8o&sz=w1000",
    "thumbnailUrl": "https://drive.google.com/thumbnail?id=1JFzGguDH98a5muWky39kJgPIvrQ7zU8o&sz=w1000",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "meme",
      "victory",
      "mic-drop",
      "boss",
      "cool",
      "template"
    ],
    "views": 19243,
    "downloads": 7007,
    "favorites": 4139,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Put on dark sunglasses and walk briskly towards the lens.",
      "Do not look back; keep chin level and shoulders squared.",
      "Hold a prop or hand casually in pocket for effortless boss energy."
    ],
    "tips": [
      "Low angle makes this walk look legendary."
    ]
  },
  {
    "id": "pose-meme-distracted-walk",
    "categoryId": "meme",
    "category": "Meme Templates",
    "title": "The Distracted Glance Back",
    "description": "Looking back over the shoulder with wide eyes checking out something exciting.",
    "imageUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "meme",
      "distracted",
      "glance",
      "funny",
      "template"
    ],
    "views": 6889,
    "downloads": 3873,
    "favorites": 6421,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-meme-is-this-a-pigeon",
    "categoryId": "meme",
    "category": "Meme Templates",
    "title": "The Outstretched Palm Question",
    "description": "Hand gesturing gently toward an object with an overly polite inquiring face.",
    "imageUrl": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "meme",
      "gesture",
      "curious",
      "question",
      "template"
    ],
    "views": 15831,
    "downloads": 5764,
    "favorites": 1721,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-meme-drake-reject-accept",
    "categoryId": "meme",
    "category": "Meme Templates",
    "title": "The Dismissive Hand & Approve Point",
    "description": "Turning head away with palm up rejecting one thing, followed by enthusiastic finger point.",
    "imageUrl": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "meme",
      "reject",
      "approve",
      "drake",
      "classic",
      "template"
    ],
    "views": 16113,
    "downloads": 7265,
    "favorites": 4587,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-meme-two-buttons-sweat",
    "categoryId": "meme",
    "category": "Meme Templates",
    "title": "The Hard Choice Forehead Dab",
    "description": "Nervously dabbing a sweaty brow while looking back and forth between two difficult options.",
    "imageUrl": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "meme",
      "dilemma",
      "nervous",
      "sweat",
      "choice",
      "template"
    ],
    "views": 7030,
    "downloads": 6416,
    "favorites": 5730,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-meme-change-my-mind-sit",
    "categoryId": "meme",
    "category": "Meme Templates",
    "title": "The Coffee Table Challenge Sit",
    "description": "Sitting confidently behind a table with arms crossed sipping coffee with an open challenge look.",
    "imageUrl": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "meme",
      "debate",
      "challenge",
      "confident",
      "sit",
      "template"
    ],
    "views": 9790,
    "downloads": 4015,
    "favorites": 6036,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-meme-woman-yelling-cat",
    "categoryId": "meme",
    "category": "Meme Templates",
    "title": "The Pointing Accusation Drama",
    "description": "Dramatically pointing a weeping finger while a friend holds you back in high comedy drama.",
    "imageUrl": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "meme",
      "drama",
      "pointing",
      "crying",
      "funny",
      "template"
    ],
    "views": 5279,
    "downloads": 3394,
    "favorites": 6260,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-meme-confused-math-lady",
    "categoryId": "meme",
    "category": "Meme Templates",
    "title": "The Squinting Calculation Gaze",
    "description": "Staring into empty space trying to do complex mental math while squinting with mouth agape.",
    "imageUrl": "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "meme",
      "math",
      "confused",
      "thinking",
      "calculation",
      "template"
    ],
    "views": 10677,
    "downloads": 6700,
    "favorites": 4045,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-meme-chef-kiss-delicious",
    "categoryId": "meme",
    "category": "Meme Templates",
    "title": "The Italian Chef’s Kiss Perfection",
    "description": "Bringing fingers together to lips and kissing them outward to declare absolute perfection.",
    "imageUrl": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "meme",
      "chefs-kiss",
      "perfection",
      "delicious",
      "italian",
      "template"
    ],
    "views": 18461,
    "downloads": 3224,
    "favorites": 4752,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-meme- leonardo-toast-glass",
    "categoryId": "meme",
    "category": "Meme Templates",
    "title": "The Gatsby Champagne Toast",
    "description": "Raising a sparkling glass toward the camera with a debonair smile and fireworks background aura.",
    "imageUrl": "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "meme",
      "toast",
      "gatsby",
      "cheers",
      "champagne",
      "template"
    ],
    "views": 7064,
    "downloads": 2349,
    "favorites": 3169,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-meme-hiding-in-bushes",
    "categoryId": "meme",
    "category": "Meme Templates",
    "title": "The Slow Backward Hedge Retreat",
    "description": "Fading smoothly backwards into green bushes with a neutral polite smile.",
    "imageUrl": "https://images.unsplash.com/photo-1448375240586-882707db888b?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1448375240586-882707db888b?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "meme",
      "disappear",
      "bushes",
      "awkward",
      "retreat",
      "template"
    ],
    "views": 9134,
    "downloads": 7976,
    "favorites": 3913,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-meme-panik-kalm-panik",
    "categoryId": "meme",
    "category": "Meme Templates",
    "title": "The Sudden Panic Wide Eyes",
    "description": "Instantly transforming from calm relaxation to wide-eyed panic in a split second.",
    "imageUrl": "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "meme",
      "panic",
      "calm",
      "funny",
      "facial-expression",
      "template"
    ],
    "views": 9117,
    "downloads": 7045,
    "favorites": 1623,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-meme-stonks-upward-point",
    "categoryId": "meme",
    "category": "Meme Templates",
    "title": "The Upward Graph Stride",
    "description": "Standing in a business suit pointing proudly up and to the right representing skyrocketing success.",
    "imageUrl": "https://images.unsplash.com/photo-1480429370139-e0132c086e2a?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1480429370139-e0132c086e2a?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "meme",
      "stonks",
      "business",
      "success",
      "arrow",
      "template"
    ],
    "views": 5558,
    "downloads": 3366,
    "favorites": 5965,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-meme-salute-crying-hero",
    "categoryId": "meme",
    "category": "Meme Templates",
    "title": "The Tearful Respectful Salute",
    "description": "Snapping a crisp military salute with a single dramatic tear rolling down the cheek.",
    "imageUrl": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "meme",
      "salute",
      "respect",
      "hero",
      "tear",
      "template"
    ],
    "views": 18812,
    "downloads": 5893,
    "favorites": 1948,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-meme-spiderman-pointing-self",
    "categoryId": "meme",
    "category": "Meme Templates",
    "title": "The Accusatory Mirror Finger",
    "description": "Pointing directly at another identical person or mirror reflection shouting ‘You!’.",
    "imageUrl": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "meme",
      "pointing",
      "identical",
      "spiderman",
      "funny",
      "template"
    ],
    "views": 10003,
    "downloads": 3848,
    "favorites": 4031,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-beach-palm-lean",
    "categoryId": "beach",
    "category": "Beach",
    "title": "Palm Tree Lean",
    "description": "Effortless coastal pose leaning relaxed against a palm tree trunk in a loose sage linen shirt.",
    "imageUrl": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "beach",
      "lean",
      "tree",
      "linen",
      "coastal",
      "relaxed"
    ],
    "views": 15119,
    "downloads": 4629,
    "favorites": 5722,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-beach-railing-stance",
    "categoryId": "beach",
    "category": "Beach",
    "title": "Coastal Railing Stance",
    "description": "Classic vacation portrait standing with crossed arms by a stone railing overlooking the ocean.",
    "imageUrl": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "beach",
      "railing",
      "view",
      "ocean",
      "vacation"
    ],
    "views": 14035,
    "downloads": 2172,
    "favorites": 2072,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-beach-golden-sunset",
    "categoryId": "beach",
    "category": "Beach",
    "title": "Golden Sunset Shoreline",
    "description": "Cinematic golden hour beach walk in an open cream linen shirt with warm sunset reflection.",
    "imageUrl": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "beach",
      "sunset",
      "golden-hour",
      "shoreline",
      "linen"
    ],
    "views": 8854,
    "downloads": 5628,
    "favorites": 1782,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-beach-sand-stride",
    "categoryId": "beach",
    "category": "Beach",
    "title": "Sand Shore Stride",
    "description": "Casual mid-stride walk across golden beach sand in a beige sweater and relaxed trousers.",
    "imageUrl": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "beach",
      "walk",
      "sand",
      "casual",
      "stride"
    ],
    "views": 9024,
    "downloads": 3859,
    "favorites": 2279,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-beach-surfboard-lean",
    "categoryId": "beach",
    "category": "Beach",
    "title": "Surfboard Propped Stance",
    "description": "Athletic coastal pose leaning against a classic wooden surfboard on warm coastal sands.",
    "imageUrl": "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "beach",
      "surf",
      "surfboard",
      "ocean",
      "athletic",
      "summer"
    ],
    "views": 13989,
    "downloads": 6141,
    "favorites": 4218,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-beach-water-splash-kick",
    "categoryId": "beach",
    "category": "Beach",
    "title": "Barefoot Water Splash Kick",
    "description": "Playful splash kicking through shallow ocean waves with vibrant summer energy.",
    "imageUrl": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "beach",
      "water",
      "splash",
      "playful",
      "summer",
      "wave"
    ],
    "views": 14207,
    "downloads": 4272,
    "favorites": 3216,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-beach-straw-hat-shade",
    "categoryId": "beach",
    "category": "Beach",
    "title": "Straw Hat Sun Shade",
    "description": "Elegant portrait tilting a woven straw hat downward to cast artistic sunbeam shadows on the face.",
    "imageUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "beach",
      "hat",
      "shadows",
      "portrait",
      "summer",
      "elegance"
    ],
    "views": 11827,
    "downloads": 3694,
    "favorites": 4777,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-beach-dune-crest-gaze",
    "categoryId": "beach",
    "category": "Beach",
    "title": "Sand Dune Crest Horizon",
    "description": "Standing at the peak of a rolling golden sand dune looking out into vast azure ocean waters.",
    "imageUrl": "https://images.unsplash.com/photo-1509233725247-49e657c54213?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1509233725247-49e657c54213?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "beach",
      "dunes",
      "horizon",
      "vast",
      "scenic",
      "wind"
    ],
    "views": 9562,
    "downloads": 5724,
    "favorites": 5421,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-beach-towel-shoulder-drape",
    "categoryId": "beach",
    "category": "Beach",
    "title": "Striped Towel Shoulder Drape",
    "description": "Casual resort lifestyle pose with a rolled cabana towel over one shoulder and aviators.",
    "imageUrl": "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "beach",
      "resort",
      "towel",
      "aviators",
      "chill",
      "luxury"
    ],
    "views": 15755,
    "downloads": 3013,
    "favorites": 5106,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-beach-hammock-palm-rest",
    "categoryId": "beach",
    "category": "Beach",
    "title": "Seaside Hammock Drift",
    "description": "Relaxed horizontal lounger pose in a woven macrame hammock strung between two palm trees.",
    "imageUrl": "https://images.unsplash.com/photo-1473186578172-c141e6798cf4?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1473186578172-c141e6798cf4?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "beach",
      "hammock",
      "relaxed",
      "palms",
      "island",
      "vacation"
    ],
    "views": 5370,
    "downloads": 6986,
    "favorites": 5078,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-beach-shell-finder-crouch",
    "categoryId": "beach",
    "category": "Beach",
    "title": "Seashell Foraging Crouch",
    "description": "Candid low-angle crouch looking down at glistening seashells and tidal pools.",
    "imageUrl": "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "beach",
      "crouch",
      "candid",
      "shells",
      "tidepool",
      "nature"
    ],
    "views": 17459,
    "downloads": 5003,
    "favorites": 3128,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-beach-sunglasses-lower-look",
    "categoryId": "beach",
    "category": "Beach",
    "title": "Sunglasses Lowered Eye Contact",
    "description": "Charismatic beach portrait gently sliding sunglasses down the nose to make direct eye contact.",
    "imageUrl": "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "beach",
      "sunglasses",
      "charismatic",
      "gaze",
      "summer"
    ],
    "views": 16329,
    "downloads": 6040,
    "favorites": 3361,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-beach-tidal-rock-perch",
    "categoryId": "beach",
    "category": "Beach",
    "title": "Tidal Rock Cliff Perch",
    "description": "Dramatic pose sitting on dark volcanic sea rocks with crashing white foam in the background.",
    "imageUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "beach",
      "rocks",
      "cliff",
      "waves",
      "dramatic",
      "ocean"
    ],
    "views": 6688,
    "downloads": 5401,
    "favorites": 3532,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-beach-wet-hair-pushback",
    "categoryId": "beach",
    "category": "Beach",
    "title": "Wet Hair Ocean Slick",
    "description": "Fresh out of the surf pushing wet hair back from the face with natural golden sunlight on skin.",
    "imageUrl": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "beach",
      "surf",
      "water",
      "wet-hair",
      "candid",
      "summer"
    ],
    "views": 19848,
    "downloads": 7060,
    "favorites": 2743,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-beach-coconut-drink-sip",
    "categoryId": "beach",
    "category": "Beach",
    "title": "Fresh Coconut Straw Sip",
    "description": "Tropical vacation portrait holding a green coconut with a straw and an effortless sunny smile.",
    "imageUrl": "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "beach",
      "coconut",
      "tropical",
      "drink",
      "refreshing",
      "vacation"
    ],
    "views": 11909,
    "downloads": 7264,
    "favorites": 4441,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-beach-sunrise-yoga-arc",
    "categoryId": "beach",
    "category": "Beach",
    "title": "Sunrise Shoreline Warrior Arc",
    "description": "Graceful yoga warrior pose on wet sand reflecting the pastel pink and orange morning dawn.",
    "imageUrl": "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "beach",
      "yoga",
      "sunrise",
      "warrior",
      "fitness",
      "mindful"
    ],
    "views": 6827,
    "downloads": 5465,
    "favorites": 3800,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-beach-blanket-lounger-book",
    "categoryId": "beach",
    "category": "Beach",
    "title": "Beach Blanket Book Reading",
    "description": "Cozy lifestyle pose lying propped on elbows reading a paperback novel on a linen beach spread.",
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "beach",
      "reading",
      "book",
      "lifestyle",
      "calm",
      "cozy"
    ],
    "views": 19769,
    "downloads": 3990,
    "favorites": 6093,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-beach-sunset-silhouette-jump",
    "categoryId": "beach",
    "category": "Beach",
    "title": "Sunset Mid-Air Joy Jump",
    "description": "Exuberant silhouette jumping into the golden sunset sky over the breaking surf.",
    "imageUrl": "https://images.unsplash.com/photo-1519741497674-611481863552?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1519741497674-611481863552?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "beach",
      "jump",
      "energy",
      "silhouette",
      "joy",
      "sunset"
    ],
    "views": 11142,
    "downloads": 6418,
    "favorites": 4039,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-beach-coastal-path-bike",
    "categoryId": "beach",
    "category": "Beach",
    "title": "Beach Cruiser Promenade Stroll",
    "description": "Holding handlebars of a vintage beach cruiser bicycle along a seaside boardwalk.",
    "imageUrl": "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "beach",
      "bicycle",
      "boardwalk",
      "cruiser",
      "lifestyle"
    ],
    "views": 5831,
    "downloads": 3214,
    "favorites": 4003,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-beach-ocean-horizon-point",
    "categoryId": "beach",
    "category": "Beach",
    "title": "Ocean Horizon Distant Point",
    "description": "Pointing casually toward a distant lighthouse or sailboat with back slightly to camera.",
    "imageUrl": "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "beach",
      "point",
      "horizon",
      "travel",
      "discovery"
    ],
    "views": 19599,
    "downloads": 7016,
    "favorites": 3130,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-beach-breeze-linen-flow",
    "categoryId": "beach",
    "category": "Beach",
    "title": "Sea Breeze Linen Silhouette",
    "description": "Flowing white linen shirt catching the coastal wind with eyes closed enjoying the sea air.",
    "imageUrl": "https://images.unsplash.com/photo-1494774157365-9e04c6720e47?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1494774157365-9e04c6720e47?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "beach",
      "wind",
      "linen",
      "peaceful",
      "meditative"
    ],
    "views": 8686,
    "downloads": 3945,
    "favorites": 5174,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-beach-driftwood-bench-sit",
    "categoryId": "beach",
    "category": "Beach",
    "title": "Weathered Driftwood Perch",
    "description": "Sitting thoughtfully on a large weathered driftwood log washed up along the wild coastline.",
    "imageUrl": "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "beach",
      "driftwood",
      "wild",
      "thoughtful",
      "nature"
    ],
    "views": 10356,
    "downloads": 5118,
    "favorites": 2407,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-beach-sundown-wave-dip",
    "categoryId": "beach",
    "category": "Beach",
    "title": "Twilight Surf Ankles Dip",
    "description": "Standing ankle-deep in the cool evening surf with sky shifting from violet to deep navy.",
    "imageUrl": "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "beach",
      "twilight",
      "surf",
      "water",
      "evening",
      "peace"
    ],
    "views": 11931,
    "downloads": 5099,
    "favorites": 2450,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-beach-pier-piling-lean",
    "categoryId": "beach",
    "category": "Beach",
    "title": "Wooden Pier Piling Shadow",
    "description": "Leaning against tall dark wooden pier columns with beams of sunlight cutting through.",
    "imageUrl": "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "beach",
      "pier",
      "architecture",
      "shadows",
      "rustic"
    ],
    "views": 6058,
    "downloads": 3277,
    "favorites": 6252,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-cafe-window-sip",
    "categoryId": "cafe",
    "category": "Cafe",
    "title": "Window Light Latte Sip",
    "description": "Warm morning light illuminating a ceramic latte mug held with both hands while gazing out.",
    "imageUrl": "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "cafe",
      "coffee",
      "latte",
      "morning",
      "window",
      "cozy"
    ],
    "views": 8124,
    "downloads": 5207,
    "favorites": 4302,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-cafe-laptop-work",
    "categoryId": "cafe",
    "category": "Cafe",
    "title": "Artisan Cafe Workspace",
    "description": "Focused digital nomad work pose with laptop, pour-over coffee, and natural wood desk.",
    "imageUrl": "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "cafe",
      "work",
      "laptop",
      "focus",
      "nomad",
      "lifestyle"
    ],
    "views": 6651,
    "downloads": 5494,
    "favorites": 2055,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-cafe-over-mug-gaze",
    "categoryId": "cafe",
    "category": "Cafe",
    "title": "Over-the-Mug Eye Contact",
    "description": "Intimate candid portrait looking directly over the rim of a steaming cappuccino mug.",
    "imageUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "cafe",
      "eyes",
      "cappuccino",
      "portrait",
      "candid"
    ],
    "views": 7954,
    "downloads": 6814,
    "favorites": 3661,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-cafe-outdoor-bistro",
    "categoryId": "cafe",
    "category": "Cafe",
    "title": "Parisian Outdoor Bistro Chair",
    "description": "Cross-legged seated pose at a round marble bistro table with sunglasses and espresso.",
    "imageUrl": "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "cafe",
      "bistro",
      "paris",
      "marble",
      "outdoor",
      "fashion"
    ],
    "views": 12750,
    "downloads": 3409,
    "favorites": 6487,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-cafe-croissant-bite",
    "categoryId": "cafe",
    "category": "Cafe",
    "title": "Flaky Croissant Breakfast Bite",
    "description": "Playful food photography candid taking a bite of a buttery golden pastry with a smile.",
    "imageUrl": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "cafe",
      "pastry",
      "croissant",
      "breakfast",
      "candid"
    ],
    "views": 13776,
    "downloads": 4124,
    "favorites": 6217,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-cafe-menu-board-reading",
    "categoryId": "cafe",
    "category": "Cafe",
    "title": "Artisan Menu Board Deciding",
    "description": "Standing by the chalk menu board with finger on chin deciding on seasonal roasts.",
    "imageUrl": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "cafe",
      "menu",
      "chalkboard",
      "coffee-shop",
      "lifestyle"
    ],
    "views": 6002,
    "downloads": 4031,
    "favorites": 4680,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-cafe-latte-art-showcase",
    "categoryId": "cafe",
    "category": "Cafe",
    "title": "Latte Art Heart Showcase",
    "description": "Holding a flat white with rosette latte art angled slightly toward the camera.",
    "imageUrl": "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "cafe",
      "latte-art",
      "coffee",
      "details",
      "aesthetic"
    ],
    "views": 12084,
    "downloads": 7095,
    "favorites": 2406,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-cafe-corner-booth-recline",
    "categoryId": "cafe",
    "category": "Cafe",
    "title": "Velvet Corner Booth Slouch",
    "description": "Relaxed seated pose in a deep emerald velvet booth holding a hardback book.",
    "imageUrl": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "cafe",
      "booth",
      "velvet",
      "recline",
      "reading",
      "luxury"
    ],
    "views": 9505,
    "downloads": 4327,
    "favorites": 6170,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-cafe-brick-wall-stool",
    "categoryId": "cafe",
    "category": "Cafe",
    "title": "Exposed Brick Barstool Perch",
    "description": "Sitting on a high metal barstool against an exposed industrial brick cafe wall.",
    "imageUrl": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "cafe",
      "brick",
      "industrial",
      "barstool",
      "urban"
    ],
    "views": 17695,
    "downloads": 6544,
    "favorites": 3063,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-cafe-plant-wall-coffee",
    "categoryId": "cafe",
    "category": "Cafe",
    "title": "Monstera Plant Corner Coffee",
    "description": "Surrounded by lush indoor fiddle-leaf figs and monstera foliage enjoying cold brew.",
    "imageUrl": "https://images.unsplash.com/photo-1448375240586-882707db888b?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1448375240586-882707db888b?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "cafe",
      "plants",
      "greenery",
      "botanical",
      "cold-brew"
    ],
    "views": 17541,
    "downloads": 6802,
    "favorites": 3279,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-cafe-pour-over-watch",
    "categoryId": "cafe",
    "category": "Cafe",
    "title": "Chemex Pour-Over Watch",
    "description": "Watching the slow bloom of freshly ground beans through a glass Chemex drip.",
    "imageUrl": "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "cafe",
      "pourover",
      "chemex",
      "coffee-nerd",
      "focus"
    ],
    "views": 12253,
    "downloads": 2828,
    "favorites": 3581,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-cafe-rainy-window-steam",
    "categoryId": "cafe",
    "category": "Cafe",
    "title": "Rainy Window Steam Gaze",
    "description": "Looking out at rain-streaked cafe window glass with steam rising softly from hot cocoa.",
    "imageUrl": "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "cafe",
      "rain",
      "steam",
      "cozy",
      "winter",
      "moody"
    ],
    "views": 13504,
    "downloads": 2539,
    "favorites": 6497,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-cafe-neon-sign-reflection",
    "categoryId": "cafe",
    "category": "Cafe",
    "title": "Neon Light Cafe Glow",
    "description": "Sitting under a warm amber cursive neon sign with neon color reflection in eyes.",
    "imageUrl": "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "cafe",
      "neon",
      "night-cafe",
      "glow",
      "moody",
      "color"
    ],
    "views": 13457,
    "downloads": 5904,
    "favorites": 2680,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-cafe-journal-writing",
    "categoryId": "cafe",
    "category": "Cafe",
    "title": "Leather Journal Morning Thoughts",
    "description": "Writing thoughts into a leather journal with fountain pen beside an iced Americano.",
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "cafe",
      "journal",
      "writing",
      "mindfulness",
      "cozy"
    ],
    "views": 16929,
    "downloads": 7219,
    "favorites": 3009,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-cafe-espresso-chin-tilt",
    "categoryId": "cafe",
    "category": "Cafe",
    "title": "Double Espresso Chin Tilt",
    "description": "Taking a quick single sip of espresso with sharp confident chin tilt.",
    "imageUrl": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "cafe",
      "espresso",
      "confident",
      "sharp",
      "editorial"
    ],
    "views": 17560,
    "downloads": 3387,
    "favorites": 3163,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-cafe-friend-table-laugh",
    "categoryId": "cafe",
    "category": "Cafe",
    "title": "Table Across Conversational Laugh",
    "description": "Spontaneous candid laugh across a rustic oak table during lively cafe storytelling.",
    "imageUrl": "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "cafe",
      "conversation",
      "laugh",
      "candid",
      "friends"
    ],
    "views": 11743,
    "downloads": 5274,
    "favorites": 4517,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-cafe-sweet-cake-fork",
    "categoryId": "cafe",
    "category": "Cafe",
    "title": "Tiramisu Slice Dessert Fork",
    "description": "Holding a dessert fork hovering over a delicate dusted tiramisu cake slice.",
    "imageUrl": "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "cafe",
      "dessert",
      "cake",
      "sweet",
      "foodie"
    ],
    "views": 9321,
    "downloads": 3692,
    "favorites": 2116,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-cafe-matcha-green-latte",
    "categoryId": "cafe",
    "category": "Cafe",
    "title": "Vibrant Matcha Foam Swirl",
    "description": "Holding a bowl of bright emerald matcha tea against clean Scandinavian white tile.",
    "imageUrl": "https://images.unsplash.com/photo-1533038590840-1cde6e668a91?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1533038590840-1cde6e668a91?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "cafe",
      "matcha",
      "zen",
      "green",
      "minimalist"
    ],
    "views": 16663,
    "downloads": 4303,
    "favorites": 5165,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-cafe-record-player-browse",
    "categoryId": "cafe",
    "category": "Cafe",
    "title": "Cafe Vinyl Corner Spin",
    "description": "Flipping through a crate of vintage vinyl records in an audiophile coffee bar.",
    "imageUrl": "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "cafe",
      "vinyl",
      "music",
      "audiophile",
      "retro"
    ],
    "views": 18700,
    "downloads": 5044,
    "favorites": 4991,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-cafe-trenchcoat-takeaway",
    "categoryId": "cafe",
    "category": "Cafe",
    "title": "Wool Coat Coffee-to-Go Exit",
    "description": "Walking through the cafe door holding a paper takeaway cup in a tailored trench coat.",
    "imageUrl": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "cafe",
      "takeaway",
      "coat",
      "street-style",
      "autumn"
    ],
    "views": 12361,
    "downloads": 5211,
    "favorites": 2109,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-cafe-barista-counter-lean",
    "categoryId": "cafe",
    "category": "Cafe",
    "title": "Copper Counter Friendly Chat",
    "description": "Leaning on the polished copper coffee bar chatting with the barista with hands in pockets.",
    "imageUrl": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "cafe",
      "barista",
      "counter",
      "friendly",
      "lifestyle"
    ],
    "views": 8294,
    "downloads": 4245,
    "favorites": 3832,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-cafe-sunbeam-dust-mote",
    "categoryId": "cafe",
    "category": "Cafe",
    "title": "Sunbeam Dust Mote Dream",
    "description": "Bathed in a sharp morning sunbeam with illuminated coffee steam floating in the light.",
    "imageUrl": "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "cafe",
      "sunbeam",
      "cinematic",
      "light",
      "ethereal"
    ],
    "views": 9737,
    "downloads": 5758,
    "favorites": 5572,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-nature-sunlight-stream",
    "categoryId": "nature",
    "category": "Nature",
    "title": "Forest Sunlight Beams",
    "description": "Standing in a redwood grove with sunbeams filtering down through the misty tree canopy.",
    "imageUrl": "https://images.unsplash.com/photo-1448375240586-882707db888b?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1448375240586-882707db888b?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "nature",
      "forest",
      "sunbeams",
      "redwood",
      "ethereal"
    ],
    "views": 13268,
    "downloads": 2240,
    "favorites": 3660,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-nature-pine-lean",
    "categoryId": "nature",
    "category": "Nature",
    "title": "Leaning Pine Trunk Stance",
    "description": "Relaxed outdoor pose leaning against a tall fragrant pine tree in earthy tones.",
    "imageUrl": "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "nature",
      "pine",
      "tree",
      "earthy",
      "outdoor"
    ],
    "views": 17466,
    "downloads": 3599,
    "favorites": 5898,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-nature-fern-crouch",
    "categoryId": "nature",
    "category": "Nature",
    "title": "Emerald Fern Field Crouch",
    "description": "Low-angle crouch surrounded by lush green ferns touching fronds with fingertips.",
    "imageUrl": "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "nature",
      "ferns",
      "green",
      "crouch",
      "botanical"
    ],
    "views": 17723,
    "downloads": 5651,
    "favorites": 5364,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-nature-mossy-rock",
    "categoryId": "nature",
    "category": "Nature",
    "title": "Mossy Boulder Forest Perch",
    "description": "Sitting atop a giant moss-covered river boulder in a peaceful mountain canyon.",
    "imageUrl": "https://images.unsplash.com/photo-1473186578172-c141e6798cf4?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1473186578172-c141e6798cf4?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "nature",
      "moss",
      "boulder",
      "river",
      "zen"
    ],
    "views": 19136,
    "downloads": 4950,
    "favorites": 3200,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-nature-wildflower-walk",
    "categoryId": "nature",
    "category": "Nature",
    "title": "Alpine Wildflower Meadow Stroll",
    "description": "Walking through knee-high purple lupines and yellow wildflowers with hands skimming blossoms.",
    "imageUrl": "https://images.unsplash.com/photo-1533038590840-1cde6e668a91?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1533038590840-1cde6e668a91?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "nature",
      "wildflowers",
      "meadow",
      "summer",
      "blooms"
    ],
    "views": 9811,
    "downloads": 5492,
    "favorites": 2707,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-nature-autumn-leaves-throw",
    "categoryId": "nature",
    "category": "Nature",
    "title": "Golden Autumn Leaves Shower",
    "description": "Tossing golden maple leaves into the crisp autumn air with laughter.",
    "imageUrl": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "nature",
      "autumn",
      "leaves",
      "playful",
      "golden"
    ],
    "views": 5434,
    "downloads": 6917,
    "favorites": 5925,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-nature-waterfall-mist",
    "categoryId": "nature",
    "category": "Nature",
    "title": "Waterfall Spray Gaze",
    "description": "Dramatic pose standing on rocks before a roaring waterfall with mist catching rainbows.",
    "imageUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "nature",
      "waterfall",
      "mist",
      "power",
      "epic"
    ],
    "views": 14364,
    "downloads": 2563,
    "favorites": 2584,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-nature-birch-trees",
    "categoryId": "nature",
    "category": "Nature",
    "title": "White Birch Tree Column Frame",
    "description": "Framed between slender white birch trunks in soft diffused overcast light.",
    "imageUrl": "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "nature",
      "birch",
      "trees",
      "minimal",
      "forest"
    ],
    "views": 9065,
    "downloads": 2300,
    "favorites": 2389,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-nature-canopy-look-up",
    "categoryId": "nature",
    "category": "Nature",
    "title": "High Forest Canopy Look-Up",
    "description": "Looking straight up into towering tree branches creating a circular sky portal.",
    "imageUrl": "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "nature",
      "canopy",
      "look-up",
      "trees",
      "perspective"
    ],
    "views": 7578,
    "downloads": 3287,
    "favorites": 6354,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-nature-wooden-footbridge",
    "categoryId": "nature",
    "category": "Nature",
    "title": "Rustic Forest Bridge Stride",
    "description": "Walking across a mossy wooden footbridge over a babbling clear brook.",
    "imageUrl": "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "nature",
      "bridge",
      "brook",
      "stream",
      "peaceful"
    ],
    "views": 9685,
    "downloads": 6055,
    "favorites": 2818,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-nature-creek-step-stones",
    "categoryId": "nature",
    "category": "Nature",
    "title": "River Stepping Stones Balance",
    "description": "Balancing playfully across flat river stepping stones with arms slightly out.",
    "imageUrl": "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "nature",
      "river",
      "stones",
      "balance",
      "adventure"
    ],
    "views": 18015,
    "downloads": 2370,
    "favorites": 5763,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-nature-lake-reflection-pier",
    "categoryId": "nature",
    "category": "Nature",
    "title": "Glass Lake Pier Silhouette",
    "description": "Sitting on the edge of a rustic wooden dock reflecting perfectly in calm mountain water.",
    "imageUrl": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "nature",
      "lake",
      "pier",
      "reflection",
      "stillness"
    ],
    "views": 17635,
    "downloads": 6343,
    "favorites": 5364,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-nature-misty-pine-ridge",
    "categoryId": "nature",
    "category": "Nature",
    "title": "Misty Alpine Valley Breath",
    "description": "Standing at the edge of a mountain ridge overlooking rolling clouds in valleys below.",
    "imageUrl": "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "nature",
      "mist",
      "valley",
      "breath",
      "freedom"
    ],
    "views": 5258,
    "downloads": 2749,
    "favorites": 3859,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-nature-tall-grass-part",
    "categoryId": "nature",
    "category": "Nature",
    "title": "Golden Prairie Grass Parting",
    "description": "Walking through amber prairie grass at golden hour gently pushing stalks aside.",
    "imageUrl": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "nature",
      "prairie",
      "grass",
      "golden-hour",
      "warm"
    ],
    "views": 10972,
    "downloads": 5756,
    "favorites": 4484,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-nature-campfire-hands-warm",
    "categoryId": "nature",
    "category": "Nature",
    "title": "Campfire Glowing Hands",
    "description": "Holding hands out to warm them over glowing embers with warm orange firelight on face.",
    "imageUrl": "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "nature",
      "campfire",
      "fire",
      "cozy",
      "night",
      "warmth"
    ],
    "views": 14012,
    "downloads": 6938,
    "favorites": 3973,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-nature-canyon-rim-stand",
    "categoryId": "nature",
    "category": "Nature",
    "title": "Red Rock Canyon Rim Stance",
    "description": "Standing tall on a dramatic sandstone cliff edge overlooking deep red canyon layers.",
    "imageUrl": "https://images.unsplash.com/photo-1509233725247-49e657c54213?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1509233725247-49e657c54213?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "nature",
      "canyon",
      "red-rock",
      "grand",
      "epic"
    ],
    "views": 18010,
    "downloads": 3318,
    "favorites": 5768,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-nature-sunflower-field",
    "categoryId": "nature",
    "category": "Nature",
    "title": "Towering Sunflower Field Turn",
    "description": "Standing amidst giant yellow blooming sunflowers turning back with a vibrant smile.",
    "imageUrl": "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "nature",
      "sunflowers",
      "yellow",
      "summer",
      "bright"
    ],
    "views": 13300,
    "downloads": 7375,
    "favorites": 5621,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-nature-evergreen-shadow-walk",
    "categoryId": "nature",
    "category": "Nature",
    "title": "Deep Forest Shadow Trail",
    "description": "Walking down a narrow pine needle path through dense ancient evergreen woods.",
    "imageUrl": "https://images.unsplash.com/photo-1448375240586-882707db888b?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1448375240586-882707db888b?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "nature",
      "shadows",
      "trail",
      "evergreen",
      "deep-woods"
    ],
    "views": 16080,
    "downloads": 5541,
    "favorites": 6062,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-nature-wild-berry-picking",
    "categoryId": "nature",
    "category": "Nature",
    "title": "Wild Blackberry Foraging",
    "description": "Candid foraging pose reaching into a berry bush with basket in hand.",
    "imageUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "nature",
      "foraging",
      "berries",
      "lifestyle",
      "organic"
    ],
    "views": 19576,
    "downloads": 5662,
    "favorites": 4955,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-nature-sunrise-fog-stroll",
    "categoryId": "nature",
    "category": "Nature",
    "title": "Dawn Fog Meadow Silhouette",
    "description": "Solitary figure walking through low morning ground fog as the sun breaks the horizon.",
    "imageUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "nature",
      "fog",
      "dawn",
      "silhouette",
      "mystical"
    ],
    "views": 16893,
    "downloads": 2196,
    "favorites": 4764,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-nature-boulder-summit-sit",
    "categoryId": "nature",
    "category": "Nature",
    "title": "Granite Summit Overlook Sit",
    "description": "Sitting cross-legged on a smooth granite dome surveying the panoramic forest canopy.",
    "imageUrl": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "nature",
      "granite",
      "summit",
      "meditate",
      "peace"
    ],
    "views": 8511,
    "downloads": 7126,
    "favorites": 1651,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-nature-overgrown-stair-climb",
    "categoryId": "nature",
    "category": "Nature",
    "title": "Mossy Stone Staircase Ascent",
    "description": "Climbing ancient stone steps cut into a green mountainside framed by ivy.",
    "imageUrl": "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "nature",
      "stairs",
      "ivy",
      "ancient",
      "green"
    ],
    "views": 15806,
    "downloads": 4921,
    "favorites": 3861,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-nature-sunset-lake-dip-toes",
    "categoryId": "nature",
    "category": "Nature",
    "title": "Sunset Alpine Lake Dip",
    "description": "Dipping toes into crystal-clear alpine water with sunset mountains reflecting on the surface.",
    "imageUrl": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "nature",
      "alpine",
      "lake",
      "sunset",
      "pure"
    ],
    "views": 15474,
    "downloads": 2596,
    "favorites": 6423,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-nature-lavender-field-drift",
    "categoryId": "nature",
    "category": "Nature",
    "title": "Provence Lavender Field Drift",
    "description": "Walking through endless purple rows of lavender in Provence touching the fragrant flowers.",
    "imageUrl": "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "nature",
      "lavender",
      "provence",
      "purple",
      "scenic"
    ],
    "views": 12833,
    "downloads": 3656,
    "favorites": 4592,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-trek-summit-victory",
    "categoryId": "trek",
    "category": "Trek",
    "title": "Summit Ridge Victory Stance",
    "description": "Standing triumphant on a jagged alpine mountain peak with trekking poles raised overhead.",
    "imageUrl": "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "trek",
      "summit",
      "victory",
      "mountains",
      "adventure",
      "poles"
    ],
    "views": 10287,
    "downloads": 2919,
    "favorites": 4608,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-trek-pack-adjust",
    "categoryId": "trek",
    "category": "Trek",
    "title": "Backpack Strap Adjustment",
    "description": "Candid hiking stance tightening backpack shoulder straps while pausing on a switchback trail.",
    "imageUrl": "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "trek",
      "backpack",
      "straps",
      "trail",
      "hiking",
      "gear"
    ],
    "views": 9720,
    "downloads": 7875,
    "favorites": 4458,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-trek-pole-stride",
    "categoryId": "trek",
    "category": "Trek",
    "title": "Trekking Pole Uphill Stride",
    "description": "Athletic forward stride planting carbon trekking poles firmly into rocky mountain gravel.",
    "imageUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "trek",
      "poles",
      "uphill",
      "stride",
      "fitness",
      "mountain"
    ],
    "views": 18175,
    "downloads": 2947,
    "favorites": 3021,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-trek-trail-marker-map",
    "categoryId": "trek",
    "category": "Trek",
    "title": "Trail Map Compass Check",
    "description": "Unfolding a topographical trail map at a wooden elevation marker to plot the next col.",
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "trek",
      "map",
      "navigation",
      "trail-marker",
      "alpine"
    ],
    "views": 16921,
    "downloads": 2134,
    "favorites": 3200,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-trek-cliffside-lookout",
    "categoryId": "trek",
    "category": "Trek",
    "title": "Cliffside Valley Perch",
    "description": "Sitting on a natural stone ledge with legs dangling over a vast emerald glacier valley.",
    "imageUrl": "https://images.unsplash.com/photo-1509233725247-49e657c54213?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1509233725247-49e657c54213?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "trek",
      "cliff",
      "ledge",
      "valley",
      "glacier",
      "epic"
    ],
    "views": 6783,
    "downloads": 7597,
    "favorites": 6146,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-trek-high-altitude-breath",
    "categoryId": "trek",
    "category": "Trek",
    "title": "High Altitude Deep Inhale",
    "description": "Hands on hips taking a deep breath of crisp mountain air with snowy peaks all around.",
    "imageUrl": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "trek",
      "breath",
      "altitude",
      "snow",
      "pure",
      "adventure"
    ],
    "views": 19976,
    "downloads": 3081,
    "favorites": 5987,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-trek-suspension-bridge",
    "categoryId": "trek",
    "category": "Trek",
    "title": "Himalayan Suspension Bridge Cross",
    "description": "Walking across a high suspension footbridge draped in colorful Tibetan prayer flags.",
    "imageUrl": "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "trek",
      "bridge",
      "suspension",
      "himalayas",
      "flags"
    ],
    "views": 9744,
    "downloads": 6140,
    "favorites": 2564,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-trek-rock-scramble-pause",
    "categoryId": "trek",
    "category": "Trek",
    "title": "Boulder Scramble Hand Lock",
    "description": "Gripping a solid handhold while scrambling up a technical steep granite mountain pitch.",
    "imageUrl": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "trek",
      "climbing",
      "scramble",
      "granite",
      "athletic"
    ],
    "views": 8947,
    "downloads": 7931,
    "favorites": 3143,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-trek-sunrise-glacier",
    "categoryId": "trek",
    "category": "Trek",
    "title": "Alpenglow Glacier Horizon",
    "description": "Gazing at pink morning alpenglow lighting up immense glacier crevasses and snowfields.",
    "imageUrl": "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "trek",
      "glacier",
      "alpenglow",
      "sunrise",
      "snow"
    ],
    "views": 19953,
    "downloads": 4729,
    "favorites": 5632,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-trek-windbreaker-hood",
    "categoryId": "trek",
    "category": "Trek",
    "title": "Windbreaker Hood Cinch",
    "description": "Pulling the drawstrings of a bright technical mountain jacket as alpine gusts blow.",
    "imageUrl": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "trek",
      "windbreaker",
      "gear",
      "hood",
      "elements"
    ],
    "views": 8787,
    "downloads": 2934,
    "favorites": 4800,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-trek-switchback-step",
    "categoryId": "trek",
    "category": "Trek",
    "title": "Alpine Switchback Incline",
    "description": "Mid-stride rhythm climbing a serpentine scree path above the timberline.",
    "imageUrl": "https://images.unsplash.com/photo-1448375240586-882707db888b?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1448375240586-882707db888b?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "trek",
      "switchback",
      "timberline",
      "scree",
      "hiking"
    ],
    "views": 7540,
    "downloads": 5267,
    "favorites": 1878,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-trek-hydration-flask-sip",
    "categoryId": "trek",
    "category": "Trek",
    "title": "Electrolyte Flask Break",
    "description": "Refreshing water sip from an insulated canteen sitting on a sunny trail boulder.",
    "imageUrl": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "trek",
      "hydration",
      "water",
      "break",
      "sun"
    ],
    "views": 8412,
    "downloads": 4187,
    "favorites": 4016,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-trek-ridge-crest-walk",
    "categoryId": "trek",
    "category": "Trek",
    "title": "Knife-Edge Ridge Traverse",
    "description": "Walking along a narrow scenic mountain ridge with steep drops on both sides.",
    "imageUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "trek",
      "ridge",
      "knife-edge",
      "traverse",
      "thrill"
    ],
    "views": 17919,
    "downloads": 5185,
    "favorites": 5147,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-trek-tent-doorway-gaze",
    "categoryId": "trek",
    "category": "Trek",
    "title": "Morning Tent Doorway View",
    "description": "Peeking out of a high-altitude expedition tent looking at sunrise over peaks.",
    "imageUrl": "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "trek",
      "tent",
      "camping",
      "sunrise",
      "expedition"
    ],
    "views": 12741,
    "downloads": 5358,
    "favorites": 6361,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-trek-stone-cairn-stack",
    "categoryId": "trek",
    "category": "Trek",
    "title": "Trail Cairn Stone Placement",
    "description": "Placing the final marker stone on a traditional hiking cairn beside the path.",
    "imageUrl": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "trek",
      "cairn",
      "stones",
      "tradition",
      "trail"
    ],
    "views": 14869,
    "downloads": 4290,
    "favorites": 5457,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-trek-cloud-inversion-gaze",
    "categoryId": "trek",
    "category": "Trek",
    "title": "Cloud Sea Inversion Stance",
    "description": "Standing above a sea of thick white clouds filling the valleys below like waves.",
    "imageUrl": "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "trek",
      "cloud-inversion",
      "sea-of-clouds",
      "magic"
    ],
    "views": 13325,
    "downloads": 7911,
    "favorites": 5651,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-trek-mountain-pass-reach",
    "categoryId": "trek",
    "category": "Trek",
    "title": "High Pass Col Crossing",
    "description": "Reaching the crest of a 4,000m mountain pass with wind blowing hair and flags.",
    "imageUrl": "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "trek",
      "col",
      "pass",
      "high-altitude",
      "achievement"
    ],
    "views": 5813,
    "downloads": 6554,
    "favorites": 3261,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-trek-alpine-flower-macro",
    "categoryId": "trek",
    "category": "Trek",
    "title": "Edelweiss Blossom Inspection",
    "description": "Kneeling down gently to inspect rare edelweiss alpine flowers growing in rocks.",
    "imageUrl": "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "trek",
      "edelweiss",
      "flowers",
      "macro",
      "alpine"
    ],
    "views": 15542,
    "downloads": 6722,
    "favorites": 5124,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-trek-glacier-lake-dip",
    "categoryId": "trek",
    "category": "Trek",
    "title": "Glacier Melt Water Splash",
    "description": "Splashing freezing turquoise glacial melt water on face to refresh after a steep climb.",
    "imageUrl": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "trek",
      "glacier-lake",
      "water",
      "refresh",
      "turquoise"
    ],
    "views": 19196,
    "downloads": 3123,
    "favorites": 5140,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-trek-heavy-pack-strut",
    "categoryId": "trek",
    "category": "Trek",
    "title": "Multi-Day Expedition Strut",
    "description": "Confident powerful stride carrying a fully loaded 70L expedition backpack.",
    "imageUrl": "https://images.unsplash.com/photo-1480429370139-e0132c086e2a?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1480429370139-e0132c086e2a?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "trek",
      "expedition",
      "pack",
      "strength",
      "wilderness"
    ],
    "views": 11054,
    "downloads": 4366,
    "favorites": 1973,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-trek-sunset-ridge-silhouette",
    "categoryId": "trek",
    "category": "Trek",
    "title": "Dusk Ridge Sunset Silhouette",
    "description": "Dark silhouette of hiker with pack against a fiery crimson and gold mountain sunset.",
    "imageUrl": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "trek",
      "silhouette",
      "sunset",
      "dusk",
      "drama"
    ],
    "views": 7619,
    "downloads": 7043,
    "favorites": 1763,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-trek-summit-flag-hold",
    "categoryId": "trek",
    "category": "Trek",
    "title": "Peak Marker Summit Flag",
    "description": "Holding the summit peak marker post with an exhausted but beaming victorious grin.",
    "imageUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "trek",
      "summit",
      "peak",
      "victory",
      "smile"
    ],
    "views": 10250,
    "downloads": 2113,
    "favorites": 4612,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-selfie-full-mirror",
    "categoryId": "selfie",
    "category": "Selfie",
    "title": "Full-Length Mirror Fit",
    "description": "Minimalist bedroom full-body mirror selfie in a casual outfit with clean neutral lines.",
    "imageUrl": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "selfie",
      "mirror",
      "outfit",
      "minimal",
      "bedroom"
    ],
    "views": 8600,
    "downloads": 4143,
    "favorites": 2742,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-selfie-golden-catchlight",
    "categoryId": "selfie",
    "category": "Selfie",
    "title": "Golden Hour 45° Catchlight",
    "description": "Close-up selfie angled 45° to catch pure golden sunset light in the irises of the eyes.",
    "imageUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "selfie",
      "golden-hour",
      "catchlight",
      "eyes",
      "glow"
    ],
    "views": 15253,
    "downloads": 4835,
    "favorites": 6102,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-selfie-high-angle-wide",
    "categoryId": "selfie",
    "category": "Selfie",
    "title": "High-Angle 0.5x Ultra-Wide",
    "description": "Trendy overhead 0.5x wide angle selfie capturing full fit, shoes, and aesthetic floor.",
    "imageUrl": "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "selfie",
      "wide-angle",
      "0.5x",
      "trendy",
      "outfit"
    ],
    "views": 9160,
    "downloads": 2627,
    "favorites": 6032,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-selfie-low-angle-jawline",
    "categoryId": "selfie",
    "category": "Selfie",
    "title": "Low-Angle Sharp Jawline",
    "description": "Slight low-angle front camera pose tilting chin up 15 degrees to highlight jaw structure.",
    "imageUrl": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "selfie",
      "jawline",
      "low-angle",
      "sharp",
      "confident"
    ],
    "views": 10859,
    "downloads": 2590,
    "favorites": 5064,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-selfie-car-visor-light",
    "categoryId": "selfie",
    "category": "Selfie",
    "title": "Car Sun Visor Vanity Glow",
    "description": "Flattering in-car selfie using natural windshield light and a relaxed seated lean.",
    "imageUrl": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "selfie",
      "car-selfie",
      "vanity",
      "glow",
      "casual"
    ],
    "views": 12676,
    "downloads": 3542,
    "favorites": 3212,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-selfie-hand-frame-cheek",
    "categoryId": "selfie",
    "category": "Selfie",
    "title": "Hand Framing Jaw Cheek",
    "description": "Soft delicate pose resting chin and jawline lightly in fingertips with manicured nails.",
    "imageUrl": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "selfie",
      "hand-frame",
      "jaw",
      "soft",
      "portrait"
    ],
    "views": 19206,
    "downloads": 4654,
    "favorites": 5790,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-selfie-flash-mirror-shadow",
    "categoryId": "selfie",
    "category": "Selfie",
    "title": "Dark Room Flash Mirror",
    "description": "Moody aesthetic mirror selfie in a darkened room using direct phone flash reflection.",
    "imageUrl": "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "selfie",
      "flash",
      "mirror",
      "moody",
      "night",
      "retro"
    ],
    "views": 9792,
    "downloads": 7882,
    "favorites": 1734,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-selfie-over-shoulder-turn",
    "categoryId": "selfie",
    "category": "Selfie",
    "title": "Over-the-Shoulder Mirror Glance",
    "description": "Looking back over one shoulder into a bathroom or dressing room mirror.",
    "imageUrl": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "selfie",
      "over-shoulder",
      "mirror",
      "turn",
      "fit"
    ],
    "views": 18037,
    "downloads": 5290,
    "favorites": 5269,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-selfie-candid-laugh-front",
    "categoryId": "selfie",
    "category": "Selfie",
    "title": "Candid Front-Camera Smile",
    "description": "Spontaneous laughing selfie looking away from the lens as if mid-conversation.",
    "imageUrl": "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "selfie",
      "laugh",
      "smile",
      "candid",
      "natural"
    ],
    "views": 8071,
    "downloads": 4448,
    "favorites": 3783,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-selfie-window-side-profile",
    "categoryId": "selfie",
    "category": "Selfie",
    "title": "Window Light Side Profile",
    "description": "Clean side profile selfie illuminated by bright soft morning window light.",
    "imageUrl": "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "selfie",
      "profile",
      "window",
      "light",
      "clean"
    ],
    "views": 12513,
    "downloads": 3559,
    "favorites": 6310,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-selfie-coffee-cup-prop",
    "categoryId": "selfie",
    "category": "Selfie",
    "title": "Coffee Cup Cheek Rest",
    "description": "Resting a warm ceramic coffee mug near the cheek with cozy knitted sweater cuffs.",
    "imageUrl": "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "selfie",
      "coffee",
      "sweater",
      "cozy",
      "autumn"
    ],
    "views": 12385,
    "downloads": 5371,
    "favorites": 6136,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-selfie-hoodie-peeking",
    "categoryId": "selfie",
    "category": "Selfie",
    "title": "Oversized Hoodie Peeking Look",
    "description": "Playful cute selfie peeking out from inside an oversized cozy drawstring hoodie.",
    "imageUrl": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "selfie",
      "hoodie",
      "cute",
      "cozy",
      "streetwear"
    ],
    "views": 15893,
    "downloads": 5073,
    "favorites": 1916,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-selfie-neon-rim-glow",
    "categoryId": "selfie",
    "category": "Selfie",
    "title": "Neon Light Edge Hue",
    "description": "Selfie lit by colorful magenta or cyan neon lights in an urban lounge.",
    "imageUrl": "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "selfie",
      "neon",
      "glow",
      "color",
      "cyber"
    ],
    "views": 14566,
    "downloads": 5861,
    "favorites": 3230,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-selfie-peace-sign-frame",
    "categoryId": "selfie",
    "category": "Selfie",
    "title": "Two-Finger Peace Sign Frame",
    "description": "Classic upbeat selfie flashing a peace sign next to the eye with a playful wink.",
    "imageUrl": "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "selfie",
      "peace-sign",
      "wink",
      "fun",
      "upbeat"
    ],
    "views": 7137,
    "downloads": 2238,
    "favorites": 6459,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-selfie-elevator-mirror",
    "categoryId": "selfie",
    "category": "Selfie",
    "title": "Brushed Steel Elevator Fit Check",
    "description": "Modern full-body outfit selfie reflected in brushed metallic elevator walls.",
    "imageUrl": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "selfie",
      "elevator",
      "outfit",
      "fashion",
      "mirror"
    ],
    "views": 6520,
    "downloads": 6363,
    "favorites": 5419,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-selfie-sunset-shadow-wall",
    "categoryId": "selfie",
    "category": "Selfie",
    "title": "Golden Sunset Wall Shadow",
    "description": "Artistic selfie capturing the dramatic dark silhouette shadow cast on a warm stucco wall.",
    "imageUrl": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "selfie",
      "shadow",
      "sunset",
      "stucco",
      "artistic"
    ],
    "views": 12637,
    "downloads": 3100,
    "favorites": 2841,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-selfie-sunglasses-reflection",
    "categoryId": "selfie",
    "category": "Selfie",
    "title": "Sunglasses Lens Reflection View",
    "description": "Close-up selfie showing tropical beach palm trees reflecting in mirrored aviator lenses.",
    "imageUrl": "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "selfie",
      "sunglasses",
      "reflection",
      "palms",
      "summer"
    ],
    "views": 5694,
    "downloads": 5563,
    "favorites": 6329,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-selfie-couch-slouch-chill",
    "categoryId": "selfie",
    "category": "Selfie",
    "title": "Sunday Couch Slouch Chill",
    "description": "Ultra-relaxed home selfie reclining back on plush sofa pillows in cotton loungewear.",
    "imageUrl": "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "selfie",
      "couch",
      "relax",
      "home",
      "loungewear"
    ],
    "views": 14329,
    "downloads": 6538,
    "favorites": 6107,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-selfie-rooftop-golden-hour",
    "categoryId": "selfie",
    "category": "Selfie",
    "title": "Rooftop Skyline Golden Hour",
    "description": "Golden hour selfie high above the city with glowing skyscraper backdrop.",
    "imageUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "selfie",
      "rooftop",
      "skyline",
      "golden-hour",
      "city"
    ],
    "views": 19104,
    "downloads": 7820,
    "favorites": 2764,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-selfie-pet-duo-cuddle",
    "categoryId": "selfie",
    "category": "Selfie",
    "title": "Puppy / Kitten Cheek Cuddle",
    "description": "Adorable selfie holding your favorite pet close to your cheek with beaming smiles.",
    "imageUrl": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "selfie",
      "pet",
      "puppy",
      "cute",
      "cuddle"
    ],
    "views": 16467,
    "downloads": 3818,
    "favorites": 2299,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-selfie-workout-glow",
    "categoryId": "selfie",
    "category": "Selfie",
    "title": "Post-Workout Gym Radiance",
    "description": "Fresh post-cardio front camera selfie showing off healthy post-workout glow.",
    "imageUrl": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "selfie",
      "gym",
      "glow",
      "fitness",
      "healthy"
    ],
    "views": 14316,
    "downloads": 7507,
    "favorites": 3575,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-selfie-venetian-blind-light",
    "categoryId": "selfie",
    "category": "Selfie",
    "title": "Venetian Blinds Zebra Stripes",
    "description": "Moody shadow stripes cast across the face from wooden window blinds at sunset.",
    "imageUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "selfie",
      "blinds",
      "shadows",
      "dramatic",
      "stripes"
    ],
    "views": 6748,
    "downloads": 2022,
    "favorites": 5446,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-selfie-beach-towel-overhead",
    "categoryId": "selfie",
    "category": "Selfie",
    "title": "Lying on Beach Towel Bird’s Eye",
    "description": "Looking directly straight up at front camera while lying back on a striped beach blanket.",
    "imageUrl": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "selfie",
      "overhead",
      "beach",
      "towel",
      "summer"
    ],
    "views": 13181,
    "downloads": 5960,
    "favorites": 5070,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-selfie-airplane-window",
    "categoryId": "selfie",
    "category": "Selfie",
    "title": "Airplane Window Wing View",
    "description": "Travel selfie holding iced drink with airplane wing and fluffy clouds outside window.",
    "imageUrl": "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "selfie",
      "travel",
      "airplane",
      "clouds",
      "wanderlust"
    ],
    "views": 8938,
    "downloads": 2605,
    "favorites": 6352,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-selfie-night-city-bokeh",
    "categoryId": "selfie",
    "category": "Selfie",
    "title": "Night Street Bokeh Glow",
    "description": "Night selfie with vibrant blurred colorful car headlights and city neon in the background.",
    "imageUrl": "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "selfie",
      "night",
      "bokeh",
      "city-lights",
      "glow"
    ],
    "views": 19903,
    "downloads": 7034,
    "favorites": 4480,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-gym-dumbbell-rack-lean",
    "categoryId": "gym",
    "category": "Gym",
    "title": "Dumbbell Rack Rest Stance",
    "description": "Confident rest pose leaning one hand on heavy metal dumbbell rack between sets.",
    "imageUrl": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "gym",
      "dumbbells",
      "fitness",
      "lean",
      "strength"
    ],
    "views": 13805,
    "downloads": 4847,
    "favorites": 2326,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-gym-pullup-hang",
    "categoryId": "gym",
    "category": "Gym",
    "title": "Pull-Up Bar Grip Hang",
    "description": "Gripping pull-up bar overhead showing back definition and athletic core engagement.",
    "imageUrl": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "gym",
      "pullups",
      "back",
      "muscle",
      "athletic"
    ],
    "views": 8393,
    "downloads": 2075,
    "favorites": 5353,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-gym-chalk-clap",
    "categoryId": "gym",
    "category": "Gym",
    "title": "Weightlifting Chalk Cloud Clap",
    "description": "Dramatic action shot clapping chalked hands together creating a glowing white powder cloud.",
    "imageUrl": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "gym",
      "chalk",
      "powerlifting",
      "action",
      "epic"
    ],
    "views": 18458,
    "downloads": 6520,
    "favorites": 5078,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-gym-barbell-squat-ready",
    "categoryId": "gym",
    "category": "Gym",
    "title": "Barbell Squat Rack Setup",
    "description": "Hands locked onto knurled olympic barbell in the squat rack preparing for heavy set.",
    "imageUrl": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "gym",
      "squats",
      "barbell",
      "power",
      "focus"
    ],
    "views": 7492,
    "downloads": 5330,
    "favorites": 4851,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-gym-kettlebell-swing-pause",
    "categoryId": "gym",
    "category": "Gym",
    "title": "Cast Iron Kettlebell Hold",
    "description": "Resting black cast iron kettlebell on the floor between feet with focused gaze.",
    "imageUrl": "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "gym",
      "kettlebell",
      "crossfit",
      "strength",
      "iron"
    ],
    "views": 14713,
    "downloads": 5857,
    "favorites": 5627,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-gym-boxing-guard",
    "categoryId": "gym",
    "category": "Gym",
    "title": "Boxing Wraps Guard Stance",
    "description": "Athletic boxing stance with wrapped hands held high in front of chin in striking pose.",
    "imageUrl": "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "gym",
      "boxing",
      "wraps",
      "guard",
      "combat",
      "cardio"
    ],
    "views": 16584,
    "downloads": 3542,
    "favorites": 2030,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-gym-deadlift-lockout",
    "categoryId": "gym",
    "category": "Gym",
    "title": "Deadlift Stance Ready Lock",
    "description": "Standing tall over loaded barbell plates with chalked palms and intense focus.",
    "imageUrl": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "gym",
      "deadlift",
      "powerlifting",
      "strength",
      "heavy"
    ],
    "views": 7414,
    "downloads": 7062,
    "favorites": 2426,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-gym-cable-crossover-hold",
    "categoryId": "gym",
    "category": "Gym",
    "title": "Cable Machine Mid-Rep Grip",
    "description": "Holding dual cable crossover handles displaying chest and shoulder vascularity.",
    "imageUrl": "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "gym",
      "cables",
      "chest",
      "definition",
      "pump"
    ],
    "views": 16562,
    "downloads": 3620,
    "favorites": 4122,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-gym-bench-rest-gaze",
    "categoryId": "gym",
    "category": "Gym",
    "title": "Flat Bench Breath Pause",
    "description": "Sitting on flat weight bench elbows on knees catching breath under gym spotlights.",
    "imageUrl": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "gym",
      "bench",
      "rest",
      "intensity",
      "fitness"
    ],
    "views": 12871,
    "downloads": 3054,
    "favorites": 4056,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-gym-treadmill-stride-look",
    "categoryId": "gym",
    "category": "Gym",
    "title": "Sprint Interval Focus",
    "description": "Powerful running stride on treadmill with focused eyes and sweat catchlight.",
    "imageUrl": "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "gym",
      "cardio",
      "treadmill",
      "running",
      "speed"
    ],
    "views": 6166,
    "downloads": 5237,
    "favorites": 4564,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-gym-floor-mat-stretch",
    "categoryId": "gym",
    "category": "Gym",
    "title": "Post-Workout Hamstring Stretch",
    "description": "Sitting on black foam mat stretching hamstring reaching for toe with relaxed breathing.",
    "imageUrl": "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "gym",
      "stretch",
      "yoga",
      "recovery",
      "mobility"
    ],
    "views": 5601,
    "downloads": 6466,
    "favorites": 3055,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-gym-water-bottle-hydrate",
    "categoryId": "gym",
    "category": "Gym",
    "title": "Stainless Shaker Hydration",
    "description": "Drinking ice water from a steel shaker bottle after an intense conditioning circuit.",
    "imageUrl": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "gym",
      "water",
      "hydration",
      "shaker",
      "cool-down"
    ],
    "views": 6914,
    "downloads": 6321,
    "favorites": 5333,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-gym-locker-room-mirror",
    "categoryId": "gym",
    "category": "Gym",
    "title": "Locker Room Full-Fit Check",
    "description": "Clean mirror reflection in modern gym locker room checking activewear fit.",
    "imageUrl": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "gym",
      "locker-room",
      "activewear",
      "fit",
      "mirror"
    ],
    "views": 13991,
    "downloads": 5501,
    "favorites": 3001,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-gym-bicep-curl-peak",
    "categoryId": "gym",
    "category": "Gym",
    "title": "Incline Dumbbell Curl Peak",
    "description": "Contraction at peak of bicep curl showing defined forearm and bicep split.",
    "imageUrl": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "gym",
      "biceps",
      "curl",
      "arms",
      "pump"
    ],
    "views": 8697,
    "downloads": 2887,
    "favorites": 1772,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-gym-jump-rope-action",
    "categoryId": "gym",
    "category": "Gym",
    "title": "High-Speed Jump Rope Stride",
    "description": "Mid-air jump rope freeze frame with athletic calf and shoulder engagement.",
    "imageUrl": "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "gym",
      "jump-rope",
      "cardio",
      "speed",
      "action"
    ],
    "views": 6743,
    "downloads": 4563,
    "favorites": 4980,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-gym-plyo-box-step",
    "categoryId": "gym",
    "category": "Gym",
    "title": "Plyometric Box Step-Up",
    "description": "One foot planted on wooden plyo box preparing for explosive jump.",
    "imageUrl": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "gym",
      "plyo",
      "box-jump",
      "explosive",
      "power"
    ],
    "views": 19386,
    "downloads": 6866,
    "favorites": 2766,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-gym-foam-roller-back",
    "categoryId": "gym",
    "category": "Gym",
    "title": "Thoracic Foam Roller Release",
    "description": "Rolling out upper back with arms crossed over chest for mobility recovery.",
    "imageUrl": "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "gym",
      "foam-roller",
      "recovery",
      "mobility",
      "health"
    ],
    "views": 13361,
    "downloads": 5490,
    "favorites": 2848,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-gym-gym-bag-shoulder",
    "categoryId": "gym",
    "category": "Gym",
    "title": "Duffel Bag Over Shoulder Exit",
    "description": "Walking out of gym doors with heavy duffel bag slung casually over one shoulder.",
    "imageUrl": "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "gym",
      "duffel-bag",
      "exit",
      "lifestyle",
      "fitness"
    ],
    "views": 15883,
    "downloads": 6683,
    "favorites": 2161,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-gym-resistance-band-pull",
    "categoryId": "gym",
    "category": "Gym",
    "title": "Resistance Band Lateral Pull",
    "description": "Stretching green resistance band across chest highlighting rear delts and traps.",
    "imageUrl": "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "gym",
      "bands",
      "shoulders",
      "warmup",
      "delts"
    ],
    "views": 19233,
    "downloads": 2486,
    "favorites": 5189,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-gym-weight-plate-hold",
    "categoryId": "gym",
    "category": "Gym",
    "title": "Olympic 45lb Plate Grip",
    "description": "Holding black iron 45lb bumper plate with both hands in confident ready stance.",
    "imageUrl": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "gym",
      "plate",
      "iron",
      "weights",
      "strength"
    ],
    "views": 10606,
    "downloads": 4329,
    "favorites": 4049,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-gym-heavy-bag-kick",
    "categoryId": "gym",
    "category": "Gym",
    "title": "Heavy Bag Roundhouse Kick",
    "description": "High dynamic kick landing on heavy leather punching bag with clean martial arts form.",
    "imageUrl": "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "gym",
      "kickboxing",
      "heavy-bag",
      "kick",
      "martial-arts"
    ],
    "views": 17051,
    "downloads": 2810,
    "favorites": 3956,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-gym-preworkout-focus",
    "categoryId": "gym",
    "category": "Gym",
    "title": "Hooded Pre-Workout Zone",
    "description": "Headphones on, hoodie up, eyes locked on the barbell getting mentally locked in.",
    "imageUrl": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "gym",
      "headphones",
      "focus",
      "hoodie",
      "mental"
    ],
    "views": 18992,
    "downloads": 6192,
    "favorites": 4078,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-street-crosswalk-blur",
    "categoryId": "street",
    "category": "Street",
    "title": "Crosswalk Motion Blur Strut",
    "description": "Striding briskly across downtown zebra crossing with passing yellow cabs blurred.",
    "imageUrl": "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "street",
      "crosswalk",
      "motion-blur",
      "city",
      "strut"
    ],
    "views": 8103,
    "downloads": 2235,
    "favorites": 3751,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-street-neon-alley-lean",
    "categoryId": "street",
    "category": "Street",
    "title": "Neon Alleyway Brick Lean",
    "description": "Leaning relaxed against textured brick in a glowing Tokyo or New York side alley.",
    "imageUrl": "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "street",
      "neon",
      "alley",
      "brick",
      "night",
      "moody"
    ],
    "views": 8795,
    "downloads": 2556,
    "favorites": 3466,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-street-leather-jacket-turn",
    "categoryId": "street",
    "category": "Street",
    "title": "Leather Jacket Over-Shoulder Turn",
    "description": "Sharp over-the-shoulder turn adjusting black leather biker jacket collar.",
    "imageUrl": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "street",
      "leather",
      "fashion",
      "edgy",
      "turn"
    ],
    "views": 16772,
    "downloads": 4989,
    "favorites": 2651,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-street-graffiti-wall-contrast",
    "categoryId": "street",
    "category": "Street",
    "title": "Graffiti Mural Color Contrast",
    "description": "Standing in clean monochrome outfit against a hyper-vibrant street art graffiti wall.",
    "imageUrl": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "street",
      "graffiti",
      "mural",
      "art",
      "color",
      "contrast"
    ],
    "views": 7028,
    "downloads": 5576,
    "favorites": 5487,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-street-subway-entrance-stairs",
    "categoryId": "street",
    "category": "Street",
    "title": "Metro Station Stairs Descent",
    "description": "Walking down concrete subway entrance stairs with trench coat moving with stride.",
    "imageUrl": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "street",
      "subway",
      "stairs",
      "metro",
      "urban",
      "stride"
    ],
    "views": 14799,
    "downloads": 5850,
    "favorites": 2743,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-street-taxi-hailing-arm",
    "categoryId": "street",
    "category": "Street",
    "title": "Yellow Taxi Hailing Arm",
    "description": "Arm raised confidently hailing a yellow cab on a busy metropolitan avenue.",
    "imageUrl": "https://images.unsplash.com/photo-1480429370139-e0132c086e2a?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1480429370139-e0132c086e2a?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "street",
      "taxi",
      "hail",
      "avenue",
      "city-life"
    ],
    "views": 13308,
    "downloads": 6717,
    "favorites": 3052,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-street-skateboard-under-arm",
    "categoryId": "street",
    "category": "Street",
    "title": "Skater Cruiser Arm Tuck",
    "description": "Casual street skater walking with wooden skateboard tucked neatly under arm.",
    "imageUrl": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "street",
      "skateboard",
      "skater",
      "casual",
      "youth"
    ],
    "views": 19684,
    "downloads": 3788,
    "favorites": 4097,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-street-pavement-shadow",
    "categoryId": "street",
    "category": "Street",
    "title": "Golden Hour Long Shadow Walk",
    "description": "Low sun angle casting 20-foot elongated shadow across asphalt pavement.",
    "imageUrl": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "street",
      "shadow",
      "golden-hour",
      "asphalt",
      "geometry"
    ],
    "views": 18853,
    "downloads": 4114,
    "favorites": 4518,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-street-coffee-walk-fast",
    "categoryId": "street",
    "category": "Street",
    "title": "Morning Commuter Stride",
    "description": "Fast-paced walking shot carrying iced coffee and leather briefcase through downtown.",
    "imageUrl": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "street",
      "commuter",
      "coffee",
      "fast",
      "work"
    ],
    "views": 5799,
    "downloads": 4127,
    "favorites": 3638,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-street-bus-stop-bench-sit",
    "categoryId": "street",
    "category": "Street",
    "title": "Glass Bus Shelter Perch",
    "description": "Sitting on wooden bench inside modern glass transit shelter with earphones in.",
    "imageUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "street",
      "bus-stop",
      "transit",
      "earphones",
      "chill"
    ],
    "views": 8956,
    "downloads": 4165,
    "favorites": 5157,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-street-overpass-skyline",
    "categoryId": "street",
    "category": "Street",
    "title": "Highway Overpass Horizon",
    "description": "Leaning over highway pedestrian railing watching streams of evening traffic below.",
    "imageUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "street",
      "overpass",
      "highway",
      "traffic",
      "skyline"
    ],
    "views": 5864,
    "downloads": 3535,
    "favorites": 2310,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-street-storefront-reflection",
    "categoryId": "street",
    "category": "Street",
    "title": "Luxury Boutique Glass Glance",
    "description": "Looking sideways into glossy window display reflecting city skyscrapers.",
    "imageUrl": "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "street",
      "reflection",
      "boutique",
      "window",
      "fashion"
    ],
    "views": 12851,
    "downloads": 2440,
    "favorites": 4120,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-street-rain-slick-pavement",
    "categoryId": "street",
    "category": "Street",
    "title": "Rain Slick Reflection Strut",
    "description": "Walking across wet night streets reflecting glowing storefront signs like mirrors.",
    "imageUrl": "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "street",
      "rain",
      "wet-streets",
      "reflection",
      "night"
    ],
    "views": 18859,
    "downloads": 7270,
    "favorites": 2209,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-street-urban-staircase-sit",
    "categoryId": "street",
    "category": "Street",
    "title": "Brownstone Stoop Relaxed Sit",
    "description": "Classic New York brownstone stoop sitting pose elbows resting on knees.",
    "imageUrl": "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "street",
      "stoop",
      "brownstone",
      "sit",
      "neighborhood"
    ],
    "views": 7579,
    "downloads": 5236,
    "favorites": 2756,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-street-street-food-candid",
    "categoryId": "street",
    "category": "Street",
    "title": "Night Market Taco Truck Bite",
    "description": "Candid late-night street food bite illuminated by the food truck service window.",
    "imageUrl": "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "street",
      "food-truck",
      "night-market",
      "candid",
      "eating"
    ],
    "views": 14899,
    "downloads": 7090,
    "favorites": 2033,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-street-construction-scaffold",
    "categoryId": "street",
    "category": "Street",
    "title": "Industrial Scaffolding Frame",
    "description": "Standing under green construction mesh and steel pipes in streetwear outfit.",
    "imageUrl": "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "street",
      "scaffolding",
      "industrial",
      "grunge",
      "streetwear"
    ],
    "views": 10261,
    "downloads": 3216,
    "favorites": 1668,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-street-tunnel-echo-walk",
    "categoryId": "street",
    "category": "Street",
    "title": "Echoing Tile Pedestrian Tunnel",
    "description": "Walking down symmetrical curved white tile pedestrian tunnel with dramatic vanishing point.",
    "imageUrl": "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "street",
      "tunnel",
      "symmetry",
      "perspective",
      "tiles"
    ],
    "views": 14276,
    "downloads": 7646,
    "favorites": 3747,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-street-fire-escape-ladder",
    "categoryId": "street",
    "category": "Street",
    "title": "Cast Iron Fire Escape Perch",
    "description": "Sitting on the first landing of a black iron building fire escape overlooking the avenue.",
    "imageUrl": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "street",
      "fire-escape",
      "iron",
      "perch",
      "architecture"
    ],
    "views": 18309,
    "downloads": 7525,
    "favorites": 5043,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-street-puffer-jacket-chill",
    "categoryId": "street",
    "category": "Street",
    "title": "Metallic Puffer Jacket Silhouette",
    "description": "Voluminous silver puffer jacket standing under cold winter streetlights.",
    "imageUrl": "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "street",
      "puffer",
      "winter",
      "silver",
      "streetwear"
    ],
    "views": 14800,
    "downloads": 4490,
    "favorites": 5621,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-street-streetlamp-rim-night",
    "categoryId": "street",
    "category": "Street",
    "title": "Warm Sodium Streetlamp Rim",
    "description": "Backlit by an amber streetlamp casting glowing rim light on hair in dark alley.",
    "imageUrl": "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "street",
      "streetlamp",
      "rim-light",
      "night",
      "amber"
    ],
    "views": 7738,
    "downloads": 2467,
    "favorites": 3331,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-street-newsstand-browse",
    "categoryId": "street",
    "category": "Street",
    "title": "Corner Magazine Kiosk Glance",
    "description": "Flipping through an art magazine outside a traditional street newsstand kiosk.",
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "street",
      "newsstand",
      "kiosk",
      "magazine",
      "culture"
    ],
    "views": 12731,
    "downloads": 2102,
    "favorites": 3738,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-street-rooftop-ladder-step",
    "categoryId": "street",
    "category": "Street",
    "title": "Rooftop Access Hatch Climb",
    "description": "Climbing the final metal rung onto a wide open rooftop overlooking skyline.",
    "imageUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "street",
      "rooftop",
      "ladder",
      "urban-exploration",
      "adventure"
    ],
    "views": 11775,
    "downloads": 6098,
    "favorites": 1692,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-street-corner-pillar-peek",
    "categoryId": "street",
    "category": "Street",
    "title": "Concrete Pillar Peeking Stance",
    "description": "Playful urban pose peeking head around a brutalist concrete building column.",
    "imageUrl": "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "street",
      "pillar",
      "peek",
      "playful",
      "concrete"
    ],
    "views": 7301,
    "downloads": 3153,
    "favorites": 2869,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-city-skyscraper-upward",
    "categoryId": "city",
    "category": "City",
    "title": "Glass Tower Upward Perspective",
    "description": "Standing at the base of mirrored skyscraper towers looking straight up as glass meets sky.",
    "imageUrl": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "city",
      "skyscraper",
      "architecture",
      "glass",
      "upward"
    ],
    "views": 14998,
    "downloads": 7613,
    "favorites": 2783,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-city-plaza-architecture",
    "categoryId": "city",
    "category": "City",
    "title": "Modernist Museum Plaza Walk",
    "description": "Walking across a vast granite museum plaza with clean geometric lines in the background.",
    "imageUrl": "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "city",
      "museum",
      "plaza",
      "minimalist",
      "lines"
    ],
    "views": 10430,
    "downloads": 3781,
    "favorites": 3844,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-city-bridge-archway",
    "categoryId": "city",
    "category": "City",
    "title": "Steel Suspension Bridge Geometry",
    "description": "Standing beneath the towering steel cables and rivets of an iconic suspension bridge.",
    "imageUrl": "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "city",
      "bridge",
      "steel",
      "geometry",
      "cables"
    ],
    "views": 16356,
    "downloads": 6860,
    "favorites": 5808,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-city-concrete-stairs",
    "categoryId": "city",
    "category": "City",
    "title": "Grand Concert Hall Steps",
    "description": "Sitting centered on monumental concrete steps in tailored structured blazer.",
    "imageUrl": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "city",
      "steps",
      "blazer",
      "structure",
      "monumental"
    ],
    "views": 8648,
    "downloads": 6176,
    "favorites": 3226,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-city-rooftop-skyline-edge",
    "categoryId": "city",
    "category": "City",
    "title": "Panoramic Penthouse Balcony",
    "description": "Standing on luxury glass balcony surveying the 360-degree metropolitan skyline.",
    "imageUrl": "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "city",
      "penthouse",
      "balcony",
      "skyline",
      "luxury"
    ],
    "views": 9894,
    "downloads": 2464,
    "favorites": 4933,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-city-glass-canopy-reflection",
    "categoryId": "city",
    "category": "City",
    "title": "Glass Atrium Sky Reflection",
    "description": "Under a geometric glass atrium canopy reflecting sunlight patterns onto clothes.",
    "imageUrl": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "city",
      "atrium",
      "glass",
      "reflection",
      "geometry"
    ],
    "views": 16991,
    "downloads": 5527,
    "favorites": 5815,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-city-fountain-edge-sit",
    "categoryId": "city",
    "category": "City",
    "title": "Civic Center Fountain Edge",
    "description": "Sitting relaxed on polished stone fountain rim with jets of water dancing behind.",
    "imageUrl": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "city",
      "fountain",
      "water",
      "civic-center",
      "peaceful"
    ],
    "views": 16198,
    "downloads": 6032,
    "favorites": 2271,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-city-financial-district-power",
    "categoryId": "city",
    "category": "City",
    "title": "Wall Street Power Stride",
    "description": "High-energy fast-paced stride between classical granite banking columns.",
    "imageUrl": "https://images.unsplash.com/photo-1480429370139-e0132c086e2a?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1480429370139-e0132c086e2a?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "city",
      "power-walk",
      "columns",
      "banking",
      "business"
    ],
    "views": 16449,
    "downloads": 3713,
    "favorites": 1773,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-city-spiral-staircase",
    "categoryId": "city",
    "category": "City",
    "title": "Architectural Spiral Helix Look",
    "description": "Looking up or down a sweeping concrete architectural spiral staircase.",
    "imageUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "city",
      "spiral",
      "stairs",
      "helix",
      "architecture"
    ],
    "views": 18629,
    "downloads": 3071,
    "favorites": 1953,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-city-night-traffic-trails",
    "categoryId": "city",
    "category": "City",
    "title": "Long-Exposure Traffic Light Trails",
    "description": "Standing stationary on pedestrian island with streaking red and white car light trails.",
    "imageUrl": "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "city",
      "light-trails",
      "traffic",
      "night",
      "long-exposure"
    ],
    "views": 11721,
    "downloads": 5963,
    "favorites": 4528,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-city-clock-tower-gaze",
    "categoryId": "city",
    "category": "City",
    "title": "Historic Clock Tower Perspective",
    "description": "Framed below a classic sandstone clock tower against a clear blue sky.",
    "imageUrl": "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "city",
      "clock-tower",
      "historic",
      "sandstone",
      "heritage"
    ],
    "views": 18596,
    "downloads": 4306,
    "favorites": 1815,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-city-modern-art-sculpture",
    "categoryId": "city",
    "category": "City",
    "title": "Public Bronze Sculpture Lean",
    "description": "Leaning lightly against a monumental polished metal abstract public art installation.",
    "imageUrl": "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "city",
      "sculpture",
      "art",
      "bronze",
      "culture"
    ],
    "views": 16480,
    "downloads": 3887,
    "favorites": 4763,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-city-glass-elevator-ascent",
    "categoryId": "city",
    "category": "City",
    "title": "Exterior Glass Elevator Ride",
    "description": "Looking out through glass elevator wall as city skyline reveals itself below.",
    "imageUrl": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "city",
      "elevator",
      "glass",
      "skyline",
      "height"
    ],
    "views": 16690,
    "downloads": 5824,
    "favorites": 5260,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-city-monument-base-stand",
    "categoryId": "city",
    "category": "City",
    "title": "Classical Marble Monument Base",
    "description": "Standing at the steps of a grand triumphal arch or marble column monument.",
    "imageUrl": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "city",
      "monument",
      "marble",
      "arch",
      "grand"
    ],
    "views": 8024,
    "downloads": 4754,
    "favorites": 4518,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-city-skyway-bridge-walk",
    "categoryId": "city",
    "category": "City",
    "title": "Enclosed Glass Skybridge Cross",
    "description": "Walking through a glass-enclosed skybridge connecting two high-rise skyscrapers.",
    "imageUrl": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "city",
      "skybridge",
      "glass",
      "futuristic",
      "towers"
    ],
    "views": 8995,
    "downloads": 4745,
    "favorites": 5408,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-city-subway-platform-motion",
    "categoryId": "city",
    "category": "City",
    "title": "Train Rushing Past Platform",
    "description": "Standing completely still on metro platform while express train blurs past.",
    "imageUrl": "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "city",
      "train",
      "subway",
      "motion-blur",
      "platform"
    ],
    "views": 14528,
    "downloads": 5003,
    "favorites": 5904,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-city-skyline-sunset-perch",
    "categoryId": "city",
    "category": "City",
    "title": "Twilight City Sunset Perch",
    "description": "Watching violet sunset hues settle over thousands of illuminated city windows.",
    "imageUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "city",
      "twilight",
      "sunset",
      "windows",
      "serene"
    ],
    "views": 5037,
    "downloads": 2489,
    "favorites": 1543,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-city-brutalist-concrete-shadow",
    "categoryId": "city",
    "category": "City",
    "title": "Brutalist Concrete Angle Play",
    "description": "Sharp diagonal shadow cuts across a heavy geometric concrete facade.",
    "imageUrl": "https://images.unsplash.com/photo-1509233725247-49e657c54213?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1509233725247-49e657c54213?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "city",
      "brutalist",
      "concrete",
      "shadows",
      "angular"
    ],
    "views": 19485,
    "downloads": 3469,
    "favorites": 3129,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-city-city-park-border",
    "categoryId": "city",
    "category": "City",
    "title": "Central Park Tree & Tower Border",
    "description": "Standing on green lawn where lush park trees meet the sheer wall of skyline towers.",
    "imageUrl": "https://images.unsplash.com/photo-1448375240586-882707db888b?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1448375240586-882707db888b?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "city",
      "park",
      "green",
      "towers",
      "contrast"
    ],
    "views": 5586,
    "downloads": 4063,
    "favorites": 1509,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-city-waterfront-promenade",
    "categoryId": "city",
    "category": "City",
    "title": "Harbor Waterfront Stroll",
    "description": "Walking along wide paved harbor promenade with sailboats and city skyline across the bay.",
    "imageUrl": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "city",
      "harbor",
      "waterfront",
      "bay",
      "sailboats"
    ],
    "views": 10540,
    "downloads": 7253,
    "favorites": 5873,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-city-skyline-champagne-toast",
    "categoryId": "city",
    "category": "City",
    "title": "Rooftop Lounge Toast",
    "description": "Raising a flute of champagne with glowing metropolis panorama behind.",
    "imageUrl": "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "city",
      "champagne",
      "lounge",
      "luxury",
      "cheers"
    ],
    "views": 13450,
    "downloads": 4543,
    "favorites": 3023,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-city-tunnel-light-exit",
    "categoryId": "city",
    "category": "City",
    "title": "Vehicular Tunnel Portal Walk",
    "description": "Stepping from dark tunnel interior out into blinding bright city daylight.",
    "imageUrl": "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "city",
      "tunnel",
      "light",
      "transition",
      "cinematic"
    ],
    "views": 7497,
    "downloads": 7350,
    "favorites": 5932,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-portrait-editorial-jaw-rest",
    "categoryId": "portrait",
    "category": "Portrait",
    "title": "Editorial Jawline Hand Rest",
    "description": "Classic Vogue editorial pose resting jawline on knuckles with piercing gaze.",
    "imageUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "portrait",
      "editorial",
      "vogue",
      "jawline",
      "gaze"
    ],
    "views": 16563,
    "downloads": 6133,
    "favorites": 5379,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-portrait-rembrandt-lighting",
    "categoryId": "portrait",
    "category": "Portrait",
    "title": "Studio Rembrandt Lighting Triangle",
    "description": "Studio headshot with signature triangle of light under one eye against dark background.",
    "imageUrl": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "portrait",
      "rembrandt",
      "studio",
      "lighting",
      "classic"
    ],
    "views": 16614,
    "downloads": 4425,
    "favorites": 1554,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-portrait-coat-shoulder-drape",
    "categoryId": "portrait",
    "category": "Portrait",
    "title": "Tailored Blazer Over Shoulders",
    "description": "Wearing heavy wool overcoat draped loosely over shoulders without putting arms through sleeves.",
    "imageUrl": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "portrait",
      "blazer",
      "overcoat",
      "fashion",
      "luxury"
    ],
    "views": 16061,
    "downloads": 6879,
    "favorites": 3893,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-portrait-dramatic-shadow-slice",
    "categoryId": "portrait",
    "category": "Portrait",
    "title": "Sharp Shadow Slice Across Eyes",
    "description": "Dramatic hard-light portrait where shadow cuts diagonally across the face leaving one eye bright.",
    "imageUrl": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "portrait",
      "shadow",
      "contrast",
      "dramatic",
      "editorial"
    ],
    "views": 7428,
    "downloads": 6978,
    "favorites": 5390,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-portrait-clean-high-key",
    "categoryId": "portrait",
    "category": "Portrait",
    "title": "Clean High-Key White Studio",
    "description": "Bright clean white background portrait with luminous skin and warm engaging smile.",
    "imageUrl": "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "portrait",
      "high-key",
      "white-studio",
      "clean",
      "headshot"
    ],
    "views": 10587,
    "downloads": 5170,
    "favorites": 3044,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-portrait-vintage-monochrome",
    "categoryId": "portrait",
    "category": "Portrait",
    "title": "Timeless Monochrome Glance",
    "description": "Rich black and white portrait with deep blacks and velvety tones capturing intense emotion.",
    "imageUrl": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "portrait",
      "black-and-white",
      "monochrome",
      "timeless",
      "emotion"
    ],
    "views": 13216,
    "downloads": 5492,
    "favorites": 6044,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-portrait-flowing-hair-breeze",
    "categoryId": "portrait",
    "category": "Portrait",
    "title": "Studio Fan Hair Movement",
    "description": "Studio portrait with gentle wind machine lifting hair strands into dynamic motion.",
    "imageUrl": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "portrait",
      "hair",
      "movement",
      "breeze",
      "studio"
    ],
    "views": 8039,
    "downloads": 7172,
    "favorites": 4782,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-portrait-turtleneck-chin-tuck",
    "categoryId": "portrait",
    "category": "Portrait",
    "title": "Textured Turtleneck Chin Tuck",
    "description": "Tucking chin lightly inside chunky knit turtleneck sweater collar for cozy editorial elegance.",
    "imageUrl": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "portrait",
      "turtleneck",
      "knit",
      "autumn",
      "editorial"
    ],
    "views": 13452,
    "downloads": 5714,
    "favorites": 1687,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-portrait-over-shoulder-intense",
    "categoryId": "portrait",
    "category": "Portrait",
    "title": "Intense Over-the-Shoulder Focus",
    "description": "Turned back to camera with head snapped around and direct commanding eye contact.",
    "imageUrl": "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "portrait",
      "over-shoulder",
      "intense",
      "commanding",
      "focus"
    ],
    "views": 6176,
    "downloads": 2078,
    "favorites": 4868,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-portrait-collarbone-minimal",
    "categoryId": "portrait",
    "category": "Portrait",
    "title": "Collarbone & Minimalist Gaze",
    "description": "Clean architectural neck and collarbone posture with soft downward angled gaze.",
    "imageUrl": "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "portrait",
      "collarbone",
      "minimalist",
      "soft",
      "beauty"
    ],
    "views": 16447,
    "downloads": 4955,
    "favorites": 6162,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-portrait-hands-interlock-look",
    "categoryId": "portrait",
    "category": "Portrait",
    "title": "Interlocked Hands Chin Perch",
    "description": "Resting chin on top of loosely interlocked fingers with soft studio key lighting.",
    "imageUrl": "https://images.unsplash.com/photo-1480429370139-e0132c086e2a?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1480429370139-e0132c086e2a?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "portrait",
      "hands",
      "interlock",
      "chin",
      "studio"
    ],
    "views": 13774,
    "downloads": 7862,
    "favorites": 4197,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-portrait-profile-silhouette-rim",
    "categoryId": "portrait",
    "category": "Portrait",
    "title": "Fine Rim Light Profile Silhouette",
    "description": "Pure black profile silhouette outlined by razor-thin white rim light along nose and lips.",
    "imageUrl": "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "portrait",
      "rim-light",
      "profile",
      "silhouette",
      "artistic"
    ],
    "views": 5918,
    "downloads": 5225,
    "favorites": 5023,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-portrait-black-velvet-backdrop",
    "categoryId": "portrait",
    "category": "Portrait",
    "title": "Dark Velvet Background Immersion",
    "description": "Subject stepping out from total darkness into soft directional lantern glow.",
    "imageUrl": "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "portrait",
      "dark",
      "velvet",
      "moody",
      "glow"
    ],
    "views": 13650,
    "downloads": 7978,
    "favorites": 2916,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-portrait-sunset-catchlight-eyes",
    "categoryId": "portrait",
    "category": "Portrait",
    "title": "Sunset Honey Catchlight Iris",
    "description": "Macro portrait capturing amber honey tones in eyes looking into setting sun.",
    "imageUrl": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "portrait",
      "eyes",
      "macro",
      "sunset",
      "honey"
    ],
    "views": 14651,
    "downloads": 7106,
    "favorites": 6479,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-portrait-studio-stool-lean",
    "categoryId": "portrait",
    "category": "Portrait",
    "title": "Wooden Studio Stool Straddle",
    "description": "Seated straddling a wooden stool with arms resting across the backrest.",
    "imageUrl": "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "portrait",
      "stool",
      "straddle",
      "studio",
      "relaxed"
    ],
    "views": 7728,
    "downloads": 4123,
    "favorites": 1960,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-portrait-candid-laugh-head-tilt",
    "categoryId": "portrait",
    "category": "Portrait",
    "title": "Genuine Laugh Head Tilt",
    "description": "Head tilted back mid-laugh capturing unfiltered joy and natural crinkling eyes.",
    "imageUrl": "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "portrait",
      "laugh",
      "joy",
      "smile",
      "candid"
    ],
    "views": 18950,
    "downloads": 3932,
    "favorites": 4721,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-portrait-sunglasses-temple-slide",
    "categoryId": "portrait",
    "category": "Portrait",
    "title": "Sunglasses Temple Slide Adjust",
    "description": "One hand touching the temple of designer sunglasses sliding them down slightly.",
    "imageUrl": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "portrait",
      "sunglasses",
      "designer",
      "chic",
      "style"
    ],
    "views": 14087,
    "downloads": 3772,
    "favorites": 2016,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-portrait-silk-scarf-drape",
    "categoryId": "portrait",
    "category": "Portrait",
    "title": "Printed Silk Scarf Frame",
    "description": "Patterned silk scarf framing cheekbones with gentle vintage Italian cinema elegance.",
    "imageUrl": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "portrait",
      "silk-scarf",
      "vintage",
      "elegance",
      "cinema"
    ],
    "views": 17991,
    "downloads": 5690,
    "favorites": 2204,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-portrait-textured-knitwear-hug",
    "categoryId": "portrait",
    "category": "Portrait",
    "title": "Self-Hug Chunky Knit Sweater",
    "description": "Crossing arms gently around torso in an oversized cable-knit sweater with peaceful expression.",
    "imageUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "portrait",
      "knitwear",
      "cozy",
      "warmth",
      "peaceful"
    ],
    "views": 18699,
    "downloads": 5256,
    "favorites": 2264,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-portrait-studio-ringlight-halo",
    "categoryId": "portrait",
    "category": "Portrait",
    "title": "Ring Light Halo Reflections",
    "description": "Beauty headshot with glowing circular halo light catchlights in pupils and dewy skin.",
    "imageUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "portrait",
      "ring-light",
      "beauty",
      "dewy",
      "headshot"
    ],
    "views": 11235,
    "downloads": 2693,
    "favorites": 4395,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-portrait-arms-crossed-boss",
    "categoryId": "portrait",
    "category": "Portrait",
    "title": "Executive Arms Crossed Stance",
    "description": "Confident arms folded stance with slight 30-degree torso angle and warm authority.",
    "imageUrl": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "portrait",
      "executive",
      "business",
      "authority",
      "arms-crossed"
    ],
    "views": 6185,
    "downloads": 4083,
    "favorites": 5373,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-portrait-soft-veil-diffuse",
    "categoryId": "portrait",
    "category": "Portrait",
    "title": "Ethereal Tulle Veil Diffusion",
    "description": "Looking through delicate transparent tulle veil softening features in fairytale light.",
    "imageUrl": "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "portrait",
      "veil",
      "tulle",
      "ethereal",
      "fairytale"
    ],
    "views": 9770,
    "downloads": 6029,
    "favorites": 4654,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-portrait-dramatic-profile-gaze",
    "categoryId": "portrait",
    "category": "Portrait",
    "title": "Dramatic Classical Roman Profile",
    "description": "Full 90-degree profile with chin parallel to the ground and statuesque posture.",
    "imageUrl": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": [
      "portrait",
      "profile",
      "classical",
      "statuesque",
      "roman"
    ],
    "views": 18864,
    "downloads": 2426,
    "favorites": 2865,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "natural daylight",
    "orientation": "portrait",
    "createdAt": "2026-08-18T00:00:00Z",
    "updatedAt": "2026-08-18T00:00:00Z",
    "instructions": [
      "Position yourself with shoulders relaxed and natural posture.",
      "Shift 70% weight onto the back foot for natural silhouette balance.",
      "Turn torso 30-45 degrees towards the key light.",
      "Maintain soft eye contact with camera or glance slightly off-lens."
    ],
    "tips": [
      "Keep posture loose and natural.",
      "Use natural ambient lighting for organic depth."
    ]
  },
  {
    "id": "pose-jedi-hero-stance",
    "categoryId": "cinematic",
    "category": "Cinematic & Sci-Fi",
    "title": "Jedi Hero Stance (Calm & Focused)",
    "description": "Original cinematic sci-fi inspired stance: relaxed balanced weight distribution, hands held in grounded readiness, shoulders square with focused gaze.",
    "imageUrl": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "medium",
    "indoor": false,
    "tags": ["cinematic", "sci-fi", "hero", "jedi", "stance"],
    "views": 25410,
    "downloads": 8920,
    "favorites": 4500,
    "estimatedDistance": 2.5,
    "cameraAngle": "low-angle",
    "lighting": "side dramatic rim light",
    "orientation": "portrait",
    "createdAt": "2026-08-19T00:00:00Z",
    "updatedAt": "2026-08-19T00:00:00Z",
    "instructions": [
      "Plant feet shoulder-width apart with front foot slightly angled.",
      "Keep torso tall, shoulders lowered, and chest open.",
      "Position lead hand forward at waist height with relaxed fingers.",
      "Look directly down the lens axis with intense, focused calm."
    ],
    "tips": [
      "Keep breathing steady and shoulders un-hunched.",
      "A low camera angle creates heroic presence."
    ]
  },
  {
    "id": "pose-lightsaber-duel-stance",
    "categoryId": "cinematic",
    "category": "Cinematic & Sci-Fi",
    "title": "Lightsaber Duel Stance (Dynamic Offset)",
    "description": "Original sci-fi duel readiness posture: staggered legs, two-handed diagonal guard, low center of gravity.",
    "imageUrl": "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "hard",
    "indoor": false,
    "tags": ["cinematic", "sci-fi", "duel", "action", "lightsaber"],
    "views": 31200,
    "downloads": 11400,
    "favorites": 6120,
    "estimatedDistance": 2.8,
    "cameraAngle": "eye-level",
    "lighting": "dramatic dual-tone neon",
    "orientation": "portrait",
    "createdAt": "2026-08-19T00:00:00Z",
    "updatedAt": "2026-08-19T00:00:00Z",
    "instructions": [
      "Step left foot forward with knee bent at 45 degrees.",
      "Raise both hands in diagonal grip across torso.",
      "Angle shoulders 30 degrees away from the lens.",
      "Lock eyes with the camera for high tension."
    ],
    "tips": [
      "Bend both knees slightly for an authentic dynamic athletic stance."
    ]
  },
  {
    "id": "pose-dark-villain-power-stance",
    "categoryId": "cinematic",
    "category": "Cinematic & Sci-Fi",
    "title": "Dark Villain Power Stance (Commanding)",
    "description": "Original dark sci-fi villain stance: wide symmetrical feet, hands resting at utility belt height, chin elevated with imposing presence.",
    "imageUrl": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "medium",
    "indoor": true,
    "tags": ["cinematic", "sci-fi", "villain", "power", "vader"],
    "views": 29800,
    "downloads": 10500,
    "favorites": 5400,
    "estimatedDistance": 2.2,
    "cameraAngle": "low-angle",
    "lighting": "high contrast overhead split",
    "orientation": "portrait",
    "createdAt": "2026-08-19T00:00:00Z",
    "updatedAt": "2026-08-19T00:00:00Z",
    "instructions": [
      "Stand broad-shouldered with feet firmly planted shoulder-width apart.",
      "Tuck thumbs lightly into belt or hold fists at waist sides.",
      "Tilt chin slightly upward while casting downward authoritative gaze.",
      "Allow low camera angle to maximize visual height."
    ],
    "tips": [
      "Avoid smiling; maintain rigid architectural posture."
    ]
  },
  {
    "id": "pose-obi-wan-defensive-guard",
    "categoryId": "cinematic",
    "category": "Cinematic & Sci-Fi",
    "title": "Obi-Wan Defensive Guard (Soresu Stance)",
    "description": "Original sci-fi master stance: two-finger forward peace/guard gesture with rear hand cocked back high, sideways silhouette.",
    "imageUrl": "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "hard",
    "indoor": false,
    "tags": ["cinematic", "sci-fi", "obi-wan", "soresu", "guard"],
    "views": 27400,
    "downloads": 9800,
    "favorites": 4900,
    "estimatedDistance": 2.5,
    "cameraAngle": "eye-level",
    "lighting": "golden rim sunset",
    "orientation": "portrait",
    "createdAt": "2026-08-19T00:00:00Z",
    "updatedAt": "2026-08-19T00:00:00Z",
    "instructions": [
      "Turn body perpendicular to camera with rear foot back.",
      "Extend lead hand with index and middle fingers pointed forward.",
      "Raise back hand behind head near ear level.",
      "Keep head turned toward camera with poised calm expression."
    ],
    "tips": [
      "Keep lead elbow slightly relaxed rather than hyper-extended."
    ]
  },
  {
    "id": "pose-anakin-hero-landing",
    "categoryId": "cinematic",
    "category": "Cinematic & Sci-Fi",
    "title": "Anakin Hero Landing (Ground Strike)",
    "description": "Original sci-fi hero landing: one knee down on ground, one fist planted forward, head tilted up with intense look.",
    "imageUrl": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "hard",
    "indoor": false,
    "tags": ["cinematic", "sci-fi", "anakin", "landing", "hero"],
    "views": 33100,
    "downloads": 12800,
    "favorites": 7100,
    "estimatedDistance": 2.0,
    "cameraAngle": "ground-level",
    "lighting": "backlit rim glow",
    "orientation": "portrait",
    "createdAt": "2026-08-19T00:00:00Z",
    "updatedAt": "2026-08-19T00:00:00Z",
    "instructions": [
      "Drop into low 3-point hero stance: one knee down, opposite foot planted.",
      "Touch lead fist lightly to ground surface.",
      "Keep back arm swept backward for balance.",
      "Raise chin sharply to face lens."
    ],
    "tips": [
      "Use ground-level camera perspective for maximum cinematic impact."
    ]
  },
  {
    "id": "pose-men-streetwear-oversized",
    "categoryId": "men",
    "category": "Men's Style",
    "title": "Men's Editorial Streetwear (Casual Lean)",
    "description": "Effortlessly modern streetwear stance: one hand in pocket, relaxed one-foot wall lean, urban architectural background.",
    "imageUrl": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "easy",
    "indoor": false,
    "tags": ["men", "streetwear", "urban", "casual", "fashion"],
    "views": 22100,
    "downloads": 7600,
    "favorites": 3800,
    "estimatedDistance": 2.2,
    "cameraAngle": "eye-level",
    "lighting": "overcast soft light",
    "orientation": "portrait",
    "createdAt": "2026-08-19T00:00:00Z",
    "updatedAt": "2026-08-19T00:00:00Z",
    "instructions": [
      "Lean back shoulder casually against wall or pillar.",
      "Slide one hand thumb-in to pant pocket.",
      "Cross outside foot slightly over inside foot.",
      "Turn head 20 degrees away from camera with relaxed mouth."
    ],
    "tips": [
      "Keep chin neutral and avoid over-posing."
    ]
  },
  {
    "id": "pose-men-luxury-watch-cuff",
    "categoryId": "men",
    "category": "Men's Style",
    "title": "Luxury Cuff & Watch Adjustment",
    "description": "Refined masculine formal pose: looking down while adjusting jacket sleeve or timepiece, elegant tailored silhouette.",
    "imageUrl": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=900&auto=format&fit=crop&q=80",
    "thumbnailUrl": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=900&auto=format&fit=crop&q=80",
    "overlayImage": "",
    "difficulty": "medium",
    "indoor": true,
    "tags": ["men", "luxury", "suit", "formal", "watch"],
    "views": 26500,
    "downloads": 9200,
    "favorites": 4600,
    "estimatedDistance": 1.8,
    "cameraAngle": "eye-level",
    "lighting": "warm ambient interior",
    "orientation": "portrait",
    "createdAt": "2026-08-19T00:00:00Z",
    "updatedAt": "2026-08-19T00:00:00Z",
    "instructions": [
      "Stand tall with spine straight and shoulders relaxed.",
      "Bring right hand up to lightly touch left watch strap or cufflink.",
      "Tilt head slightly down towards wrist with contemplative gaze.",
      "Allow key light to highlight fabric texture."
    ],
    "tips": [
      "Ensure jacket sits naturally on shoulders."
    ]
  }
];
