import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AdBanner } from "@/components/ads/AdBanner";

export const metadata: Metadata = {
  title: "Como jogar",
  description:
    "Aprenda as regras do Termo Bíblico: descubra a palavra bíblica do dia em até 6 tentativas usando as dicas de cores.",
};

export default function HowToPlayPage() {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8">
        <article className="prose-sm space-y-6">
          <h2 className="text-2xl font-extrabold">Como jogar o Termo Bíblico</h2>

          <section className="space-y-3 text-stone-700 dark:text-stone-300">
            <p>
              O <strong>Termo Bíblico</strong> é um jogo diário de adivinhação
              de palavras inspirado no clássico Termo (Wordle), com uma
              diferença especial: todas as palavras vêm das Escrituras —
              personagens, lugares, livros da Bíblia e termos da fé cristã.
            </p>
            <p>
              Todos os dias, à meia-noite (horário de Brasília), uma nova
              palavra secreta é escolhida. Ela pode ter de{" "}
              <strong>4 a 8 letras</strong>, e você tem{" "}
              <strong>6 tentativas</strong> para descobri-la.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-lg font-bold">As cores</h3>
            <ul className="space-y-2 text-stone-700 dark:text-stone-300">
              <li className="flex items-center gap-2">
                <span className="inline-block h-5 w-5 rounded bg-correct" />
                <span>
                  <strong>Verde:</strong> a letra está na palavra e na posição
                  certa.
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="inline-block h-5 w-5 rounded bg-present" />
                <span>
                  <strong>Amarelo:</strong> a letra está na palavra, mas em
                  outra posição.
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="inline-block h-5 w-5 rounded bg-stone-400 dark:bg-stone-700" />
                <span>
                  <strong>Cinza:</strong> a letra não está na palavra.
                </span>
              </li>
            </ul>
          </section>

          <section className="space-y-3 text-stone-700 dark:text-stone-300">
            <h3 className="text-lg font-bold">Dicas importantes</h3>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                Digite sem se preocupar com acentos: o jogo preenche acentos e
                cedilha automaticamente (digite MOISES e o jogo mostra MOISÉS).
              </li>
              <li>
                Letras podem se repetir na palavra — fique atento às cores.
              </li>
              <li>
                Se precisar de ajuda, use o botão <strong>💡 Dica</strong> para
                ver uma pista sobre a palavra do dia.
              </li>
              <li>
                Ao final, você descobre a <strong>referência bíblica</strong> da
                palavra — uma ótima forma de aprender mais sobre a Bíblia
                brincando.
              </li>
            </ul>
          </section>

          <section className="space-y-3 text-stone-700 dark:text-stone-300">
            <h3 className="text-lg font-bold">Desafie seus amigos</h3>
            <p>
              Além da palavra do dia, você pode{" "}
              <Link href="/criar" className="font-semibold text-correct hover:underline">
                criar um desafio personalizado
              </Link>{" "}
              com qualquer palavra e enviar o link pelo WhatsApp. Seu amigo
              tenta adivinhar e pode comparar o resultado com você!
            </p>
          </section>

          <div className="pt-4 text-center">
            <Link
              href="/"
              className="inline-block rounded-xl bg-correct px-8 py-3 font-bold text-white transition hover:brightness-110"
            >
              Jogar agora
            </Link>
          </div>
        </article>

        <AdBanner slot="howto-bottom" className="mt-8" />
      </main>
      <Footer />
    </>
  );
}
