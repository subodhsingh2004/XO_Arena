import { useState } from "react"
import { GridBackgroundDemo } from "../components/GridBackgroundDemo"
import { Link, useNavigate } from "react-router-dom"
import { login } from "../services/userApi"
import { useDispatch } from "react-redux"
import { loginReducer } from "../slice/userSlice"
import { toast } from "react-toastify"
import axios from "axios"
import Loader from "../components/Loader"

function Login() {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [username, setUsername] = useState<string>("")
    const [password, setPassword] = useState<string>("")

    const [isLoading, setIsLoading] = useState(false)


    const loginUser = async (e: React.FormEvent) => {
        e.preventDefault()

        if (username.length === 0 || password.length === 0) {
            toast.error("Please fill all the fields", {
                style: {
                    backgroundImage: 'linear-gradient(to right, #010101, #dc2626)',
                    border: '1px solid #212121',
                    fontFamily: 'poppins'
                },
            })
            return
        }

        try {
            setIsLoading(true)
            const response = await login(username, password)
            if (response) {
                toast.success("Login successfully", {
                    style: {
                        backgroundImage: 'linear-gradient(to right, #010101, #16a34a)',
                        border: '1px solid #212121',
                        fontFamily: 'poppins'
                    },
                })
                setUsername("")
                setPassword("")
                setIsLoading(false)
                dispatch(loginReducer(response.user))
                navigate(`profile/${response.user._id}`)
            }
        } catch (error) {
            setIsLoading(false)
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.error, {
                    style: {
                        backgroundImage: 'linear-gradient(to right, #010101, #dc2626)',
                        border: '1px solid #212121',
                        fontFamily: 'poppins'
                    },
                })
            } else {
                toast.error("Something went wrong", {
                    style: {
                        backgroundImage: 'linear-gradient(to right, #010101, #dc2626)',
                        border: '1px solid #212121',
                        fontFamily: 'poppins'
                    },
                })
            }
        }
    }

    return (
        <div className="w-full h-dvh flex transition-all duration-300 ease-in">
            <GridBackgroundDemo />

            <div className="w-full h-dvh z-20 flex items-center justify-center">

                <Loader isActive={isLoading} />

                <div className="w-full p-4 fixed top-0 flex items-start justify-center md:justify-start">
                    <Link to="/">
                        <h1 className='font-bold font-[poppins] leading-none text-[30px] text-transparent bg-clip-text bg-gradient-to-r from-blue-600  to-red-500'>XO Arena</h1>
                    </Link>
                </div>

                <div className="w-full flex items-center flex-col space-y-6 md:space-y-10 px-8">

                    <div className="flex items-center justify-center relative">
                        <h2 className="font-[poppins] font-medium text-white text-3xl tracking-wide">Login to your Account <span className="text-[26px] sm:hidden absolute bottom-1 ml-1.5">🔑</span></h2>
                    </div>

                    <form onSubmit={loginUser} className="flex flex-col w-full sm:w-[350px]">

                        <div className="flex flex-col space-y-6">
                            <div className="flex flex-col space-y-2">
                                <label htmlFor="username" className="text-gray-400 font-[JetBrains_Mono]">Enter Username</label>
                                <input
                                    type="text"
                                    id="username"
                                    value={username}
                                    required
                                    autoComplete="off"
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="p-2 border-none rounded-md text-white font-[JetBrains_Mono] focus:outline-gray-400 focus:outline-[3.5px] outline-[3.5px] outline-[#515151]"
                                />
                            </div>
                            <div className="flex flex-col space-y-2">
                                <label htmlFor="password" className="text-gray-400 font-[JetBrains_Mono]">Enter Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    required
                                    min={8}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="p-2 border-none rounded-md text-white focus:outline-gray-400 focus:outline-[3.5px] outline-[3.5px] outline-[#515151]"
                                />
                            </div>
                        </div>

                        <button type="submit" className="mt-10 bg-gradient-to-r from-blue-600 to-red-500 text-white font-[JetBrains_Mono] font-bold  py-2 rounded-md hover:bg-gradient-to-l transition-colors duration-500 cursor-pointer">
                            Login
                        </button>

                        <p className="text-[#a3abb9] mt-3 text-sm font-[poppins]">
                            Don't have an Account ?
                            <Link to={'/sign-up'} className="text-white font-[JetBrains_Mono]"> Signup </Link>
                        </p>

                    </form>

                </div>

            </div>
        </div>
    )
}

export default Login