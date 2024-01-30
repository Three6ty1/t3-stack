import { GuessType, GuessTypeValue, getOperatorIconUrl } from "~/helper/helper";

type Props = {
    operator: GuessType;
}

export default function HintListIcon({ operator, } : Props) {
    const url = getOperatorIconUrl(operator[GuessTypeValue.charId], operator[GuessTypeValue.rarity])
    return (
        <div className='tooltip' data-tip={operator[0]}>
            <img className='border-incorrect border-[0.1px] border-solid m-[0.5px] rounded-md' src={url} alt={`${operator[0]} operator icon`} width={50} height={50} />
        </div>
    )
}