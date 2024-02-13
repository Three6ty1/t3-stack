import SearchBar from "./searchBar";
import React from 'react'
import Result from "./result";
import type { GuessResult } from "~/server/api/routers/wordleServer";
import type { GuessType } from "~/helper/helper";
import type { Stats } from '~/server/api/routers/wordle';
import { Operator } from "@prisma/client";

type Props = {
    handleSubmit: (promise: Promise<GuessResult>, callback: (success: boolean) => void) => void;
    allOperators: Operator[];
    stats: Stats;
}

export default function Search({ handleSubmit, allOperators, stats }: Props) {
    const [results, setResults] = React.useState<Operator[]>([]);

    return (
        <div className='flex flex-col items-center w-full'>
            <SearchBar setResults={(value) => setResults(value)} handleSubmit={handleSubmit} allOperators={allOperators} stats={stats} />
            {results.length > 0 &&
                <div className='flex flex-col overflow-y-scroll overflow-x-hidden 
                    w-[80vw] max-h-[35vh] md:w-[30vw] md:max-h-[50vh] 
                    my-2 py-2 rounded-md bg-base-100 shadow-sm shadow-neutral-content
                    no-scrollbar .no-scrollbar::-webkit-scrollbar'
                >

                    {results.map((op, index) => (<Result key={index} operator={op} handleSubmit={handleSubmit} stats={stats} />))}
                </div>
            }
        </div>
    );
}
