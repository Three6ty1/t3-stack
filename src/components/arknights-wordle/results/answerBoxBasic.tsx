import { wordleColors } from "~/helper/helper";
import type { GuessResult } from "~/server/api/routers/wordleServer";
import { animationDelay, answerRowStyle } from "./answerRow";

type Props = {
  pastGuesses: GuessResult[];
  guess: string;
  result: boolean;
  boxIndex: number;
  rowIndex: number;
};

export default function AnswerBoxBasic({
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

  //  If the row index isnt the 0th index, which is the newest guess, do not animate
  //      If the answer is correct, play a seperate animation than the standard flipping animation
  rowIndex === 0 &&
    (op.correct
      ? (divStyle += " opacity-0 animate-win ")
      : (divStyle += " opacity-0 animate-flip "));

  const bg = result ? wordleColors.correct : wordleColors.incorrect;

  return (
    <div
      className={`${divStyle}`}
      style={{
        backgroundColor: bg,
        animationDelay: `${boxIndex * animationDelay}ms`,
      }}
    >
      <span>{guess}</span>
    </div>
  );
}
