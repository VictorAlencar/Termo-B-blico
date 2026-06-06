# Handoff: Termo Bíblico — reskin "Pergaminho + Aurora"

## Visão geral
Reestilização visual completa do **Termo Bíblico** (jogo diário de palavras, base Wordle)
para um clima bíblico/escritural voltado ao público evangélico — **sem imagens de santos**.
A mecânica do jogo **não muda**: é puramente tema, tipografia, cores, ícones e um
acréscimo de conteúdo (versículo ao revelar a palavra).

Direção visual escolhida:
- **Base de pergaminho claro** (off-white quente) com um leve **brilho dourado / aurora** no topo.
- **Tema escuro "Candlelit"** alternável (mantém o glow, fundo marrom quente).
- **Paleta vinho + dourado + verde-oliva.**
- **Tipografia com serifa** (Cinzel para títulos e peças; Spectral para corpo).
- **Ícones monoline em SVG** no lugar dos emojis.
- **Versículo + referência** exibidos ao final de cada partida.
- Ornamentação mínima.

## Sobre os arquivos desta pasta
Os arquivos em `reference/` são **referências de design feitas em HTML/React (Babel no browser)** —
um protótipo que mostra a aparência e o comportamento pretendidos. **Não são código de produção
para copiar e colar.** A tarefa é **reproduzir esse visual no seu próprio codebase**
(Next.js + TypeScript + Tailwind v4, App Router) usando os componentes e padrões que você já tem.

Seu codebase atual (do repositório `VictorAlencar/Termo-B-blico`) já tem toda a estrutura:
`src/app/globals.css`, `src/components/game/{Tile,Board,Keyboard}.tsx`, `Header.tsx`,
`Footer.tsx`, `Modal.tsx`, `HelpModal.tsx`, `StatsModal.tsx`, `ThemeToggle.tsx`, etc.
O trabalho é **trocar tokens e classes** desses arquivos — a lógica (`useGame`, `game-logic`,
`words.ts`, `daily.ts`, storage) permanece intacta.

## Fidelidade
**Alta fidelidade (hifi).** Cores, tipografia, espaçamento e estados finais estão definidos.
Reproduza fielmente, adaptando às classes Tailwind/variáveis CSS do projeto.

---

## Design Tokens

O projeto já usa CSS custom properties em `globals.css` com `@theme` do Tailwind v4.
Substitua/adicione os tokens abaixo. **Tudo é dirigido por `data-theme` e `data-palette`
no `<html>`** (em vez de só a classe `.dark`).

### Tipografia (Google Fonts — substituem Geist)
```
Títulos / wordmark / peças:  Cinzel        (400, 600, 700)
Corpo / textos:              Spectral      (400, 500, 600 + itálico)
Alternativa de peça:         EB Garamond   (400, 600)
Alternativa "linear":        Inter Tight   (600, 700)
```
Import (Next: usar `next/font/google` ou `<link>`):
```
https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Spectral:ital,wght@0,400;0,500;0,600;1,400;1,500&family=EB+Garamond:wght@400;600&family=Inter+Tight:wght@600;700&display=swap
```
Escala de uso:
- Wordmark "TERMO BÍBLICO": Cinzel 600, ~22px, `letter-spacing: 0.14em`, "Bíblico" na cor de acento, "." em dourado.
- Peças do tabuleiro: Cinzel 700, `clamp(26px, 8vw, 38px)`, uppercase.
- Eyebrow "DESAFIO #1 · 5 LETRAS": Cinzel 12px, `letter-spacing: 0.18em`, uppercase, `--ink-faint`.
- Corpo / artigos: Spectral 400, 15.5px, line-height 1.62.
- Títulos de página: Cinzel 600, 24px.

### Cores

**Tema claro (pergaminho)** — `[data-theme="light"]`
```
--paper:              #f3ead4   (fundo)
--paper-raised:       #faf3e1   (cards / modais)
--paper-sunken:       #ebdfc2   (bloco de revelação)
--ink:                #2c2620   (texto principal)
--ink-soft:           #6c6150   (texto secundário)
--ink-faint:          #9c9077   (legendas)
--line:               #dccdaa   (bordas)
--line-strong:        #c2b287
--tile-letter:        #fdf8ec   (letra sobre peça colorida)
--tile-empty-border:  #d8c9a4   (peça vazia)
--tile-typed-border:  #b09f78   (peça digitada)
--absent:             #b8aa89   (peça "não está")
--absent-key:         #c6b794   (tecla "não está")
--key-bg:             #e7dbbe   (tecla padrão)
--key-bg-hover:       #ddcfac
--scrim:              rgba(44,36,24,0.45)
```

