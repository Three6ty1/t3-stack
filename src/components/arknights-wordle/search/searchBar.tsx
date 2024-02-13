import type { Operator } from "@prisma/client";
import React from "react";
import type { Stats } from "~/server/api/routers/wordle";
import type { GuessResult } from "~/server/api/routers/wordleServer";
import { api } from "~/utils/api";

type Props = {
  setResults: (value: Operator[]) => void;
  handleSubmit: (
    promise: Promise<GuessResult>,
    callback: (success: boolean) => void,
  ) => void;
  allOperators: Operator[];
  stats: Stats;
};

export default function SearchBar({
  setResults,
  handleSubmit,
  allOperators,
  stats,
}: Props) {
  const [input, setInput] = React.useState("");
  const [_results, _setResults] = React.useState<Operator[]>([]);

  const utils = api.useUtils();

  const handleChange = (value: string) => {
    setInput(value);

    // Empty case
    if (value.trim() === "") {
      setResults([]);
      _setResults([]);
      return;
    }

    const lower = value.toLowerCase().trim();

    const results = allOperators.filter((op) => {
      const op_lower = op.name.toLowerCase();
      return (
        op_lower.startsWith(lower) ||
        op_lower.replace("'", "").startsWith(lower.replace("", "")) ||
        op_lower.replace("ł", "l").startsWith(lower) || // special cases for Pozyomka and Mylnar
        op_lower.replace("ë", "yo").startsWith(lower)
      );
    });
    _setResults(results);
    setResults(results);
  };

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const ls = localStorage.getItem("guesses");
      const _pastGuesses: GuessResult[] = ls
        ? (JSON.parse(ls) as unknown as GuessResult[])
        : [];
      const pastGuesses = _pastGuesses.map((guess) => guess.name);

      let guess;
      if (_results.length > 0 && _results[0]) {
        guess = _results[0];
      } else {
        return;
      }

      const callback = () => {
        setInput("");
        setResults([]);
        _setResults([]);
      };

      handleSubmit(
        utils.wordle.compare.fetch({
          guessOp: guess,
          guesses: pastGuesses,
          correctId: stats.operatorId,
        }),
        callback,
      );
    }
  };

  return (
    <div className="flex w-full flex-row items-center justify-center">
      <input
        name="operator-guess"
        value={input}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={(e) => handleKey(e)}
        placeholder="Start typing an operator name"
        className="input input-bordered w-[80vw] text-center md:w-[30vw]"
        type="text"
      />
    </div>
  );
}
