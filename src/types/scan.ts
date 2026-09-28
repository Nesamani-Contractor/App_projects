// Mirrors server/src/schema.js (Call 1's forced tool-call schema).
export type ScanImageQuality = { usable: boolean; issues: string[] };

export type FaceShapeValue = 'Oval' | 'Round' | 'Square' | 'Heart' | 'Diamond' | 'Oblong' | 'Triangle';

export type SkinObservation = {
  area: 't_zone' | 'cheeks' | 'under_eye' | 'forehead' | 'chin';
  concern: 'shine' | 'dryness' | 'redness' | 'uneven_tone' | 'texture' | 'dark_circles' | 'puffiness' | 'fine_lines' | 'blemishes';
  level: 'mild' | 'moderate' | 'noticeable';
};

export type RealScanResult = {
  image_quality: ScanImageQuality;
  face_shape: { value: FaceShapeValue; confidence: 'high' | 'medium' | 'low' };
  features: {
    eye_shape: string;
    brow_shape: string;
    lip_shape: string;
    nose: string;
    cheekbones: string;
    jawline: string;
  };
  color: {
    undertone: 'Warm' | 'Cool' | 'Neutral' | 'Olive';
    depth: 'Light' | 'Medium' | 'Tan' | 'Deep';
    contrast: 'Low' | 'Medium' | 'High';
    season: 'Spring' | 'Summer' | 'Autumn' | 'Winter';
    sub_season: string;
    best_colors_hex: string[];
    avoid_colors_hex: string[];
    best_metals: 'Gold' | 'Silver' | 'Rose_Gold' | 'Both';
    confidence: 'high' | 'medium' | 'low';
  };
  skin: {
    apparent_type: 'Oily' | 'Dry' | 'Combination' | 'Normal' | 'Unclear';
    observations: SkinObservation[];
    strengths: string[];
  };
  hair: { color: string; visible_length: 'Short' | 'Medium' | 'Long' | 'Not_Visible' };
};

export type StarterPlanDay = { day: number; title: string; action: string; minutes: number };
