import React, { BaseSyntheticEvent } from 'react';
import { api } from "~/utils/api";

// Types
import { GuessResult } from '~/server/api/routers/wordleServer';

// Components
import Theme from '~/components/arknights-wordle/header/theme';
import Info from '~/components/arknights-wordle/header/info';
import Hints from '~/components/arknights-wordle/hints/hints';
import Search from '~/components/arknights-wordle/search/search';
import CategoryRows from '~/components/arknights-wordle/results/categoryRow';
import AnswerRow from '~/components/arknights-wordle/results/answerRow';
import ShareBox from '~/components/arknights-wordle/share/shareBox';
import { ChosenOperators } from '@prisma/client';
import { TRPCClientError } from '@trpc/client';

export default function ArknightsWordle() {
    const statsArgs = api.wordle.stats.useQuery(undefined, {refetchOnWindowFocus: false});

    if (!statsArgs.isSuccess) {
        return statsArgs.error;
    }
    const stats = statsArgs.data;

    const [guesses, setGuesses] = React.useState<GuessResult[]>([]);
    const [playing, setPlaying] = React.useState(true);
    const [isInputDelay, setIsInputDelay] = React.useState(false);
    const [darkMode, setDarkMode] = React.useState(false);
    const [error, setError] = React.useState('');

    React.useEffect(() => { 
        const initGuesses = () => {
            const now = new Date().toDateString()
            const lastPlayed = localStorage.getItem('lastPlayed');
            // Refresh the guesses and set playing to true if the last played date is not the current date
            if (now != lastPlayed) {
                localStorage.setItem('guesses', JSON.stringify([]));
                localStorage.setItem('lastPlayed', now);
                localStorage.setItem('playing', 'true');
                setPlaying(true);
                setGuesses([]);
            } else {
                // The reason for storing on both localstorage and state is to make sure state persists through refresh
                const isGuesses = localStorage.getItem('guesses');
                const guesses = (isGuesses) ? JSON.parse(isGuesses) : [];
                const isPlaying = localStorage.getItem('playing');
                const playing = (isPlaying) ? JSON.parse(isPlaying) as boolean : true;
                setPlaying(playing);
                setGuesses(guesses);
            }
        }

        const initTheme = () => {
            const isTheme = localStorage.getItem('data-theme');
            const theme: string = (isTheme) ? isTheme : 'light';
            document.getElementById('ak-wordle-root')?.setAttribute('data-theme', theme);
            if (theme === 'dark') {
                document.getElementById('theme-checkbox')?.setAttribute('checked', '');
                setDarkMode(true)
            }   
        }

        initGuesses();
        initTheme();
        
    }, [])

    const handleSubmit = (promise: Promise<GuessResult>, callback: (success: boolean) => void) => {
        promise.then((result) => {
            setError('');
            setIsInputDelay(true)
            const isGuesses = localStorage.getItem('guesses');
            const pastGuesses = (isGuesses) ? JSON.parse(isGuesses) : [];
            // Insert the newest guess at the first index of the answer row array
            let newGuesses = [result, ...pastGuesses];
            localStorage.setItem('guesses', JSON.stringify(newGuesses));
            setGuesses(newGuesses);

            // Prevent the user from being able to input new guesses with an input delay, and to let the winning animation play fully
            // state change while this animation is occuring will stop the animation entirely.
            if (result.correct) {
                setTimeout(() => setPlaying(false), 4000);
                setTimeout(() => setIsInputDelay(false), 4000)
                localStorage.setItem('playing', 'false');
                setPlaying(false);
            } else {
                setTimeout(() => setIsInputDelay(false), 2500)
            }
            callback(true);
        })
        .catch((error) => {
            if (error instanceof TRPCClientError) {
                setError(error.message);
            } else {
                setError(`Something went wrong ${error}`);
            }
            callback(false);
        })
    }

    const handleThemeChange = (e: BaseSyntheticEvent) => {
        const theme = e.target.checked ? 'dark' : 'light';
        localStorage.setItem('data-theme', theme);
        document.getElementById('ak-wordle-root')?.setAttribute('data-theme', theme);
        setDarkMode(theme === 'dark');
    }

    return (
        <main id='ak-wordle-root' className='flex flex-col w-full justify-top items-center align-middle text-center font-sans p-5 pt-10 h-full'>
            <Theme handleThemeChange={(e) => handleThemeChange(e)}/>
            <Info darkMode={darkMode} stats={stats} />

            <div className='flex justify-center align-middle w-3/4 md:w-96 my-2'>
                <Hints amtGuesses={guesses.length}/>
            </div>

            {error != '' ? (
                <p className='text-red-500'>{error}</p>
            ) : null}

            <div className='grid w-full justify-center pb-10'>
                {/** 
                * Using grid and col-start to force these elements to overlap one another 
                * This is so the search bar appears ontop of the answer row instead of pushing it down.
                */}
                <div className='flex flex-col col-start-1 row-start-1 align-middle w-full animate-fade-in'>
                    {playing && !isInputDelay && <Search handleSubmit={({promise, callback}) => handleSubmit(promise, callback)} />}
                </div>

                {!playing && !isInputDelay &&
                <div className='flex flex-col col-start-1 row-start-1 align-middle w-full animate-fade-in pb-10'>
                    <ShareBox gameInfo={stats}/>
                </div>
                }

                {/** Needs margin top or else it overlaps with search bar due to the grid formatting. */}
                <div className='col-start-1 row-start-1 flex flex-col mt-14 w-auto overflow-x-scroll overflow-y-clip md:overflow-visible'>
                    {/** Wrapper for div to expand into scrollable area in mobile */}
                    <div className='flex flex-col items-start'>
                        {guesses && (guesses.length) > 0 &&
                            <>
                                <CategoryRows />
                                {guesses.map(
                                    (guess: GuessResult, index) => 
                                    (<AnswerRow key={guess.charId ? guess.charId : index} guess={guess} index={index}/>)
                                )}
                            </>
                        }
                    </div>
                </div>
            </div>
        </main>
    );
}