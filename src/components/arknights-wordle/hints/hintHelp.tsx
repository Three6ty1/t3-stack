import { HintBreakpoints } from "./hints";

export default function HintHelp() {
  return (
    <>
      <button
        className="btn indicator-item tooltip m-2 flex w-1/3 items-center"
        data-tip="Help and Info"
        onClick={() =>
          (
            document.getElementById("help_modal") as HTMLDialogElement
          ).showModal()
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
          />
        </svg>
      </button>
      <dialog id="help_modal" className="modal">
        <div className="modal-box h-2/3 md:h-auto">
          <h1 className="mb-2 text-xl font-bold">
            How to play Arknights Wordle
          </h1>
          <p>Each operator has 7 categories each.</p>
          <p>
            You must enter an operator and compare its traits to the currently
            chosen operator.
          </p>
          <p>
            <span className="font-bold">
              After {HintBreakpoints.one} guesses
            </span>{" "}
            the operator list will be sorted by Rarity.
          </p>
          <p>
            <span className="font-bold">
              After {HintBreakpoints.two} guesses
            </span>{" "}
            the operator list will be sorted by Class.
          </p>
          <p>
            After a guess, the correctness of your guess will be represented by
            these colours:
          </p>
          <ul className="whitespace-pre-line text-center">
            <li>
              <p className="bg-incorrect text-white">Grey</p>
              <p>Incorrect.</p>
            </li>
            <li>
              <p className="bg-higher text-white">Blue</p>
              <p>
                The E2 cost of the chosen operator is{" "}
                <span className="font-bold">HIGHER</span>
                <br />
                than your guessed operators E2 cost.
              </p>
            </li>
            <li>
              <p className="bg-lower text-white">Red</p>
              <p>
                The E2 cost of the chosen operator is{" "}
                <span className="font-bold">LOWER</span>
                <br />
                than your guessed operators E2 cost.
              </p>
            </li>
            <li>
              <p className="bg-half text-white">Orange</p>
              <p>
                The <span className="font-bold">allegiance</span> of your
                guessed operator is{" "}
                <span className="font-bold">partially correct</span>
              </p>
              <p>
                E.g. If the character is under Elite Ops and you guess a
                character from OP Reserve A1, this guess would be partially
                correct because both groups fall under Rhodes Island.
              </p>
            </li>
            <li>
              <p className="bg-correct text-white">Green</p>
              <p>Correct.</p>
            </li>
          </ul>
          <br />
          <p>Reset at 12:00AM AEST / 2:00PM UTC / 10AM EST</p>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}
