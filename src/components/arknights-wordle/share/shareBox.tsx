import type { GuessResult } from '~/server/api/routers/wordleServer';
import { Range, Correctness } from "~/helper/helper";
import React from 'react';
import type { ChosenOperators } from "@prisma/client";

type Props = {
    gameInfo: ChosenOperators;
}

export default function ShareBox({ gameInfo }: Props) { 
    const [shareString, setShareString] = React.useState('');
    const [isVisible, setIsVisible] = React.useState(false);

    React.useEffect(() => {
        const generateshareString = () => {
            let newString = '';
            const ls = localStorage.getItem("guesses");
            const guesses: GuessResult[] = (ls) ? JSON.parse(ls) as unknown as GuessResult[]: [];

            for(const guess of guesses.reverse()) {
                for (const category in guess) {
                    if (category === 'charId' || category === 'name' || category === 'correct') { continue }
        
                    const compare = guess[category as keyof typeof guess] as {guess: unknown, result: unknown}
        
                    // Correctness and Range .corret's are the same, just added for clarity
                    if (compare.result === Range.Correct || compare.result === Correctness.Correct || compare.result === true) {
                        newString += '🟩';
                    } else if (compare.result === false || compare.result === Correctness.Wrong) {
                        newString += '🟥';
                    } else if (compare.result === Range.Lower) {
                        newString += '⬇️';
                    } else if (compare.result === Range.Higher) {
                        newString += '⬆️';
                    } else if (compare.result === Correctness.Half) {
                        newString += '🟨';
                    }
                }
                newString += '\n';
            }

            setShareString(newString);
        }

        generateshareString();
    }, [])

    const handleShare = () => {
        const newString = `Arknights Wordle #${gameInfo.gameId}\n` + shareString;
        navigator.clipboard.writeText(newString).catch(() => {
            console.log('Cannot add to clipboard')
        })
        setIsVisible(true)
        setTimeout(() => setIsVisible(false), 3000);
    }
   
    return (
        <div className='justify-center flex flex-col items-center'>
            <button className='btn btn-success text-white w-fit' onClick={() => handleShare()}>
                Share your results!
            </button>
            {isVisible &&
                <div role="alert" className="alert bg-correct fixed left-0 bottom-0 animate-fade-in-out flex justify-center rounded-none text-white z-50">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span>Copied to clipboard</span>
                </div>
            }
            
        </div>
    );
}