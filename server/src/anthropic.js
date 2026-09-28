import Anthropic from '@anthropic-ai/sdk';
import { scanToolSchema } from './schema.js';
import { SCAN_SYSTEM_PROMPT, buildGuideSystemPrompt } from './prompts.js';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SCAN_MODEL = process.env.SCAN_MODEL || 'claude-haiku-4-5-20251001';
const GUIDE_MODEL = process.env.GUIDE_MODEL || 'claude-sonnet-5';

// Call 1 — the scan. Vision + forced tool call, so the response is always
// structured JSON matching the schema (never free-form prose to parse).
export const runScan = async ({ imageBase64, mediaType }) => {
  const message = await client.messages.create({
    model: SCAN_MODEL,
    max_tokens: 1200,
    temperature: 0,
    system: SCAN_SYSTEM_PROMPT,
    tools: [scanToolSchema],
    tool_choice: { type: 'tool', name: 'record_scan' },
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'base64', media_type: mediaType, data: imageBase64 },
          },
          {
            type: 'text',
            text: 'Analyze this selfie and call record_scan with your findings.',
          },
        ],
      },
    ],
  });

  const toolUse = message.content.find((block) => block.type === 'tool_use');
  if (!toolUse) {
    throw new Error('Model did not return a tool call');
  }
  return { result: toolUse.input, rawModel: SCAN_MODEL };
};

// Call 2 — the glow-up guide. Text-only (never sees the photo), streamed.
export const streamGuide = async ({ scan, profile, previousScan }, onDelta) => {
  const userContent = JSON.stringify(
    {
      scan,
      profile: profile ?? null,
      previous_scan_delta: previousScan
        ? { previous: previousScan.scan, scanned_at: previousScan.createdAt }
        : null,
    },
    null,
    2
  );

  const stream = client.messages.stream({
    model: GUIDE_MODEL,
    max_tokens: 2000,
    temperature: 0.6,
    system: buildGuideSystemPrompt(),
    messages: [
      {
        role: 'user',
        content: `Here is the user's scan result and onboarding profile as JSON:\n\n${userContent}\n\nWrite their personalized glow-up guide.`,
      },
    ],
  });

  stream.on('text', (delta) => onDelta(delta));
  const finalMessage = await stream.finalMessage();
  return finalMessage.content.map((b) => (b.type === 'text' ? b.text : '')).join('');
};
