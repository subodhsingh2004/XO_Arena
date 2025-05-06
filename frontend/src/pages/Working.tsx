import { Link } from "react-router-dom"
import { GridBackgroundDemo } from "../components/GridBackgroundDemo"

function Working() {
    return (
        <div className="w-full h-dvh flex">
            <GridBackgroundDemo />

            <div className="w-full h-dvh z-20 flex flex-col gap-8 items-center justify-center">

                <div className="w-full p-4 fixed top-0 flex justify-center sm:justify-start items-start">
                    <Link to={'/'}>
                        <h1 className='font-bold font-[poppins] leading-none text-[30px] text-transparent bg-clip-text bg-gradient-to-r from-blue-600  to-red-500'>XO Arena</h1>
                    </Link>
                </div>

                <div className="w-full px-5 xl:px-10 flex flex-col items-center justify-center sm:flex-row gap-8 sm:justify-around">

                    <div className="flex w-full md:w-fit flex-col space-y-2">
                        <h2 className="font-[poppins] text-white text-3xl">How it works ?</h2>
                        <ol className="text-[#a3abb9] text-[18px] font-[JetBrains_Mono] space-y-2 sm:mt-4 list-decimal list-inside">
                            <li className="tracking-tighter leading-5 text-[16px]">Create your Account. No Email required.</li>
                            <li className="tracking-tighter leading-5 text-[16px]">Generate GameRoom code or enter a GameRoom code.</li>
                            <li className="tracking-tighter leading-5 text-[16px]">And that's all required, start playing with your friends. </li>
                        </ol>
                    </div>

                    <div className="flex w-full md:w-fit flex-col space-y-2">
                        <h2 className="font-[poppins] text-white text-3xl">Rules</h2>
                        <ol className="text-[#a3abb9] text-[18px] font-[JetBrains_Mono] space-y-2 sm:mt-4 list-decimal list-inside">
                            <li className="tracking-tighter leading-5 text-[16px]">Each win gives you 5 points, and each loss  deducts 2 points.</li>
                            <li className="tracking-tighter leading-5 text-[16px]">The Player who created the room will get 'X' Symbol and first move.</li>
                        </ol>
                    </div>

                </div>

                <Link to="/" className="self-center">
                    <button className={` mt-6 sm:mt-11 rounded-md py-2 px-3.5 w-fit text-gray-300 border border-[#707070] font-[JetBrains_Mono] text-sm hover:bg-[#212121] transition-all duration-100 cursor-pointer`}>Back to Home</button>
                </Link>

            </div>
        </div>
    )
}

export default Working