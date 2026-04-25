// Lightweight client-side progress + streak tracking (no backend yet).

export interface Attempt {
  caseId: string;
  correct: boolean;
  timestamp: number;
}

export interface UserStats {
  attempts: Attempt[];
  streak: number;
  bestStreak: number;
  lastDailyDate: string | null;
  dailyHistory: Record<string, { caseId: string; correct: boolean; attempts: number }>;
}

const KEY = "ecgdle.stats.v1";

const empty = (): UserStats => ({
  attempts: [],
  streak: 0,
  bestStreak: 0,
  lastDailyDate: null,
  dailyHistory: {},
});

export function loadStats(): UserStats {
  if (typeof window === "undefined") return empty();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return empty();
    return { ...empty(), ...JSON.parse(raw) };
  } catch {
    return empty();
  }
}

export function saveStats(s: UserStats) {
  localStorage.setItem(KEY, JSON.stringify(s));
}

export function recordAttempt(caseId: string, correct: boolean) {
  const s = loadStats();
  s.attempts.push({ caseId, correct, timestamp: Date.now() });
  saveStats(s);
}

export function recordDaily(caseId: string, correct: boolean, attempts: number) {
  const s = loadStats();
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  if (s.dailyHistory[today]) return s; // already recorded

  s.dailyHistory[today] = { caseId, correct, attempts };

  if (correct) {
    if (s.lastDailyDate === yesterday) s.streak += 1;
    else s.streak = 1;
    s.bestStreak = Math.max(s.bestStreak, s.streak);
  } else {
    s.streak = 0;
  }
  s.lastDailyDate = today;
  saveStats(s);
  return s;
}

export function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

export function computeAccuracy(s: UserStats) {
  if (!s.attempts.length) return 0;
  const c = s.attempts.filter((a) => a.correct).length;
  return Math.round((c / s.attempts.length) * 100);
}
