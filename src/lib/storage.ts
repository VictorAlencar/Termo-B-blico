import { MAX_GUESSES } from "./game-logic";

export type GameStatus = "playing" | "won" | "lost";

export interface DailyGameState {
  day: number;
  /** Tentativas digitadas (normalizadas, sem acento) */
  guesses: string[];
  status: GameStatus;
  hintUsed: boolean;
}

export interface PlayerStats {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  /** distribution[i] = vitórias em i+1 tentativas */
  distribution: number[];
  lastPlayedDay: number;
}

const DAILY_KEY = "tb-daily";
const STATS_KEY = "tb-stats";

const isBrowser = typeof window !== "undefined";

export function loadDailyState(day: number): DailyGameState | null {
  if (!isBrowser) return null;
  try {
    const raw = localStorage.getItem(DAILY_KEY);
    if (!raw) return null;
    const state = JSON.parse(raw) as DailyGameState;
    return state.day === day ? state : null;
  } catch {
    return null;
  }
}

export function saveDailyState(state: DailyGameState): void {
  if (!isBrowser) return;
  try {
    localStorage.setItem(DAILY_KEY, JSON.stringify(state));
  } catch {
    // armazenamento indisponível (modo privado etc.) — jogo segue sem persistir
  }
}

export function emptyStats(): PlayerStats {
  return {
    gamesPlayed: 0,
    gamesWon: 0,
    currentStreak: 0,
    maxStreak: 0,
    distribution: new Array(MAX_GUESSES).fill(0),
    lastPlayedDay: 0,
  };
}

export function loadStats(): PlayerStats {
  if (!isBrowser) return emptyStats();
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) return emptyStats();
    return { ...emptyStats(), ...(JSON.parse(raw) as PlayerStats) };
  } catch {
    return emptyStats();
  }
}

/** Registra o resultado de um jogo diário nas estatísticas */
export function recordResult(
  day: number,
  won: boolean,
  attempts: number
): PlayerStats {
  const stats = loadStats();
  if (stats.lastPlayedDay === day) return stats; // já registrado

  stats.gamesPlayed++;
  if (won) {
    stats.gamesWon++;
    // sequência só continua se jogou (e venceu) no dia anterior
    stats.currentStreak =
      stats.lastPlayedDay === day - 1 ? stats.currentStreak + 1 : 1;
    stats.maxStreak = Math.max(stats.maxStreak, stats.currentStreak);
    if (attempts >= 1 && attempts <= MAX_GUESSES) {
      stats.distribution[attempts - 1]++;
    }
  } else {
    stats.currentStreak = 0;
  }
  stats.lastPlayedDay = day;

  if (isBrowser) {
    try {
      localStorage.setItem(STATS_KEY, JSON.stringify(stats));
    } catch {
      // sem persistência disponível
    }
  }
  return stats;
}
