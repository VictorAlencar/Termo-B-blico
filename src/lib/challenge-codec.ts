import { isPlayableWord } from "./game-logic";

export interface Challenge {
  /** Palavra (forma exibida, pode ter acentos) */
  word: string;
  /** Dica opcional do criador */
  hint?: string;
}

// Chave fixa de ofuscação — NÃO é criptografia, só evita que a palavra
// apareça legível na URL compartilhada.
const KEY = "TERMOBIBLICO";

function xor(bytes: Uint8Array): Uint8Array {
  const out = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) {
    out[i] = bytes[i] ^ KEY.charCodeAt(i % KEY.length);
  }
  return out;
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(s: string): Uint8Array {
  const base64 = s.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(base64);
  return Uint8Array.from(binary, (c) => c.charCodeAt(0));
}

/** Codifica um desafio para o parâmetro `d` da URL */
export function encodeChallenge(challenge: Challenge): string {
  const payload = JSON.stringify({
    w: challenge.word.trim().toUpperCase(),
    ...(challenge.hint?.trim() ? { h: challenge.hint.trim() } : {}),
  });
  return toBase64Url(xor(new TextEncoder().encode(payload)));
}

/** Decodifica o parâmetro `d` da URL; retorna null se inválido/corrompido */
export function decodeChallenge(code: string): Challenge | null {
  try {
    const payload = new TextDecoder().decode(xor(fromBase64Url(code)));
    const data = JSON.parse(payload) as { w?: string; h?: string };
    if (typeof data.w !== "string" || !isPlayableWord(data.w)) return null;
    if (data.h !== undefined && typeof data.h !== "string") return null;
    return { word: data.w, hint: data.h };
  } catch {
    return null;
  }
}

/** URL completa do desafio para compartilhar */
export function buildChallengeUrl(challenge: Challenge, origin: string): string {
  return `${origin}/desafio?d=${encodeChallenge(challenge)}`;
}
