import type { GuessResult } from "~/server/api/routers/wordleServer";
import AnswerBoxBasic from "./answerBoxBasic";
import AnswerBoxName from "./answerBoxName";
import AnswerBoxRace from "./answerBoxRace";
import AnswerBoxCost from "./answerBoxCost";
import type { Correctness, Range } from "~/helper/helper";
import AnswerBoxAllegiance from "./answerBoxAllegiance";
import AnswerBoxRarity from "./answerBoxRarity";

export const animationDelay = 225;
type Props = {
  guess: GuessResult;
  index: number;
};

export default function AnswerRow({ guess, index }: Props) {
  // Get the current guess through local storage to persist animation logic
  const ls = localStorage.getItem("guesses");
  const pastGuesses = ls ? (JSON.parse(ls) as unknown as GuessResult[]) : [];
  let divStyle = "answer-row flex flex-col p-1 leading-2 break-all text-white";

  const op = pastGuesses[index];
  if (!op) {
    return <>Loading...</>;
  }

  index === 0 &&
    (op.correct
      ? (divStyle += " opacity-0 animate-win ")
      : (divStyle += " opacity-0 animate-flip "));

  return (
    <div className="flex w-auto flex-row justify-center">
      {Object.keys(guess).map((key, boxIndex) => {
        if (key === "charId" || key === "correct") {
          return null;
        } else if (key === "name") {
          return (
            <AnswerBoxName
              key={key}
              op={op}
              name={guess[key as keyof typeof guess] as string}
              divStyle={divStyle}
            />
          );
        } else if (key === "race") {
          return (
            <AnswerBoxRace
              key={key}
              guess={
                (
                  guess[key as keyof typeof guess] as {
                    guess: string;
                    result: boolean;
                  }
                ).guess
              }
              result={
                (
                  guess[key as keyof typeof guess] as {
                    guess: string;
                    result: boolean;
                  }
                ).result
              }
              boxIndex={boxIndex}
              divStyle={divStyle}
            />
          );
        } else if (key === "cost") {
          return (
            <AnswerBoxCost
              key={key}
              guess={
                (
                  guess[key as keyof typeof guess] as {
                    guess: number[];
                    result: Range;
                  }
                ).guess
              }
              result={
                (
                  guess[key as keyof typeof guess] as {
                    guess: number[];
                    result: Range;
                  }
                ).result
              }
              boxIndex={boxIndex}
              divStyle={divStyle}
            />
          );
        } else if (key === "allegiance") {
          return (
            <AnswerBoxAllegiance
              key={key}
              guess={
                (
                  guess[key as keyof typeof guess] as {
                    guess: string;
                    result: Correctness;
                  }
                ).guess
              }
              result={
                (
                  guess[key as keyof typeof guess] as {
                    guess: string;
                    result: Correctness;
                  }
                ).result
              }
              boxIndex={boxIndex}
              divStyle={divStyle}
            />
          );
        } else if (key === "rarity") {
          return (
            <AnswerBoxRarity
              key={key}
              guess={
                (
                  guess[key as keyof typeof guess] as {
                    guess: number;
                    result: Range;
                  }
                ).guess
              }
              result={
                (
                  guess[key as keyof typeof guess] as {
                    guess: number;
                    result: Range;
                  }
                ).result
              }
              boxIndex={boxIndex}
              divStyle={divStyle}
            />
          );
        } else {
          return (
            <AnswerBoxBasic
              key={key}
              guess={
                (
                  guess[key as keyof typeof guess] as {
                    guess: string;
                    result: boolean;
                  }
                ).guess
              }
              result={
                (
                  guess[key as keyof typeof guess] as {
                    guess: string;
                    result: boolean;
                  }
                ).result
              }
              boxIndex={boxIndex}
              divStyle={divStyle}
            />
          );
        }
      })}
    </div>
  );
}
