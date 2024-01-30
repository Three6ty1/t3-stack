import { GuessResult } from "~/server/api/routers/wordleServer";
import AnswerBox from "./answerBox";

type Props = {
    guess: GuessResult,
    index: number
}

export default function AnswerRow({ guess, index } : Props) {
    return (
        <div className='flex flex-row justify-center w-auto'>
            {
                Object.keys(guess).map((key, boxIndex) => (
                    key != 'charId' && key != 'correct' ? 
                        key == 'name' ?
                            <AnswerBox
                                key={key}
                                category={key}
                                /** @ts-ignore */
                                guess={guess[key as keyof typeof guess]}
                                /** @ts-ignore */
                                result={null}
                                boxIndex={boxIndex}
                                rowIndex={index}
                            />
                            :
                            <AnswerBox
                                key={key}
                                category={key}
                                /** @ts-ignore */
                                guess={guess[key as keyof typeof guess].guess}
                                /** @ts-ignore */
                                result={guess[key as keyof typeof guess].result}
                                boxIndex={boxIndex}
                                rowIndex={index}
                            />
                    : null          
                ))
            }
        </div>
    );
}