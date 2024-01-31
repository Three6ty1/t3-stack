import type { GuessResult } from "~/server/api/routers/wordleServer";
import AnswerBoxBasic from "./answerBoxBasic";
import AnswerBoxName from "./answerBoxName";
import AnswerBoxRace from "./answerBoxRace";
import AnswerBoxCost from "./answerBoxCost";
import type { Correctness, Range } from "~/helper/helper";
import AnswerBoxAllegiance from "./answerBoxAllegiance";

export const answerRowStyle = 'answer-row flex flex-col p-1 leading-2 break-all text-white';
export const animationDelay = 225;
type Props = {
    guess: GuessResult,
    index: number
}

export default function AnswerRow({ guess, index } : Props) {

    // Get the current guess through local storage to persist animation logic
    const ls = localStorage.getItem('guesses');
    const pastGuesses = (ls) ? JSON.parse(ls) as unknown as GuessResult[]: [];

    return (
        <div className='flex flex-row justify-center w-auto'>
            {
                Object.keys(guess).map((key, boxIndex) => {
                    if (key === 'charId' || key === 'correct') {
                        return null
                    } else if (key === 'name') {
                        return (
                            <AnswerBoxName 
                                key={key}
                                pastGuesses={pastGuesses}
                                name={guess[key as keyof typeof guess] as string}
                                rowIndex={index}
                            />
                        )
                    } else if (key === 'race') {
                        return (
                            <AnswerBoxRace
                                key={key}
                                pastGuesses={pastGuesses}
                                guess={(guess[key as keyof typeof guess] as {guess: string, result: boolean}).guess}
                                result={(guess[key as keyof typeof guess] as {guess: string, result: boolean}).result}
                                boxIndex={boxIndex}
                                rowIndex={index}
                            />
                        )
                    } else if (key === 'cost') {
                        return (
                            <AnswerBoxCost
                                key={key}
                                pastGuesses={pastGuesses}
                                guess={(guess[key as keyof typeof guess] as {guess: number[], result: Range}).guess}
                                result={(guess[key as keyof typeof guess] as {guess: number[], result: Range}).result}
                                boxIndex={boxIndex}
                                rowIndex={index}
                            />
                        )
                    } else if (key === 'allegiance') {
                        return (
                            <AnswerBoxAllegiance
                                key={key}
                                pastGuesses={pastGuesses}
                                guess={(guess[key as keyof typeof guess] as {guess: string, result: Correctness}).guess}
                                result={(guess[key as keyof typeof guess] as {guess: string, result: Correctness}).result}
                                boxIndex={boxIndex}
                                rowIndex={index}
                            />
                        )
                    } else {
                        return (
                            <AnswerBoxBasic
                                key={key}
                                pastGuesses={pastGuesses}
                                guess={(guess[key as keyof typeof guess] as {guess: string, result: boolean}).guess}
                                result={(guess[key as keyof typeof guess] as {guess: string, result: boolean}).result}
                                boxIndex={boxIndex}
                                rowIndex={index}
                            />
                        )
                    }         
                })
            }
        </div>
    );
}