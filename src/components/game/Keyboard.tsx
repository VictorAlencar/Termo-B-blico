"use client";

import type { LetterStatus } from "@/lib/game-logic";
import { BackspaceIcon } from "@/components/icons";

const ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACKSPACE"],
];

interface KeyboardProps {
  statuses: Record<string, LetterStatus>;
  onKey: (key: string) => void;
}

export function Keyboard({ statuses, onKey }: KeyboardProps) {
  return (
    <div className="mx-auto mt-0.5 flex w-full max-w-[500px] flex-col gap-[7px]">
      {ROWS.map((row, ri) => (
        <div key={ri} className="flex justify-center gap-1.5">
          {row.map((key) => {
            const isSpecial = key.length > 1;
            const status = statuses[key];
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
                className={`tb-key${isSpecial ? " special" : ""}${
                  status ? ` s-${status}` : ""
                }`}
              >
                {key === "BACKSPACE" ? <BackspaceIcon /> : key}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
