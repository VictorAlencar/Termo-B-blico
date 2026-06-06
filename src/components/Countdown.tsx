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
    <div className="tb-countdown">
      <p className="lbl">Próxima palavra em</p>
      <p className="time">
        {remaining === null ? "--:--:--" : format(remaining)}
      </p>
    </div>
  );
}
