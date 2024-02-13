import map from "../../../../public/world_map.png";
import { HintBreakpoints } from "./hints";
import React from "react";
import Image from "next/image";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";

const regions = {
  Ægir: "Aquatic animals and Seaborn.\nGroups: Abyssal Hunters.",
  Bolivar: "Mainly Perros: Dogs.",
  Columbia: "Varied.\nGroups: Blacksteel, Rhine Lab.",
  Higashi: "Oni and some Ægir.",
  Iberia: "Mainly Liberi: Birds.",
  Kazimierz: "Mainly Kuranta: Horses and Zebras.\nGroups: Pinus Sylvestris.",
  Kjerag: "Varied. Snow Realm.",
  Laterano: "Mainly Sankta: Angels and Liberi: Birds.",
  Leithanien: "Mainly Caprinae: Goats/Sheep and Elafia: Deer.",
  Lungmen: "Varied.\nGroups: Lee's Detective Agency, LGD, Penguin Logistics.",
  Minos: "Mainly Forte: Bovines/Camels.",
  "Rhodes Island":
    "Varied.\nGroups: Elite Ops, Followers, Op-teams, S.W.E.E.P.",
  "Rim Billiton": "Mainly Cautus: Rabbits and Hares.",
  Sami: "Mainly Elafia: Deer",
  Sargon: "Mainly Archosauria: Crocodilians and Pythia: Serpents.",
  Siracusa: "Mainly Lupo: Wolves and Vulpo: Foxes.\nGroups: Chiave's Gang.",
  Ursus: "Mainly Ursus: Bears.\nGroups: Ursus Student Self-Governing Group.",
  Victoria: "Mainly Feline: Cats.\nGroups: Dublinn, Glasgow.",
  Yan: "Varied. Ruled by Lung.\nGroups: Sui.",
};

type Props = {
  amtGuesses: number;
};

export default function HintWorldMap({ amtGuesses }: Props) {
  const [showAlert, setShowAlert] = React.useState(false);
  const handleClick = () => {
    (
      document.getElementById("world_map_modal") as HTMLDialogElement
    ).showModal();
    setShowAlert(false);
  };

  React.useEffect(() => {
    const setAmtGuesses = () => {
      if (amtGuesses === HintBreakpoints.one.valueOf()) {
        setShowAlert(true);
      }
    };
    setAmtGuesses();
  }, [amtGuesses]);

  return (
    <>
      <div className="indicator m-2 flex w-1/3">
        {showAlert && <span className="badge indicator-item bg-higher" />}
        <button
          className="btn tooltip flex w-full items-center"
          data-tip="World Map and Races"
          onClick={() => handleClick()}
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
              d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z"
            />
          </svg>
        </button>
      </div>
      <dialog id="world_map_modal" className="modal w-screen overflow-visible">
        <div className="no-scrollbar no-scrollbar::-webkit-scrollbar modal-box h-2/3 md:h-auto max-w-[95vw] md:max-w-[80vw]">
          <div className="h-auto w-full touch-auto overflow-auto md:h-auto">
            <TransformWrapper
              initialScale={1}
            >
              <TransformComponent>
                <img src={map.src} alt="map" />
              </TransformComponent>
            </TransformWrapper>
          </div>

          {amtGuesses >= HintBreakpoints.one.valueOf() && (
            <div className="mt-5 flex flex-row flex-wrap justify-start">
              {Object.entries(regions).map((region) => (
                <div className="h-36 w-1/2 text-left md:h-20 p-2" key={region[0]}>
                  <h1 className="font-bold">{region[0]}</h1>
                  <p className="whitespace-pre-line">{region[1]}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}
