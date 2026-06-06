import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-line px-3.5 pt-[18px] pb-6 text-center text-[13px] text-ink-faint">
      <nav className="mb-2 flex flex-wrap justify-center gap-x-[18px] gap-y-1.5">
        <Link href="/como-jogar" className="text-ink-soft hover:text-accent hover:underline">
          Como jogar
        </Link>
        <Link href="/criar" className="text-ink-soft hover:text-accent hover:underline">
          Criar desafio
        </Link>
        <Link href="/sobre" className="text-ink-soft hover:text-accent hover:underline">
          Sobre
        </Link>
        <Link href="/privacidade" className="text-ink-soft hover:text-accent hover:underline">
          Privacidade
        </Link>
      </nav>
      <p className="italic">
        “Lâmpada para os meus pés é a tua palavra.” — Salmos 119:105
      </p>
    </footer>
  );
}
