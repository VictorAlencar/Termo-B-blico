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
import { LampIcon } from "@/components/icons";
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
          <p className="animate-pulse text-ink-faint">Carregando…</p>
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

      <main className="mx-auto flex w-full max-w-[520px] flex-1 flex-col items-center gap-[18px] px-3.5 pt-[22px] pb-7">
        <p className="tb-eyebrow">
          Desafio #{day} · {game.wordLength} letras
        </p>

        <Board game={game} />

        {game.status === "playing" && (
          <div className="flex min-h-10 items-center justify-center text-center">
            {hintVisible || game.hintUsed ? (
              <p className="tb-hint-text">
                <LampIcon />
                <span>{word.dica}</span>
              </p>
            ) : (
              <button type="button" onClick={showHint} className="tb-hint-btn">
                <LampIcon />
                Pedir uma luz
              </button>
            )}
          </div>
        )}

        <Keyboard statuses={game.keyboardStatuses} onKey={game.onKey} />

        <AdBanner slot="home-bottom" className="max-w-[500px]" />
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
