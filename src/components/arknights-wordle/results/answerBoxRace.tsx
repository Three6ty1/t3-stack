import { raceToolTips, wordleColors } from "~/helper/helper";
import type { GuessResult } from "~/server/api/routers/wordleServer";
import { animationDelay, answerRowStyle } from "./answerRow";

type Props = {
  pastGuesses: GuessResult[];
  guess: string;
  result: boolean;
  boxIndex: number;
  rowIndex: number;
};

export default function AnswerBoxRace({
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

  const bg = result ? wordleColors.correct : wordleColors.incorrect;

  return (
    <div
      className={`${divStyle} tooltip-answer-row`}
      data-tip={raceToolTips[guess as keyof typeof raceToolTips]}
      style={{
        backgroundColor: bg,
        animationDelay: `${boxIndex * animationDelay}ms`,
      }}
    >
      <span>{guess}</span>
    </div>
  );
}
