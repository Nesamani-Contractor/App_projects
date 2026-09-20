export type ColorSeason = {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  palette: string[];
  metalTone: 'Gold' | 'Silver' | 'Rose Gold';
};

export const COLOR_SEASONS: ColorSeason[] = [
  {
    id: 'warm-spring',
    name: 'Warm Spring',
    subtitle: 'Bright, warm & clear',
    description: 'Your undertone glows with warmth. Fresh corals, warm peach, and golden hues make your complexion light up.',
    palette: ['#FFB37B', '#FF8C69', '#F4C978', '#7FBF8E', '#F2E394'],
    metalTone: 'Gold',
  },
  {
    id: 'cool-summer',
    name: 'Cool Summer',
    subtitle: 'Soft, cool & muted',
    description: 'Your coloring is soft and cool. Dusty rose, lavender, and powder blue flatter your delicate undertone.',
    palette: ['#C9B7D4', '#9FB8CE', '#E3A9BE', '#B4C7B0', '#D8CFE0'],
    metalTone: 'Silver',
  },
  {
    id: 'deep-autumn',
    name: 'Deep Autumn',
    subtitle: 'Rich, warm & deep',
    description: 'You carry rich, earthy warmth beautifully. Terracotta, olive, and deep amber bring out your natural richness.',
    palette: ['#A9542E', '#C97A3A', '#7A6B3A', '#8C3B2E', '#D9A94E'],
    metalTone: 'Gold',
  },
  {
    id: 'clear-winter',
    name: 'Clear Winter',
    subtitle: 'Bold, cool & vivid',
    description: 'Your contrast is striking. Fuchsia, icy pink, and jewel tones make your features pop with clarity.',
    palette: ['#C24A72', '#5A2340', '#3E7CB1', '#E8799F', '#1E1B2E'],
    metalTone: 'Rose Gold',
  },
];

export const pickSeasonForSeed = (seed: number) => COLOR_SEASONS[seed % COLOR_SEASONS.length];
