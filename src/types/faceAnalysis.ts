// Mirrors the response shape of POST /api/analyze on the face-analysis
// server (see server/src/routes/analyze.js). Keep the two in sync.

export type SkinConcernSeverity = 'low' | 'moderate' | 'high';

export type SkinConcern = {
  id: string;
  label: string;
  severity: SkinConcernSeverity;
  score: number;
  recommendation: string;
};

export type TouchUpTip = {
  id: string;
  area: string;
  issue: string;
  suggestion: string;
};

export type MakeupReview = {
  summary: string;
  overallScore: number;
  touchUps: TouchUpTip[];
};

export type SkinAnalysis = {
  overallScore: number;
  concerns: SkinConcern[];
};

export type CelebrityMatch = {
  name: string;
  similarity: number;
  imageUrl: string;
};

export type FaceAnalysisResult = {
  makeupReview: MakeupReview;
  skin: SkinAnalysis;
  celebrityMatches: CelebrityMatch[];
};
