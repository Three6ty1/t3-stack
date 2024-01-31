import { getOperatorIconUrl } from "~/helper/helper";
import type { GuessResult } from "~/server/api/routers/wordleServer";
import { answerRowStyle } from "./answerRow";
import Image from "next/image";

type Props = {
    pastGuesses: GuessResult[]
    name: string
    rowIndex: number
}   

export default function AnswerBoxName({ pastGuesses, name, rowIndex }: Props) {
    let divStyle = answerRowStyle;
    const op = pastGuesses[rowIndex]
    if (!op) {
        return <>Loading...</>
    }

    const url = getOperatorIconUrl(op.charId, op.rarity.guess);
    (rowIndex === 0 && (op.correct ? divStyle += ' opacity-0 animate-win ' : divStyle += ' opacity-0 animate-flip '))

    return (
        <div className={`${divStyle} tooltip-answer-row bg-base-200`} data-tip={name} style={{animationDelay: '200ms'}}>
            <Image fill={true} src={url} alt={`${name} operator icon`} className='p-1' />
        </div>   
    );
}

