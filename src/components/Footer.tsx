import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-stone-200 py-4 text-center text-xs text-stone-500 dark:border-stone-700 dark:text-stone-400">
      <nav className="mb-1 flex flex-wrap justify-center gap-x-4 gap-y-1">
        <Link href="/como-jogar" className="hover:underline">
          Como jogar
        </Link>
        <Link href="/criar" className="hover:underline">
          Criar desafio
        </Link>
        <Link href="/sobre" className="hover:underline">
          Sobre
        </Link>
        <Link href="/privacidade" className="hover:underline">
          Privacidade
        </Link>
      </nav>
      <p>Termo Bíblico — um jogo de palavras inspirado nas Escrituras.</p>
    </footer>
  );
}
