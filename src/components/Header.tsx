"use client";

import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

interface HeaderProps {
  onHelp?: () => void;
  onStats?: () => void;
}

export function Header({ onHelp, onStats }: HeaderProps) {
  return (
    <header className="border-b border-stone-200 dark:border-stone-700">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-3 py-2">
        <div className="flex items-center gap-1">
          {onHelp ? (
            <button
              type="button"
              onClick={onHelp}
              aria-label="Como jogar"
              className="rounded-lg p-2 text-xl hover:bg-stone-200 dark:hover:bg-stone-700"
            >
              ❓
            </button>
          ) : (
            <Link
              href="/como-jogar"
              aria-label="Como jogar"
              className="rounded-lg p-2 text-xl hover:bg-stone-200 dark:hover:bg-stone-700"
            >
              ❓
            </Link>
          )}
          <Link
            href="/criar"
            aria-label="Criar desafio"
            className="rounded-lg p-2 text-xl hover:bg-stone-200 dark:hover:bg-stone-700"
          >
            ✏️
          </Link>
        </div>

        <Link href="/" className="text-center">
          <h1 className="text-xl font-extrabold tracking-widest uppercase sm:text-2xl">
            Termo{" "}
            <span className="text-correct">Bíblico</span>
          </h1>
        </Link>

        <div className="flex items-center gap-1">
          {onStats && (
            <button
              type="button"
              onClick={onStats}
              aria-label="Estatísticas"
              className="rounded-lg p-2 text-xl hover:bg-stone-200 dark:hover:bg-stone-700"
            >
              📊
            </button>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
