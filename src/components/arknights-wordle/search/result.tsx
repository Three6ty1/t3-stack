import React from 'react';
import { GuessType, GuessTypeValue, getOperatorIconUrl } from "~/helper/helper";
import { GuessResult } from '~/server/api/routers/wordleServer';
import { api } from '~/utils/api';

type Props = {
    op: GuessType;
    handleSubmit: React.Dispatch<React.SetStateAction<any>>;
}

export default function Result({op, handleSubmit } : Props) {
    const [pastGuesses, setPastGuesses] = React.useState<string[]>([]);

    React.useEffect(() => {
        const ls = localStorage.getItem("guesses");
        let guessResults: GuessResult[] = ls ? JSON.parse(ls) : [];
        const pastGuesses = guessResults.map((guess) => guess.name);
        setPastGuesses(pastGuesses);
    }, [])

    const url = getOperatorIconUrl(op[GuessTypeValue.charId], op[GuessTypeValue.rarity]);

    let textStyle = ' '
    // Ternary operator for this line BREAKS the code
    if (pastGuesses.includes(op[GuessTypeValue.name])) { textStyle += 'text-higher' }

    const utils = api.useUtils();

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        
        const guess = e.currentTarget.textContent;
        if (!guess) {
            throw "Empty operator list entry, please report"
        }

        handleSubmit({promise: utils.wordle.compare.fetch({guess: guess, guesses: pastGuesses}), callback: () => {}});
    }

    return (
        <div className='flex flex-row self-center w-full items-center m-1'>
            <div className='flex w-1/2 justify-end pr-5'>
                <img src={url} alt={`${op[0]} operator icon`} width={40}/>
            </div>
            <div className={'flex w-1/2 justify-start text-start text-2xl' + textStyle} onClick={(e) => handleClick(e)}>{op[GuessTypeValue.name]}</div> 
        </div>
    );
}