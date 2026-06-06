/* ===== Lógica do jogo + componentes do tabuleiro ===== */
const { useState, useEffect, useRef, useCallback, useMemo } = React;

const MAX_GUESSES = 6;
const REVEAL_STEP_MS = 300;
const FLIP_DURATION_MS = 550;

function normalize(word) {
  return word.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function evaluateGuess(guess, solution) {
  const result = new Array(guess.length).fill("absent");
  const remaining = {};
  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === solution[i]) result[i] = "correct";
    else remaining[solution[i]] = (remaining[solution[i]] ?? 0) + 1;
  }
  for (let i = 0; i < guess.length; i++) {
    if (result[i] === "correct") continue;
    const l = guess[i];
    if (remaining[l] > 0) { result[i] = "present"; remaining[l]--; }
  }
  return result;
}

const STATUS_PRIORITY = { absent: 0, present: 1, correct: 2 };
function getKeyboardStatuses(guesses, evals) {
  const s = {};
  guesses.forEach((g, gi) => {
    for (let i = 0; i < g.length; i++) {
      const l = g[i], st = evals[gi][i];
      if (!s[l] || STATUS_PRIORITY[st] > STATUS_PRIORITY[s[l]]) s[l] = st;
    }
  });
  return s;
}

function displayLetter(typed, solutionDisplay, index, status) {
  if (status === "correct") return (solutionDisplay[index] ?? typed).toUpperCase();
  return typed;
}

/* ---------- Hook do jogo ---------- */
function useGame(solutionDisplay) {
  const solution = useMemo(() => normalize(solutionDisplay), [solutionDisplay]);
  const wordLength = solution.length;

  const [guesses, setGuesses] = useState([]);
  const [current, setCurrent] = useState("");
  const [status, setStatus] = useState("playing");
  const [revealing, setRevealing] = useState(false);
  const [toast, setToast] = useState(null);
  const [shaking, setShaking] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);
  const toastTimer = useRef(null);

  const evaluations = useMemo(
    () => guesses.map((g) => evaluateGuess(g, solution)),
    [guesses, solution]
  );
  const settled = revealing ? guesses.length - 1 : guesses.length;
  const keyboardStatuses = useMemo(
    () => getKeyboardStatuses(guesses.slice(0, settled), evaluations.slice(0, settled)),
    [guesses, evaluations, settled]
  );

  const showToast = useCallback((msg) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast(msg);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  }, []);

  const shake = useCallback(() => {
    setShaking(true);
    setTimeout(() => setShaking(false), 500);
  }, []);

  const submit = useCallback(() => {
    if (current.length < wordLength) { showToast("Letras insuficientes"); shake(); return; }
    if (!/^[A-Z]+$/.test(current)) { showToast("Use apenas letras"); shake(); return; }
    const guess = current;
    const next = [...guesses, guess];
    const won = guess === solution;
    const lost = !won && next.length >= MAX_GUESSES;
    const nextStatus = won ? "won" : lost ? "lost" : "playing";
    setGuesses(next);
    setCurrent("");
    setRevealing(true);
    setTimeout(() => {
      setRevealing(false);
      setStatus(nextStatus);
    }, wordLength * REVEAL_STEP_MS + FLIP_DURATION_MS);
  }, [current, guesses, wordLength, solution, showToast, shake]);

  const onKey = useCallback((key) => {
    if (status !== "playing" || revealing) return;
    if (key === "ENTER") return submit();
    if (key === "BACKSPACE") return setCurrent((c) => c.slice(0, -1));
    const letter = normalize(key);
    if (/^[A-Z]$/.test(letter)) setCurrent((c) => (c.length < wordLength ? c + letter : c));
  }, [status, revealing, submit, wordLength]);

  useEffect(() => {
    const handler = (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const t = e.target;
      if (t && ["INPUT", "TEXTAREA"].includes(t.tagName)) return;
      if (e.key === "Enter") onKey("ENTER");
      else if (e.key === "Backspace") onKey("BACKSPACE");
      else if (/^[a-zA-ZçÇáàâãéêíóôõúüÁÀÂÃÉÊÍÓÔÕÚÜ]$/.test(e.key)) onKey(e.key);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onKey]);

  const useHint = useCallback(() => setHintUsed(true), []);

  return {
    solutionDisplay, solution, wordLength, guesses, current, status, revealing,
    finished: status !== "playing" && !revealing,
    evaluations, keyboardStatuses, toast, shaking, hintUsed,
    attempts: guesses.length, onKey, useHint, showToast,
  };
}

/* ---------- Tile ---------- */
function Tile({ letter, status, index, animateReveal, bounce, justTyped }) {
  let cls = "tb-tile";
  let style;
  if (status) {
    if (bounce) {
      cls += ` s-${status} tb-bounce`;
      style = { animationDelay: `${index * 100}ms` };
    } else if (animateReveal) {
      cls += " tb-flip";
      const bg = status === "correct" ? "var(--correct)" : status === "present" ? "var(--present)" : "var(--absent)";
      style = { "--reveal-bg": bg, animationDelay: `${index * REVEAL_STEP_MS}ms` };
    } else {
      cls += ` s-${status}`;
    }
  } else if (letter) {
    cls += ` is-typed ${justTyped ? "tb-pop" : ""}`;
  }
  return <div className={cls} style={style}>{letter}</div>;
}

