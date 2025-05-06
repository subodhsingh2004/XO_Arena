import { useEffect, useState } from "react"
import { GridBackgroundDemo } from "../components/GridBackgroundDemo"
import { Link, useNavigate } from "react-router-dom"
import { checkUniqueUsername, signUp } from "../services/userApi"
import { useDispatch } from "react-redux"
import { loginReducer } from "../slice/userSlice"
import { toast } from "react-toastify"
import axios from "axios"
import Loader from "../components/Loader"

function Signup() {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [username, setUsername] = useState<string>("")
    const [password, setPassword] = useState<string>("")

    const [isLoading, setIsLoading] = useState(false)

    const [isUsernameAvailable, setIsUsernameAvailable] = useState<boolean>()

    const checkUserNameStatus = async () => {
        const response = await checkUniqueUsername(username)
        if (response) {
            if (response.isAvailable) {
                setIsUsernameAvailable(true)
            } else {
                setIsUsernameAvailable(false)
            }
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!isUsernameAvailable) {
            toast.error("Username is not available", {
                style: {
                    backgroundImage: 'linear-gradient(to right, #010101, #16a34a)',
                    border: '1px solid #212121',
                    fontFamily: 'poppins'
                },
            })
            return
        }

        try {
            setIsLoading(true)
            const response = await signUp(username, password)
            if (response) {
                toast.success("Account created successfully", {
                    style: {
                        backgroundImage: 'linear-gradient(to right, #010101, #16a34a)',
                        border: '1px solid #212121',
                        fontFamily: 'poppins'
                    },
                })
                dispatch(loginReducer(response.user))
                setIsLoading(false)
                setUsername("")
                setPassword("")
                navigate("/")
            }
        } catch (error) {
            setIsLoading(false)
            if (axios.isAxiosError(error)) {
                let err = error.response?.data?.error.split(":")
                toast.error(err[err.length - 1].trim())
            } else {
                toast.error("Something went wrong")
            }
        }

    }


    useEffect(() => {
        const delay = setTimeout(() => {
            if (username.length >= 3) {
                checkUserNameStatus()
            }
        }, 1000)
        return () => clearTimeout(delay);
    }, [username])

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

                <div className="w-full flex items-center flex-col space-y-6 md:space-y-10 p-8">

                    <div className="flex items-center justify-center relative">
                        <h2 className="font-[poppins] text-white text-3xl tracking-wide">Create your Account <span className="text-[26px] sm:hidden absolute bottom-1 ml-1">🔒</span></h2>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col w-full sm:w-[350px]">

                        <div className="flex flex-col space-y-6">

                            <div className="flex flex-col space-y-2">
                                <label htmlFor="username" className="text-gray-400 font-[JetBrains_Mono]">Set a Username</label>
                                <input
                                    type="text"
                                    id="username"
                                    value={username}
                                    required
                                    autoComplete="off"
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="p-2 border-none rounded-md text-white focus:outline-gray-400 focus:outline-[3.5px] outline-[3.5px] outline-[#515151]"
                                />
                            </div>

                            {
                                username.length > 0 && isUsernameAvailable === false ?
                                    <div className="flex items-center space-x-1 -mt-2">
                                        <img src="/redcross.png" alt="tick_image" className="h-[18px]" />
                                        <p className="text-red-500 font-[JetBrains_Mono] text-sm">
                                            Username already taken
                                        </p>
                                    </div> : null
                            }

                            {
                                username.length > 0 && isUsernameAvailable === true ?
                                    <div className="flex items-center space-x-1 -mt-2">
                                        <img src="/tick.png" alt="tick_image" className="h-[18px]" />
                                        <p className="text-green-500 font-[JetBrains_Mono] text-sm">
                                            Username is available
                                        </p>
                                    </div> : null
                            }

                            <div className="flex flex-col space-y-2">
                                <label htmlFor="password" className="text-gray-400 font-[JetBrains_Mono]">Create Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    required
                                    autoComplete="off"
                                    minLength={6}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="p-2 border-none rounded-md text-white focus:outline-gray-400 focus:outline-[3.5px] outline-[3.5px] outline-[#515151]"
                                />
                            </div>
                        </div>

                        <button className="mt-10 bg-gradient-to-r from-blue-600 to-red-500 text-white font-[JetBrains_Mono] font-bold  py-2 rounded-md hover:bg-gradient-to-l transition-colors duration-500 cursor-pointer">
                            Create Account
                        </button>

                        <p className="text-[#a3abb9] mt-3 text-sm font-[poppins]">
                            Already have an Account ?
                            <Link to={'/login'} className="text-white font-[JetBrains_Mono]"> Login</Link>
                        </p>

                    </form>

                </div>

            </div>
        </div>
    )
}

export default Signup