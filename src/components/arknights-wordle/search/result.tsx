import Image from 'next/image';
import React from 'react';
import { type GuessType, GuessTypeValue, getOperatorIconUrl } from "~/helper/helper";
import { Stats } from '~/server/api/routers/wordle';
import type { GuessResult } from '~/server/api/routers/wordleServer';
import { api } from '~/utils/api';

type Props = {
    op: GuessType;
    handleSubmit: (promise: Promise<GuessResult>, callback: (success: boolean) => void) => void;
    stats: Stats;
}

export default function Result({op, handleSubmit, stats } : Props) {
    const [pastGuesses, setPastGuesses] = React.useState<string[]>([]);

    React.useEffect(() => {
        const ls = localStorage.getItem("guesses");
        const _pastGuesses = (ls) ? JSON.parse(ls) as unknown as GuessResult[]: [];
        const pastGuesses = _pastGuesses.map((guess) => guess.name);
        setPastGuesses(pastGuesses);
    }, [])

    const url = getOperatorIconUrl(op[GuessTypeValue.charId], op[GuessTypeValue.rarity]);

    let textStyle = ' '
    // Ternary operator for this line BREAKS the code
    if (pastGuesses.includes(op[GuessTypeValue.name])) { textStyle += 'text-higher' }

    const utils = api.useUtils();

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        
        const guess = e.currentTarget.id;
        if (!guess) {
            throw "Empty operator list entry, please report"
        }
        handleSubmit(utils.wordle.compare.fetch({guessId: guess, guesses: pastGuesses, correctId: stats.operatorId}), () => {return});
    }

    return (
        <div className='flex flex-row self-center w-full items-center m-1'>
            <div className='flex w-1/2 justify-end pr-5'>
                <Image src={url} alt={`${op[0]} operator icon`} width={40} height={40} />
            </div>
            <div className={'flex w-1/2 justify-start text-start text-2xl' + textStyle} onClick={(e) => handleClick(e)} id={op[GuessTypeValue.charId]}>{op[GuessTypeValue.name]}</div> 
        </div>
    );
}