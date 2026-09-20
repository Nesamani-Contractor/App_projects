export type ProductRec = {
  id: string;
  category: string;
  shadeName: string;
  icon: 'water-outline' | 'color-fill-outline' | 'flame-outline' | 'brush-outline' | 'contrast-outline';
  note: string;
};

const PRODUCTS_BY_SEASON: Record<string, ProductRec[]> = {
  'warm-spring': [
    { id: 'p1', category: 'Blush', shadeName: 'Coral Glow', icon: 'flame-outline', note: 'Warms up the cheeks without looking muddy.' },
    { id: 'p2', category: 'Lipstick', shadeName: 'Peach Nude', icon: 'color-fill-outline', note: 'A warm nude that matches your undertone.' },
    { id: 'p3', category: 'Highlighter', shadeName: 'Golden Champagne', icon: 'water-outline', note: 'Gives your skin a sun-kissed shimmer.' },
  ],
  'cool-summer': [
    { id: 'p4', category: 'Blush', shadeName: 'Dusty Rose', icon: 'flame-outline', note: 'Soft and cool, never too intense.' },
    { id: 'p5', category: 'Lipstick', shadeName: 'Mauve Pink', icon: 'color-fill-outline', note: 'Cool-toned pink that flatters your complexion.' },
    { id: 'p6', category: 'Eyeshadow', shadeName: 'Lavender Mist', icon: 'brush-outline', note: 'A cool shimmer that brightens your eyes.' },
  ],
  'deep-autumn': [
    { id: 'p7', category: 'Blush', shadeName: 'Terracotta', icon: 'flame-outline', note: 'Rich warmth that suits deeper undertones.' },
    { id: 'p8', category: 'Lipstick', shadeName: 'Brick Red', icon: 'color-fill-outline', note: 'A bold, earthy red made for you.' },
    { id: 'p9', category: 'Bronzer', shadeName: 'Amber Glow', icon: 'contrast-outline', note: 'Deepens dimension with warmth.' },
  ],
  'clear-winter': [
    { id: 'p10', category: 'Blush', shadeName: 'Fuchsia Pop', icon: 'flame-outline', note: 'A vivid pop that matches your contrast.' },
    { id: 'p11', category: 'Lipstick', shadeName: 'Blue Red', icon: 'color-fill-outline', note: 'Cool, saturated red for maximum impact.' },
    { id: 'p12', category: 'Eyeliner', shadeName: 'Jet Black', icon: 'brush-outline', note: 'Crisp definition that suits your clarity.' },
  ],
};

export const getProductRecs = (seasonId: string): ProductRec[] =>
  PRODUCTS_BY_SEASON[seasonId] ?? PRODUCTS_BY_SEASON['warm-spring'];
