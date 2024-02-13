import { Stats } from "~/server/api/routers/wordle";
import LogoBlack from "../../../../public/logo_black.png";
import LogoWhite from "../../../../public/logo_white.png";
import Image from "next/image";

type Props = {
  darkMode: boolean;
  stats: Stats;
};
export default function Info({ darkMode, stats }: Props) {
  return (
    <>
      <Image
        width={416}
        height={72}
        src={`${darkMode ? LogoWhite.src : LogoBlack.src}`}
        alt="Logo"
        priority={true}
      />
      <h1 className="text-4xl font-bold">WORDLE</h1>
      <div className="mt-2">
        <p>{`#${stats?.gameId}, ${stats?.date} (AEST)`}</p>
        <p>{`${stats?.timesGuessed === 0 ? "No Dokutah's have" : stats?.timesGuessed + " " + (stats?.timesGuessed && stats.timesGuessed > 1 ? "Dokutah's have" : "Dokutah has")} guessed the operator.`}</p>
      </div>
    </>
  );
}
