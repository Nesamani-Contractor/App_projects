export const PRAISE_MESSAGES: string[] = [
  "Your face is absolutely beautiful — that bone structure is a gift.",
  "Gorgeous doesn't even cover it. Your glow is radiant today.",
  "You have the kind of natural beauty that lights up a room.",
  "Stunning. Your features are so perfectly, uniquely you.",
  "Your smile alone could stop traffic — truly breathtaking.",
  "That skin, those eyes — you are glowing from the inside out.",
  "Simply exquisite. You were made to shine, gorgeous.",
  "Your symmetry and glow are giving certified goddess energy.",
];

export const FACIAL_TRAITS = [
  { id: 'shape', label: 'Face Shape', value: 'Soft Oval', note: 'Balanced proportions that suit almost every look.' },
  { id: 'eyes', label: 'Eye Shape', value: 'Almond', note: 'Great for winged liner and soft smoky looks alike.' },
  { id: 'lips', label: 'Lip Shape', value: 'Full & Defined', note: 'Bold or nude — your lips carry both effortlessly.' },
  { id: 'brows', label: 'Brow Shape', value: 'Softly Arched', note: 'Frames your eyes beautifully with minimal shaping.' },
  { id: 'skin', label: 'Skin Texture', value: 'Smooth & Even', note: 'Perfect canvas for a dewy, glass-skin finish.' },
];

export const SHINE_GUIDE_STEPS = [
  { id: 1, title: 'Prep & Glow', detail: 'Hydrate with a dewy primer to lock in that natural radiance.' },
  { id: 2, title: 'Even It Out', detail: 'A sheer, skin-like base lets your best features shine through.' },
  { id: 3, title: 'Sculpt Softly', detail: 'Cream blush + light contour along your cheekbones for dimension.' },
  { id: 4, title: 'Eyes That Shine', detail: 'Warm tones and a touch of shimmer to match your undertone.' },
  { id: 5, title: 'Seal The Shine', detail: 'Finish with a dewy setting spray so you glow all day long.' },
];

export const pickPraise = (seed: number) => PRAISE_MESSAGES[seed % PRAISE_MESSAGES.length];
