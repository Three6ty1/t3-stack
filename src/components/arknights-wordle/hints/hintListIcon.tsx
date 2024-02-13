import { type GuessType , GuessTypeValue, getOperatorIconUrl } from "~/helper/helper";
import Image from "next/image";
import { Operator } from "@prisma/client";
type Props = {
    operator: Operator;
}

export default function HintListIcon({ operator, } : Props) {
    const url = getOperatorIconUrl(operator.charId, operator.rarity)
    return (
        <div className='tooltip' data-tip={operator.name}>
            <Image className='border-incorrect border-[0.1px] border-solid m-[0.5px] rounded-md' src={url} alt={`${operator.name} operator icon`} width={50} height={50} />
        </div>
    )
}