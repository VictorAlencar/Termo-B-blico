import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description:
    "Política de privacidade do Termo Bíblico: como tratamos dados, cookies e publicidade.",
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8">
        <article className="space-y-6 text-stone-700 dark:text-stone-300">
          <h2 className="text-2xl font-extrabold text-foreground">
            Política de Privacidade
          </h2>
          <p className="text-sm text-stone-500">
            Última atualização: 6 de junho de 2026
          </p>

          <section className="space-y-2">
            <h3 className="text-lg font-bold text-foreground">
              1. Dados que coletamos
            </h3>
            <p>
              O Termo Bíblico <strong>não exige cadastro</strong> e não coleta
              dados pessoais identificáveis. Seu progresso no jogo e suas
              estatísticas (vitórias, sequências e distribuição de tentativas)
              são armazenados exclusivamente no{" "}
              <strong>seu próprio navegador</strong> (localStorage) e nunca são
              enviados aos nossos servidores.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-lg font-bold text-foreground">
              2. Cookies e publicidade
            </h3>
            <p>
              Este site exibe anúncios fornecidos pelo{" "}
              <strong>Google AdSense</strong>. O Google e seus parceiros podem
              utilizar cookies e identificadores para exibir anúncios
              personalizados com base em visitas anteriores a este e a outros
              sites.
            </p>
            <p>
              Você pode desativar a publicidade personalizada acessando as{" "}
              <a
                href="https://adssettings.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-correct hover:underline"
              >
                Configurações de anúncios do Google
              </a>
              . Para mais detalhes sobre como o Google utiliza dados, consulte{" "}
              <a
                href="https://policies.google.com/technologies/partner-sites"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-correct hover:underline"
              >
                policies.google.com/technologies/partner-sites
              </a>
              .
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-lg font-bold text-foreground">
              3. Links de desafio
            </h3>
            <p>
              Ao criar um desafio personalizado, a palavra escolhida é
              codificada diretamente no link gerado. Nenhuma informação é
              armazenada em servidores — o link contém tudo o que é necessário
              para o jogo funcionar.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-lg font-bold text-foreground">
              4. Seus direitos
            </h3>
            <p>
              Como não mantemos dados pessoais em servidores, você pode apagar
              todos os dados do jogo a qualquer momento limpando os dados de
              navegação do seu navegador para este site.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-lg font-bold text-foreground">5. Contato</h3>
            <p>
              Dúvidas sobre esta política? Escreva para{" "}
              <a
                href="mailto:victor@sunne.com.br"
                className="font-semibold text-correct hover:underline"
              >
                victor@sunne.com.br
              </a>
              .
            </p>
          </section>
        </article>
      </main>
      <Footer />
    </>
  );
}
