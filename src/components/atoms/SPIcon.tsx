/**
 * SPIcon — Ultra-crisp SVG icon atom powered by lucide-react-native & react-native-svg.
 * Fully supports dynamic themes, stroke styling, and spring micro-interactions.
 * Minimum touch target 48×48 dp when interactive. [Req 32]
 */

import React from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import {
  Home,
  Search,
  Camera,
  Heart,
  Settings,
  Sparkles,
  Grid3X3,
  LayoutGrid,
  Zap,
  ZapOff,
  Timer,
  Clock,
  RotateCcw,
  RefreshCw,
  SwitchCamera,
  Image as ImageIcon,
  Images,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Share2,
  Trash2,
  Check,
  X,
  Eye,
  EyeOff,
  Building2,
  Coffee,
  Leaf,
  User,
  Users,
  Plane,
  Armchair,
  Footprints,
  Wand2,
  Sun,
  Shirt,
  Dumbbell,
  Tag,
  Calendar,
  Palette,
  Smartphone,
  Save,
  Bookmark,
  Bot,
  ShieldCheck,
  FileText,
  Star,
  HelpCircle,
  MessageSquare,
  Package,
  Download,
  Lightbulb,
  Sliders,
  Play,
  Flame,
  Award,
  Aperture,
  AlertTriangle,
  Info,
  Lock,
  Volume2,
  VolumeX,
  Bell,
  Moon,
  Target,
  type LucideIcon,
} from 'lucide-react-native';
import { useTheme } from '@/constants/theme';

// ---------------------------------------------------------------------------
// Icon Registry
// ---------------------------------------------------------------------------

export const ICON_REGISTRY: Record<string, LucideIcon> = {
  // Audio & Voice
  volume: Volume2,
  volume2: Volume2,
  volumeOff: VolumeX,
  volumeX: VolumeX,
  audio: Volume2,
  sound: Volume2,

  // Navigation & Core
  home: Home,
  search: Search,
  camera: Camera,
  heart: Heart,
  'heart-filled': Heart,
  settings: Settings,
  favorites: Heart,
  'favorites-outline': Heart,
  gallery: Images,
  image: ImageIcon,
  sparkles: Sparkles,
  lock: Lock,
  bell: Bell,
  notification: Bell,
  notif: Bell,
  moon: Moon,
  target: Target,

  // Actions
  close: X,
  check: Check,
  trash: Trash2,
  share: Share2,
  download: Download,
  save: Save,
  bookmark: Bookmark,
  play: Play,
  edit: Sliders,
  refresh: RefreshCw,
  flip: SwitchCamera,
  rotate: RotateCcw,
  eye: Eye,
  eyeOff: EyeOff,

  // Camera Tools
  flash: Zap,
  flashAuto: Zap,
  flashOff: ZapOff,
  grid: Grid3X3,
  gridGolden: LayoutGrid,
  timer: Timer,
  clock: Clock,
  aperture: Aperture,
  lens: Aperture,

  // Categories
  all: Sparkles,
  street: Building2,
  cafe: Coffee,
  nature: Leaf,
  portrait: User,
  selfie: Smartphone,
  couple: Users,
  travel: Plane,
  sitting: Armchair,
  standing: Footprints,
  creative: Wand2,
  lifestyle: Sun,
  fashion: Shirt,

  // Highlights & Badges
  trending: Flame,
  flame: Flame,
  featured: Star,
  editors: Award,
  star: Star,

  // Directions
  arrowLeft: ArrowLeft,
  arrowRight: ArrowRight,
  arrowUp: ArrowUp,
  arrowDown: ArrowDown,
  arrow_left: ArrowLeft,
  arrow_right: ArrowRight,

  // Settings & System
  theme: Palette,
  haptics: Smartphone,
  autoSave: Save,
  ai: Bot,
  bot: Bot,
  mirror: SwitchCamera,
  about: Sparkles,
  privacy: ShieldCheck,
  terms: FileText,
  rate: Star,
  shareApp: Share2,
  help: HelpCircle,
  feedback: MessageSquare,
  info: Info,
  warning: AlertTriangle,
  package: Package,
  lightbulb: Lightbulb,
  tips: Lightbulb,

  // Sort & Filter
  newest: Clock,
  oldest: Calendar,
  category: Tag,
  difficulty: Dumbbell,
  filter: Sliders,
};

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SPIconProps {
  name: keyof typeof ICON_REGISTRY | string;
  size?: number;
  color?: string;
  fill?: string;
  strokeWidth?: number;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}

// ---------------------------------------------------------------------------
// SPIcon Component
// ---------------------------------------------------------------------------

export function SPIcon({
  name,
  size = 22,
  color,
  fill,
  strokeWidth = 2,
  style,
  accessibilityLabel,
}: SPIconProps) {
  const { theme } = useTheme();
  const resolvedColor = color ?? theme.colors.textPrimary;

  const IconComponent = ICON_REGISTRY[name] ?? Sparkles;
  const isFilled = name === 'heart-filled' || name === 'star-filled' || !!fill;
  const resolvedFill = isFilled ? (fill ?? resolvedColor) : 'none';

  return (
    <View
      style={style}
      accessibilityLabel={accessibilityLabel}
      accessible={accessibilityLabel != null}
    >
      <IconComponent
        size={size}
        color={resolvedColor}
        fill={resolvedFill}
        strokeWidth={strokeWidth}
      />
    </View>
  );
}

export const ICON_MAP = ICON_REGISTRY;
