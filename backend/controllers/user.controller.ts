import { Request } from "express";
import { User, UserModel } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

interface CustomReq extends Request {
    user?: User
}

let user;

const generateAccessAndRefreshToken = async (userId: string) => {
    try {
        const user = await UserModel.findById(userId)
        if (!user) {
            throw new ApiError(500, "User not found", [])
        }

        const refreshToken = await user.generateRefreshToken()
        const accessToken = await user.generateAccessToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }

    } catch (error) {
        throw new ApiError(500, `something went wrong while generating token: ${error}`, [])
    }
}

const signUp = asyncHandler(async (req: CustomReq, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Please provide username and password" });
    }

    const isUserExists = await UserModel.findOne({ username })
    if (isUserExists) {
        throw new ApiError(404, "User already exists", [])
    }

    const user: User = await UserModel.create({ username, password })
    if (!user) {
        throw new ApiError(500, "Error while signup", [])
    }

    req.user = user

    const token = await generateAccessAndRefreshToken(String(user._id))

    const signUpUser = await UserModel.findOne({ _id: user._id }).select("-password -refreshToken")

    return res.status(201)
        .cookie("token", token.accessToken, { httpOnly: true, secure: true, sameSite: "strict" })
        .json({
            message: "User created successfully",
            user: signUpUser
        });
});

const login = asyncHandler(async (req: CustomReq, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        throw new ApiError(400, "Please provide username and password", [])
    }

    const user: User | null = await UserModel.findOne({ username })
    if (!user) {
        throw new ApiError(404, "User not found", [])
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password)
    if (!isPasswordCorrect) {
        throw new ApiError(401, "Invalid credentials", [])

    }

    req.user = user

    const token = await generateAccessAndRefreshToken(String(user._id))

    const loggedInUser: User = await UserModel.findOne({ _id: user._id }).select("-password -refreshToken")

    return res.status(201)
        .cookie("token", token.accessToken, { httpOnly: true, secure: true })
        .json({
            message: "User created successfully",
            user: loggedInUser
        });
});

const logout = asyncHandler(async (req, res) => {
    res.clearCookie('token')
    res.status(200).json({message: "Logout successfully"})
})


const checkUniqueUsername = asyncHandler(async (req, res) => {
    const { username } = req.query;

    if (!username) {
        throw new ApiError(400, "Please provide username", [])
    }

    const isUsernameUnique = await UserModel.findOne({ username })
    if (isUsernameUnique) {
        return res.status(200).json({ isAvailable: false });
    }

    return res.status(200).json({ isAvailable: true });
});

export { signUp, login, logout, checkUniqueUsername };