/**
 * Perfect Corp YouCam AI API adapter (skin analysis + makeup/touch-up
 * recommendations).
 *
 * VERIFY BEFORE RELYING ON THIS: this sandbox's network egress blocked
 * docs.perfectcorp.com and yce.perfectcorp.com, so the auth handshake and
 * endpoint paths below were written from documentation summaries, not a
 * live-tested session. Everything uncertain is isolated in the constants
 * and the three functions below (getAccessToken, uploadImage, runTask) so
 * it's a small, contained fix if a path/field name is off. Confirm against
 * https://yce.perfectcorp.com/ai-api (Quick Start + API reference) once you
 * have console access, in particular:
 *   - the exact auth endpoint path and whether id_token is RSA-encrypted
 *     with a key you generate, or supplied directly as client_secret
 *   - the exact feature endpoint names for skin analysis vs. makeup/style
 *   - the exact result JSON field names (mapped in normalizeSkinResult /
 *     normalizeMakeupResult below)
 */
const crypto = require('crypto');
const config = require('../../config');

let cachedToken = null; // { accessToken, expiresAt }

function buildIdToken(clientId, clientSecret) {
  // Perfect Corp's S2S auth signs a short-lived payload with your secret.
  // If your console gives you an RSA private key instead of a plain
  // secret, swap this for crypto.privateEncrypt with that key.
  const payload = JSON.stringify({ client_id: clientId, timestamp: Date.now() });
  const hmac = crypto.createHmac('sha256', clientSecret).update(payload).digest('base64');
  return Buffer.from(JSON.stringify({ payload, signature: hmac })).toString('base64');
}

async function getAccessToken() {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 5000) {
    return cachedToken.accessToken;
  }

  const { clientId, clientSecret, apiBase } = config.perfectCorp;
  const res = await fetch(`${apiBase}/s2s/v1.0/client/auth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: clientId,
      id_token: buildIdToken(clientId, clientSecret),
    }),
  });

  if (!res.ok) {
    throw new Error(`Perfect Corp auth failed: ${res.status} ${await res.text()}`);
  }

  const data = await res.json();
  cachedToken = {
    accessToken: data.result?.access_token || data.access_token,
    // Fall back to a short TTL if the response doesn't say how long the token lasts.
    expiresAt: Date.now() + (data.result?.expires_in ? data.result.expires_in * 1000 : 5 * 60 * 1000),
  };
  return cachedToken.accessToken;
}

async function uploadImage(feature, imageBuffer, accessToken) {
  const { apiBase } = config.perfectCorp;

  const fileRes = await fetch(`${apiBase}/s2s/v1.0/file/${feature}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ files: [{ content_type: 'image/jpeg', file_name: 'scan.jpg' }] }),
  });
  if (!fileRes.ok) {
    throw new Error(`Perfect Corp file request failed (${feature}): ${fileRes.status} ${await fileRes.text()}`);
  }
  const fileData = await fileRes.json();
  const fileEntry = fileData.result?.files?.[0] || fileData.result;
  const { file_id: fileId, url: uploadUrl } = fileEntry;

  const putRes = await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': 'image/jpeg' },
    body: imageBuffer,
  });
  if (!putRes.ok) {
    throw new Error(`Perfect Corp image upload failed: ${putRes.status}`);
  }

  return fileId;
}

async function runTask(feature, fileId, accessToken) {
  const { apiBase } = config.perfectCorp;

  const taskRes = await fetch(`${apiBase}/s2s/v1.0/task/${feature}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ request_id: crypto.randomUUID(), payload: { src_ids: [fileId] } }),
  });
  if (!taskRes.ok) {
    throw new Error(`Perfect Corp task submit failed (${feature}): ${taskRes.status} ${await taskRes.text()}`);
  }
  const taskData = await taskRes.json();
  const taskId = taskData.result?.task_id;

  const deadline = Date.now() + 20000;
  while (Date.now() < deadline) {
    const statusRes = await fetch(`${apiBase}/s2s/v1.0/task/${feature}/${taskId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const statusData = await statusRes.json();
    const status = statusData.result?.status;
    if (status === 'success') return statusData.result;
    if (status === 'error') throw new Error(`Perfect Corp task failed (${feature}): ${JSON.stringify(statusData.result)}`);
    await new Promise((r) => setTimeout(r, 1000));
  }
  throw new Error(`Perfect Corp task timed out (${feature})`);
}

function severityFromScore(score) {
  if (score >= 80) return 'low';
  if (score >= 60) return 'moderate';
  return 'high';
}

// Maps YouCam's skin-analysis concern scores to our normalized shape. Field
// names (e.g. `result.skin_analysis.acne.score`) need to be confirmed
// against a real response payload.
function normalizeSkinResult(raw) {
  const concernDefs = [
    { key: 'hydration', label: 'Hydration' },
    { key: 'dark_circle', label: 'Dark Circles' },
    { key: 'texture', label: 'Texture' },
    { key: 'oiliness', label: 'Oiliness' },
    { key: 'acne', label: 'Acne' },
    { key: 'wrinkle', label: 'Wrinkles' },
    { key: 'spot', label: 'Spots' },
  ];

  const concerns = concernDefs
    .map((def) => {
      const entry = raw?.skin_analysis?.[def.key];
      if (!entry || typeof entry.score !== 'number') return null;
      return {
        id: `concern-${def.key}`,
        label: def.label,
        severity: severityFromScore(entry.score),
        score: Math.round(entry.score),
        recommendation: entry.recommendation || `Keep an eye on ${def.label.toLowerCase()} and adjust your routine accordingly.`,
      };
    })
    .filter(Boolean);

  const overallScore = concerns.length
    ? Math.round(concerns.reduce((sum, c) => sum + c.score, 0) / concerns.length)
    : 0;

  return { overallScore, concerns };
}

function normalizeMakeupResult(raw) {
  const touchUps = (raw?.makeup_analysis?.touch_up_suggestions || []).map((t, i) => ({
    id: `touchup-${i}`,
    area: t.area,
    issue: t.issue,
    suggestion: t.suggestion,
  }));

  return {
    summary: raw?.makeup_analysis?.summary || 'Your makeup analysis is ready.',
    overallScore: Math.round(raw?.makeup_analysis?.overall_score ?? 0),
    touchUps,
  };
}

async function analyzeSkinAndMakeup(imageBuffer) {
  const accessToken = await getAccessToken();

  const skinFileId = await uploadImage('skin-analysis', imageBuffer, accessToken);
  const skinRaw = await runTask('skin-analysis', skinFileId, accessToken);

  const makeupFileId = await uploadImage('makeup-analysis', imageBuffer, accessToken);
  const makeupRaw = await runTask('makeup-analysis', makeupFileId, accessToken);

  return {
    skin: normalizeSkinResult(skinRaw),
    makeupReview: normalizeMakeupResult(makeupRaw),
  };
}

module.exports = { analyzeSkinAndMakeup };
