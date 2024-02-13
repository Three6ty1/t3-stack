import HintListIcon from "./hintListIcon";
import React from "react";
import { type GuessType, GuessTypeValue, getProfessionIconUrl, wordleColors } from "~/helper/helper";
import { HintBreakpoints } from "./hints";
import { api } from "~/utils/api";
import Image from "next/image";

type Props = {
    amtGuesses: number,
    allNames: GuessType[];
}

const Professsions = ['Vanguard', 'Guard', 'Defender', 'Sniper', 'Caster', 'Medic', 'Supporter', 'Specialist'];

export default function HintOperatorList({ amtGuesses, allNames }: Props) {
    const [showAlert, setShowAlert] = React.useState(false);
    const [selectedProfession, setSelectedProfession] = React.useState<string>('');

    React.useEffect(() => {
        const setAmtGuesses = () => {
            if (amtGuesses == HintBreakpoints.one.valueOf() || amtGuesses == HintBreakpoints.two.valueOf()) {
                setShowAlert(true)
            }
        }
        setAmtGuesses();
    }, [amtGuesses])

    const sortedRarityOperators: Record<string, GuessType[]> = {
        "6": [],
        "5": [],
        "4": [],
        "3": [],
        "2": [],
        "1": [],
    };

    if (!allNames) {
        return <>Loading...</>
    }

    // Sort all operators into sortedRarityOperators
    allNames.map((operator) => sortedRarityOperators[operator[GuessTypeValue.rarity as keyof typeof operator] as keyof typeof sortedRarityOperators]!.push(operator))

    const handleProfession = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
        const id = (e.target as HTMLImageElement).id
        selectedProfession === id ? setSelectedProfession('') : setSelectedProfession(id)
    }

    const handleClick = () => {
        (document.getElementById('operator_list_modal') as HTMLDialogElement).showModal()
        setShowAlert(false)
    }

    return (
        <>
            <div className='indicator w-1/3 m-2'>
                {showAlert && <span className="indicator-item badge bg-higher" />}
                <button className='flex btn tooltip w-full items-center' data-tip='Operator List' onClick={()=> handleClick()}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" />
                    </svg>
                </button>
            </div>
            <dialog id='operator_list_modal' className='modal'>
                <div className='modal-box flex flex-col max-w-[3/5vh] h-2/3 md:h-full justify-items-center overflow-x-clip overflow-y-scroll no-scrollbar no-scrollbar::-webkit-scrollbar'>
                    <h1 className='w-full text-xl mb-2'>Operator List (Up to Executor Alter)</h1>
                    <div className='flex flex-row flex-wrap justify-center w-full'>
                        {/**
                         * If under breakpoint 1
                         *      List all operators in alphabetical
                         * Else 
                         *      If over breakpoint 2
                         *          Display the operator class filters
                         *          Filter operators depending on class selected
                         *      Else
                         *          List all operators sorted in rarity 
                         */}
                        {amtGuesses < HintBreakpoints.one.valueOf() ?
                                <>
                                    {allNames.map((operator) => {
                                        return (<HintListIcon key={`${operator[GuessTypeValue.name]} list icon`} operator={operator} />)
                                    })}
                                </>
                            :
                                <>
                                    <div>
                                        {amtGuesses >= HintBreakpoints.two.valueOf() && Professsions.map((p) => (
                                            <button className='tooltip p-[0.2rem]' data-tip={p} key={`${p} icon`} style={{backgroundColor: selectedProfession === p ? wordleColors.higher : 'white'}}>
                                                <Image src={getProfessionIconUrl(p)} width={40} height={40} id={p} onClick={(e) => handleProfession(e)} alt={`${p} operator icon image`}/>
                                            </button>
                                        ))}
                                    </div>
                                    {Object.entries(sortedRarityOperators).reverse().map((rarity) => (
                                        <div key={`${rarity[0]} rarity operators`} className='w-full'>
                                            <h2>{rarity[0]} star Operators</h2>
                                            {rarity[1].map((operator) => {
                                                if (amtGuesses >= HintBreakpoints.two.valueOf()) {
                                                    if (selectedProfession === '') {
                                                        return <HintListIcon key={`${operator[GuessTypeValue.name]} list icon`} operator={operator} />
                                                    }
                                                    if (operator[2] === selectedProfession) {
                                                        return <HintListIcon key={`${operator[GuessTypeValue.name]} list icon`} operator={operator} />
                                                    } 
                                                    return null
                                                }
                                                return <HintListIcon key={`${operator[GuessTypeValue.name]} list icon`} operator={operator} />
                                            })}
                                        </div>
                                    ))}
                                </>
                        }
                    </div>
                </div>
                <form method='dialog' className='modal-backdrop'>
                    <button>close</button>
                </form>
            </dialog>
        </>
    )
}