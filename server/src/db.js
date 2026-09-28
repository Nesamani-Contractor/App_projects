import Database from 'better-sqlite3';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, '..', 'data');
fs.mkdirSync(dataDir, { recursive: true });

export const db = new Database(path.join(dataDir, 'shine-me.sqlite'));

db.exec(`
  CREATE TABLE IF NOT EXISTS scans (
    id TEXT PRIMARY KEY,
    created_at TEXT NOT NULL,
    profile_json TEXT,
    scan_json TEXT NOT NULL,
    model TEXT NOT NULL,
    guide_markdown TEXT
  );
`);

export const insertScan = ({ id, profile, scan, model }) => {
  db.prepare(
    `INSERT INTO scans (id, created_at, profile_json, scan_json, model) VALUES (?, ?, ?, ?, ?)`
  ).run(id, new Date().toISOString(), JSON.stringify(profile ?? null), JSON.stringify(scan), model);
};

export const getScan = (id) => {
  const row = db.prepare(`SELECT * FROM scans WHERE id = ?`).get(id);
  if (!row) return undefined;
  return {
    id: row.id,
    createdAt: row.created_at,
    profile: row.profile_json ? JSON.parse(row.profile_json) : undefined,
    scan: JSON.parse(row.scan_json),
    model: row.model,
    guideMarkdown: row.guide_markdown ?? undefined,
  };
};

export const saveGuideMarkdown = (id, markdown) => {
  db.prepare(`UPDATE scans SET guide_markdown = ? WHERE id = ?`).run(markdown, id);
};

export const getPreviousScanForProfile = (currentId, profile) => {
  if (!profile) return undefined;
  const rows = db
    .prepare(`SELECT * FROM scans WHERE id != ? ORDER BY created_at DESC LIMIT 5`)
    .all(currentId);
  const match = rows.find((r) => r.profile_json === JSON.stringify(profile));
  if (!match) return undefined;
  return { scan: JSON.parse(match.scan_json), createdAt: match.created_at };
};
