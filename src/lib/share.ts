import type { LetterStatus } from "./game-logic";
import { MAX_GUESSES } from "./game-logic";

const EMOJI: Record<LetterStatus, string> = {
  correct: "🟩",
  present: "🟨",
  absent: "⬛",
};

export function buildEmojiGrid(evaluations: LetterStatus[][]): string {
  return evaluations
    .map((row) => row.map((s) => EMOJI[s]).join(""))
    .join("\n");
}

/** Texto de compartilhamento do desafio diário */
export function buildDailyShareText(
  day: number,
  evaluations: LetterStatus[][],
  won: boolean,
  url: string
): string {
  const score = won ? `${evaluations.length}/${MAX_GUESSES}` : `X/${MAX_GUESSES}`;
  return `Termo Bíblico #${day} ${score}\n\n${buildEmojiGrid(evaluations)}\n\n${url}`;
}

/** Texto de compartilhamento de um desafio personalizado */
export function buildChallengeShareText(
  evaluations: LetterStatus[][],
  won: boolean,
  challengeUrl: string
): string {
  const score = won ? `${evaluations.length}/${MAX_GUESSES}` : `X/${MAX_GUESSES}`;
  return `Termo Bíblico — Desafio de um amigo ${score}\n\n${buildEmojiGrid(evaluations)}\n\nJogue também: ${challengeUrl}`;
}

/** Compartilha via Web Share API (mobile) com fallback para clipboard */
export async function shareOrCopy(text: string): Promise<"shared" | "copied"> {
  if (typeof navigator !== "undefined" && navigator.share) {
    try {
      await navigator.share({ text });
      return "shared";
    } catch {
      // usuário cancelou ou share falhou — tenta clipboard
    }
  }
  await navigator.clipboard.writeText(text);
  return "copied";
}
