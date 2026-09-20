import { LookId } from '../data/looks';

export type ScanStackParamList = {
  ScanCamera: undefined;
  Analyzing: undefined;
  Results: { seasonId: string; praiseIndex: number; timestamp: string; score: number };
};

export type LooksStackParamList = {
  ChooseLook: { recommendedLookId?: LookId } | undefined;
  LookDetail: { lookId: LookId };
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
