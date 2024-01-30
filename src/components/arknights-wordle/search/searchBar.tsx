import { TRPCClientError } from "@trpc/client";
import React from "react";
import { GuessType, GuessTypeValue } from "~/helper/helper";
import { GuessResult } from "~/server/api/routers/wordleServer";
import { api } from "~/utils/api";

type Props = {
    setResults: React.Dispatch<React.SetStateAction<any>>;
    handleSubmit: React.Dispatch<React.SetStateAction<any>>;
}

export default function SearchBar({ setResults, handleSubmit } : Props) {
    const allOperatorsArgs= api.wordle.allNames.useQuery();
    if (!allOperatorsArgs.isSuccess) {
        return <>{allOperatorsArgs.error}</>
    }
    const allOperators: GuessType[] = allOperatorsArgs.data;
    const [input , setInput] = React.useState('');
    const [_results, _setResults] = React.useState<GuessType[]>([]);

    const utils = api.useUtils();

    const handleChange = (value: string) => {
        setInput(value);

        // Empty case
        if (value.trim() === '') {
            setResults([]);
            _setResults([]);
            return;
        }
        
        const lower = value.toLowerCase().trim();

        const results = allOperators.filter((op) => {
            const op_lower = op[GuessTypeValue.name].toLowerCase();
            return (
                op_lower.startsWith(lower) || 
                op_lower.replace("'", "").startsWith(lower.replace("", "")) || 
                op_lower.replace("ł", "l").startsWith(lower) || // special cases for Pozyomka and Mylnar
                op_lower.replace("ë", "yo").startsWith(lower)
            );
        });
        _setResults(results);
        setResults(results);
    }

    const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if(e.key === 'Enter') {
            e.preventDefault();
            const ls = localStorage.getItem("guesses");
            let guessResults: GuessResult[] = ls ? JSON.parse(ls) : [];
            const pastGuesses = guessResults.map((guess) => guess.name);

            let guess;
            if (_results.length > 0 && _results[0]) {
                guess = _results[0][GuessTypeValue.name];
            } else {
                guess = input;
            }

            const callback = () => {
                setInput('');
                setResults([]);
                _setResults([]);
            }

            handleSubmit({promise: utils.wordle.compare.fetch({guess: guess, guesses: pastGuesses}), callback: callback})
        }
    }

    return (
        <div className='items-center flex flex-row justify-center w-full'>
            <input name='operator-guess'
            value={input}
            onChange={(e) => handleChange(e.target.value)}
            onKeyDown={(e) => handleKey(e)}
            placeholder='Start typing an operator name'
            className='input input-bordered w-[80vw] md:w-[30vw] text-center'
            type='text'/>
        </div>
    );
}