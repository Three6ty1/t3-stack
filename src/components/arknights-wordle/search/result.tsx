import React from 'react';
import { GuessType, GuessTypeValue, getOperatorIconUrl } from "~/helper/helper";
import { GuessResult } from '~/server/api/routers/wordleServer';
import { api } from '~/utils/api';

type Props = {
    op: GuessType;
    hasGuessed: boolean;
    handleSubmit: React.Dispatch<React.SetStateAction<any>>;
}

export default function Result({op, hasGuessed, handleSubmit } : Props) {
    const [_hasGuessed, setHasGuessed] = React.useState(hasGuessed);
    const url = getOperatorIconUrl(op[GuessTypeValue.charId], op[GuessTypeValue.rarity]);

    let textStyle = ' '
    // Ternary operator for this line BREAKS the code
    if (_hasGuessed) { textStyle += 'text-higher' }

    const utils = api.useUtils();

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        
        const guess = e.currentTarget.textContent;
        if (!guess) {
            throw "Empty operator list entry, please report"
        }
        const ls = localStorage.getItem("guesses");
        let guessResults: GuessResult[] = ls ? JSON.parse(ls) : [];
        const guessesNames = guessResults.map((guess) => guess.name);

        const callback = (success: boolean) => {
            if (success) {
                setHasGuessed(true);
            }
        }

        handleSubmit({promise: utils.wordle.compare.fetch({guess: guess, guesses: guessesNames}), callback: callback});
    }

    return (
        <div className='flex flex-row self-center w-full items-center m-1'>
            <div className='flex w-1/2 justify-end pr-5'>
                <img src={url} alt={`${op[0]} operator icon`} width={40}/>
            </div>
            <div className={'flex w-1/2 justify-start text-start text-2xl' + textStyle} onClick={(e) => {setHasGuessed(true); handleClick(e)}}>{op[GuessTypeValue.name]}</div> 
        </div>
    );
}