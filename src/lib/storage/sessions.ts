import type { PracticeSession } from '@/lib/ai/feedback-schema';

const STORAGE_KEY = 'speakdennis_sessions';
const MAX_SESSIONS = 100;

function readAll(): PracticeSession[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as PracticeSession[]) : [];
  } catch {
    return [];
  }
}

function writeAll(sessions: PracticeSession[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch (e) {
    console.error('[sessions] Failed to write to localStorage:', e);
  }
}

export function saveSession(session: PracticeSession): void {
  const sessions = readAll();
  // Prepend newest first, cap at MAX_SESSIONS
  const updated = [session, ...sessions].slice(0, MAX_SESSIONS);
  writeAll(updated);
}

export function getSessions(): PracticeSession[] {
  return readAll();
}

export function getSession(id: string): PracticeSession | null {
  return readAll().find((s) => s.id === id) ?? null;
}

export function deleteSession(id: string): void {
  writeAll(readAll().filter((s) => s.id !== id));
}

export function clearAll(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

export function exportSessions(): string {
  return JSON.stringify(readAll(), null, 2);
}

/** Aggregate stats across all sessions */
export interface SessionStats {
  totalSessions: number;
  averageScore: number;
  bestScore: number;
  streakDays: number;
  mostPracticedScenario: string | null;
  weeklyScores: { date: string; score: number }[];
}

export function getStats(): SessionStats {
  const sessions = readAll();
  if (sessions.length === 0) {
    return {
      totalSessions: 0,
      averageScore: 0,
      bestScore: 0,
      streakDays: 0,
      mostPracticedScenario: null,
      weeklyScores: [],
    };
  }

  const scores = sessions.map((s) => s.feedback.overall.score);
  const averageScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  const bestScore = Math.max(...scores);

  // Streak: consecutive days with at least 1 session
  const days = new Set(sessions.map((s) => s.createdAt.slice(0, 10)));
  let streakDays = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    if (days.has(d.toISOString().slice(0, 10))) {
      streakDays++;
    } else {
      break;
    }
  }

  // Most practiced scenario
  const counts: Record<string, number> = {};
  sessions.forEach((s) => {
    counts[s.scenarioName] = (counts[s.scenarioName] ?? 0) + 1;
  });
  const mostPracticedScenario =
    Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

  // Last 7 days of scores
  const weeklyScores = sessions
    .filter((s) => {
      const d = new Date(s.createdAt);
      const diff = (Date.now() - d.getTime()) / (1000 * 60 * 60 * 24);
      return diff <= 7;
    })
    .map((s) => ({ date: s.createdAt.slice(0, 10), score: s.feedback.overall.score }))
    .reverse();

  return { totalSessions: sessions.length, averageScore, bestScore, streakDays, mostPracticedScenario, weeklyScores };
}
