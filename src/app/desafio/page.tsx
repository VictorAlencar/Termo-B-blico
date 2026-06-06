"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Toast } from "@/components/Toast";
import { Modal } from "@/components/Modal";
import { Board } from "@/components/game/Board";
import { Keyboard } from "@/components/game/Keyboard";
import { AdBanner } from "@/components/ads/AdBanner";
import { useGame } from "@/hooks/useGame";
import { decodeChallenge, type Challenge } from "@/lib/challenge-codec";
import { buildChallengeShareText, shareOrCopy } from "@/lib/share";

export default function ChallengePage() {
  return (
    <Suspense fallback={null}>
      <ChallengeLoader />
    </Suspense>
  );
}

function ChallengeLoader() {
  const params = useSearchParams();
  const code = params.get("d");
  const challenge = useMemo(
    () => (code ? decodeChallenge(code) : null),
    [code]
  );

  if (!challenge) {
    return (
      <>
        <Header />
        <main className="mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center gap-4 px-4 py-8 text-center">
          <p className="text-5xl">😕</p>
          <h2 className="text-xl font-extrabold">Link de desafio inválido</h2>
          <p className="text-sm text-stone-600 dark:text-stone-300">
            Este link parece estar incompleto ou corrompido. Peça para seu
            amigo enviar novamente — ou crie o seu próprio desafio!
          </p>
          <div className="flex gap-3">
            <Link
              href="/criar"
              className="rounded-xl bg-correct px-5 py-2.5 font-bold text-white transition hover:brightness-110"
            >
              Criar desafio
            </Link>
            <Link
              href="/"
              className="rounded-xl border border-stone-300 px-5 py-2.5 font-bold transition hover:bg-stone-100 dark:border-stone-600 dark:hover:bg-stone-700"
            >
              Jogo do dia
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return <ChallengeGame challenge={challenge} />;
}

function ChallengeGame({ challenge }: { challenge: Challenge }) {
  const game = useGame({ solution: challenge.word });
  const [resultOpen, setResultOpen] = useState(false);
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);
  const [hintVisible, setHintVisible] = useState(false);

  // Abre o resultado ao terminar
  useEffect(() => {
    if (game.finished) {
      const t = setTimeout(() => setResultOpen(true), 800);
      return () => clearTimeout(t);
    }
  }, [game.finished]);

  const handleShare = async () => {
    const result = await shareOrCopy(
      buildChallengeShareText(
        game.evaluations,
        game.status === "won",
        window.location.href
      )
    );
    if (result === "copied") {
      setShareFeedback("Resultado copiado!");
      setTimeout(() => setShareFeedback(null), 2000);
    }
  };

  return (
    <>
      <Header />
      <Toast message={game.toast} />

      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col items-center gap-4 px-3 py-4">
        <p className="text-xs uppercase tracking-widest text-stone-500 dark:text-stone-400">
          🎁 Desafio de um amigo · {game.wordLength} letras
        </p>

        <Board game={game} />

        {game.status === "playing" && (
          <div className="min-h-10 text-center">
            {challenge.hint ? (
              hintVisible ? (
                <p className="max-w-md text-sm text-stone-600 italic dark:text-stone-300">
                  💡 {challenge.hint}
                </p>
              ) : (
                <button
                  type="button"
                  onClick={() => setHintVisible(true)}
                  className="rounded-full border border-stone-300 px-4 py-1.5 text-sm font-semibold text-stone-600 transition hover:bg-stone-100 dark:border-stone-600 dark:text-stone-300 dark:hover:bg-stone-700"
                >
                  💡 Dica
                </button>
              )
            ) : null}
          </div>
        )}

        <Keyboard statuses={game.keyboardStatuses} onKey={game.onKey} />

        <AdBanner slot="challenge-bottom" className="w-full max-w-lg" />
      </main>

      <Footer />

      <Modal
        open={resultOpen}
        onClose={() => setResultOpen(false)}
        title={game.status === "won" ? "Você acertou! 🎉" : "Não foi dessa vez"}
      >
        <div className="mb-5 rounded-xl bg-stone-100 p-4 text-center dark:bg-stone-700/50">
          <p className="text-sm text-stone-500 dark:text-stone-300">
            A palavra era
          </p>
          <p className="text-3xl font-extrabold tracking-widest text-correct">
            {challenge.word}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={handleShare}
            className="rounded-xl bg-correct px-6 py-3 font-bold text-white transition hover:brightness-110"
          >
            {shareFeedback ?? "Compartilhar resultado 📋"}
          </button>
          <Link
            href="/criar"
            className="rounded-xl border border-stone-300 px-6 py-3 text-center font-bold transition hover:bg-stone-100 dark:border-stone-600 dark:hover:bg-stone-700"
          >
            Criar meu desafio ✏️
          </Link>
          <Link
            href="/"
            className="text-center text-sm font-semibold text-correct hover:underline"
          >
            Jogar a palavra do dia →
          </Link>
        </div>

        <AdBanner slot="challenge-over" className="mt-4" />
      </Modal>
    </>
  );
}
