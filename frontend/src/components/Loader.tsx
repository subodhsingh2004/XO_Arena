import "./../style.css"

interface Prop {
    isActive: boolean
}

function Loader({isActive}: Prop) {
    return (
        isActive && <div className="absolute w-full h-full flex justify-center items-center z-50 bg-[#212121]/60 backdrop-blur-[3px]">

            <div className="flex flex-col items-center">
                <div className="text-8xl animate-pulse duration-100 font-medium font-[poppins] bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent">#</div>
                <span className="text-white font-[JetBrains_Mono]">Loading.....</span>
            </div>

        </div>

    )
}

export default Loader