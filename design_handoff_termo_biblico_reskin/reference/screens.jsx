/* ===== Modais e telas auxiliares ===== */

function Modal({ open, onClose, title, children }) {
  useEffect(() => {
    if (!open) return;
    const h = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="tb-scrim" onClick={onClose} role="dialog" aria-modal="true" aria-label={title}>
      <div className="tb-modal" onClick={(e) => e.stopPropagation()}>
        <div className="tb-modal-head">
          <h2 className="tb-modal-title">{title}</h2>
          <button className="tb-close" aria-label="Fechar" onClick={onClose}><TBIcon.Close /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function MiniTile({ letter, variant }) {
  return <span className={`tb-minitile ${variant ? "s-" + variant : ""}`}>{letter}</span>;
}
function ExampleRow({ word, highlight, variant }) {
  return (
    <div className="tb-help-row">
      {word.split("").map((l, i) => <MiniTile key={i} letter={l} variant={i === highlight ? variant : undefined} />)}
    </div>
  );
}

function HelpModal({ open, onClose, onNav }) {
  return (
    <Modal open={open} onClose={onClose} title="Como jogar">
      <div className="tb-ornament"><TBIcon.Ornament /></div>
      <div className="tb-prose">
        <p>Descubra a <strong>palavra bíblica do dia</strong> em até <strong>6 tentativas</strong>. A cada palpite, as cores revelam o quão perto você chegou.</p>
        <ExampleRow word="JESUS" highlight={0} variant="correct" />
        <p>A letra <strong>J</strong> está na palavra e na <strong>posição certa</strong>.</p>
        <ExampleRow word="GRACA" highlight={2} variant="present" />
        <p>A letra <strong>A</strong> está na palavra, mas em <strong>outra posição</strong>.</p>
        <ExampleRow word="PEDRO" highlight={4} variant="absent" />
        <p>A letra <strong>O</strong> <strong>não está</strong> na palavra.</p>
        <ul>
          <li>O tamanho da palavra varia a cada dia (4 a 8 letras).</li>
          <li>Os acentos são preenchidos automaticamente — digite sem acento.</li>
          <li>Pode ser nome de personagem, lugar, livro ou termo bíblico.</li>
          <li>Travou? Toque em <strong>Pedir uma luz</strong> para ver uma pista.</li>
          <li>Uma nova palavra surge todo dia à meia-noite (horário de Brasília).</li>
        </ul>
        <p>Você também pode <a onClick={() => { onClose(); onNav("criar"); }}>criar um desafio</a> com a sua própria palavra e enviar para os amigos e o grupo da igreja.</p>
      </div>
    </Modal>
  );
}

function Countdown() {
  const [t, setT] = useState("23:11:42");
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const next = new Date(now);
      next.setHours(24, 0, 0, 0);
      const total = Math.max(0, Math.floor((next - now) / 1000));
      const h = String(Math.floor(total / 3600)).padStart(2, "0");
      const m = String(Math.floor((total % 3600) / 60)).padStart(2, "0");
      const s = String(total % 60).padStart(2, "0");
      setT(`${h}:${m}:${s}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="tb-countdown">
      <p className="lbl">Próxima palavra em</p>
      <p className="time">{t}</p>
    </div>
  );
}

function StatsModal({ open, onClose, game, word, stats, day }) {
  const [feedback, setFeedback] = useState(null);
  const maxDist = Math.max(1, ...stats.distribution);
  const winRate = stats.gamesPlayed > 0 ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) : 0;
  const share = () => {
    const rows = game.evaluations.map((row) =>
      row.map((s) => (s === "correct" ? "🟩" : s === "present" ? "🟨" : "⬛")).join("")
    ).join("\n");
    const txt = `Termo Bíblico #${day} ${game.status === "won" ? game.attempts : "X"}/6\n\n${rows}`;
    if (navigator.share) navigator.share({ text: txt }).catch(() => {});
    else { navigator.clipboard?.writeText(txt); setFeedback("Resultado copiado!"); setTimeout(() => setFeedback(null), 2000); }
  };
  return (
    <Modal open={open} onClose={onClose} title="Estatísticas">
      {game.finished && (
        <div className="tb-reveal">
          <p className="label">{game.status === "won" ? "Você descobriu!" : "A palavra era"}</p>
          <p className="word">{game.solutionDisplay}</p>
          <p className="ref">{word.referencia}</p>
          <p className="verse">{word.versiculo}</p>
        </div>
      )}
      <div className="tb-stats-grid">
        {[[stats.gamesPlayed, "jogos"], [`${winRate}%`, "vitórias"], [stats.currentStreak, "sequência"], [stats.maxStreak, "melhor"]].map(([v, l]) => (
          <div key={l}><div className="tb-stat-val">{v}</div><div className="tb-stat-lbl">{l}</div></div>
        ))}
      </div>
      <p className="tb-dist-title">Distribuição de tentativas</p>
      <div>
        {stats.distribution.map((c, i) => (
          <div key={i} className="tb-dist-row">
            <span className="n">{i + 1}</span>
            <div className={`tb-dist-bar ${c === 0 ? "empty" : ""}`} style={{ width: `${(c / maxDist) * 100}%` }}>{c}</div>
          </div>
        ))}
      </div>
      {game.finished && (
        <>
          <div className="tb-ornament"><TBIcon.Ornament /></div>
          <div className="tb-share-row">
            <Countdown />
            <button className="tb-btn-primary" onClick={share}>
              <TBIcon.Share />{feedback ?? "Compartilhar"}
            </button>
          </div>
        </>
      )}
    </Modal>
  );
}

/* ---------- Páginas (artigo) ---------- */
function PageShell({ title, children }) {
  return (
    <main className="tb-main" style={{ maxWidth: 640, alignItems: "stretch" }}>
      <article className="tb-prose" style={{ width: "100%" }}>
        <h2>{title}</h2>
        <div className="tb-ornament" style={{ justifyContent: "flex-start", margin: "10px 0 18px" }}><TBIcon.Ornament /></div>
        {children}
      </article>
    </main>
  );
}

function ComoJogarPage({ onNav }) {
  return (
    <PageShell title="Como jogar o Termo Bíblico">
      <p>O <strong>Termo Bíblico</strong> é um jogo diário de adivinhação de palavras inspirado no clássico Termo (Wordle), com uma diferença especial: todas as palavras vêm das Escrituras — personagens, lugares, livros da Bíblia e termos da fé cristã.</p>
      <p>Todos os dias, à meia-noite (horário de Brasília), uma nova palavra secreta é escolhida. Ela pode ter de <strong>4 a 8 letras</strong>, e você tem <strong>6 tentativas</strong> para descobri-la.</p>
      <h3>As cores</h3>
      <ul>
        <li><span className="tb-swatch" style={{ background: "var(--correct)" }}></span><strong>Verde:</strong> a letra está na palavra e na posição certa.</li>
        <li><span className="tb-swatch" style={{ background: "var(--present)" }}></span><strong>Dourado:</strong> a letra está na palavra, mas em outra posição.</li>
        <li><span className="tb-swatch" style={{ background: "var(--absent)" }}></span><strong>Apagada:</strong> a letra não está na palavra.</li>
      </ul>
      <h3>Dicas importantes</h3>
      <ul>
        <li>Digite sem se preocupar com acentos: o jogo preenche acentos e cedilha (digite MOISES e aparece MOISÉS).</li>
        <li>Letras podem se repetir na palavra — fique atento às cores.</li>
        <li>Precisa de ajuda? Peça uma luz para ver uma pista sobre a palavra do dia.</li>
        <li>Ao final, você descobre a <strong>referência bíblica</strong> e um versículo — uma forma de aprender brincando.</li>
      </ul>
      <h3>Desafie seus amigos</h3>
      <p>Além da palavra do dia, você pode <a onClick={() => onNav("criar")}>criar um desafio personalizado</a> com qualquer palavra e enviar o link. Seu amigo tenta adivinhar e compara o resultado com você!</p>
      <p style={{ textAlign: "center", paddingTop: 8 }}>
        <button className="tb-btn-primary" onClick={() => onNav("home")}>Jogar agora</button>
      </p>
    </PageShell>
  );
}

function SobrePage({ onNav }) {
  return (
    <PageShell title="Sobre o Termo Bíblico">
      <p>O <strong>Termo Bíblico</strong> nasceu da vontade de unir duas paixões: jogos de palavras e as Escrituras. Inspirado no Termo (a versão brasileira do Wordle), o jogo propõe um desafio diário em que a palavra secreta é sempre um nome, lugar, livro ou termo presente na Bíblia.</p>
      <p>Mais do que um passatempo, queremos que cada partida seja uma oportunidade de aprender: ao final de cada jogo, você descobre a <strong>referência bíblica</strong> da palavra e um versículo relacionado. São centenas de palavras catalogadas — de personagens como Moisés e Débora a lugares como Jericó e Patmos.</p>
      <h3>Como funciona</h3>
      <ul>
        <li>Uma nova palavra todos os dias, igual para todos os jogadores.</li>
        <li>Sem cadastro e sem custo — é só abrir e jogar.</li>
        <li>Suas estatísticas ficam salvas no seu navegador: sequência de vitórias, distribuição de tentativas e mais.</li>
        <li>Você pode <a onClick={() => onNav("criar")}>criar desafios personalizados</a> e compartilhar com amigos e grupos da igreja.</li>
      </ul>
      <h3>Contato</h3>
      <p>Sugestões de palavras, correções ou parcerias? Escreva para <a href="mailto:contato@termobiblico.com.br">contato@termobiblico.com.br</a>.</p>
    </PageShell>
  );
}

function CriarPage({ onNav }) {
  const [palavra, setPalavra] = useState("");
  const [link, setLink] = useState(null);
  const valid = /^[a-zA-ZçÇáàâãéêíóôõúüÁÀÂÃÉÊÍÓÔÕÚÜ]{4,8}$/.test(palavra.trim());
  return (
    <PageShell title="Criar um desafio">
      <p>Escolha uma palavra de <strong>4 a 8 letras</strong> — de preferência bíblica — e gere um link para enviar aos amigos. A palavra viaja codificada no próprio link: nada fica salvo em servidor.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 380, marginTop: 8 }}>
        <input value={palavra} onChange={(e) => { setPalavra(e.target.value); setLink(null); }}
          placeholder="Ex.: SALMOS" maxLength={8}
          style={{ font: "inherit", fontSize: 18, letterSpacing: "0.1em", textTransform: "uppercase",
            padding: "12px 16px", borderRadius: 10, border: "1px solid var(--line-strong)",
            background: "var(--paper-raised)", color: "var(--ink)", outline: "none" }} />
        <button className="tb-btn-primary" disabled={!valid} style={{ opacity: valid ? 1 : 0.5, alignSelf: "flex-start" }}
          onClick={() => setLink(`termobiblico.com.br/d/${btoa(palavra.trim().toUpperCase()).replace(/=/g, "")}`)}>
          <TBIcon.Quill />Gerar link do desafio
        </button>
        {link && (
          <div style={{ background: "var(--paper-sunken)", border: "1px solid var(--line)", borderRadius: 10, padding: "12px 14px", fontSize: 14, color: "var(--ink-soft)", wordBreak: "break-all" }}>
            <p style={{ margin: "0 0 6px", fontWeight: 600, color: "var(--ink)" }}>Seu desafio está pronto:</p>
            {link}
          </div>
        )}
      </div>
      <p style={{ marginTop: 20 }}><a onClick={() => onNav("home")}>← Voltar à palavra do dia</a></p>
    </PageShell>
  );
}

function PrivacidadePage({ onNav }) {
  return (
    <PageShell title="Privacidade">
      <p>O Termo Bíblico não exige cadastro e não coleta dados pessoais. Seu progresso e suas estatísticas ficam salvos apenas no seu próprio navegador (armazenamento local).</p>
      <p>O site é gratuito e pode exibir anúncios para se manter. Você pode limpar os dados locais a qualquer momento nas configurações do seu navegador.</p>
      <p style={{ marginTop: 20 }}><a onClick={() => onNav("home")}>← Voltar à palavra do dia</a></p>
    </PageShell>
  );
}

Object.assign(window, {
  Modal, HelpModal, StatsModal, Countdown, ComoJogarPage, SobrePage, CriarPage, PrivacidadePage,
});