**Tema escuro (candlelit)** — `[data-theme="dark"]`
```
--paper:              #1b1712
--paper-raised:       #262019
--paper-sunken:       #14110c
--ink:                #f0e6d0
--ink-soft:           #b8aa8c
--ink-faint:          #877a60
--line:               #3a3124
--line-strong:        #564a34
--tile-letter:        #fdf8ec
--tile-empty-border:  #3a3124
--tile-typed-border:  #6a5c41
--absent:             #443a2a
--absent-key:         #2f281e
--key-bg:             #2e2820
--key-bg-hover:       #3a3227
--scrim:              rgba(8,6,4,0.62)
```

**Paleta — acento + cor de acerto** (padrão "Pergaminho")
```
--accent:   #7d2533   (vinho/garnet — marca, botões primários, "Bíblico")
--accent-ink: #fdf6ea (texto sobre acento)
--gold:     #b3892b   (dourado — "posição errada" / detalhes)
--correct:  #4f7a3f   (verde-oliva — "posição certa")
--present:  #b3892b   (dourado — "posição errada")
```
Variações opcionais (toggle de paleta):
- **Original**: `--accent:#2f8f81; --correct:#3aa394; --present:#c79a3f;`
- **Real**: `--accent:#34508f; --correct:#3d6b4e; --present:#b3892b;`

### Brilho aurora (decoração)
Pseudo-elemento fixo no fundo (atrás de tudo, `z-index:-2`):
```css
body::before {
  content:""; position:fixed; inset:0; z-index:-2; pointer-events:none;
  background:
    radial-gradient(125% 70% at 50% -22%, var(--aurora-1) 0%, transparent 58%),
    radial-gradient(90% 60% at 80% 8%, var(--aurora-2) 0%, transparent 55%);
}
/* claro */ --aurora-1: rgba(212,170,78,0.34); --aurora-2: rgba(180,120,70,0.10);
/* escuro */ --aurora-1: rgba(206,158,64,0.22); --aurora-2: rgba(120,78,40,0.12);
```

### Raios / cantos
```
peça: 9px   tecla: 8px   card/modal: 16px   pílula (botões/dica): 999px
```

### Espaçamento
Grid de 4px (mesma escala já usada). Gaps do tabuleiro/teclado: 6–7px.
Padding de modal: 26px. Padding de card de revelação: 20px.

---

## Mudanças por arquivo (mapa para o seu repo)

> A lógica não muda. Abaixo, só o que precisa de ajuste visual/conteúdo.

### `src/app/globals.css`
- Trocar os blocos `:root` / `.dark` por seletores `[data-theme="light"]` / `[data-theme="dark"]`
  com os tokens acima (ou manter `.dark` se preferir — ver nota no fim).
- Adicionar `[data-palette="…"]` para acento/correct/present.
- Trocar `--color-correct`/`--color-present` por `--correct`/`--present` (ou manter os nomes
  e só mudar os valores: correct `#4f7a3f`, present `#b3892b`).
- Definir `--font-display: "Cinzel"`, `--font-body: "Spectral"`, `--font-tile`.
- Adicionar o `body::before` da aurora.
- Manter as animações existentes (flip/pop/shake/bounce). **Importante:** nas animações de
  modal/scrim, **não animar `opacity` de 0→1** (use só `transform`), senão o conteúdo pode
  ficar invisível se a timeline travar. Veja `reference/theme.css` (keyframes `tb-modal-in`).

### `src/app/layout.tsx`
- Trocar as fontes Geist por Cinzel + Spectral (`next/font/google`).
- No `themeScript`, aplicar `data-theme` no `<html>` (ler `tb-theme`), em vez de classe `.dark`
  (ou manter `.dark` — ver nota).
- `<body className="font-[var(--font-body)] …">`.

### `src/components/game/Tile.tsx`
- `base`: usar `font-family: var(--font-tile)`, peso 700, `rounded-[9px]`, `border-2`.
- Cores estáticas:
  - correct → `bg-[var(--correct)] border-[var(--correct)] text-[var(--tile-letter)]`
  - present → `bg-[var(--present)] border-[var(--present)] text-[var(--tile-letter)]`
  - absent  → `bg-[var(--absent)]  border-[var(--absent)]  text-[var(--tile-letter)]`
  - vazia   → `border-[var(--tile-empty-border)]`
  - digitada→ `border-[var(--tile-typed-border)]`
- `REVEAL_BG`: correct `var(--correct)`, present `var(--present)`, absent `var(--absent)`.

### `src/components/game/Keyboard.tsx`
- Tecla padrão: `bg-[var(--key-bg)] text-[var(--ink)] hover:bg-[var(--key-bg-hover)] border border-[var(--line)] rounded-[8px]`.
- correct/present iguais às peças; absent → `bg-[var(--absent-key)] text-[var(--ink-faint)]`.
- **Backspace**: trocar o emoji `⌫` pelo ícone SVG `Backspace` (ver `reference/icons.jsx`).
- Fonte das teclas: Spectral 600.

