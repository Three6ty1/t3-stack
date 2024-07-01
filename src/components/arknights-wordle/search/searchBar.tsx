import type { Operator } from "@prisma/client";
import React from "react";

type Props = {
  setResults: (value: Operator[]) => void;
  handleSubmit: (
    guess: Operator,
    callback: (success: boolean) => void,
  ) => void;
  allOperators: Operator[];
};

export default function SearchBar({
  setResults,
  handleSubmit,
  allOperators,
}: Props) {
  const [input, setInput] = React.useState("");
  const [_results, _setResults] = React.useState<Operator[]>([]);

  const handleChange = (value: string) => {
    setInput(value);

    // Empty case
    if (value.trim() === "") {
      setResults([]);
      _setResults([]);
      return;
    }

    const inputLower = value.toLowerCase().trim();

    let results: Operator[] = []
    let aliasResults: Operator[] = []

    for (const op of allOperators) {
      const op_lower = op.name.toLowerCase();

      if (
        op_lower.startsWith(inputLower) ||
        op_lower.replace("'", "").startsWith(inputLower.replace("'", "")) ||
        op_lower.replace("ł", "l").startsWith(inputLower) || // special cases for Pozyomka and Mylnar
        op_lower.replace("ë", "yo").startsWith(inputLower)
      ) {
        results.push(op)
      } else {
        const matchingAlias = op.alias.filter(a => {
          const lower = a.toLowerCase()
          return lower.startsWith(inputLower) || lower.startsWith(inputLower.replace("'", ""))
        })
        if (matchingAlias.length > 0) {
          aliasResults.push(op)
        }
      }
    }

    _setResults([...results, ...aliasResults]);
    setResults([...results, ...aliasResults]);
  };

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      let guess;
      if (_results.length > 0 && _results[0]) {
        guess = _results[0];
      } else {
        return;
      }
      
      setResults([]);
      _setResults([]);
      
      const callback = () => {
        setInput("");
      };

      handleSubmit(
        guess,
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
