import { useState } from "react";

type Props = {
    roomId: string
}

function RoomCodePopup({ roomId }: Props) {
    const [isCopied, setIsCopied] = useState(false);

    return (
        <>
            <div className="absolute md:top-8 px-5">
                <div className="w-full bg-amber-50 p-0.5 bg-gradient-to-r from-blue-600 to-red-600 rounded-xl">
                    <div className="text-center flex flex-col items-center bg-[#010101] border border-[#313131] py-5 px-3 rounded-xl">

                        <h2 className="font-medium font-[poppins] text-2xl">Room ID</h2>

                        <p className="font-[poppins] text-sm text-gray-400">share this code to your friend to invite them into your game</p>

                        <div className="flex justify-center gap-2 mt-4">
                            <span className="font-[JetBrains_Mono] bg-[#262626] p-0.5 px-1.5 rounded-md">{roomId}</span>
                            {
                                isCopied ?
                                    <button className="cursor-pointer" onClick={() => {
                                        setIsCopied(false)
                                    }}>
                                        <img src="/copied.png" alt="" />
                                    </button> :
                                    <button className="cursor-pointer" onClick={() => {
                                        setIsCopied(true)
                                        navigator.clipboard.writeText(roomId)
                                        setTimeout(() => { setIsCopied(false) }, 1000 * 30);
                                    }}>
                                        <img src="/copy.png" alt="" />
                                    </button>
                            }
                        </div>

                        <div className="mt-4">
                            <span className="font-[JetBrains_Mono] tracking-tighter text-gray-400">waiting for your friend to join the game..... </span>
                            <p className="font-[poppins] text-sm text-gray-300 tracking-normal leading-5 mt-3">once your friend join the room <br /> you will automatically enter the game</p>
                        </div> 

                    </div>
                </div>
            </div>
        </>
    )
}

export default RoomCodePopup