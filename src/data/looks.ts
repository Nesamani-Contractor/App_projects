import { gradients } from '../theme/colors';

export type LookId =
  | 'soft-girl'
  | 'natural-glam'
  | 'soft-grunge'
  | 'latina-bestie'
  | 'full-glam'
  | 'sweet-spicy'
  | 'choose-for-me';

export type LookOption = {
  id: LookId;
  title: string;
  tagline: string;
  description: string;
  icon: 'flower-outline' | 'sunny-outline' | 'skull-outline' | 'flame-outline' | 'diamond-outline' | 'sparkles-outline' | 'shuffle-outline';
  gradient: readonly string[];
  vibeWords: string[];
};

export const LOOKS: LookOption[] = [
  {
    id: 'soft-girl',
    title: 'Soft Girl',
    tagline: 'Delicate & dreamy',
    description: 'A delicate, dreamy look with gentle sweetness — dewy skin, blushed cheeks, and soft rosy tones.',
    icon: 'flower-outline',
    gradient: gradients.softGirl,
    vibeWords: ['Dreamy', 'Gentle', 'Sweet'],
  },
  {
    id: 'natural-glam',
    title: 'Natural Glam',
    tagline: 'Glowing & effortless',
    description: 'A glowing, effortless look that highlights your natural beauty with warm, radiant skin.',
    icon: 'sunny-outline',
    gradient: gradients.naturalGlam,
    vibeWords: ['Glowing', 'Effortless', 'Radiant'],
  },
  {
    id: 'soft-grunge',
    title: 'Soft Grunge',
    tagline: 'Edgy with a soft touch',
    description: 'An edgy, rebellious look with a soft touch — smoky eyes balanced with muted, moody tones.',
    icon: 'skull-outline',
    gradient: gradients.softGrunge,
    vibeWords: ['Edgy', 'Moody', 'Rebellious'],
  },
  {
    id: 'latina-bestie',
    title: 'Latina Bestie',
    tagline: 'Spicy, fierce, confident',
    description: 'A bold look that screams spicy, fierce, and confidence — sun-kissed glow with a fiery pop of color.',
    icon: 'flame-outline',
    gradient: gradients.latinaBestie,
    vibeWords: ['Spicy', 'Fierce', 'Confident'],
  },
  {
    id: 'full-glam',
    title: 'Full Glam',
    tagline: 'Bold & dramatic',
    description: 'A dramatic, all-out look with bold, attention-grabbing makeup fit for the spotlight.',
    icon: 'diamond-outline',
    gradient: gradients.fullGlam,
    vibeWords: ['Dramatic', 'Bold', 'Show-stopping'],
  },
  {
    id: 'sweet-spicy',
    title: 'Sweet & Spicy',
    tagline: 'Playful & charming',
    description: 'A playful and charming look with vibrant touches — sweet at first glance with a spicy little kick.',
    icon: 'sparkles-outline',
    gradient: gradients.sweetSpicy,
    vibeWords: ['Playful', 'Vibrant', 'Charming'],
  },
  {
    id: 'choose-for-me',
    title: 'Choose For Me',
    tagline: 'Let Shine Me decide',
    description: "Let's choose based on your picture — your Shine Me AI Assistant will pick the look that matches your features and coloring best.",
    icon: 'shuffle-outline',
    gradient: gradients.chooseForMe,
    vibeWords: ['Curated', 'Personal', 'Surprise'],
  },
];

export const getLookById = (id: LookId | string | undefined) =>
  LOOKS.find((look) => look.id === id);

const SEASON_TO_LOOK: Record<string, LookId> = {
  'warm-spring': 'natural-glam',
  'cool-summer': 'soft-girl',
  'deep-autumn': 'latina-bestie',
  'clear-winter': 'full-glam',
};

export const recommendLookForSeason = (seasonId: string): LookId =>
  SEASON_TO_LOOK[seasonId] ?? 'natural-glam';
