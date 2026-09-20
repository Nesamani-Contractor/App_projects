import { LookId } from './looks';

export type QuizOption = {
  id: string;
  label: string;
  icon: 'sunny-outline' | 'moon-outline' | 'flower-outline' | 'flame-outline';
  mapsToLook?: LookId;
};

export const GOAL_OPTIONS: QuizOption[] = [
  { id: 'everyday', label: 'Everyday Natural', icon: 'sunny-outline' },
  { id: 'night-out', label: 'Glam Night Out', icon: 'moon-outline' },
  { id: 'find-colors', label: 'Find My Colors', icon: 'flower-outline' },
  { id: 'confidence', label: 'Boost My Confidence', icon: 'flame-outline' },
];

export const STYLE_OPTIONS: QuizOption[] = [
  { id: 'soft-romantic', label: 'Soft & Romantic', icon: 'flower-outline', mapsToLook: 'soft-girl' },
  { id: 'bold-glam', label: 'Bold & Glam', icon: 'moon-outline', mapsToLook: 'full-glam' },
  { id: 'edgy', label: 'Edgy & Alternative', icon: 'flame-outline', mapsToLook: 'soft-grunge' },
  { id: 'sunkissed', label: 'Sun-Kissed & Fun', icon: 'sunny-outline', mapsToLook: 'natural-glam' },
];
