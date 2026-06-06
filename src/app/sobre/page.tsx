import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AdBanner } from "@/components/ads/AdBanner";

export const metadata: Metadata = {
  title: "Sobre",
  description:
    "Conheça o Termo Bíblico: um jogo gratuito de palavras com temática bíblica para jogar todos os dias e compartilhar com os amigos.",
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8">
        <article className="space-y-6 text-stone-700 dark:text-stone-300">
          <h2 className="text-2xl font-extrabold text-foreground">
            Sobre o Termo Bíblico
          </h2>

          <p>
            O <strong>Termo Bíblico</strong> nasceu da vontade de unir duas
            paixões: jogos de palavras e as Escrituras. Inspirado no Termo
            (a versão brasileira do Wordle), o jogo propõe um desafio diário
            em que a palavra secreta é sempre um nome, lugar, livro ou termo
            presente na Bíblia.
          </p>

          <p>
            Mais do que um passatempo, queremos que cada partida seja uma
            oportunidade de aprender: ao final de cada jogo, você descobre a{" "}
            <strong>referência bíblica</strong> da palavra e uma curiosidade
            sobre ela. São centenas de palavras catalogadas — de personagens
            como Moisés e Débora a lugares como Jericó e Patmos.
          </p>

          <h3 className="text-lg font-bold text-foreground">Como funciona</h3>
          <ul className="list-disc space-y-1 pl-5">
            <li>Uma nova palavra todos os dias, igual para todos os jogadores.</li>
            <li>Sem cadastro e sem custo — é só abrir e jogar.</li>
            <li>
              Suas estatísticas ficam salvas no seu navegador: sequência de
              vitórias, distribuição de tentativas e mais.
            </li>
            <li>
              Você pode{" "}
              <Link href="/criar" className="font-semibold text-correct hover:underline">
                criar desafios personalizados
              </Link>{" "}
              e compartilhar com amigos e grupos da igreja.
            </li>
          </ul>

          <h3 className="text-lg font-bold text-foreground">Publicidade</h3>
          <p>
            O Termo Bíblico é gratuito e se mantém por meio de anúncios do
            Google AdSense. Saiba mais na nossa{" "}
            <Link href="/privacidade" className="font-semibold text-correct hover:underline">
              política de privacidade
            </Link>
            .
          </p>

          <h3 className="text-lg font-bold text-foreground">Contato</h3>
          <p>
            Sugestões de palavras, correções ou parcerias? Escreva para{" "}
            <a
              href="mailto:victor@sunne.com.br"
              className="font-semibold text-correct hover:underline"
            >
              victor@sunne.com.br
            </a>
            .
          </p>
        </article>

        <AdBanner slot="about-bottom" className="mt-8" />
      </main>
      <Footer />
    </>
  );
}
