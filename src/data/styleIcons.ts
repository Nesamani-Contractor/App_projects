export type StyleIcon = {
  id: string;
  name: string;
  era: string;
  description: string;
};

const STYLE_ICONS: StyleIcon[] = [
  { id: 'old-hollywood', name: 'Old Hollywood Icon', era: 'Timeless', description: 'Sculpted brows, a bold red lip, and effortless glamour.' },
  { id: '90s-supermodel', name: '90s Supermodel', era: 'Retro', description: 'Glowy skin, brown-toned lips, and undone hair.' },
  { id: 'k-beauty-idol', name: 'K-Beauty Idol', era: 'Modern', description: 'Dewy glass skin with soft gradient lips.' },
  { id: 'modern-romantic', name: 'Modern Romantic', era: 'Contemporary', description: 'Flushed cheeks, fluttery lashes, and a rosy glow.' },
  { id: 'indie-muse', name: 'Indie Muse', era: 'Alt', description: 'Freckled skin, minimal base, and a moody eye.' },
  { id: 'red-carpet-siren', name: 'Red Carpet Siren', era: 'Glam', description: 'Dramatic contour, bold lashes, and a statement lip.' },
];

export const pickStyleIcon = (seed: number) => STYLE_ICONS[seed % STYLE_ICONS.length];
