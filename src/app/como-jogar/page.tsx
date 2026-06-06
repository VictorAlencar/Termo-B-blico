import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AdBanner } from "@/components/ads/AdBanner";
import { OrnamentIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Como jogar",
  description:
    "Aprenda as regras do Termo Bíblico: descubra a palavra bíblica do dia em até 6 tentativas usando as dicas de cores.",
};

export default function HowToPlayPage() {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-[640px] flex-1 px-4 pt-[22px] pb-7">
        <article className="tb-prose">
          <h2>Como jogar o Termo Bíblico</h2>
          <div
            className="tb-ornament"
            style={{ justifyContent: "flex-start", margin: "10px 0 18px" }}
          >
            <OrnamentIcon />
          </div>

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

          <h3>As cores</h3>
          <ul>
            <li>
              <span className="tb-swatch" style={{ background: "var(--correct)" }} />
              <strong>Verde:</strong> a letra está na palavra e na posição
              certa.
            </li>
            <li>
              <span className="tb-swatch" style={{ background: "var(--present)" }} />
              <strong>Dourado:</strong> a letra está na palavra, mas em outra
              posição.
            </li>
            <li>
              <span className="tb-swatch" style={{ background: "var(--absent)" }} />
              <strong>Apagada:</strong> a letra não está na palavra.
            </li>
          </ul>

          <h3>Dicas importantes</h3>
          <ul>
            <li>
              Digite sem se preocupar com acentos: o jogo preenche acentos e
              cedilha automaticamente (digite MOISES e aparece MOISÉS).
            </li>
            <li>Letras podem se repetir na palavra — fique atento às cores.</li>
            <li>
              Precisa de ajuda? Toque em <strong>Pedir uma luz</strong> para
              ver uma pista sobre a palavra do dia.
            </li>
            <li>
              Ao final, você descobre a <strong>referência bíblica</strong> e
              um versículo — uma forma de aprender brincando.
            </li>
          </ul>

          <h3>Desafie seus amigos</h3>
          <p>
            Além da palavra do dia, você pode{" "}
            <Link href="/criar">criar um desafio personalizado</Link> com
            qualquer palavra e enviar o link. Seu amigo tenta adivinhar e
            compara o resultado com você!
          </p>

          <p className="pt-2 text-center">
            <Link href="/" className="tb-btn-primary">
              Jogar agora
            </Link>
          </p>
        </article>

        <AdBanner slot="howto-bottom" className="mt-8" />
      </main>
      <Footer />
    </>
  );
}
