import React from "react";

// Types
import { type GuessResult, compareGuess } from "~/helper/compare";
import type { Stats } from "~/server/api/routers/wordle";
import type { Operator } from "@prisma/client";
import type { GetServerSideProps } from "next";

// Components
import Theme from "~/components/arknights-wordle/header/theme";
import Info from "~/components/arknights-wordle/header/info";
import Hints from "~/components/arknights-wordle/hints/hints";
import { getAllOperators, getStats } from "~/server/api/routers/wordle";
import { getDateString, randomInteger } from "~/helper/helper";
import { api } from "~/utils/api";
import Head from "next/head";
import PastGuesses from "~/components/arknights-wordle/results/pastGuesses";
import SearchAndShare from "~/components/arknights-wordle/searchAndShare";
import SearchError from "~/components/arknights-wordle/search/searchError";

interface GameModeContextValue {
  allOperators: Operator[],
  stats: Stats,
  guesses: GuessResult[],
  endlessGuesses: GuessResult[],
  endlessPlaying: boolean,
  isNormalMode: boolean,
  setIsNormalMode: (v: boolean) => void,
  handleSubmit: (guess: Operator, callback: (success: boolean) => void) => void, 
  endlessOp: Operator,
  handleEndlessReset: () => void,
}

export const GameModeContext = React.createContext<GameModeContextValue>(undefined as unknown as GameModeContextValue);

