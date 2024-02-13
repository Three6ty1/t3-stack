import React from "react";
import { TRPCClientError } from "@trpc/client";

// Types
import { type GuessResult } from "~/server/api/routers/wordleServer";

// Components
import Theme from "~/components/arknights-wordle/header/theme";
import Info from "~/components/arknights-wordle/header/info";
import Hints from "~/components/arknights-wordle/hints/hints";
import Search from "~/components/arknights-wordle/search/search";
import CategoryRows from "~/components/arknights-wordle/results/categoryRow";
import AnswerRow from "~/components/arknights-wordle/results/answerRow";
import ShareBox from "~/components/arknights-wordle/share/shareBox";
import type { GetServerSideProps } from "next";
import { getAllOperators, getStats } from "~/server/api/routers/wordle";
import type { Stats } from "~/server/api/routers/wordle";
import type { Operator } from "@prisma/client";

export default function ArknightsWordle({
  stats,
  allOperators,
}: {
  stats: Stats;
  allOperators: Operator[];
}) {
  const [guesses, setGuesses] = React.useState<GuessResult[]>([]);
  const [playing, setPlaying] = React.useState(true);
  const [isInputDelay, setIsInputDelay] = React.useState(false);
  const [darkMode, setDarkMode] = React.useState(false);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    const initGuesses = () => {
      const now = new Date().toDateString();
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

    initGuesses();
    initTheme();
  }, []);

  const handleSubmit = (
    promise: Promise<GuessResult>,
    callback: (success: boolean) => void,
  ) => {
    promise
      .then((result) => {
        setError("");
        setIsInputDelay(true);
        const ls = localStorage.getItem("guesses");
        const pastGuesses: GuessResult[] = ls
          ? (JSON.parse(ls) as unknown as GuessResult[])
          : [];
        // Insert the newest guess at the first index of the answer row array
        const newGuesses = [result, ...pastGuesses];
        localStorage.setItem("guesses", JSON.stringify(newGuesses));
        setGuesses(newGuesses);

        // Prevent the user from being able to input new guesses with an input delay, and to let the winning animation play fully
        // state change while this animation is occuring will stop the animation entirely.
        if (result.correct) {
          setTimeout(() => setPlaying(false), 4000);
          setTimeout(() => setIsInputDelay(false), 4000);
          localStorage.setItem("playing", "false");
          setPlaying(false);
        } else {
          setTimeout(() => setIsInputDelay(false), 2500);
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
      });
  };

  const handleThemeChange = (e: HTMLInputElement) => {
    const theme = e.checked ? "dark" : "light";
    localStorage.setItem("data-theme", theme);
    document
      .getElementById("ak-wordle-root")
      ?.setAttribute("data-theme", theme);
    setDarkMode(theme === "dark");
  };

  return (
    <main
      id="ak-wordle-root"
      className="justify-top flex h-full w-full flex-col items-center p-5 pt-10 text-center align-middle font-sans"
    >
      <Theme handleThemeChange={(e) => handleThemeChange(e)} />
      <Info darkMode={darkMode} stats={stats} />
      <Hints amtGuesses={guesses.length} allOperators={allOperators} />

      {error != "" ? <p className="text-red-500">{error}</p> : null}

      <div className="grid w-full justify-center">
        {/**
         * Using grid and col-start to force these elements to overlap one another
         * This is so the search bar appears ontop of the answer row instead of pushing it down.
         */}
        <div className="z-10 col-start-1 row-start-1 flex h-fit w-full flex-col align-middle">
          {playing && !isInputDelay && (
            <Search
              handleSubmit={(promise, callback) =>
                handleSubmit(promise, callback)
              }
              allOperators={allOperators}
              stats={stats}
            />
          )}
        </div>

        {!playing && !isInputDelay && (
          <div className="col-start-1 row-start-1 flex w-full flex-col pb-10 align-middle">
            <ShareBox gameInfo={stats} />
          </div>
        )}

        {/** Needs margin top or else it overlaps with search bar due to the grid formatting. */}
        <div className="relative top-20 col-start-1 row-start-1 flex flex-col overflow-y-clip overflow-x-scroll pb-10 md:overflow-x-visible md:overflow-y-visible">
          {/** Wrapper for div to expand into scrollable area in mobile */}
          <div className="flex w-fit flex-col">
            {guesses && guesses.length > 0 && (
              <>
                <CategoryRows />
                {guesses.map((guess: GuessResult, index) => (
                  <AnswerRow
                    key={guess.charId ? guess.charId : index}
                    guess={guess}
                    index={index}
                  />
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </main>
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
