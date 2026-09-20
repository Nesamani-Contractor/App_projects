export const PREMIUM_FEATURES: { icon: string; label: string }[] = [
  { icon: 'infinite-outline', label: 'Unlimited face & color scans' },
  { icon: 'sparkles-outline', label: 'Full Shine Me Guide & routines' },
  { icon: 'people-outline', label: 'Style Icon Match' },
  { icon: 'pricetag-outline', label: 'Personalized product recommendations' },
  { icon: 'image-outline', label: 'Makeup Match from any photo' },
  { icon: 'color-wand-outline', label: 'All 7 shining looks unlocked' },
];

export type PricingPlan = {
  id: string;
  label: string;
  price: string;
  period: string;
  badge?: string;
};

export const PRICING_PLANS: PricingPlan[] = [
  { id: 'weekly', label: 'Weekly', price: '$6.99', period: '/week' },
  { id: 'yearly', label: 'Yearly', price: '$39.99', period: '/year', badge: 'Best Value' },
];
