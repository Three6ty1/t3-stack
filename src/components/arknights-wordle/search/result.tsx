import type { Operator } from "@prisma/client";
import Image from "next/image";
import React from "react";
import { getOperatorIconUrl } from "~/helper/helper";
import type { GuessResult } from "~/helper/compare";

type Props = {
  operator: Operator;
  setResults: (value: Operator[]) => void;
  handleSubmit: (
    guess: Operator,
    callback: (success: boolean) => void,
  ) => void;
};

export default function Result({ operator, handleSubmit, setResults }: Props) {
  const [pastGuesses, setPastGuesses] = React.useState<string[]>([]);

  // Past guesses here to make the text of a previously guessed operator blue
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

  const handleClick = (e: React.MouseEvent) => {
    setResults([]);
    e.preventDefault();
    e.stopPropagation();
    handleSubmit(
      operator,
      () => {
        return;
      },
    );
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
