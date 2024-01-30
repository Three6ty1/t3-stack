import SearchBar from "./searchBar";
import React from 'react'
import Results from "./results";
import { GuessResult } from "~/server/api/routers/wordleServer";

type Props = {
    guesses: GuessResult[];
    handleSubmit: React.Dispatch<React.SetStateAction<any>>;
}

export default function Search({ guesses, handleSubmit }: Props) {
    const [results, setResults] = React.useState([]);
    let newGuesses: string[] = [];

    for (const guess of guesses) {
        newGuesses.push(guess.name);
    }

    return (
        <div className='flex flex-col items-center w-full'>
            <SearchBar setResults={(e) => setResults(e)} handleSubmit={handleSubmit}/>
            <Results results={results} guesses={newGuesses} handleSubmit={handleSubmit}/>
        </div>
    );
}
