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
import { LampIcon, OrnamentIcon, QuillIcon, ShareIcon } from "@/components/icons";
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
        <main className="mx-auto flex w-full max-w-[520px] flex-1 flex-col items-center justify-center gap-4 px-4 py-8 text-center">
          <div className="tb-ornament w-full max-w-60">
            <OrnamentIcon />
          </div>
          <h2 className="font-[var(--font-display)] text-2xl font-semibold tracking-[0.04em] text-ink">
            Link de desafio inválido
          </h2>
          <p className="text-sm text-ink-soft">
            Este link parece estar incompleto ou corrompido. Peça para seu
            amigo enviar novamente — ou crie o seu próprio desafio!
          </p>
          <div className="mt-2 flex gap-3">
            <Link href="/criar" className="tb-btn-primary">
              <QuillIcon />
              Criar desafio
            </Link>
            <Link href="/" className="tb-btn-secondary">
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
        <p className="tb-eyebrow">
          Desafio de um amigo · {game.wordLength} letras
        </p>

        <Board game={game} />

        {game.status === "playing" && (
          <div className="flex min-h-10 items-center justify-center text-center">
            {challenge.hint ? (
              hintVisible ? (
                <p className="tb-hint-text">
                  <LampIcon />
                  <span>{challenge.hint}</span>
                </p>
              ) : (
                <button
                  type="button"
                  onClick={() => setHintVisible(true)}
                  className="tb-hint-btn"
                >
                  <LampIcon />
                  Pedir uma luz
                </button>
              )
            ) : null}
          </div>
        )}

        <Keyboard statuses={game.keyboardStatuses} onKey={game.onKey} />

        <AdBanner slot="challenge-bottom" className="max-w-[500px]" />
      </main>

      <Footer />

      <Modal
        open={resultOpen}
        onClose={() => setResultOpen(false)}
        title={game.status === "won" ? "Você descobriu!" : "Não foi dessa vez"}
      >
        <div className="tb-reveal">
          <p className="label">A palavra era</p>
          <p className="word">{challenge.word}</p>
        </div>

        <div className="flex flex-col gap-3">
          <button type="button" onClick={handleShare} className="tb-btn-primary">
            <ShareIcon />
            {shareFeedback ?? "Compartilhar resultado"}
          </button>
          <Link href="/criar" className="tb-btn-secondary">
            <QuillIcon />
            Criar meu desafio
          </Link>
          <Link
            href="/"
            className="text-center text-sm font-semibold text-accent hover:underline"
          >
            Jogar a palavra do dia →
          </Link>
        </div>

        <AdBanner slot="challenge-over" className="mt-4" />
      </Modal>
    </>
  );
}
