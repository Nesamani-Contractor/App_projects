import { LookId } from '../data/looks';

export type ScanStackParamList = {
  ScanCamera: undefined;
  Analyzing: undefined;
  Results: { seasonId: string; praiseIndex: number; timestamp: string; score: number };
};

export type LooksStackParamList = {
  ChooseLook: { recommendedLookId?: LookId } | undefined;
  LookDetail: { lookId: LookId };
  MakeupMatch: undefined;
};

export type DashboardStackParamList = {
  Dashboard: undefined;
  ScanDetail: { recordId: string };
};

export type RootTabParamList = {
  ScanTab: undefined;
  LooksTab: undefined;
  DashboardTab: undefined;
};

export type MainStackParamList = {
  Tabs: undefined;
  Paywall: { source?: string } | undefined;
};

export type OnboardingStackParamList = {
  Welcome: undefined;
  GoalQuiz: undefined;
  StyleQuiz: { goalId: string };
  CreatingProfile: { goalId: string; styleId: string };
  Paywall: { source: 'onboarding'; recommendedLookId?: LookId };
};
