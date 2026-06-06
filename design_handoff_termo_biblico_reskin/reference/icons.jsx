/* Ícones monoline (currentColor, 24×24) — substituem os emojis.
   Voz visual sóbria, traço fino, alinhada ao tema escritural. */
const TBIcon = {
  Help: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"
      strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.2 9.2a2.8 2.8 0 0 1 5.3 1.1c0 1.9-2.5 2.3-2.5 3.9" />
      <circle cx="12" cy="17" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  ),
  Quill: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"
      strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M4 20s2.5-1 4-2.5C12 13.5 17 9 19.5 4.5c.4 5-2 11-7 13.5C9.5 19.5 6 20 4 20Z" />
      <path d="M4 20c1.5-3 3.8-5.3 6.5-7" />
    </svg>
  ),
  Chart: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"
      strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M4 20V11" />
      <path d="M10 20V5" />
      <path d="M16 20v-6" />
      <path d="M3 20h18" />
    </svg>
  ),
  Sun: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"
      strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4" />
    </svg>
  ),
  Moon: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"
      strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M20 14.5A8 8 0 0 1 9.5 4 7.5 7.5 0 1 0 20 14.5Z" />
    </svg>
  ),
  Close: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  ),
  Backspace: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"
      strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M9 5h11a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H9l-6-7Z" />
      <path d="M16 9.5 11.5 14M11.5 9.5 16 14" />
    </svg>
  ),
  Lamp: (p) => (
    /* lâmpada — "lâmpada para os meus pés é a tua palavra" */
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"
      strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M12 3c1.2 2 3.5 3.4 3.5 6.2A3.5 3.5 0 0 1 12 12.7a3.5 3.5 0 0 1-3.5-3.5C8.5 6.4 10.8 5 12 3Z" />
      <path d="M10 16h4M10.5 19h3" />
      <path d="M12 12.7V16" />
    </svg>
  ),
  Share: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"
      strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="6" cy="12" r="2.4" />
      <circle cx="18" cy="6" r="2.4" />
      <circle cx="18" cy="18" r="2.4" />
      <path d="M8.1 10.9 15.9 7.1M8.1 13.1l7.8 3.8" />
    </svg>
  ),
  Ornament: (p) => (
    /* pequeno losango/estrela de quatro pontas — ornamento neutro */
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"
      strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M12 3c.6 4.2 1.8 5.4 6 6-4.2.6-5.4 1.8-6 6-.6-4.2-1.8-5.4-6-6 4.2-.6 5.4-1.8 6-6Z" />
    </svg>
  ),
};

window.TBIcon = TBIcon;
