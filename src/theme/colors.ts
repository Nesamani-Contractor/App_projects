export const colors = {
  // Core pinks
  blush: '#FFE4EC',
  petal: '#FFD1DE',
  rose: '#F7A8C4',
  roseDeep: '#E8799F',
  berry: '#C24A72',
  plum: '#5A2340',

  // Accent — matched from Glam Up's App Store screenshots (pixel-sampled):
  // gradient top #FC7295, gradient bottom #FFAFC3, button/accent #FB6F95
  gold: '#FB6F95',
  goldLight: '#FFAFC3',
  goldDeep: '#E5487A',

  // Onboarding / paywall accent (same Glam Up pink family)
  lavender: '#FFAFC3',
  lavenderDeep: '#F0527A',
  violetDeep: '#DB3C6B',

  // Neutrals
  ivory: '#FFFBF6',
  cream: '#FFF3E9',
  charcoal: '#3A2430',
  slate: '#7A6470',
  white: '#FFFFFF',
  black: '#000000',

  // Semantic
  success: '#7FB88A',
  overlay: 'rgba(58, 36, 48, 0.55)',
  overlaySoft: 'rgba(58, 36, 48, 0.28)',
  cardShadow: 'rgba(184, 106, 143, 0.25)',
};

export const gradients = {
  // Exact Glam Up marketing-screenshot gradient (top → bottom)
  heroBackground: ['#FC7295', '#FD8FAB', '#FFAFC3'] as const,
  goldButton: ['#FD8CA8', '#FB6F95', '#E5487A'] as const,
  goldButtonPressed: ['#FB6F95', '#E5487A', '#C93058'] as const,
  cardSheen: ['rgba(255,255,255,0.65)', 'rgba(255,255,255,0.15)'] as const,
  vaultHeader: ['#FD7C9E', '#FB6F95', '#E5487A'] as const,
  viewfinderGlow: ['rgba(251,111,149,0.9)', 'rgba(255,175,195,0.2)'] as const,
  softGirl: ['#FFE9F0', '#FFC9DE', '#F7A8C4'] as const,
  naturalGlam: ['#FFF3E1', '#F6D9A8', '#D9A94E'] as const,
  softGrunge: ['#E3D3E8', '#B79BC4', '#6E4C7A'] as const,
  latinaBestie: ['#FFD6A5', '#F2745A', '#B8324B'] as const,
  fullGlam: ['#3A2440', '#7A2E52', '#C24A72'] as const,
  sweetSpicy: ['#FFCB77', '#FF8FA3', '#C4467A'] as const,
  chooseForMe: ['#FC7295', '#FB6F95', '#FFAFC3'] as const,
  glamUpOnboarding: ['#FC7295', '#FD8FAB', '#FFAFC3'] as const,
  glamUpPaywall: ['#E5487A', '#FB6F95', '#FD8FAB'] as const,

  // Dynamic multi-stop "signature" gradient + mesh-blob accents for the landing screen
  heroSignature: ['#5C1B54', '#C93058', '#FB6F95', '#FF9770'] as const,
  titleGradient: ['#FFE8A3', '#FFAFC3', '#FFFFFF'] as const,
  blobGold: ['rgba(255,201,119,0.9)', 'rgba(255,201,119,0)'] as const,
  blobViolet: ['rgba(199,109,214,0.8)', 'rgba(199,109,214,0)'] as const,
  blobPink: ['rgba(255,143,171,0.85)', 'rgba(255,143,171,0)'] as const,
  iconBadge: ['#FFE8A3', '#FB6F95'] as const,
};

export const typography = {
  display: 'PlayfairDisplay_700Bold',
  displayItalic: 'PlayfairDisplay_600SemiBold_Italic',
  heading: 'PlayfairDisplay_600SemiBold',
  body: 'Poppins_400Regular',
  bodyMedium: 'Poppins_500Medium',
  bodySemiBold: 'Poppins_600SemiBold',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  tabBarClearance: 120,
};

export const radii = {
  sm: 10,
  md: 16,
  lg: 24,
  xl: 32,
  pill: 999,
};
