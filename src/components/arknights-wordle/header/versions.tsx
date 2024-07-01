import { getOperatorIconUrl } from "~/helper/helper"
import Image from "next/image";

export default function VersionLog() {
    
    const versions = [
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