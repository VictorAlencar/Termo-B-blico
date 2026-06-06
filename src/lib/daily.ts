import { WORDS, type BiblicalWord } from "./words";

/** Data de lançamento do jogo (dia #1) no fuso de São Paulo */
const EPOCH = "2026-06-06";
const TIME_ZONE = "America/Sao_Paulo";

/** Data de hoje (YYYY-MM-DD) no fuso de São Paulo */
export function getTodayString(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function daysBetween(fromISO: string, toISO: string): number {
  const [fy, fm, fd] = fromISO.split("-").map(Number);
  const [ty, tm, td] = toISO.split("-").map(Number);
  const from = Date.UTC(fy, fm - 1, fd);
  const to = Date.UTC(ty, tm - 1, td);
  return Math.round((to - from) / 86_400_000);
}

/** Número do desafio diário (1 = dia do lançamento) */
export function getDayNumber(): number {
  return daysBetween(EPOCH, getTodayString()) + 1;
}

/**
 * Embaralhamento determinístico do índice (hash multiplicativo de Knuth)
 * para a sequência diária não seguir a ordem da lista.
 */
function shuffledIndex(day: number, length: number): number {
  return Math.abs((day * 2654435761) % 2 ** 31) % length;
}

/** A palavra do dia — a mesma para todos os jogadores no mesmo dia */
export function getDailyWord(day: number = getDayNumber()): BiblicalWord {
  return WORDS[shuffledIndex(day, WORDS.length)];
}

/** Milissegundos restantes até a meia-noite em São Paulo */
export function msUntilNextWord(): number {
  const now = new Date();
  // Hora atual em SP (hh:mm:ss)
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(now);
  const get = (t: string) =>
    Number(parts.find((p) => p.type === t)?.value ?? 0);
  const elapsedMs =
    (get("hour") * 3600 + get("minute") * 60 + get("second")) * 1000;
  return 86_400_000 - elapsedMs;
}
