"use client";

import type { CSSProperties } from "react";
import type { LetterStatus } from "@/lib/game-logic";
import { REVEAL_STEP_MS } from "@/hooks/useGame";

const REVEAL_BG: Record<LetterStatus, string> = {
  correct: "#3aa394",
  present: "#d3ad69",
  absent: "var(--tile-absent)",
};

const STATIC_CLASSES: Record<LetterStatus, string> = {
  correct: "bg-correct border-correct text-white",
  present: "bg-present border-present text-white",
  absent:
    "bg-stone-400 border-stone-400 text-white dark:bg-stone-700 dark:border-stone-700",
};

interface TileProps {
  letter: string;
  status: LetterStatus | null;
  /** índice da coluna (para escalonar animações) */
  index: number;
  /** anima o flip de revelação */
  animateReveal?: boolean;
  /** anima o salto de vitória */
  bounce?: boolean;
  /** célula da linha atual (recém-digitada) */
  justTyped?: boolean;
}

export function Tile({
  letter,
  status,
  index,
  animateReveal = false,
  bounce = false,
  justTyped = false,
}: TileProps) {
  const base =
    "flex aspect-square w-full items-center justify-center rounded border-2 text-2xl font-extrabold uppercase select-none sm:text-3xl";

  let stateClasses =
    "border-stone-300 dark:border-stone-600 bg-transparent";
  let style: CSSProperties | undefined;

  if (status) {
    if (bounce) {
      stateClasses = `${STATIC_CLASSES[status]} tile-bounce`;
      style = { animationDelay: `${index * 100}ms` };
    } else if (animateReveal) {
      stateClasses = "tile-flip border-stone-300 dark:border-stone-600";
      style = {
        ["--reveal-bg" as string]: REVEAL_BG[status],
        animationDelay: `${index * REVEAL_STEP_MS}ms`,
      };
    } else {
      stateClasses = STATIC_CLASSES[status];
    }
  } else if (letter) {
    stateClasses = `border-stone-500 dark:border-stone-400 ${justTyped ? "tile-pop" : ""}`;
  }

  return (
    <div className={`${base} ${stateClasses}`} style={style}>
      {letter}
    </div>
  );
}
