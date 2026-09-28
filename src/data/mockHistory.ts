import { COLOR_SEASONS } from './colorSeasons';
import { LOOKS, LookId, recommendLookForSeason } from './looks';
import { pickPraise } from './insights';
import { RealScanResult } from '../types/scan';

export type ScanRecord = {
  id: string;
  timestamp: string; // ISO
  seasonId: string;
  lookId: LookId;
  praise: string;
  score: number; // legacy "shine score", kept for the vault's stat aggregation only — never shown as a rating on a real scan's results
  photoUri?: string;
  realScan?: RealScanResult;
};

const REAL_SEASON_TO_LOCAL_ID: Record<RealScanResult['color']['season'], string> = {
  Spring: 'warm-spring',
  Summer: 'cool-summer',
  Autumn: 'deep-autumn',
  Winter: 'clear-winter',
};

export const buildScanRecordFromReal = (
  id: string,
  timestamp: string,
  scan: RealScanResult,
  photoUri?: string
): ScanRecord => {
  const seasonId = REAL_SEASON_TO_LOCAL_ID[scan.color.season] ?? 'warm-spring';
  const lookId = recommendLookForSeason(seasonId);
  return {
    id,
    timestamp,
    seasonId,
    lookId,
    praise: `${scan.face_shape.value} face, ${scan.color.season} coloring`,
    score: 90,
    photoUri,
    realScan: scan,
  };
};

const daysAgo = (n: number, hour = 9) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(hour, 30, 0, 0);
  return d.toISOString();
};

export const MOCK_HISTORY: ScanRecord[] = [
  {
    id: 'scan-1',
    timestamp: daysAgo(0, 8),
    seasonId: COLOR_SEASONS[3].id,
    lookId: 'full-glam',
    praise: pickPraise(4),
    score: 96,
  },
  {
    id: 'scan-2',
    timestamp: daysAgo(2, 19),
    seasonId: COLOR_SEASONS[0].id,
    lookId: 'natural-glam',
    praise: pickPraise(1),
    score: 92,
  },
  {
    id: 'scan-3',
    timestamp: daysAgo(5, 10),
    seasonId: COLOR_SEASONS[1].id,
    lookId: 'soft-girl',
    praise: pickPraise(0),
    score: 94,
  },
  {
    id: 'scan-4',
    timestamp: daysAgo(9, 21),
    seasonId: COLOR_SEASONS[2].id,
    lookId: 'latina-bestie',
    praise: pickPraise(3),
    score: 90,
  },
  {
    id: 'scan-5',
    timestamp: daysAgo(14, 14),
    seasonId: COLOR_SEASONS[3].id,
    lookId: 'sweet-spicy',
    praise: pickPraise(5),
    score: 93,
  },
  {
    id: 'scan-6',
    timestamp: daysAgo(21, 11),
    seasonId: COLOR_SEASONS[1].id,
    lookId: 'soft-grunge',
    praise: pickPraise(6),
    score: 88,
  },
];

export const getHistoryStats = (records: ScanRecord[] = MOCK_HISTORY) => {
  const totalScans = records.length;
  const avgScore = Math.round(
    records.reduce((sum, r) => sum + r.score, 0) / (totalScans || 1)
  );
  const favoriteLook = LOOKS.find(
    (l) =>
      l.id ===
      records.map((r) => r.lookId).sort(
        (a, b) =>
          records.filter((r) => r.lookId === b).length -
          records.filter((r) => r.lookId === a).length
      )[0]
  );
  return { totalScans, avgScore, favoriteLook };
};
