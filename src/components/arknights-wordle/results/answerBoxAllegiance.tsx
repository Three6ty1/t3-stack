import { Correctness, wordleColors } from "~/helper/helper";
import type { GuessResult } from "~/server/api/routers/wordleServer";
import { animationDelay, answerRowStyle } from "./answerRow";

type Props = {
  pastGuesses: GuessResult[];
  guess: string;
  result: Correctness;
  boxIndex: number;
  rowIndex: number;
};

export default function AnswerBoxAllegiance({
  pastGuesses,
  guess,
  result,
  boxIndex,
  rowIndex,
}: Props) {
  const allegianceTooltip = "Correct Allegiance but wrong subdivision";
  let divStyle = answerRowStyle;
  const op = pastGuesses[rowIndex];
  if (!op) {
    return <>Loading...</>;
  }

  rowIndex === 0 &&
    (op.correct
      ? (divStyle += " opacity-0 animate-win ")
      : (divStyle += " opacity-0 animate-flip "));

  let tooltip = false;
  let bg = wordleColors.correct;
  if (result === Correctness.Half) {
    bg = wordleColors.half;
    tooltip = true;
  } else if (result === Correctness.Wrong) {
    bg = wordleColors.incorrect;
  }

  return (
    <>
      {tooltip ? (
        <div
          className={`${divStyle} tooltip-answer-row`}
          data-tip={allegianceTooltip}
          style={{
            backgroundColor: bg,
            animationDelay: `${boxIndex * animationDelay}ms`,
          }}
        >
          <span>{guess}</span>
        </div>
      ) : (
        <div
          className={`${divStyle}`}
          style={{
            backgroundColor: bg,
            animationDelay: `${boxIndex * animationDelay}ms`,
          }}
        >
          <span>{guess}</span>
        </div>
      )}
    </>
  );
}
