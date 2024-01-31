import LogoBlack from '../../../../public/logo_black.png'
import LogoWhite from '../../../../public/logo_white.png';
import Image from 'next/image';

type Props = {
    darkMode: boolean;
    stats: {
        gameId: number,
        date: string,
        operatorId: string,
        timesGuessed: number,
    }
}
export default function Info({ darkMode, stats } : Props) {
    return (
        <>
            <Image width={416} height={72} src={`${darkMode ? LogoWhite.src : LogoBlack.src}`} alt='Logo'/>
            <h1 className='font-bold text-4xl'>WORDLE</h1>
            <div className='mt-2'>
                <p>{`#${stats?.gameId}, ${stats?.date} (AEST)`}</p>
                <p>{`${stats?.timesGuessed === 0 ? 'No Dokutah\'s have': stats?.timesGuessed + ' ' + (stats?.timesGuessed && stats.timesGuessed > 1 ? 'Dokutah\'s have' : 'Dokutah has')} guessed the operator.`}</p>
            </div>
        </>
    )
}