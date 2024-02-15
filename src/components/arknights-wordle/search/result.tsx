import type { Operator } from "@prisma/client";
import Image from "next/image";
import React from "react";
import { getOperatorIconUrl } from "~/helper/helper";
import type { Stats } from "~/server/api/routers/wordle";
import type { GuessResult } from "~/server/api/routers/wordleServer";
import { api } from "~/utils/api";

type Props = {
  operator: Operator;
  handleSubmit: (
    promise: Promise<GuessResult>,
    callback: (success: boolean) => void,
  ) => void;
  stats: Stats;
};

export default function Result({ operator, handleSubmit, stats }: Props) {
  const [pastGuesses, setPastGuesses] = React.useState<string[]>([]);

  React.useEffect(() => {
    const ls = localStorage.getItem("guesses");
    const _pastGuesses = ls ? (JSON.parse(ls) as unknown as GuessResult[]) : [];
    const pastGuesses = _pastGuesses.map((guess) => guess.name);
    setPastGuesses(pastGuesses);
  }, []);

  const url = getOperatorIconUrl(operator.charId, operator.rarity);

  let textStyle = " ";
  // Ternary operator for this line BREAKS the code
  if (pastGuesses.includes(operator.name)) {
    textStyle += "text-higher";
  }

  const utils = api.useUtils();

  const handleClick = (e: React.MouseEvent) => {
    e.currentTarget.setAttribute("disabled", "disabled");
    e.preventDefault();
    e.stopPropagation();
    handleSubmit(
      utils.wordle.compare.fetch({
        guessOp: operator,
        guesses: pastGuesses,
        correctId: stats.operatorId,
      }),
      () => {
        return;
      },
    );
    e.currentTarget.removeAttribute("disabled");
  };

  return (
    <button
      className="m-1 flex w-full flex-row items-center self-center"
      onClick={(e) => handleClick(e)}
      id={String(operator.id)}
    >
      <div className="flex w-1/2 justify-end pr-5">
        <Image
          src={url}
          alt={`${operator.name} operator icon`}
          width={50}
          height={50}
        />
      </div>
      <div
        className={"flex w-1/2 justify-start text-start text-2xl" + textStyle}
      >
        {operator.name}
      </div>
    </button>
  );
}