export default function ArknightsWordle({
  stats,
  allOperators,
}: {
  stats: Stats;
  allOperators: Operator[];
}) {
  const [guesses, setGuesses] = React.useState<GuessResult[]>([]);
  const [playing, setPlaying] = React.useState(true);

  const [endlessGuesses, setEndlessGuesses] = React.useState<GuessResult[]>([]);
  const [endlessPlaying, setEndlessPlaying] = React.useState(true);
  const [isNormalMode, setIsNormalMode] = React.useState(true);
  const [endlessOp, setEndlessOp] = React.useState<Operator>(undefined as unknown as Operator)

  const [isInputDelay, setIsInputDelay] = React.useState(false);
  const [darkMode, setDarkMode] = React.useState(false);
  const [error, setError] = React.useState("");
  const [endlessError, setEndlessError] = React.useState("");

  const winMutation = api.wordle.updateWins.useMutation();

  React.useEffect(() => {
    const initGuesses = () => {
      const now = getDateString();
      const lastPlayed = localStorage.getItem("lastPlayed");
      // Refresh the guesses and set playing to true if the last played date is not the current date
      if (now != lastPlayed) {
        localStorage.setItem("guesses", JSON.stringify([]));
        localStorage.setItem("lastPlayed", now);
        localStorage.setItem("playing", "true");
        setPlaying(true);
        setGuesses([]);
      } else {
        // The reason for storing on both localstorage and state is to make sure state persists through refresh
        const isGuesses = localStorage.getItem("guesses");
        const guesses = isGuesses
          ? (JSON.parse(isGuesses) as unknown as GuessResult[])
          : [];
        const isPlaying = localStorage.getItem("playing");
        const playing = isPlaying
          ? (JSON.parse(isPlaying) as unknown as boolean)
          : true;
        setPlaying(playing);
        setGuesses(guesses);
      }
    };

    const initTheme = () => {
      if (
        localStorage["data-theme"] === "dark" ||
        (!("data-theme" in localStorage) &&
          window.matchMedia("(prefers-color-scheme: dark)").matches)
      ) {
        document.getElementById("theme-checkbox")?.setAttribute("checked", "");
        document
          .getElementById("ak-wordle-root")
          ?.setAttribute("data-theme", "dark");
        setDarkMode(true);
      } else {
        document
          .getElementById("ak-wordle-root")
          ?.setAttribute("data-theme", "light");
      }
    };

    const initEndless = () => {
      // Init endless operator
      const ls = localStorage.getItem("endlessOp");
      const chosenEndlessOp: Operator | null= ls
        ? (JSON.parse(ls) as unknown as Operator)
        : null;

      if (chosenEndlessOp == null) {
        const newEndlessOp = allOperators[randomInteger(0, allOperators.length)]!
        setEndlessOp(newEndlessOp)
        localStorage.setItem("endlessOp", JSON.stringify(newEndlessOp))
      } else {
        setEndlessOp(chosenEndlessOp)
      }

      // Init endless guesses
      const isGuesses = localStorage.getItem("endlessGuesses");
      const guesses = isGuesses
        ? (JSON.parse(isGuesses) as unknown as GuessResult[])
        : [];
      const isPlaying = localStorage.getItem("endlessPlaying");
      const playing = isPlaying
        ? (JSON.parse(isPlaying) as unknown as boolean)
        : true;
      setEndlessPlaying(playing);
      setEndlessGuesses(guesses);
    }

    initEndless();
    initGuesses();
    initTheme();
  });

  const handleSubmit = (
    guess: Operator,
    callback: (success: boolean) => void,
  ) => {
    const pastGuesses = isNormalMode ? guesses : endlessGuesses;
    const res = compareGuess(guess, pastGuesses, isNormalMode ? stats.operator : endlessOp)

    if (res.valid && res.guessResult != null) {
      setError("");
      setIsInputDelay(true);
      // Insert the newest guess at the first index of the answer row array
      const newGuesses = [res.guessResult, ...pastGuesses];
      
      if (isNormalMode) {
        localStorage.setItem("guesses", JSON.stringify(newGuesses));
        setGuesses(newGuesses);
      } else {
        localStorage.setItem("endlessGuesses", JSON.stringify(newGuesses));
        setEndlessGuesses(newGuesses);
      }
      
      // Prevent the user from being able to input new guesses with an input delay, and to let the winning animation play fully
      // state change while this animation is occuring will stop the animation entirely.
      if (res.guessResult?.correct) {
        setTimeout(() => setPlaying(false), 4000);
        setTimeout(() => setIsInputDelay(false), 4000);

        if (isNormalMode) {
          localStorage.setItem("playing", "false");
          setPlaying(false);
          winMutation.mutate();
        } else {
          localStorage.setItem("endlessPlaying", "false");
          setEndlessPlaying(false);
        }
        
      } else {
        setTimeout(() => setIsInputDelay(false), 2500);
      }
      callback(true);
    } else {
      if (res.error.length > 0)
        isNormalMode ? setError(res.error) : setEndlessError(res.error)
      else {
        isNormalMode ? setError(`Something went wrong ${res.error}`) : setEndlessError(`Something went wrong ${res.error}`)
      }
      callback(false)
    }
  };

  const handleEndlessReset = () => {
    const newEndlessOp = allOperators[randomInteger(0, allOperators.length)]!
    setEndlessOp(newEndlessOp)
    localStorage.setItem("endlessOp", JSON.stringify(newEndlessOp))
    
    setEndlessPlaying(true);
    localStorage.setItem("endlessPlaying", "true")

    setEndlessGuesses([]);
    localStorage.setItem("endlessGuesses", JSON.stringify([]));
  }

  const handleThemeChange = (e: HTMLInputElement) => {
    const theme = e.checked ? "dark" : "light";
    localStorage.setItem("data-theme", theme);
    document
      .getElementById("ak-wordle-root")
      ?.setAttribute("data-theme", theme);
    setDarkMode(theme === "dark");
  };

  return (
    <>
      <Head>
        <title>Arknights Wordle</title>
        <meta name="description" content="An Arknights Wordle parody as a personal/passion project. Type in an operators name and try to guess the correct operator using 7 different categories. Created by Three6ty1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main
        id="ak-wordle-root"
        className="justify-top flex h-full w-full flex-col items-center p-5 pt-10 text-center align-middle font-sans"
      >
        <Theme handleThemeChange={(e) => handleThemeChange(e)} />
        <Info darkMode={darkMode} stats={stats} />

        <GameModeContext.Provider value={{allOperators, stats, guesses, endlessGuesses, endlessPlaying, isNormalMode, setIsNormalMode, handleSubmit, endlessOp, handleEndlessReset}}>
          <Hints />
          <SearchError error={error} endlessError={endlessError} />

          <div className="grid w-full justify-center">
            <SearchAndShare isInputDelay={isInputDelay} playing={playing}/>
            <PastGuesses />
            
          </div>
        </GameModeContext.Provider>
      </main>
    </>
    
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const stats = await getStats();
  const allOperators = await getAllOperators();

  return {
    props: {
      stats,
      allOperators,
    },
  };
};
