import { Link, useNavigate } from "react-router-dom"
import { GridBackgroundDemo } from "../components/GridBackgroundDemo"
import { useDispatch, useSelector } from "react-redux"
import { logout } from "../services/userApi"
import { toast } from "react-toastify"
import { logoutReducer } from "../slice/userSlice"

function Profile() {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const userDetails = useSelector((state: any) => state.user.userDetails)

    const DateFormatter = (isoDate: string): string => {
        const date = new Date(isoDate)
        const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };

        const formattedDate = date.toLocaleDateString('en-GB', options)
        return formattedDate
    }

    const handleLogout = async () => {
        try {
            const response = await logout()
            if (response) {
                toast.success(response.message, {
                    style: {
                        backgroundImage: 'linear-gradient(to right, #010101, #155dfc)',
                        border: '1px solid #212121',
                        fontFamily: 'poppins'
                    },
                })
                dispatch(logoutReducer())
                navigate('/')
            }
        } catch (error) {
            toast.error("Error in logout", {
                style: {
                    backgroundImage: 'linear-gradient(to right, #010101, #dc2626)',
                    border: '1px solid #212121',
                    fontFamily: 'poppins'
                },
            })
        }
    }
    return (
        <div className="w-full h-dvh flex overflow-hidden">
            <GridBackgroundDemo />

            <div className="w-full h-dvh z-20 flex items-center justify-center">
                
                {/* LOGO */}
                <div className="w-full p-4 fixed top-0 flex justify-center sm:justify-start items-start">
                    <Link to={'/'}>
                        <h1 className='font-bold font-[poppins] leading-none text-[30px] text-transparent bg-clip-text bg-gradient-to-r from-blue-600  to-red-500'>XO Arena</h1>
                    </Link>
                </div>

                <div className="flex flex-col items-center sm:w-[400px]">
                    <h2 className="text-white font-[poppins] tracking-wide text-2xl">Profile</h2>

                    <div className="flex flex-col gap-4 mt-2 sm:mt-8 w-full">
                        <div className="bg-[#181818] rounded-md flex items-center justify-between w-full py-2 px-2 border border-[#313131]">
                            <div className="flex flex-col">
                                <span className="text-gray-400 font-[poppins] text-sm">Username</span>
                                <span className="text-[20px] text-transparent bg-clip-text bg-gradient-to-r from-blue-500  to-red-600 font-[JetBrains_Mono] font-bold">{userDetails.username}</span>
                            </div>
                            <div>
                                <img src="/user.png" alt="user_image" />
                            </div>
                        </div>

                        <div className="bg-[#181818] rounded-md flex items-center justify-between w-full py-2 px-2">
                            <div className="flex flex-col">
                                <span className="text-gray-400 font-[poppins] text-sm">Joined on</span>
                                <span className="font-[JetBrains_Mono] text-white text-sm">{DateFormatter(userDetails.createdAt)}</span>
                            </div>
                            <div>
                                <img src="/calender.png" alt="calender_image" />
                            </div>
                        </div>

                        <div className="bg-[#181818] rounded-md flex items-center justify-between w-full py-2 px-2">
                            <div className="flex flex-col">
                                <span className="text-gray-400 font-[poppins] text-sm">Total Points</span>
                                <span className="font-[JetBrains_Mono] text-white text-lg">{userDetails.totalPoints}</span>
                            </div>
                            <div>
                                <img src="/points.png" alt="calender_image" className="w-[36px] h-[36px]" />
                            </div>
                        </div>

                        {/* <div className="space-x-8 bg-[#181818] rounded-md flex flex-col w-full py-1 px-2">
                            <span className="text-gray-400 font-[poppins] text-sm">GameId</span>
                            <span className="text-white font-[JetBrains_Mono]">Not created yet</span>
                        </div> */}

                        <div className="flex gap-4">
                            <div className="bg-[#181818] rounded-md flex items-center justify-between w-1/2 py-4 px-2">
                                <div className="flex flex-col">
                                    <span className="text-gray-400 font-[poppins] text-sm">Games Played</span>
                                    <span className="text-white font-[JetBrains_Mono] text-2xl">{userDetails.gamesPlayed}</span>
                                </div>
                                <div>
                                    <img src="/tictactoe.png" className="h-[38px]" alt="user_image" />
                                </div>
                            </div>
                            <div className="bg-[#181818] rounded-md flex justify-between w-1/2 py-4 px-2">
                                <div className="flex flex-col">
                                    <span className="text-gray-400 font-[poppins] text-sm">Games Won</span>
                                    <span className="text-white font-[JetBrains_Mono] text-2xl">{userDetails.gamesWon}</span>
                                </div>
                                <span className="text-[30px]" >🏆</span>
                            </div>
                        </div>

                        <div className="flex flex-col w-full mt-0 gap-3">
                            <button onClick={() => navigate('/gameplay')} className="bg-gradient-to-r from-blue-600 to-red-500 text-white font-[JetBrains_Mono] font-bold  py-2 rounded-md hover:bg-gradient-to-l transition-colors duration-500 cursor-pointer">
                                Play Now
                            </button>

                            <button onClick={handleLogout} className="border border-[#414141] hover:bg-[#181818] text-gray-400 font-[JetBrains_Mono] font-bold  py-2 rounded-md cursor-pointer">
                                Logout
                            </button>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    )
}

export default Profile