export type LetterStatus = "correct" | "present" | "absent";

export const MAX_GUESSES = 6;
export const MIN_WORD_LENGTH = 4;
export const MAX_WORD_LENGTH = 8;

/** Remove acentos e converte para maiúsculas (Ç -> C, É -> E...) */
export function normalize(word: string): string {
  return word
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/** Valida se uma palavra (forma exibida, pode ter acentos) é jogável */
export function isPlayableWord(word: string): boolean {
  const n = normalize(word.trim());
  return (
    n.length >= MIN_WORD_LENGTH &&
    n.length <= MAX_WORD_LENGTH &&
    /^[A-Z]+$/.test(n)
  );
}

/**
 * Avalia uma tentativa contra a solução (ambas normalizadas).
 * Trata letras repetidas corretamente: verdes consomem primeiro,
 * depois amarelas até esgotar as ocorrências na solução.
 */
export function evaluateGuess(
  guess: string,
  solution: string
): LetterStatus[] {
  const result: LetterStatus[] = new Array(guess.length).fill("absent");
  const remaining: Record<string, number> = {};

  // 1ª passada: verdes
  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === solution[i]) {
      result[i] = "correct";
    } else {
      remaining[solution[i]] = (remaining[solution[i]] ?? 0) + 1;
    }
  }

  // 2ª passada: amarelas
  for (let i = 0; i < guess.length; i++) {
    if (result[i] === "correct") continue;
    const letter = guess[i];
    if (remaining[letter] > 0) {
      result[i] = "present";
      remaining[letter]--;
    }
  }

  return result;
}

const STATUS_PRIORITY: Record<LetterStatus, number> = {
  absent: 0,
  present: 1,
  correct: 2,
};

/** Agrega o melhor status conhecido de cada letra para colorir o teclado */
export function getKeyboardStatuses(
  guesses: string[],
  evaluations: LetterStatus[][]
): Record<string, LetterStatus> {
  const statuses: Record<string, LetterStatus> = {};
  guesses.forEach((guess, gi) => {
    for (let i = 0; i < guess.length; i++) {
      const letter = guess[i];
      const status = evaluations[gi][i];
      const current = statuses[letter];
      if (!current || STATUS_PRIORITY[status] > STATUS_PRIORITY[current]) {
        statuses[letter] = status;
      }
    }
  });
  return statuses;
}

/**
 * Letra a exibir na célula: se a posição está correta, mostra a forma
 * acentuada da solução (ex: digitou E, exibe É) — como no Termo original.
 */
export function displayLetter(
  typedLetter: string,
  solutionDisplay: string,
  index: number,
  status: LetterStatus
): string {
  if (status === "correct") {
    return solutionDisplay[index]?.toUpperCase() ?? typedLetter;
  }
  return typedLetter;
}
