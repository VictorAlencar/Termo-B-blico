"use client";

import { useEffect, useState } from "react";
import { Modal } from "./Modal";
import { Countdown } from "./Countdown";
import { AdBanner } from "./ads/AdBanner";
import { loadStats, type PlayerStats } from "@/lib/storage";
import { buildDailyShareText, shareOrCopy } from "@/lib/share";
import type { GameApi } from "@/hooks/useGame";
import type { BiblicalWord } from "@/lib/words";

interface StatsModalProps {
  open: boolean;
  onClose: () => void;
  game: GameApi;
  word: BiblicalWord;
  day: number;
}

export function StatsModal({ open, onClose, game, word, day }: StatsModalProps) {
  const [stats, setStats] = useState<PlayerStats | null>(null);
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);

  // Recarrega ao abrir (o resultado pode ter acabado de ser registrado)
  useEffect(() => {
    if (open) setStats(loadStats());
  }, [open]);

  const handleShare = async () => {
    const result = await shareOrCopy(
      buildDailyShareText(
        day,
        game.evaluations,
        game.status === "won",
        window.location.origin
      )
    );
    if (result === "copied") {
      setShareFeedback("Resultado copiado!");
      setTimeout(() => setShareFeedback(null), 2000);
    }
  };

  const maxDist = stats ? Math.max(1, ...stats.distribution) : 1;
  const winRate =
    stats && stats.gamesPlayed > 0
      ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100)
      : 0;

  return (
    <Modal open={open} onClose={onClose} title="Estatísticas">
      {game.finished && (
        <div className="mb-5 rounded-xl bg-stone-100 p-4 text-center dark:bg-stone-700/50">
          <p className="text-sm text-stone-500 dark:text-stone-300">
            {game.status === "won" ? "🎉 Você acertou!" : "A palavra era"}
          </p>
          <p className="text-3xl font-extrabold tracking-widest text-correct">
            {game.solution}
          </p>
          <p className="mt-1 text-sm font-semibold">{word.referencia}</p>
          <p className="mt-2 text-sm text-stone-600 italic dark:text-stone-300">
            “{word.dica}”
          </p>
        </div>
      )}

      {stats && (
        <>
          <div className="mb-5 grid grid-cols-4 gap-2 text-center">
            {[
              [stats.gamesPlayed, "jogos"],
              [`${winRate}%`, "vitórias"],
              [stats.currentStreak, "sequência"],
              [stats.maxStreak, "melhor seq."],
            ].map(([value, label]) => (
              <div key={label as string}>
                <p className="text-2xl font-extrabold">{value}</p>
                <p className="text-[11px] text-stone-500 dark:text-stone-400">
                  {label}
                </p>
              </div>
            ))}
          </div>

          <div className="mb-5">
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-stone-500 dark:text-stone-400">
              Distribuição de tentativas
            </p>
            <div className="space-y-1">
              {stats.distribution.map((count, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <span className="w-3 font-bold">{i + 1}</span>
                  <div
                    className={`min-w-6 rounded px-2 py-0.5 text-right text-xs font-bold text-white ${
                      count > 0 ? "bg-correct" : "bg-stone-300 dark:bg-stone-600"
                    }`}
                    style={{ width: `${(count / maxDist) * 100}%` }}
                  >
                    {count}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {game.finished && (
        <div className="mb-4 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <Countdown />
          <button
            type="button"
            onClick={handleShare}
            className="rounded-xl bg-correct px-6 py-3 font-bold text-white transition hover:brightness-110"
          >
            {shareFeedback ?? "Compartilhar 📋"}
          </button>
        </div>
      )}

      <AdBanner slot="game-over" className="mt-2" />
    </Modal>
  );
}
