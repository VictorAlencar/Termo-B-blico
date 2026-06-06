"use client";

import type { CSSProperties } from "react";
import type { LetterStatus } from "@/lib/game-logic";
import { REVEAL_STEP_MS } from "@/hooks/useGame";

const REVEAL_BG: Record<LetterStatus, string> = {
  correct: "var(--correct)",
  present: "var(--present)",
  absent: "var(--absent)",
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
  let className = "tb-tile";
  let style: CSSProperties | undefined;

  if (status) {
    if (bounce) {
      className += ` s-${status} tile-bounce`;
      style = { animationDelay: `${index * 100}ms` };
    } else if (animateReveal) {
      className += " tile-flip";
      style = {
        ["--reveal-bg" as string]: REVEAL_BG[status],
        animationDelay: `${index * REVEAL_STEP_MS}ms`,
      };
    } else {
      className += ` s-${status}`;
    }
  } else if (letter) {
    className += ` is-typed${justTyped ? " tile-pop" : ""}`;
  }

  return (
    <div className={className} style={style}>
      {letter}
    </div>
  );
}
