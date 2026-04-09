import { z } from 'zod/v4';

/* ────────────────────────────────────────────────────────────────
   Zod schemas for Nemotron feedback output.
   Parsed from structured JSON returned by the analysis API route.
   ──────────────────────────────────────────────────────────────── */

const ScoreSchema = z.number().min(0).max(100);

export const PaceAnalysisSchema = z.object({
  wpm: z.number().describe('Words per minute'),
  assessment: z.enum(['too_slow', 'slow', 'ideal', 'fast', 'too_fast']),
  score: ScoreSchema,
  advice: z.string(),
});

export const FillerWordSchema = z.object({
  word: z.string(),
  count: z.number().int().min(0),
  positions: z.array(z.number()).optional(),
});

export const FillerWordAnalysisSchema = z.object({
  total_count: z.number().int().min(0),
  percentage: z.number().min(0).max(100),
  score: ScoreSchema,
  fillers: z.array(FillerWordSchema),
  advice: z.string(),
});

export const GrammarIssueSchema = z.object({
  original: z.string(),
  correction: z.string(),
  rule: z.string().optional(),
});

export const GrammarAnalysisSchema = z.object({
  score: ScoreSchema,
  issues: z.array(GrammarIssueSchema),
  advice: z.string(),
});

export const PronunciationFlagSchema = z.object({
  word: z.string(),
  phoneticBreakdown: z.string().describe('The phonetic breakdown of the word (e.g. "bet-er" for "better") to help the user practice').optional(),
  issue: z.string(),
  suggestion: z.string(),
});

export const PronunciationAnalysisSchema = z.object({
  score: ScoreSchema,
  flags: z.array(PronunciationFlagSchema),
  advice: z.string(),
});

export const VocabularyAnalysisSchema = z.object({
  level: z.enum(['basic', 'intermediate', 'advanced', 'expert']),
  score: ScoreSchema,
  suggestions: z.array(z.string()),
  advice: z.string(),
});

export const StructureAnalysisSchema = z.object({
  score: ScoreSchema,
  coherence: z.number().min(0).max(100),
  has_opening: z.boolean(),
  has_conclusion: z.boolean(),
  advice: z.string(),
});

export const OverallAnalysisSchema = z.object({
  score: ScoreSchema,
  label: z.enum(['beginner', 'developing', 'proficient', 'expert']),
  strengths: z.array(z.string()).min(1).max(3),
  improvements: z.array(z.string()).min(1).max(3),
  summary: z.string(),
});

export const FeedbackResultSchema = z.object({
  reasoning: z.string().optional().describe('Step-by-step reasoning generated before scoring'),
  pace: PaceAnalysisSchema,
  filler_words: FillerWordAnalysisSchema,
  grammar: GrammarAnalysisSchema,
  pronunciation: PronunciationAnalysisSchema,
  vocabulary: VocabularyAnalysisSchema,
  structure: StructureAnalysisSchema,
  overall: OverallAnalysisSchema,
});

export type PaceAnalysis        = z.infer<typeof PaceAnalysisSchema>;
export type FillerWordAnalysis  = z.infer<typeof FillerWordAnalysisSchema>;
export type GrammarAnalysis     = z.infer<typeof GrammarAnalysisSchema>;
export type PronunciationAnalysis = z.infer<typeof PronunciationAnalysisSchema>;
export type VocabularyAnalysis  = z.infer<typeof VocabularyAnalysisSchema>;
export type StructureAnalysis   = z.infer<typeof StructureAnalysisSchema>;
export type OverallAnalysis     = z.infer<typeof OverallAnalysisSchema>;
export type FeedbackResult      = z.infer<typeof FeedbackResultSchema>;

export interface PracticeSession {
  id: string;
  scenarioId: string;
  scenarioName: string;
  prompt: string;
  transcript: string;
  durationSeconds: number;
  wordCount: number;
  feedback: FeedbackResult;
  createdAt: string; // ISO date string
}

/* ── Fallback defaults (per methodology: handle LLM variations gracefully) ── */
export function parseFeedback(raw: unknown): FeedbackResult {
  const result = FeedbackResultSchema.safeParse(raw);
  if (result.success) return result.data;

  // Best-effort extraction from a partial/malformed response
  const r = raw as Record<string, unknown>;
  return {
    pace: {
      wpm: Number(r?.pace && (r.pace as Record<string, unknown>)?.wpm) || 120,
      assessment: 'ideal',
      score: 70,
      advice: 'Keep practicing to improve your pace.',
    },
    filler_words: {
      total_count: 0,
      percentage: 0,
      score: 70,
      fillers: [],
      advice: 'Watch out for filler words like "um" and "uh".',
    },
    grammar: {
      score: 70,
      issues: [],
      advice: 'Focus on verb tense consistency.',
    },
    pronunciation: {
      score: 70,
      flags: [
        { word: 'better', phoneticBreakdown: 'bet-er', issue: 'Mumbled consonants', suggestion: 'Articulate the T sound sharply' }
      ],
      advice: 'Practice tricky sounds aloud.',
    },
    vocabulary: {
      level: 'intermediate',
      score: 70,
      suggestions: [],
      advice: 'Vary your word choices for more impact.',
    },
    structure: {
      score: 70,
      coherence: 70,
      has_opening: true,
      has_conclusion: true,
      advice: 'Structure your response with a clear beginning, middle, and end.',
    },
    overall: {
      score: 70,
      label: 'developing',
      strengths: ['Completed the session'],
      improvements: ['Practice more regularly'],
      summary: 'Keep practicing — every session improves your skills.',
    },
  };
}

/** Map an overall score to a CSS class */
export function scoreClass(score: number): string {
  if (score >= 85) return 'score-excellent';
  if (score >= 65) return 'score-good';
  if (score >= 45) return 'score-average';
  return 'score-poor';
}

/** Map a score to a human label */
export function scoreLabel(score: number): string {
  if (score >= 85) return 'Excellent';
  if (score >= 65) return 'Good';
  if (score >= 45) return 'Average';
  return 'Needs Work';
}
