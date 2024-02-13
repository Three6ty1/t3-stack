import HintHelp from "./hintHelp";
import HintOperatorList from "./hintOperatorList";
import HintWorldMap from "./hintWorldMap";
import type { Operator } from "@prisma/client";

type Props = {
  amtGuesses: number;
  allOperators: Operator[];
};

export enum HintBreakpoints {
  "one" = 5,
  "two" = 8,
}

export default function Hints({ amtGuesses, allOperators }: Props) {
  // breakpoint one = 5
  //      operator list split into rarity
  //      Region cheatsheet
  // breakpoint two = 8
  //      operator list sorted by class and rarity

  return (
    <div className="my-2 flex w-full justify-center align-middle md:w-96">
      <div className="flex w-3/4 flex-row justify-center">
        <HintOperatorList amtGuesses={amtGuesses} allOperators={allOperators} />
        <HintHelp />
        <HintWorldMap amtGuesses={amtGuesses} />
      </div>
    </div>
  );
}
