"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AdBanner } from "@/components/ads/AdBanner";
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
      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-6 px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-extrabold">Criar desafio</h2>
          <p className="mt-2 text-sm text-stone-600 dark:text-stone-300">
            Escolha uma palavra secreta e envie o link para seus amigos
            tentarem adivinhar — funciona com qualquer palavra, não precisa ser
            bíblica!
          </p>
        </div>

        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1">
            <span className="text-sm font-semibold">
              Palavra secreta ({MIN_WORD_LENGTH} a {MAX_WORD_LENGTH} letras)
            </span>
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
              placeholder="Ex: MOISÉS"
              className="rounded-xl border border-stone-300 bg-white px-4 py-3 text-lg font-bold uppercase tracking-widest outline-none focus:border-correct dark:border-stone-600 dark:bg-stone-800"
            />
            {word.trim() && (
              <span className="text-xs text-stone-500">
                {normalizedLength} letras
              </span>
            )}
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm font-semibold">Dica (opcional)</span>
            <input
              type="text"
              value={hint}
              onChange={(e) => {
                setHint(e.target.value);
                setLink(null);
              }}
              maxLength={120}
              placeholder="Ex: Libertou o povo do Egito"
              className="rounded-xl border border-stone-300 bg-white px-4 py-3 outline-none focus:border-correct dark:border-stone-600 dark:bg-stone-800"
            />
          </label>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-950 dark:text-red-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="rounded-xl bg-correct px-6 py-3 font-bold text-white transition hover:brightness-110"
          >
            Gerar link do desafio
          </button>
        </form>

        {link && (
          <div className="flex flex-col gap-3 rounded-2xl border border-stone-200 bg-stone-50 p-4 dark:border-stone-700 dark:bg-stone-800/50">
            <p className="text-sm font-semibold">🎉 Desafio criado!</p>
            <p className="break-all rounded-lg bg-white px-3 py-2 font-mono text-xs text-stone-600 dark:bg-stone-900 dark:text-stone-300">
              {link}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={copyLink}
                className="flex-1 rounded-xl border border-stone-300 px-4 py-2.5 text-sm font-bold transition hover:bg-stone-100 dark:border-stone-600 dark:hover:bg-stone-700"
              >
                {copied ? "Copiado! ✅" : "Copiar link 📋"}
              </button>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 rounded-xl bg-[#25D366] px-4 py-2.5 text-center text-sm font-bold text-white transition hover:brightness-110"
              >
                WhatsApp
              </a>
            </div>
          </div>
        )}

        <AdBanner slot="create-bottom" />
      </main>
      <Footer />
    </>
  );
}
