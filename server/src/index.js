import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import crypto from 'node:crypto';
import Ajv from 'ajv';
import { runScan, streamGuide } from './anthropic.js';
import { scanToolSchema } from './schema.js';
import { insertScan, getScan, saveGuideMarkdown, getPreviousScanForProfile } from './db.js';

if (!process.env.ANTHROPIC_API_KEY) {
  console.warn(
    '\n[shine-me-server] ANTHROPIC_API_KEY is not set. /api/scan and /api/guide will fail until it is added to server/.env.\n'
  );
}

const ajv = new Ajv({ allErrors: true });
const validateScan = ajv.compile(scanToolSchema.input_schema);

const app = express();
app.use(cors());
app.use(express.json({ limit: '8mb' }));

app.get('/api/health', (req, res) => {
  res.json({ ok: true, hasApiKey: Boolean(process.env.ANTHROPIC_API_KEY) });
});

// SC-2 / SC-3 / SC-4: call the scan model, validate against the schema,
// retry once on invalid JSON, reject unusable images.
app.post('/api/scan', async (req, res) => {
  const { imageBase64, mediaType, profile } = req.body ?? {};
  if (!imageBase64 || typeof imageBase64 !== 'string') {
    return res.status(400).json({ error: 'imageBase64 is required' });
  }

  const attempt = async () => {
    const { result, rawModel } = await runScan({
      imageBase64,
      mediaType: mediaType || 'image/jpeg',
    });
    if (!validateScan(result)) {
      throw new Error('Schema validation failed: ' + ajv.errorsText(validateScan.errors));
    }
    return { result, rawModel };
  };

  let outcome;
  try {
    outcome = await attempt();
  } catch (firstErr) {
    console.warn('[scan] first attempt failed, retrying once:', firstErr.message);
    try {
      outcome = await attempt();
    } catch (secondErr) {
      console.error('[scan] second attempt failed:', secondErr.message);
      return res.status(422).json({
        error: 'retake_needed',
        message: "We couldn't get a clean read on that photo. Please retake it in even lighting, facing the camera directly.",
      });
    }
  }

  const { result, rawModel } = outcome;

  if (result.image_quality?.usable === false) {
    return res.status(422).json({
      error: 'retake_needed',
      message: 'That photo was hard to read (' + (result.image_quality.issues || []).join(', ') + '). Please retake it in even, natural lighting.',
      scan: result,
    });
  }

  const scanId = crypto.randomUUID();
  insertScan({ id: scanId, profile, scan: result, model: rawModel });

  res.json({ scanId, scan: result });
});

// GG-2: stream the personalized guide as server-sent events.
app.get('/api/guide/:scanId', async (req, res) => {
  const stored = getScan(req.params.scanId);
  if (!stored) {
    return res.status(404).json({ error: 'scan not found' });
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  const previousScan = getPreviousScanForProfile(stored.id, stored.profile);

  try {
    const fullText = await streamGuide(
      { scan: stored.scan, profile: stored.profile, previousScan },
      (delta) => {
        res.write(`event: delta\ndata: ${JSON.stringify({ text: delta })}\n\n`);
      }
    );
    saveGuideMarkdown(stored.id, fullText);
    res.write(`event: done\ndata: ${JSON.stringify({ fullText })}\n\n`);
  } catch (err) {
    console.error('[guide] streaming failed:', err.message);
    res.write(`event: error\ndata: ${JSON.stringify({ message: err.message })}\n\n`);
  } finally {
    res.end();
  }
});

app.get('/api/scan/:scanId', (req, res) => {
  const stored = getScan(req.params.scanId);
  if (!stored) return res.status(404).json({ error: 'scan not found' });
  res.json(stored);
});

const PORT = Number(process.env.PORT) || 4000;
app.listen(PORT, () => {
  console.log(`[shine-me-server] listening on http://localhost:${PORT}`);
});
