"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Toast } from "@/components/Toast";
import { Board } from "@/components/game/Board";
import { Keyboard } from "@/components/game/Keyboard";
import { HelpModal } from "@/components/HelpModal";
import { StatsModal } from "@/components/StatsModal";
import { AdBanner } from "@/components/ads/AdBanner";
import { useGame } from "@/hooks/useGame";
import { getDailyWord, getDayNumber } from "@/lib/daily";

export default function DailyGamePage() {
  // Evita divergência de hidratação: o dia só é conhecido no cliente
  const [day, setDay] = useState<number | null>(null);

  useEffect(() => {
    setDay(getDayNumber());
  }, []);

  if (day === null) {
    return (
      <>
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <p className="animate-pulse text-stone-400">Carregando…</p>
        </main>
        <Footer />
      </>
    );
  }

  return <DailyGame day={day} />;
}

function DailyGame({ day }: { day: number }) {
  const word = getDailyWord(day);
  const game = useGame({ solution: word.palavra, dailyDay: day });

  const [helpOpen, setHelpOpen] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);
  const [hintVisible, setHintVisible] = useState(false);

  // Abre as estatísticas automaticamente ao terminar
  useEffect(() => {
    if (game.finished) {
      const t = setTimeout(() => setStatsOpen(true), 800);
      return () => clearTimeout(t);
    }
  }, [game.finished]);

  // Primeira visita: mostra como jogar
  useEffect(() => {
    try {
      if (!localStorage.getItem("tb-visited")) {
        localStorage.setItem("tb-visited", "1");
        setHelpOpen(true);
      }
    } catch {
      // sem persistência
    }
  }, []);

  const showHint = () => {
    game.useHint();
    setHintVisible(true);
  };

  return (
    <>
      <Header onHelp={() => setHelpOpen(true)} onStats={() => setStatsOpen(true)} />
      <Toast message={game.toast} />

      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col items-center gap-4 px-3 py-4">
        <p className="text-xs uppercase tracking-widest text-stone-500 dark:text-stone-400">
          Desafio #{day} · {game.wordLength} letras
        </p>

        <Board game={game} />

        {game.status === "playing" && (
          <div className="min-h-10 text-center">
            {hintVisible || game.hintUsed ? (
              <p className="max-w-md text-sm text-stone-600 italic dark:text-stone-300">
                💡 {word.dica}
              </p>
            ) : (
              <button
                type="button"
                onClick={showHint}
                className="rounded-full border border-stone-300 px-4 py-1.5 text-sm font-semibold text-stone-600 transition hover:bg-stone-100 dark:border-stone-600 dark:text-stone-300 dark:hover:bg-stone-700"
              >
                💡 Dica
              </button>
            )}
          </div>
        )}

        <Keyboard statuses={game.keyboardStatuses} onKey={game.onKey} />

        <AdBanner slot="home-bottom" className="w-full max-w-lg" />
      </main>

      <Footer />

      <HelpModal open={helpOpen} onClose={() => setHelpOpen(false)} />
      <StatsModal
        open={statsOpen}
        onClose={() => setStatsOpen(false)}
        game={game}
        word={word}
        day={day}
      />
    </>
  );
}
