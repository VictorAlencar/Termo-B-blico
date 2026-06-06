"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  evaluateGuess,
  getKeyboardStatuses,
  MAX_GUESSES,
  normalize,
  type LetterStatus,
} from "@/lib/game-logic";
import { loadDictionary } from "@/lib/dictionary";
import {
  loadDailyState,
  recordResult,
  saveDailyState,
  type GameStatus,
} from "@/lib/storage";

/** Duração da revelação de uma linha (flip escalonado das células) */
export const REVEAL_STEP_MS = 300;
export const FLIP_DURATION_MS = 550;

export interface UseGameOptions {
  /** Solução na forma exibida (pode ter acentos), ex: "MOISÉS" */
  solution: string;
  /** Quando definido, persiste progresso e registra estatísticas do diário */
  dailyDay?: number;
  /**
   * Validar tentativas contra o dicionário PT-BR.
   * Desafios personalizados também validam, mas aceitam a própria solução.
   */
  validateWords?: boolean;
}

export interface GameApi {
  solution: string;
  solutionNorm: string;
  wordLength: number;
  guesses: string[];
  current: string;
  status: GameStatus;
  /** true enquanto a última linha anima a revelação */
  revealing: boolean;
  /** true quando o jogo terminou e a animação já concluiu */
  finished: boolean;
  evaluations: LetterStatus[][];
  keyboardStatuses: Record<string, LetterStatus>;
  toast: string | null;
  shaking: boolean;
  hintUsed: boolean;
  attempts: number;
  onKey: (key: string) => void;
  useHint: () => void;
  showToast: (msg: string) => void;
}

export function useGame({
  solution,
  dailyDay,
  validateWords = true,
}: UseGameOptions): GameApi {
  const solutionNorm = useMemo(() => normalize(solution), [solution]);
  const wordLength = solutionNorm.length;

  const [guesses, setGuesses] = useState<string[]>([]);
  const [current, setCurrent] = useState("");
  const [status, setStatus] = useState<GameStatus>("playing");
  const [revealing, setRevealing] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [shaking, setShaking] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const dictionary = useRef<Set<string> | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Restaura progresso do dia (apenas modo diário)
  useEffect(() => {
    if (dailyDay !== undefined) {
      const saved = loadDailyState(dailyDay);
      if (saved) {
        setGuesses(saved.guesses);
        setStatus(saved.status);
        setHintUsed(saved.hintUsed);
      }
    }
    setHydrated(true);
  }, [dailyDay]);

  // Carrega o dicionário do tamanho da palavra
  useEffect(() => {
    if (!validateWords) return;
    let active = true;
    loadDictionary(wordLength).then((set) => {
      if (active) dictionary.current = set;
    });
    return () => {
      active = false;
    };
  }, [wordLength, validateWords]);

  const evaluations = useMemo(
    () => guesses.map((g) => evaluateGuess(g, solutionNorm)),
    [guesses, solutionNorm]
  );

  // Teclado não revela cores da linha que ainda está animando
  const settledCount = revealing ? guesses.length - 1 : guesses.length;
  const keyboardStatuses = useMemo(
    () =>
      getKeyboardStatuses(
        guesses.slice(0, settledCount),
        evaluations.slice(0, settledCount)
      ),
    [guesses, evaluations, settledCount]
  );

  const showToast = useCallback((msg: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast(msg);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  }, []);

  const shake = useCallback(() => {
    setShaking(true);
    setTimeout(() => setShaking(false), 500);
  }, []);

  const persist = useCallback(
    (nextGuesses: string[], nextStatus: GameStatus, nextHint: boolean) => {
      if (dailyDay === undefined) return;
      saveDailyState({
        day: dailyDay,
        guesses: nextGuesses,
        status: nextStatus,
        hintUsed: nextHint,
      });
    },
    [dailyDay]
  );

  const submitGuess = useCallback(() => {
    if (current.length < wordLength) {
      showToast("Letras insuficientes");
      shake();
      return;
    }
    const guess = current;
    const dict = dictionary.current;
    if (
      validateWords &&
      dict &&
      !dict.has(guess) &&
      guess !== solutionNorm
    ) {
      showToast("Palavra não encontrada na lista");
      shake();
      return;
    }

    const nextGuesses = [...guesses, guess];
    const won = guess === solutionNorm;
    const lost = !won && nextGuesses.length >= MAX_GUESSES;
    const nextStatus: GameStatus = won ? "won" : lost ? "lost" : "playing";

    setGuesses(nextGuesses);
    setCurrent("");
    setRevealing(true);
    persist(nextGuesses, nextStatus, hintUsed);

    setTimeout(() => {
      setRevealing(false);
      setStatus(nextStatus);
      if (nextStatus !== "playing" && dailyDay !== undefined) {
        recordResult(dailyDay, won, nextGuesses.length);
      }
    }, wordLength * REVEAL_STEP_MS + FLIP_DURATION_MS);
  }, [
    current,
    guesses,
    wordLength,
    solutionNorm,
    validateWords,
    hintUsed,
    dailyDay,
    persist,
    showToast,
    shake,
  ]);

  const onKey = useCallback(
    (key: string) => {
      if (status !== "playing" || revealing || !hydrated) return;
      if (key === "ENTER") {
        submitGuess();
        return;
      }
      if (key === "BACKSPACE") {
        setCurrent((c) => c.slice(0, -1));
        return;
      }
      const letter = normalize(key);
      if (/^[A-Z]$/.test(letter)) {
        setCurrent((c) => (c.length < wordLength ? c + letter : c));
      }
    },
    [status, revealing, hydrated, wordLength, submitGuess]
  );

  // Teclado físico
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA"].includes(target.tagName)) return;
      if (e.key === "Enter") onKey("ENTER");
      else if (e.key === "Backspace") onKey("BACKSPACE");
      else if (/^[a-zA-ZçÇáàâãéêíóôõúüÁÀÂÃÉÊÍÓÔÕÚÜ]$/.test(e.key))
        onKey(e.key);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onKey]);

  const useHint = useCallback(() => {
    if (hintUsed) return;
    setHintUsed(true);
    persist(guesses, status, true);
  }, [hintUsed, guesses, status, persist]);

  return {
    solution,
    solutionNorm,
    wordLength,
    guesses,
    current,
    status,
    revealing,
    finished: status !== "playing" && !revealing,
    evaluations,
    keyboardStatuses,
    toast,
    shaking,
    hintUsed,
    attempts: guesses.length,
    onKey,
    useHint,
    showToast,
  };
}
