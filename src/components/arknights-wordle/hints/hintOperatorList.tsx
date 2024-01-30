import HintListIcon from "./hintListIcon";
import React from "react";
import { GuessType, GuessTypeValue, getProfessionIconUrl, wordleColors } from "~/helper/helper";
import { HintBreakpoints } from "./hints";
import { api } from "~/utils/api";

type Props = {
    amtGuesses: number,
}

interface Dictionary<T> {
    [Key: string]: T;
}

const Professsions = ['Vanguard', 'Guard', 'Defender', 'Sniper', 'Caster', 'Medic', 'Supporter', 'Specialist'];

export default function HintOperatorList({ amtGuesses }: Props) {
    const allOperatorsArgs = api.wordle.allNames.useQuery();

    if (!allOperatorsArgs.isSuccess) {
        return <>{allOperatorsArgs.error}</>;
    } 
    const allOperators: GuessType[]  = allOperatorsArgs.data;

    const [showAlert, setShowAlert] = React.useState(false)
    const [selectedProfession, setSelectedProfession] = React.useState<string>('');
    const sortedRarityOperators: Dictionary<GuessType[]> = {
        "6": [],
        "5": [],
        "4": [],
        "3": [],
        "2": [],
        "1": [],
    };

    // Sort all operators into sortedRarityOperators
    allOperators.map((operator) => sortedRarityOperators[operator[GuessTypeValue.rarity] as keyof typeof sortedRarityOperators]!.push(operator))

    const handleProfession = (e: React.SyntheticEvent<EventTarget>) => {
        // @ts-ignore for e.target.**id**
        selectedProfession === e.target.id ? setSelectedProfession('') : setSelectedProfession(e.target.id)
    }

    const handleClick = () => {
        /* @ts-ignore because this element by id is referenced in the same component */
        document.getElementById('operator_list_modal').showModal()
        setShowAlert(false)
    }

    React.useEffect(() => {
        const setAmtGuesses = () => {
            if (amtGuesses === HintBreakpoints.one || amtGuesses === HintBreakpoints.two) {
                setShowAlert(true)
            }
        }
        setAmtGuesses();
    }, [amtGuesses])

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
                <div className='modal-box flex flex-col max-w-[3/5vh] justify-items-center overflow-x-clip overflow-y-scroll no-scrollbar'>
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
                        {amtGuesses < HintBreakpoints.one ?
                                <>
                                    {allOperators.map((operator) => {
                                        return (<HintListIcon key={`${operator} list icon`} operator={operator} />)
                                    })}
                                </>
                            :
                                <>
                                    <div>
                                        {amtGuesses >= HintBreakpoints.two && Professsions.map((p) => (
                                            <button className='tooltip p-[0.2rem]' data-tip={p} key={`${p} icon`} style={{backgroundColor: selectedProfession === p ? wordleColors.higher : 'white'}}>
                                                <img src={getProfessionIconUrl(p)} width={40} id={p} onClick={handleProfession}/>
                                            </button>
                                        ))}
                                    </div>
                                    {Object.entries(sortedRarityOperators).reverse().map((rarity) => (
                                        <div key={`${rarity} rarity operators`} className='w-full'>
                                            <h2>{rarity[0]} star Operators</h2>
                                            {rarity[1].map((operator) => {
                                                if (amtGuesses >= HintBreakpoints.two) {
                                                    if (selectedProfession === '') {
                                                        return <HintListIcon key={`${operator} list icon`} operator={operator} />
                                                    }
                                                    if (operator[2] === selectedProfession) {
                                                        return <HintListIcon key={`${operator} list icon`} operator={operator} />
                                                    } 
                                                    return null
                                                }
                                                return <HintListIcon key={`${operator} list icon`} operator={operator} />
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