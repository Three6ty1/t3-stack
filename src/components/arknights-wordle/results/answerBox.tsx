import { wordleColors, Range, Correctness, raceToolTips, costToolTips, getOperatorIconUrl } from "~/helper/helper";
import { GuessResult } from "~/server/api/routers/wordleServer";

type Props = {
    category: string
    guess: string | number | boolean | number[]
    result: boolean | Range | Correctness
    boxIndex: number
    rowIndex: number
}   

const animationDelay = 225;

export default function AnswerBox({ category, guess, result, boxIndex, rowIndex }: Props) {
    const showResult = result == Range.Higher || result == Range.Lower;
    let divStyle = 'flex flex-col mx-2 my-1 h-20 w-20 p-1 leading-2 break-all justify-center text-white'
    const isGuesses = localStorage.getItem('guesses');
    const guesses: GuessResult[] = (isGuesses) ? JSON.parse(isGuesses) : [];
    const op = guesses[rowIndex]
    if (!op) {
        return <>Loading...</>
    }
    const url = getOperatorIconUrl(op['charId'], op['rarity'].guess);

    // If its an error prevent any animations (only the last index plays?)
    
    //      If the row index isnt the 0th index, which is the newest guess, do not animate
    //          If the answer is correct, play a seperate animation than the standard flipping animation
    (rowIndex != guesses.length - 1) && ((rowIndex === 0 ? true : false) && (op['correct'] ? divStyle += ' opacity-0 animate-win ' : divStyle += ' opacity-0 animate-flip '))

    let bg = wordleColors.correct;
    if (typeof result === "boolean" && !result) {
        bg = wordleColors.incorrect;
    } else if (result === Range.Lower) {
        bg = wordleColors.lower;
    } else if (result === Range.Higher) {
        bg = wordleColors.higher;
    } else if (result === Correctness.Half) {
        bg = wordleColors.half
    } else if (result === Correctness.Wrong) {
        bg = wordleColors.incorrect
    }

    return (
        <>
            {/**
             * Name
             *      Operator icon and tooltip 
             * Race
             *      Race name and tooltip
             * Cost
             *      E0 and E2 costs + higher/lower
             * Otherwise
             *      The guess.
             */}
            {category === 'name' ?
                    <div className={`${divStyle} tooltip-answer-row bg-base-200`} data-tip={guess} style={{animationDelay: '200ms'}}>
                        <img src={url} />
                    </div>   
                :
                    category === 'race' ?
                        <div className={`${divStyle} tooltip-answer-row`}
                            data-tip={raceToolTips[guess as keyof typeof raceToolTips]}
                            style={{'backgroundColor': bg, animationDelay: `${boxIndex*animationDelay}ms`}}
                        >
                            <span>{guess}</span>
                        </div>
                    :
                        category === 'cost' ?
                            <div className={`${divStyle} tooltip-answer-row`}
                                data-tip={costToolTips[result as keyof typeof costToolTips]}
                                style={{'backgroundColor': bg, animationDelay: `${boxIndex*animationDelay}ms`}}
                            >
                                <span>{`E0: ${guess[0 as keyof typeof guess]}`}</span>
                                <span>{`E2: ${guess[1 as keyof typeof guess]}`}</span>
                                <span className='font-bold'>{result}</span>
                            </div>
                        :
                            <div className={`${divStyle}`} style={{"backgroundColor" : bg, animationDelay: `${boxIndex*animationDelay}ms`}}>
                                <span>{guess}</span>
                                {showResult && <span className='font-bold'>{result}</span>}
                            </div>
            }
        </>
        
    );
}
