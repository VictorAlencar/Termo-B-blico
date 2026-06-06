"use client";

import { Modal } from "./Modal";

function MiniTile({
  letter,
  variant,
}: {
  letter: string;
  variant?: "correct" | "present" | "absent";
}) {
  const colors = {
    correct: "bg-correct border-correct text-white",
    present: "bg-present border-present text-white",
    absent: "bg-stone-400 border-stone-400 text-white dark:bg-stone-700 dark:border-stone-700",
  };
  return (
    <span
      className={`inline-flex h-9 w-9 items-center justify-center rounded border-2 text-lg font-extrabold ${
        variant ? colors[variant] : "border-stone-300 dark:border-stone-600"
      }`}
    >
      {letter}
    </span>
  );
}

function ExampleRow({
  word,
  highlight,
  variant,
}: {
  word: string;
  highlight: number;
  variant: "correct" | "present" | "absent";
}) {
  return (
    <div className="flex gap-1">
      {word.split("").map((l, i) => (
        <MiniTile key={i} letter={l} variant={i === highlight ? variant : undefined} />
      ))}
    </div>
  );
}

export function HelpModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Modal open={open} onClose={onClose} title="Como jogar">
      <div className="space-y-4 text-sm leading-relaxed">
        <p>
          Descubra a <strong>palavra bíblica do dia</strong> em até{" "}
          <strong>6 tentativas</strong>. A cada tentativa, as cores mostram o
          quão perto você chegou.
        </p>

        <div className="space-y-3">
          <ExampleRow word="JESUS" highlight={0} variant="correct" />
          <p>
            A letra <strong>J</strong> está na palavra e na{" "}
            <strong>posição certa</strong>.
          </p>
          <ExampleRow word="GRACA" highlight={2} variant="present" />
          <p>
            A letra <strong>A</strong> está na palavra, mas em{" "}
            <strong>outra posição</strong>.
          </p>
          <ExampleRow word="PEDRO" highlight={4} variant="absent" />
          <p>
            A letra <strong>O</strong> <strong>não está</strong> na palavra.
          </p>
        </div>

        <ul className="list-disc space-y-1 pl-5 text-stone-600 dark:text-stone-300">
          <li>O tamanho da palavra varia a cada dia (4 a 8 letras).</li>
          <li>
            Os acentos são preenchidos automaticamente — digite sem acento.
          </li>
          <li>Pode ser nome de personagem, lugar, livro ou termo bíblico.</li>
          <li>
            Travou? Use o botão <strong>💡 Dica</strong> para ver uma pista.
          </li>
          <li>Uma nova palavra aparece todo dia à meia-noite (horário de Brasília).</li>
        </ul>

        <p className="text-stone-600 dark:text-stone-300">
          Você também pode{" "}
          <a href="/criar" className="font-semibold text-correct hover:underline">
            criar um desafio
          </a>{" "}
          com a sua própria palavra e enviar para os amigos!
        </p>
      </div>
    </Modal>
  );
}
