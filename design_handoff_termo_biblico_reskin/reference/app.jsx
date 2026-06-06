/* ===== App principal: rotas, tema, tweaks ===== */

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "Pergaminho",
  "palette": "Pergaminho",
  "tilefont": "Gravada",
  "decor": "Mínimo",
  "showVerse": true
}/*EDITMODE-END*/;

const THEME_MAP = { "Pergaminho": "light", "Candlelit": "dark" };
const PALETTE_MAP = { "Pergaminho": "pergaminho", "Original": "original", "Real": "real" };
const TILEFONT_MAP = { "Gravada": "serif", "Garamond": "garamond", "Linear": "sans" };
const DECOR_MAP = { "Sutil": "sutil", "Mínimo": "minimo" };

const DEMO_STATS = { gamesPlayed: 12, gamesWon: 11, currentStreak: 4, maxStreak: 7, distribution: [0, 2, 4, 3, 1, 1] };

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [route, setRoute] = useState("home");
  const [helpOpen, setHelpOpen] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);
  const [hintVisible, setHintVisible] = useState(false);
  const [stats, setStats] = useState(DEMO_STATS);
  const recorded = useRef(false);

  const word = window.TB_WORDS[window.TB_DAILY_INDEX];
  const day = window.TB_DAY_NUMBER;
  const game = useGame(word.palavra);

  // Aplica atributos de tema/paleta/fonte no documento
  useEffect(() => {
    const r = document.documentElement;
    r.setAttribute("data-theme", THEME_MAP[t.theme] || "light");
    r.setAttribute("data-palette", PALETTE_MAP[t.palette] || "pergaminho");
    r.setAttribute("data-tilefont", TILEFONT_MAP[t.tilefont] || "serif");
    r.setAttribute("data-decor", DECOR_MAP[t.decor] || "minimo");
  }, [t.theme, t.palette, t.tilefont, t.decor]);

  // Ao terminar: registra resultado + abre estatísticas
  useEffect(() => {
    if (game.finished && !recorded.current) {
      recorded.current = true;
      setStats((s) => {
        const won = game.status === "won";
        const dist = [...s.distribution];
        if (won) dist[game.attempts - 1] = (dist[game.attempts - 1] || 0) + 1;
        return {
          gamesPlayed: s.gamesPlayed + 1,
          gamesWon: s.gamesWon + (won ? 1 : 0),
          currentStreak: won ? s.currentStreak + 1 : 0,
          maxStreak: Math.max(s.maxStreak, won ? s.currentStreak + 1 : s.currentStreak),
          distribution: dist,
        };
      });
      const id = setTimeout(() => setStatsOpen(true), 900);
      return () => clearTimeout(id);
    }
  }, [game.finished, game.status, game.attempts]);

  const toggleTheme = () => setTweak("theme", t.theme === "Candlelit" ? "Pergaminho" : "Candlelit");
  const nav = (r) => { setRoute(r); window.scrollTo(0, 0); };

  const showHint = () => { game.useHint(); setHintVisible(true); };

  const renderHome = () => (
    <main className="tb-main">
      <p className="tb-eyebrow">Desafio #{day} · {game.wordLength} letras</p>
      <Board game={game} />
      {game.status === "playing" && (
        <div className="tb-hint-wrap">
          {hintVisible || game.hintUsed ? (
            <span className="tb-hint-text"><TBIcon.Lamp />{word.dica}</span>
          ) : (
            <button className="tb-hint-btn" onClick={showHint}><TBIcon.Lamp />Pedir uma luz</button>
          )}
        </div>
      )}
      <Keyboard statuses={game.keyboardStatuses} onKey={game.onKey} />
      <div className="tb-ad">Espaço reservado para anúncio</div>
    </main>
  );

  return (
    <React.Fragment>
      <Header onHelp={() => setHelpOpen(true)} onStats={() => setStatsOpen(true)}
        onNav={nav} theme={THEME_MAP[t.theme]} onToggleTheme={toggleTheme} />
      <Toast message={game.toast} />

      {route === "home" && renderHome()}
      {route === "como-jogar" && <ComoJogarPage onNav={nav} />}
      {route === "sobre" && <SobrePage onNav={nav} />}
      {route === "criar" && <CriarPage onNav={nav} />}
      {route === "privacidade" && <PrivacidadePage onNav={nav} />}

      <Footer onNav={nav} />

      <HelpModal open={helpOpen} onClose={() => setHelpOpen(false)} onNav={nav} />
      <StatsModal open={statsOpen} onClose={() => setStatsOpen(false)}
        game={game} word={t.showVerse ? word : { ...word, versiculo: "" }} stats={stats} day={day} />

      <TweaksPanel title="Tweaks">
        <TweakSection label="Atmosfera" />
        <TweakRadio label="Tema" value={t.theme} options={["Pergaminho", "Candlelit"]}
          onChange={(v) => setTweak("theme", v)} />
        <TweakSelect label="Paleta" value={t.palette} options={["Pergaminho", "Original", "Real"]}
          onChange={(v) => setTweak("palette", v)} />
        <TweakSection label="Tipografia das peças" />
        <TweakRadio label="Letra" value={t.tilefont} options={["Gravada", "Garamond", "Linear"]}
          onChange={(v) => setTweak("tilefont", v)} />
        <TweakSection label="Detalhes" />
        <TweakRadio label="Ornamento" value={t.decor} options={["Sutil", "Mínimo"]}
          onChange={(v) => setTweak("decor", v)} />
        <TweakToggle label="Versículo ao revelar" value={t.showVerse}
          onChange={(v) => setTweak("showVerse", v)} />
      </TweaksPanel>
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
