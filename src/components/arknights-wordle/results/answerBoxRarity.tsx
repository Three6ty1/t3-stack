import { wordleColors, Range } from "~/helper/helper";
import type { GuessResult } from "~/server/api/routers/wordleServer";
import { answerRowStyle } from "./answerRow";

type Props = {
  pastGuesses: GuessResult[];
  guess: number;
  result: Range;
  boxIndex: number;
  rowIndex: number;
};

const animationDelay = 225;

export default function AnswerBoxRarity({
  pastGuesses,
  guess,
  result,
  boxIndex,
  rowIndex,
}: Props) {
  let divStyle = answerRowStyle;
  const op = pastGuesses[rowIndex];
  if (!op) {
    return <>Loading...</>;
  }

  rowIndex === 0 &&
    (op.correct
      ? (divStyle += " opacity-0 animate-win ")
      : (divStyle += " opacity-0 animate-flip "));

  let bg = wordleColors.correct;
  if (result === Range.Lower) {
    bg = wordleColors.lower;
  } else if (result === Range.Higher) {
    bg = wordleColors.higher;
  }

  return (
    <div
      className={`${divStyle}`}
      style={{
        backgroundColor: bg,
        animationDelay: `${boxIndex * animationDelay}ms`,
      }}
    >
      <span className="font-bold">{guess}</span>
      <span className="font-bold">{result}</span>
    </div>
  );
}
