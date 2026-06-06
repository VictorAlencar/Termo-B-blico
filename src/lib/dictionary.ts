import { normalize } from "./game-logic";
import { WORDS } from "./words";

// Cache em memória dos dicionários já carregados, por tamanho
const cache = new Map<number, Set<string>>();
const pending = new Map<number, Promise<Set<string>>>();

/**
 * Carrega o dicionário PT-BR para um tamanho de palavra (4–8).
 * Os arquivos em /dict/{n}.txt contêm palavras normalizadas (sem acento),
 * uma por linha. Em caso de falha de rede, retorna null (validação
 * desabilitada — aceita qualquer tentativa).
 */
export async function loadDictionary(
  length: number
): Promise<Set<string> | null> {
  if (cache.has(length)) return cache.get(length)!;
  if (pending.has(length)) return pending.get(length)!;

  const promise = (async () => {
    const res = await fetch(`/dict/${length}.txt`);
    if (!res.ok) throw new Error(`dict ${length} não encontrado`);
    const text = await res.text();
    const set = new Set(text.split("\n").filter(Boolean));
    // Garante que toda palavra bíblica do banco seja aceita como tentativa
    for (const w of WORDS) {
      const n = normalize(w.palavra);
      if (n.length === length) set.add(n);
    }
    cache.set(length, set);
    return set;
  })();

  pending.set(length, promise);
  try {
    return await promise;
  } catch {
    return null;
  } finally {
    pending.delete(length);
  }
}
