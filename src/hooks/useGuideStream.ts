import { useEffect, useRef, useState } from 'react';
import { API_BASE_URL } from '../config/api';
import { StarterPlanDay } from '../types/scan';

type GuideSection = { heading: string; body: string };

const SECTION_ORDER = [
  'Your Glow Summary',
  'Your Colors',
  'Hair & Brows',
  'Makeup',
  'Skincare Routine',
  'Face Exercises',
  'Lifestyle Boosts',
  'Your 7-Day Starter Plan',
];

export const parseGuideMarkdown = (markdown: string): { sections: GuideSection[]; starterPlan: StarterPlanDay[] } => {
  const jsonFenceMatch = markdown.match(/```json\s*([\s\S]*?)```/);
  let starterPlan: StarterPlanDay[] = [];
  if (jsonFenceMatch) {
    try {
      const parsed = JSON.parse(jsonFenceMatch[1]);
      if (Array.isArray(parsed.starter_plan)) starterPlan = parsed.starter_plan;
    } catch {}
  }

  const body = jsonFenceMatch ? markdown.slice(0, jsonFenceMatch.index).trim() : markdown;
  const lines = body.split('\n');
  const sections: GuideSection[] = [];
  let current: GuideSection | null = null;

  for (const line of lines) {
    const headingMatch = line.match(/^##\s+(.*)$/);
    if (headingMatch) {
      if (current) sections.push(current);
      current = { heading: headingMatch[1].trim(), body: '' };
    } else if (current) {
      current.body += (current.body ? '\n' : '') + line;
    }
  }
  if (current) sections.push(current);

  sections.sort((a, b) => {
    const ai = SECTION_ORDER.indexOf(a.heading);
    const bi = SECTION_ORDER.indexOf(b.heading);
    return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
  });

  return { sections, starterPlan };
};

export const useGuideStream = (scanId: string | undefined) => {
  const [rawText, setRawText] = useState('');
  const [streaming, setStreaming] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);
  const startedFor = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (!scanId || startedFor.current === scanId) return;
    startedFor.current = scanId;
    setRawText('');
    setStreaming(true);
    setError(undefined);

    const url = `${API_BASE_URL}/api/guide/${scanId}`;

    if (typeof EventSource !== 'undefined') {
      const source = new EventSource(url);
      source.addEventListener('delta', (event: any) => {
        try {
          const { text } = JSON.parse(event.data);
          setRawText((prev) => prev + text);
        } catch {}
      });
      source.addEventListener('done', () => {
        setStreaming(false);
        source.close();
      });
      source.addEventListener('error', () => {
        setStreaming(false);
        setError('The guide had trouble streaming. Pull to refresh to try again.');
        source.close();
      });
      return () => source.close();
    }

    // Fallback for platforms without EventSource (e.g. native without a
    // polyfill): fetch the whole SSE body and parse it as one chunk.
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(url);
        const text = await res.text();
        if (cancelled) return;
        const deltas = [...text.matchAll(/event: delta\ndata: (.*)\n/g)].map((m) => {
          try {
            return JSON.parse(m[1]).text as string;
          } catch {
            return '';
          }
        });
        setRawText(deltas.join(''));
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? 'Could not load the guide.');
      } finally {
        if (!cancelled) setStreaming(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [scanId]);

  const { sections, starterPlan } = parseGuideMarkdown(rawText);
  return { sections, starterPlan, streaming, error, rawText };
};
