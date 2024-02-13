import { type GuessType } from "~/helper/helper";
import HintHelp from "./hintHelp";
import HintOperatorList from "./hintOperatorList";
import HintWorldMap from "./hintWorldMap";

type Props = {
    amtGuesses: number;
    allNames: GuessType[];
}

export enum  HintBreakpoints {
    "one" = 5,
    "two" = 8,
}

export default function Hints({ amtGuesses, allNames } : Props) {
    // breakpoint one = 5
    //      operator list split into rarity
    //      Region cheatsheet
    // breakpoint two = 8
    //      operator list sorted by class and rarity
   
    return (
        <div className='flex justify-center align-middle w-full md:w-96 my-2'>
            <div className='flex flex-row justify-center w-3/4'>
                <HintOperatorList amtGuesses={amtGuesses} allNames={allNames} />
                <HintHelp />
                <HintWorldMap amtGuesses={amtGuesses} />
            </div>
        </div>
    )
}