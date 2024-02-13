import { Operator } from '@prisma/client';
import Image from 'next/image';
import React from 'react';
import { getOperatorIconUrl } from "~/helper/helper";
import { Stats } from '~/server/api/routers/wordle';
import type { GuessResult } from '~/server/api/routers/wordleServer';
import { api } from '~/utils/api';

type Props = {
    operator: Operator;
    handleSubmit: (promise: Promise<GuessResult>, callback: (success: boolean) => void) => void;
    stats: Stats;
}

export default function Result({operator, handleSubmit, stats } : Props) {
    const [pastGuesses, setPastGuesses] = React.useState<string[]>([]);

    React.useEffect(() => {
        const ls = localStorage.getItem("guesses");
        const _pastGuesses = (ls) ? JSON.parse(ls) as unknown as GuessResult[]: [];
        const pastGuesses = _pastGuesses.map((guess) => guess.name);
        setPastGuesses(pastGuesses);
    }, [])

    const url = getOperatorIconUrl(operator.charId, operator.rarity);

    let textStyle = ' '
    // Ternary operator for this line BREAKS the code
    if (pastGuesses.includes(operator.name)) { textStyle += 'text-higher' }

    const utils = api.useUtils();

    const handleClick = () => {
        handleSubmit(utils.wordle.compare.fetch({guessOp: operator, guesses: pastGuesses, correctId: stats.operatorId}), () => {return});
    }

    return (
        <div className='flex flex-row self-center w-full items-center m-1'>
            <div className='flex w-1/2 justify-end pr-5'>
                <Image src={url} alt={`${operator.name} operator icon`} width={40} height={40} />
            </div>
            <div className={'flex w-1/2 justify-start text-start text-2xl' + textStyle} onClick={handleClick} id={String(operator.id)}>{operator.name}</div> 
        </div>
    );
}