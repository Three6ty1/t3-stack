import SearchBar from "./searchBar";
import React from 'react'
import Result from "./result";

type Props = {
    handleSubmit: React.Dispatch<React.SetStateAction<any>>;
}

export default function Search({ handleSubmit }: Props) {
    const [results, setResults] = React.useState([]);

    return (
        <div className='flex flex-col items-center w-full'>
            <SearchBar setResults={(e) => setResults(e)} handleSubmit={handleSubmit}/>
            {results.length > 0 &&
                <div className='flex flex-col overflow-y-scroll overflow-x-hidden 
                    w-[80vw] max-h-[35vh] md:w-[30vw]  md:max-h-[50vh] 
                    my-2 py-2 rounded-md bg-base-100 shadow-sm shadow-neutral-content
                    no-scrollbar .no-scrollbar::-webkit-scrollbar'
                >

                    {results.map((op, index) => (<Result key={index} op={op} handleSubmit={handleSubmit}/>))}
                </div>
            }
        </div>
    );
}