/* ---------- Board ---------- */
function Board({ game }) {
  const { guesses, evaluations, current, wordLength, solutionDisplay, status, revealing, finished, shaking } = game;
  const showCurrent = status === "playing" && guesses.length < MAX_GUESSES;
  const emptyRows = Math.max(0, MAX_GUESSES - guesses.length - (showCurrent ? 1 : 0));
  const wonRow = finished && status === "won" ? guesses.length - 1 : -1;
  const cols = { gridTemplateColumns: `repeat(${wordLength}, 1fr)` };

  return (
    <div className="tb-board" style={{ width: `min(100%, ${wordLength * 4}rem)` }}>
      {guesses.map((guess, r) => {
        const last = r === guesses.length - 1;
        const animateReveal = last && revealing;
        return (
          <div key={r} className="tb-row" style={cols} role="row">
            {guess.split("").map((l, i) => (
              <Tile key={i} index={i}
                letter={displayLetter(l, solutionDisplay, i, evaluations[r][i])}
                status={evaluations[r][i]} animateReveal={animateReveal}
                bounce={r === wonRow} />
            ))}
          </div>
        );
      })}
      {showCurrent && (
        <div className={`tb-row ${shaking ? "tb-shake" : ""}`} style={cols} role="row">
          {Array.from({ length: wordLength }, (_, i) => (
            <Tile key={i} index={i} letter={current[i] ?? ""} status={null} justTyped={i === current.length - 1} />
          ))}
        </div>
      )}
      {Array.from({ length: emptyRows }, (_, r) => (
        <div key={`e${r}`} className="tb-row" style={cols} role="row">
          {Array.from({ length: wordLength }, (_, i) => <Tile key={i} index={i} letter="" status={null} />)}
        </div>
      ))}
    </div>
  );
}

/* ---------- Keyboard ---------- */
const KB_ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACKSPACE"],
];
function Keyboard({ statuses, onKey }) {
  return (
    <div className="tb-keyboard">
      {KB_ROWS.map((row, ri) => (
        <div key={ri} className="tb-krow">
          {row.map((key) => {
            const special = key.length > 1;
            const st = statuses[key];
            return (
              <button key={key} type="button" onClick={() => onKey(key)}
                aria-label={key === "BACKSPACE" ? "Apagar" : key === "ENTER" ? "Enviar" : key}
                className={`tb-key ${special ? "special" : ""} ${st ? "s-" + st : ""}`}>
                {key === "BACKSPACE" ? <TBIcon.Backspace /> : key}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

/* ---------- Header / Footer / Toast ---------- */
function Header({ onHelp, onStats, onNav, theme, onToggleTheme }) {
  return (
    <header className="tb-header">
      <div className="tb-header-inner">
        <div style={{ display: "flex", gap: 2 }}>
          <button className="tb-iconbtn" aria-label="Como jogar" onClick={onHelp}><TBIcon.Help /></button>
          <button className="tb-iconbtn" aria-label="Criar desafio" onClick={() => onNav("criar")}><TBIcon.Quill /></button>
        </div>
        <a className="tb-wordmark" onClick={() => onNav("home")} style={{ cursor: "pointer" }}>
          Termo <span className="accent">Bíblico</span><span className="dot">.</span>
        </a>
        <div style={{ display: "flex", gap: 2 }}>
          <button className="tb-iconbtn" aria-label="Estatísticas" onClick={onStats}><TBIcon.Chart /></button>
          <button className="tb-iconbtn" aria-label="Alternar tema" onClick={onToggleTheme}>
            {theme === "dark" ? <TBIcon.Sun /> : <TBIcon.Moon />}
          </button>
        </div>
      </div>
    </header>
  );
}

function Footer({ onNav }) {
  return (
    <footer className="tb-footer">
      <nav>
        <a onClick={() => onNav("como-jogar")}>Como jogar</a>
        <a onClick={() => onNav("criar")}>Criar desafio</a>
        <a onClick={() => onNav("sobre")}>Sobre</a>
        <a onClick={() => onNav("privacidade")}>Privacidade</a>
      </nav>
      <p className="verse">“Lâmpada para os meus pés é a tua palavra.” — Salmos 119:105</p>
    </footer>
  );
}

function Toast({ message }) {
  if (!message) return null;
  return (
    <div className="tb-toast-layer">
      <div className="tb-toast">{message}</div>
    </div>
  );
}

Object.assign(window, {
  MAX_GUESSES, useGame, Tile, Board, Keyboard, Header, Footer, Toast, normalize, evaluateGuess,
});
