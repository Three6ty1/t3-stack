import { getOperatorIconUrl } from "~/helper/helper"
import Image from "next/image";

export default function VersionLog() {
    
    const versions = [
        {
            version: "1.4",
            content: "- Fixed bug where recent chosen operators are chosen again.\n- Keep in mind that the database did get nuked so there will be overlaps with the previous month of operators.\n- I manually reset the operator, so reset your cache for the operator today if you've already guessed.\n- Added Endless mode. I did not add the share functionality as I didn't find a reason as to why you'll share endless. It's easy enough to add it in the future though.\n- Code base refactoring and cleaning up. Me from 6 months ago would be proud.\n- This will be the last update ON THIS DOMAIN. I will start porting over this project off of Vercel.\n- No promises as to when it will happen but everyone will have a weeks notice and I'll have a popup when you visit the site."
        },
        {
            version: "1.3.1",
            content: "- i mispelled wordle in the discord linking text and forgot to add the <> to remove the embed im very sorry"
        },
        {
            version: "1.3",
            content: "- Had to reset the database\n- Added share with markdown feature to reduce text length by hyperlinking url (Mainly for Discord)\n- Added metadata and icon to the site. Wordle and Arknights Rhodes Island icons were used and edited.\n- Added alias searching for cases such as Kirin Yato and Rathalos Noir Corne\n- Added a bunch of joke aliases/nicknames. I hope everyone has as much fun discovering them as I did adding them\n- For example, try searching for \"Doggo\" (sorry namie) :^)\n- I plan on adding an endless mode (Client side)\n- Till next time, Wdance"
        },
        {
            version: "1.2",
            content: "- Moved all the compare logic to the client side to reduce function invocation limits\n- There was an earlier caching oversight causing the client to not rollover to the new operator, apologies for that. Feel free to abuse local storage to refresh/mess around with the guesses\n- Website might be migrated to another host in the near future therefore the URL will change. Vercel charges $30AUD per month (insert sobbing emoji)\n",
        },
        {
            version: "1.1",
            content: "- Removed world map to save server costs\n- Deleted IS exclusive 5* operators\n- Added this update log\n- Added operators up to and including Viviana's banner. Previously only up to Executor-Alter banner (+20)\n- Added missing operators Friston-3 and U-Official (+2)",
            added: [["char_2012_typhon", 6], ["char_1034_jesca2", 6], ["char_4088_hodrer", 6],["char_4098_vvana", 6],["char_245_cello", 6], ["char_4093_frston", 1], ["char_4091_ulika", 1]],
        },
        {
            version: "1.0",
                content: "Hello Dokutah's, this is just a personal project of mine that I wanted to make for fun. Don't expect consistent updates since I will definitely fall behind on content eventually.\n\nUntil I figure out a way to get suggestions from the community, I will keep on adding features that I think are appropriate.\n\nThe database of this project depends on the Aceship github icons and gamedata repo, so my thanks goes out for the maintainers of that site.\n\nAnd lastly, thank you for playing - Three6ty1"
        }
    ]
    return (
        <>
            <button className="underline" onClick={()=>(document.getElementById('version_modal') as HTMLDialogElement).showModal()}>v{versions[0]?.version}</button>
            <dialog id="version_modal" className="modal">
                <div className="modal-box flex flex-col space-y-2 md:space-y-6 no-scrollbar no-scrollbar::-webkit-scrollbar overflow-y-scroll h-2/3">
                    {versions.map((currentVersion) => (
                        <div className="flex flex-col" key={`${currentVersion.version} key`}>
                            <h3 className="font-bold text-lg">Version {currentVersion.version}</h3>
                            <p className="whitespace-pre-line float-left text-left">{currentVersion.content}</p>
                            {currentVersion.added ?
                                <div className="flex flex-wrap">
                                    {currentVersion.added.map(char => {
                                        if (typeof char[0] === 'string' && typeof char[1] === 'number') {
                                            const url = getOperatorIconUrl(char[0], char[1])
                
                                            return <Image
                                                key={`${char[0]} version icon`}
                                                className="m-[0.5px] rounded-md border-[0.1px] border-solid border-incorrect"
                                                src={url}
                                                alt={`${char[0]} operator icon`}
                                                width={50}
                                                height={50}
                                            />
                                        }
                                        console.log("Could not load " + char[0])
                                        return <></>
                                    })}
                                </div>
                                :
                                <></>
                            }
                        </div>
                    ))}
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </>
    )
}