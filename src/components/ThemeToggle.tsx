"use client";

import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [dark, setDark] = useState<boolean | null>(null);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("tb-theme", next ? "dark" : "light");
    } catch {
      // sem persistência
    }
    setDark(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Alternar tema claro/escuro"
      className="rounded-lg p-2 text-xl hover:bg-stone-200 dark:hover:bg-stone-700"
    >
      {dark === null ? "🌗" : dark ? "☀️" : "🌙"}
    </button>
  );
}
