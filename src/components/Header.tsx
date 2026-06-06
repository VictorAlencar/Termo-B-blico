"use client";

import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { ChartIcon, HelpIcon, QuillIcon } from "./icons";

interface HeaderProps {
  onHelp?: () => void;
  onStats?: () => void;
}

export function Header({ onHelp, onStats }: HeaderProps) {
  return (
    <header className="tb-header">
      <div className="mx-auto flex max-w-[640px] items-center justify-between px-4 py-3">
        <div className="flex gap-0.5">
          {onHelp ? (
            <button
              type="button"
              onClick={onHelp}
              aria-label="Como jogar"
              className="tb-iconbtn"
            >
              <HelpIcon />
            </button>
          ) : (
            <Link href="/como-jogar" aria-label="Como jogar" className="tb-iconbtn">
              <HelpIcon />
            </Link>
          )}
          <Link href="/criar" aria-label="Criar desafio" className="tb-iconbtn">
            <QuillIcon />
          </Link>
        </div>

        <Link href="/" className="tb-wordmark">
          Termo <span className="accent">Bíblico</span>
          <span className="dot">.</span>
        </Link>

        <div className="flex gap-0.5">
          {onStats && (
            <button
              type="button"
              onClick={onStats}
              aria-label="Estatísticas"
              className="tb-iconbtn"
            >
              <ChartIcon />
            </button>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
