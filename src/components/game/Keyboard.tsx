"use client";

import type { LetterStatus } from "@/lib/game-logic";

const ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACKSPACE"],
];

const STATUS_CLASSES: Record<LetterStatus, string> = {
  correct: "bg-correct text-white",
  present: "bg-present text-white",
  absent:
    "bg-stone-400 text-white opacity-60 dark:bg-stone-800 dark:text-stone-400",
};

interface KeyboardProps {
  statuses: Record<string, LetterStatus>;
  onKey: (key: string) => void;
}

export function Keyboard({ statuses, onKey }: KeyboardProps) {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-1.5 px-1">
      {ROWS.map((row, ri) => (
        <div key={ri} className="flex justify-center gap-1.5">
          {row.map((key) => {
            const isSpecial = key.length > 1;
            const status = statuses[key];
            const colorClasses = status
              ? STATUS_CLASSES[status]
              : "bg-stone-200 text-stone-800 hover:bg-stone-300 dark:bg-stone-700 dark:text-stone-100 dark:hover:bg-stone-600";
            return (
              <button
                key={key}
                type="button"
                onClick={() => onKey(key)}
                aria-label={
                  key === "BACKSPACE"
                    ? "Apagar"
                    : key === "ENTER"
                      ? "Enviar"
                      : key
                }
                className={`flex h-12 items-center justify-center rounded font-bold uppercase transition-colors select-none sm:h-14 ${
                  isSpecial
                    ? "flex-[1.6] px-1 text-xs sm:text-sm"
                    : "flex-1 text-base sm:text-lg"
                } ${colorClasses}`}
              >
                {key === "BACKSPACE" ? "⌫" : key}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
