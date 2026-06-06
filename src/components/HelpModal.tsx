"use client";

import Link from "next/link";
import { Modal } from "./Modal";
import { OrnamentIcon } from "./icons";

function MiniTile({
  letter,
  variant,
}: {
  letter: string;
  variant?: "correct" | "present" | "absent";
}) {
  return (
    <span className={`tb-minitile${variant ? ` s-${variant}` : ""}`}>
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
    <div className="my-3 flex gap-[5px]">
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
      <div className="tb-ornament">
        <OrnamentIcon />
      </div>
      <div className="tb-prose">
        <p>
          Descubra a <strong>palavra bíblica do dia</strong> em até{" "}
          <strong>6 tentativas</strong>. A cada palpite, as cores revelam o
          quão perto você chegou.
        </p>

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

        <ul>
          <li>O tamanho da palavra varia a cada dia (4 a 8 letras).</li>
          <li>
            Os acentos são preenchidos automaticamente — digite sem acento.
          </li>
          <li>Pode ser nome de personagem, lugar, livro ou termo bíblico.</li>
          <li>
            Travou? Toque em <strong>Pedir uma luz</strong> para ver uma pista.
          </li>
          <li>
            Uma nova palavra surge todo dia à meia-noite (horário de Brasília).
          </li>
        </ul>

        <p>
          Você também pode <Link href="/criar">criar um desafio</Link> com a
          sua própria palavra e enviar para os amigos e o grupo da igreja.
        </p>
      </div>
    </Modal>
  );
}
