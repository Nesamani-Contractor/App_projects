import { LookId } from '../data/looks';

export type ScanStackParamList = {
  ScanCamera: undefined;
  Analyzing: { photoUri?: string } | undefined;
  Results: { seasonId: string; praiseIndex: number; timestamp: string; score: number; photoUri?: string };
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
  PaywallModal: { source?: string } | undefined;
};

export type OnboardingStackParamList = {
  Welcome: undefined;
  Journey: undefined;
  CreatingProfile: { lookId: LookId };
  Paywall: { source: 'onboarding'; recommendedLookId?: LookId };
};
