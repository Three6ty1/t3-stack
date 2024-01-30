import { guessCategoryToolTips } from "~/helper/helper";

export default function CategoryRows() {
    return (
        <div className='flex flex-row font-bold justify-center break-all'>
            {Object.entries(guessCategoryToolTips).map((category, index) => (
                <span 
                    key={index} 
                    className='tooltip-answer-row answer-row flex bg-base-200 text-content whitespace-pre-line'
                    data-tip={category[1]}
                >
                    {category[0]}
                </span>
            ))}
        </div>
    )
}