import { nim, NIM_MODELS } from './nvidia-client';
import type { FeedbackResult } from './feedback-schema';
import { parseFeedback } from './feedback-schema';

export interface AnalyzeInput {
  transcript: string;
  scenarioName: string;
  scenarioPrompt: string;
  durationSeconds: number;
  wordCount: number;
}

const SYSTEM_PROMPT = `You are an expert speech and communication coach. Analyze the provided speech transcript and return a JSON object with detailed, actionable feedback. You MUST return valid JSON only — no prose before or after.

CRITICAL INSTRUCTIONS:
1. Chain of Thought: You MUST always start your response with a "reasoning" string where you analyze the transcript step-by-step, citing specific quotes or patterns to justify your upcoming scores.
2. Assessment Rubrics:
   - 90-100 (Expert): Seamless execution, natural pacing, advanced vocabulary, no structural flaws.
   - 75-89 (Proficient): Strong performance, but with occasional filler words, slight hesitations, or minor grammatical slips.
   - 50-74 (Developing): Message is conveyed, but distracted by frequent pauses, repetitive vocabulary, or weak structure.
   - 0-49 (Beginner): Fundamental struggles with coherence, pacing, or clarity making it hard to follow.
3. Rationale Disclosure: I will be parsing this JSON programmatically using a strict schema. Adhere strictly to the requested JSON format and constrain your values to the exact enums and ranges requested.`;

function buildUserPrompt(input: AnalyzeInput): string {
  const wpm = input.durationSeconds > 0
    ? Math.round((input.wordCount / input.durationSeconds) * 60)
    : 0;

  return `SCENARIO: ${input.scenarioName}
PROMPT GIVEN: ${input.scenarioPrompt}
DURATION: ${input.durationSeconds} seconds
WORD COUNT: ${input.wordCount}
CALCULATED WPM: ${wpm}

TRANSCRIPT:
"""
${input.transcript}
"""

Return ONLY this JSON structure (no markdown code fences, no extra text):

{
  "reasoning": "<Step-by-step analysis and justification using quotes from the transcript>",
  "pace": {
    "wpm": <number>,
    "assessment": <"too_slow"|"slow"|"ideal"|"fast"|"too_fast">,
    "score": <0-100>,
    "advice": "<1-2 sentence coaching tip>"
  },
  "filler_words": {
    "total_count": <number>,
    "percentage": <0-100, percentage of total words>,
    "score": <0-100, higher = fewer fillers>,
    "fillers": [{ "word": "<word>", "count": <number> }],
    "advice": "<1-2 sentence coaching tip>"
  },
  "grammar": {
    "score": <0-100>,
    "issues": [{ "original": "<phrase>", "correction": "<fixed>", "rule": "<grammar rule>" }],
    "advice": "<1-2 sentence coaching tip>"
  },
  "pronunciation": {
    "score": <0-100>,
    "flags": [{ "word": "<word>", "phoneticBreakdown": "<e.g. 'bet-er'>", "issue": "<issue description>", "suggestion": "<how to fix>" }],
    "advice": "<1-2 sentence coaching tip>"
  },
  "vocabulary": {
    "level": <"basic"|"intermediate"|"advanced"|"expert">,
    "score": <0-100>,
    "suggestions": ["<word/phrase to add or replace>"],
    "advice": "<1-2 sentence coaching tip>"
  },
  "structure": {
    "score": <0-100>,
    "coherence": <0-100>,
    "has_opening": <boolean>,
    "has_conclusion": <boolean>,
    "advice": "<1-2 sentence coaching tip>"
  },
  "overall": {
    "score": <0-100, weighted average>,
    "label": <"beginner"|"developing"|"proficient"|"expert">,
    "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
    "improvements": ["<improvement 1>", "<improvement 2>", "<improvement 3>"],
    "summary": "<2-3 sentence overall summary>"
  }
}`;
}

export async function analyzeSpeech(input: AnalyzeInput): Promise<FeedbackResult> {
  const response = await nim.chat.completions.create({
    model: NIM_MODELS.ANALYZE,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user',   content: buildUserPrompt(input) },
    ],
    temperature: 0.2,
    max_tokens: 2048,
    response_format: { type: 'json_object' },
  });

  const content = response.choices[0]?.message?.content ?? '{}';

  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    console.error('[analyzeSpeech] Failed to parse JSON from Nemotron:', content.slice(0, 300));
    parsed = {};
  }

  return parseFeedback(parsed);
}
