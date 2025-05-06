import { Link, useNavigate } from "react-router-dom"
import { FlipWords } from "./components/flip-words"
import { GridBackgroundDemo } from "./components/GridBackgroundDemo"
import { useSelector } from "react-redux"

const titleLines = [
  "Claim your X. Defend your O.",
  "Your X. Their O. Only one winner.",
  "Every square counts. Every move matters.",
  "Unleash your strategy. Outsmart your opponent.",
]

function App() {

  const navigate = useNavigate()

  const isLoggedIn = useSelector((state: any) => state.user.isLoggedIn)
  const userDetails = useSelector((state: any) => state.user.userDetails)

  const handlePlayNow = () => {
    if (isLoggedIn) navigate("/gameplay")
    else navigate("/login")
  }

  const handleProfileClick = () => {
    navigate(`/profile/${userDetails._id}`)
  }

  return (
    <>
      <div className="w-full h-dvh flex transition-all duration-300 ease-in">
        <GridBackgroundDemo />

        <div className="w-full h-dvh z-20 space-y-8 flex flex-col items-center justify-center">

          {isLoggedIn && <button onClick={handleProfileClick} className="fixed flex cursor-pointer top-4 right-4 p-[0.5px] rounded-full bg-gradient-to-r from-blue-600 to-red-500 text-white">
            <div className="w-full flex h-full bg-[#010101] hover:bg-[#131313] px-5 py-2 rounded-full">
              <span className="font-[JetBrains_Mono] leading-none text-lg text-transparent bg-clip-text bg-gradient-to-r from-blue-600  to-red-500">{userDetails.username}</span>
            </div>
          </button>
          }

          <div className='w-full flex flex-col items-center justify-center'>
            <span className='font-bold font-[poppins] leading-none text-[60px] md:text-[100px] text-transparent bg-clip-text bg-gradient-to-r from-blue-600  to-red-500'>XO Arena</span>
            <h2 className={`mt-2 text-[36px] md:text-[80px] font-[cookie] leading-none text-[#d3d3d3] font-bold`}>
              Real Time Battles in the Grid
            </h2>
            <div className={`text-[16px] text-center sm:text-[22px] font-[poppins] text-[#a3abb9] leading-none font-light`}>
              <FlipWords words={titleLines} />
            </div>
          </div>

          <div className='space-x-6 font-[JetBrains_Mono]'>
            <button onClick={handlePlayNow} className={`rounded-md py-1.5 px-3.5 text-white bg-blue-600 hover:bg-blue-700 font-bold cursor-pointer`}>Play Now</button>
            <Link to="/how-it-works">
              <button className={`rounded-md py-1.5 px-3.5 text-gray-300 transition-all duration-100 hover:bg-[#212121] border border-[#808080] cursor-pointer`}>How it works</button>
            </Link>
          </div>

        </div>

        <footer className="absolute bottom-0 w-full text-[#a3abb9]">
          <div className="font-[JetBrains_Mono] tracking-tight flex flex-col items-end justify-center w-full h-auto text-[#a3abb9] p-3">
            <p className="text-[12px]">© 2025 XO Arena. All rights reserved</p>
            <p className="text-[13px]">Made with ❤️ by Subodh Singh</p>
          </div>
        </footer>
      </div>
    </>
  )
}

export default App
