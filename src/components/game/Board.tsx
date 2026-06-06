"use client";

import { useRef } from "react";
import { displayLetter, MAX_GUESSES } from "@/lib/game-logic";
import type { GameApi } from "@/hooks/useGame";
import { Tile } from "./Tile";

export function Board({ game }: { game: GameApi }) {
  const {
    guesses,
    evaluations,
    current,
    wordLength,
    solution,
    status,
    revealing,
    finished,
    shaking,
  } = game;

  // Linhas restauradas do localStorage não animam o flip
  const restoredCount = useRef(guesses.length);
  if (guesses.length < restoredCount.current) {
    restoredCount.current = guesses.length;
  }

  const showCurrentRow = status === "playing" && guesses.length < MAX_GUESSES;
  const emptyRows = Math.max(
    0,
    MAX_GUESSES - guesses.length - (showCurrentRow ? 1 : 0)
  );
  const wonRow = finished && status === "won" ? guesses.length - 1 : -1;

  return (
    <div
      className="mx-auto grid w-full gap-1.5"
      style={{
        maxWidth: `min(100%, ${wordLength * 4}rem)`,
        gridTemplateRows: `repeat(${MAX_GUESSES}, minmax(0, 1fr))`,
      }}
      role="grid"
      aria-label="Tabuleiro do jogo"
    >
      {guesses.map((guess, rowIdx) => {
        const isLastSubmitted = rowIdx === guesses.length - 1;
        const animateReveal =
          rowIdx >= restoredCount.current && isLastSubmitted && revealing;
        const isNewThisSession = rowIdx >= restoredCount.current;
        return (
          <div
            key={rowIdx}
            className="grid gap-1.5"
            style={{ gridTemplateColumns: `repeat(${wordLength}, minmax(0, 1fr))` }}
            role="row"
          >
            {guess.split("").map((letter, i) => {
              const evalStatus = evaluations[rowIdx][i];
              return (
                <Tile
                  key={i}
                  index={i}
                  letter={displayLetter(letter, solution, i, evalStatus)}
                  status={evalStatus}
                  animateReveal={animateReveal}
                  bounce={rowIdx === wonRow && isNewThisSession}
                />
              );
            })}
          </div>
        );
      })}

      {showCurrentRow && (
        <div
          className={`grid gap-1.5 ${shaking ? "row-shake" : ""}`}
          style={{ gridTemplateColumns: `repeat(${wordLength}, minmax(0, 1fr))` }}
          role="row"
        >
          {Array.from({ length: wordLength }, (_, i) => (
            <Tile
              key={i}
              index={i}
              letter={current[i] ?? ""}
              status={null}
              justTyped={i === current.length - 1}
            />
          ))}
        </div>
      )}

      {Array.from({ length: emptyRows }, (_, r) => (
        <div
          key={`empty-${r}`}
          className="grid gap-1.5"
          style={{ gridTemplateColumns: `repeat(${wordLength}, minmax(0, 1fr))` }}
          role="row"
        >
          {Array.from({ length: wordLength }, (_, i) => (
            <Tile key={i} index={i} letter="" status={null} />
          ))}
        </div>
      ))}
    </div>
  );
}