### `src/components/Header.tsx`
- Trocar **todos os emojis por ícones SVG** (`reference/icons.jsx`):
  - `❓` → `Help`  · `✏️` → `Quill`  · `📊` → `Chart`  · `☀️/🌙` → `Sun/Moon`
- Botões: `.tb-iconbtn` (40×40, `color: var(--ink-soft)`, hover `bg: var(--accent-soft); color: var(--accent)`).
- Wordmark Cinzel; "Bíblico" em `var(--accent)`, "." em `var(--gold)`.
- Borda inferior `1px var(--line)`, fundo translúcido com `backdrop-filter: blur(6px)`.

### `src/components/ThemeToggle.tsx`
- Alternar `data-theme` (light/dark) no `documentElement`; ícones `Sun`/`Moon`.

### `src/components/HelpModal.tsx`
- Mesmo conteúdo; aplicar tipografia/cores novas, mini-tiles com as novas cores,
  e um ornamento (`Ornament` SVG) no topo. Trocar o `❓/💡` por texto/ícone.

### `src/components/StatsModal.tsx`  ← **acréscimo de conteúdo**
- Bloco de revelação (já existe `referencia` + `dica`): adicionar o **versículo**.
  - palavra: Cinzel 34px, `color: var(--accent)`.
  - referência: Cinzel 13px uppercase, `color: var(--gold)`.
  - **versículo**: Spectral itálico 15px, `color: var(--ink-soft)`.
- Botão "Compartilhar": pílula `bg-[var(--accent)] text-[var(--accent-ink)]` + ícone `Share`.
- Barras de distribuição: `bg-[var(--correct)]`.
- **Requer dado novo:** ver "words.ts" abaixo.

### `src/components/Modal.tsx`
- `bg-[var(--paper-raised)]`, `rounded-[16px]`, borda `var(--line)`, scrim `var(--scrim)` + blur.
- Botão fechar: ícone `Close` SVG (não o caractere `×`).

### `src/components/Footer.tsx`
- Tipografia nova; adicionar o versículo de rodapé:
  "Lâmpada para os meus pés é a tua palavra." — Salmos 119:105.

### `src/app/page.tsx` (botão de dica)
- Trocar `💡 Dica` por botão pílula com ícone `Lamp` + texto **"Pedir uma luz"**.
- Dica exibida com ícone `Lamp` em dourado.

### `src/lib/words.ts`  ← **novo campo**
- Adicionar `versiculo: string` a cada palavra (o tipo `BiblicalWord` já tem `dica` e `referencia`).
- Exemplo:
  ```ts
  { palavra: "TRONO", referencia: "Apocalipse 4:2",
    dica: "Assento real; onde Deus está assentado em glória.",
    versiculo: "“Eis que um trono estava posto no céu, e um assentado sobre o trono.”" }
  ```
- Há 8 exemplos prontos em `reference/data.js` para semear.

---

## Ícones (substituir emojis)
Todos monoline, `stroke="currentColor"`, viewBox 24×24, `stroke-width ~1.7`, cantos arredondados.
Definições completas em **`reference/icons.jsx`**: `Help, Quill, Chart, Sun, Moon, Close,
Backspace, Lamp, Share, Ornament`. Exporte-os como componentes React `.tsx` (ex.
`src/components/icons/`), recebendo `props` e usando `currentColor`.

## Interações & comportamento (inalterados)
- Flip de revelação escalonado (300ms/letra, flip 550ms), pop ao digitar, shake em inválido,
  bounce na vitória. Mantenha os keyframes existentes.
- Modal de estatísticas abre ~900ms após o fim da partida.
- Tema persistido em `localStorage` (`tb-theme`).
- **Não animar opacity de 0→1 em modal/scrim** (usar transform) — ver nota em globals.css.

## Acessibilidade / responsivo
- Alvos de toque das teclas: altura 54px.
- Respeitar `prefers-reduced-motion: reduce` (já há `@media` no protótipo).
- `aria-label` nos botões de ícone (Como jogar, Criar desafio, Estatísticas, Alternar tema, Apagar, Enviar).

## Nota sobre `.dark` vs `data-theme`
O protótipo usa `data-theme`. Se quiser **minimizar mudanças**, você pode manter o sistema
`.dark` atual e apenas: (1) trocar valores de cor, (2) trocar fontes, (3) trocar emojis por SVG,
(4) adicionar o `body::before` da aurora, (5) adicionar `versiculo`. A paleta vira opcional.

## Arquivos de referência (em `reference/`)
- `Termo Bíblico.html` — protótipo completo (abra no navegador para ver tudo funcionando)
- `theme.css` — todos os tokens, classes e keyframes (fonte da verdade visual)
- `icons.jsx` — os 10 ícones SVG
- `data.js` — 8 palavras com dica + referência + versículo
- `gamelib.jsx`, `screens.jsx`, `app.jsx` — componentes do protótipo (board, teclado, modais, páginas)
