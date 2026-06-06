"use client";

import { useEffect, useState } from "react";
import { msUntilNextWord } from "@/lib/daily";

function format(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = String(Math.floor(total / 3600)).padStart(2, "0");
  const m = String(Math.floor((total % 3600) / 60)).padStart(2, "0");
  const s = String(total % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

export function Countdown() {
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    setRemaining(msUntilNextWord());
    const id = setInterval(() => setRemaining(msUntilNextWord()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="text-center">
      <p className="text-xs uppercase tracking-wide text-stone-500 dark:text-stone-400">
        Próxima palavra em
      </p>
      <p className="font-mono text-2xl font-bold tabular-nums">
        {remaining === null ? "--:--:--" : format(remaining)}
      </p>
    </div>
  );
}
