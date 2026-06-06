# Termo Bíblico 🙏

Jogo diário de palavras com temática bíblica, inspirado no [Termo](https://term.ooo)/Wordle.
Construído com Next.js (App Router) + TypeScript + Tailwind CSS. Sem login, sem banco de dados.

## Funcionalidades

- **Palavra do dia** — uma palavra bíblica nova todo dia (4 a 8 letras, tabuleiro adaptável), igual para todos os jogadores (fuso de Brasília)
- **Acentos automáticos** — digite sem acento, o jogo preenche (MOISES → MOISÉS)
- **Dica bíblica** — botão 💡 revela uma pista; ao final, a referência bíblica da palavra
- **Estatísticas** — vitórias, sequências e distribuição de tentativas no `localStorage`
- **Compartilhar resultado** — grade de emojis 🟩🟨⬛ via Web Share API / clipboard
- **Desafios personalizados** — crie uma palavra em `/criar` e compartilhe o link (a palavra vai codificada na própria URL, sem servidor)
- **Tema claro/escuro** com persistência
- **Google AdSense** pronto para ativar (ver abaixo)

## Rodando localmente

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Ativando o Google AdSense

1. Crie/aprove sua conta em [adsense.google.com](https://adsense.google.com) com o domínio do site.
2. Configure a variável de ambiente (local em `.env.local`, produção via `vercel env`):
   ```
   NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-SEU_ID_AQUI
   ```
3. Edite `public/ads.txt` com a linha fornecida pelo painel do AdSense.
4. (Opcional) Crie blocos de anúncio no painel e troque os valores de `slot` nos componentes `<AdBanner slot="..." />`.

Sem o ID configurado, nenhum script de anúncio é carregado (placeholders aparecem apenas em desenvolvimento).

## Estrutura

```
src/
├── app/                # Páginas: / (diário), /criar, /desafio, /como-jogar, /sobre, /privacidade
├── components/         # UI: tabuleiro, teclado, modais, anúncios
├── hooks/useGame.ts    # Máquina de estados do jogo (reutilizada pelo diário e desafios)
└── lib/                # Lógica pura: avaliação, palavra do dia, codec de desafios, storage
public/dict/{4..8}.txt  # Dicionários PT-BR por tamanho (validação de tentativas)
```

## Adicionando palavras

Edite `src/lib/words.ts` e adicione entradas **ao final da lista** (a ordem embaralhada é determinística — inserir no meio mudaria palavras de dias futuros já "agendados").

## Deploy

```bash
vercel
```
