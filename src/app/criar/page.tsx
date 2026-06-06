"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AdBanner } from "@/components/ads/AdBanner";
import { OrnamentIcon, QuillIcon } from "@/components/icons";
import { buildChallengeUrl } from "@/lib/challenge-codec";
import {
  isPlayableWord,
  MAX_WORD_LENGTH,
  MIN_WORD_LENGTH,
  normalize,
} from "@/lib/game-logic";

export default function CreateChallengePage() {
  const [word, setWord] = useState("");
  const [hint, setHint] = useState("");
  const [link, setLink] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = word.trim();
    if (!isPlayableWord(trimmed)) {
      setError(
        `A palavra deve ter de ${MIN_WORD_LENGTH} a ${MAX_WORD_LENGTH} letras, sem espaços ou números.`
      );
      setLink(null);
      return;
    }
    setError(null);
    setLink(
      buildChallengeUrl(
        { word: trimmed.toUpperCase(), hint: hint.trim() || undefined },
        window.location.origin
      )
    );
  };

  const copyLink = async () => {
    if (!link) return;
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const whatsappUrl = link
    ? `https://wa.me/?text=${encodeURIComponent(
        `Será que você adivinha a minha palavra no Termo Bíblico? 🙏\n${link}`
      )}`
    : "#";

  const normalizedLength = normalize(word.trim()).length;

  return (
    <>
      <Header />
      <main className="mx-auto flex w-full max-w-[640px] flex-1 flex-col gap-5 px-4 pt-[22px] pb-7">
        <article className="tb-prose">
          <h2>Criar um desafio</h2>
          <div className="tb-ornament" style={{ justifyContent: "flex-start", margin: "10px 0 18px" }}>
            <OrnamentIcon />
          </div>
          <p>
            Escolha uma palavra secreta de <strong>{MIN_WORD_LENGTH} a {MAX_WORD_LENGTH} letras</strong>{" "}
            e envie o link para seus amigos tentarem adivinhar. A palavra viaja
            codificada no próprio link: nada fica salvo em servidor — e não
            precisa ser bíblica!
          </p>
        </article>

        <form onSubmit={handleCreate} className="flex max-w-[420px] flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold text-ink">Palavra secreta</span>
            <input
              type="text"
              value={word}
              onChange={(e) => {
                setWord(e.target.value);
                setLink(null);
              }}
              maxLength={12}
              autoComplete="off"
              autoCapitalize="characters"
              placeholder="Ex.: MOISÉS"
              className="tb-input text-lg font-semibold uppercase tracking-[0.1em]"
            />
            {word.trim() && (
              <span className="text-xs text-ink-faint">
                {normalizedLength} letras
              </span>
            )}
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold text-ink">Dica (opcional)</span>
            <input
              type="text"
              value={hint}
              onChange={(e) => {
                setHint(e.target.value);
                setLink(null);
              }}
              maxLength={120}
              placeholder="Ex.: Libertou o povo do Egito"
              className="tb-input"
            />
          </label>

          {error && (
            <p className="rounded-[10px] border border-accent/30 bg-paper-sunken px-3 py-2 text-sm text-accent">
              {error}
            </p>
          )}

          <button type="submit" className="tb-btn-primary self-start">
            <QuillIcon />
            Gerar link do desafio
          </button>
        </form>

        {link && (
          <div className="flex max-w-[420px] flex-col gap-3 rounded-[14px] border border-line bg-paper-sunken p-4">
            <p className="text-sm font-semibold text-ink">Seu desafio está pronto:</p>
            <p className="rounded-[10px] border border-line bg-paper-raised px-3 py-2 font-mono text-xs break-all text-ink-soft">
              {link}
            </p>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={copyLink} className="tb-btn-secondary flex-1 text-sm">
                {copied ? "Copiado!" : "Copiar link"}
              </button>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="tb-btn-primary flex-1 text-sm"
              >
                WhatsApp
              </a>
            </div>
          </div>
        )}

        <AdBanner slot="create-bottom" className="max-w-[500px]" />
      </main>
      <Footer />
    </>
  );
}
