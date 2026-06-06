"use client";

import { useEffect, useState } from "react";
import { Modal } from "./Modal";
import { Countdown } from "./Countdown";
import { AdBanner } from "./ads/AdBanner";
import { OrnamentIcon, ShareIcon } from "./icons";
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
        <div className="tb-reveal">
          <p className="label">
            {game.status === "won" ? "Você descobriu!" : "A palavra era"}
          </p>
          <p className="word">{game.solution}</p>
          <p className="ref">{word.referencia}</p>
          {word.versiculo && <p className="verse">{word.versiculo}</p>}
        </div>
      )}

      {stats && (
        <>
          <div className="mb-[22px] grid grid-cols-4 gap-2 text-center">
            {[
              [stats.gamesPlayed, "jogos"],
              [`${winRate}%`, "vitórias"],
              [stats.currentStreak, "sequência"],
              [stats.maxStreak, "melhor"],
            ].map(([value, label]) => (
              <div key={label as string}>
                <div className="tb-stat-val">{value}</div>
                <div className="tb-stat-lbl">{label}</div>
              </div>
            ))}
          </div>

          <p className="tb-dist-title">Distribuição de tentativas</p>
          <div className="mb-4">
            {stats.distribution.map((count, i) => (
              <div key={i} className="mb-[5px] flex items-center gap-2 text-[13px]">
                <span className="w-3 font-[var(--font-display)] font-bold text-ink-soft">
                  {i + 1}
                </span>
                <div
                  className={`tb-dist-bar${count === 0 ? " empty" : ""}`}
                  style={{ width: `${(count / maxDist) * 100}%` }}
                >
                  {count}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {game.finished && (
        <>
          <div className="tb-ornament">
            <OrnamentIcon />
          </div>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <Countdown />
            <button type="button" onClick={handleShare} className="tb-btn-primary">
              <ShareIcon />
              {shareFeedback ?? "Compartilhar"}
            </button>
          </div>
        </>
      )}

      <AdBanner slot="game-over" className="mt-5" />
    </Modal>
  );
}
