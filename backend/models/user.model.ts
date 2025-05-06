import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";

export interface User extends Document {
    username: string;
    password: string;
    socketId?: string;
    totalPoints: number;
    gamesPlayed: number;
    gamesWon: number;
    createdAt: Date;
    updatedAt: Date;
    status: string;
    refreshToken: string | undefined;
    generateAccessToken: () => Promise<string>;
    generateRefreshToken: () => Promise<string>;
    isPasswordCorrect: (password: string) => Promise<boolean>;
}

const userSchema: Schema<User> = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            minlength: [3, "Username must be atleast 3 character long"],
            validate: {
                validator: (value: string) => {
                    return /^[a-zA-Z0-9_]+$/.test(value);
                },
                message: 'Username can only contain letters, numbers and underscores',
            }
        },
        password: {
            type: String,
            required: [true, "Password is required"],
        },
        socketId: {
            type: String,
            default: null,
        },
        totalPoints: {
            type: Number,
            default: 0
        },
        gamesPlayed: {
            type: Number,
            default: 0,
        },
        gamesWon: {
            type: Number,
            default: 0,
        },
        refreshToken: {
            type: String,
            default: null
        }
    },
    { timestamps: true }
)


userSchema.pre("save", async function () {
    if (this.isModified()) this.updatedAt = new Date(Date.now());
});

// Hash password before saving to database
userSchema.pre("save", async function () {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
});

// Check if password is correct
userSchema.methods.isPasswordCorrect = async function (password: string) {
    return await bcrypt.compare(password, this.password);
}

// Generate JWT access token
userSchema.methods.generateAccessToken = async function (this: User): Promise<string> {

    const secret = process.env.ACCESS_TOKEN_SECRET;

    if (!secret) {
        throw new Error("ACCESS_TOKEN_SECRET is not defined");
    }

    const signOptions: SignOptions = {
        expiresIn: Number(process.env.ACCESS_TOKEN_EXPIRY) || 86400
    };

    return jwt.sign(
        {
            _id: this._id,
            username: this.username,
        },
        secret,
        signOptions
    )
}

// Generate JWT refresh token
userSchema.methods.generateRefreshToken = async function (this: User): Promise<string> {
    const secret = process.env.REFRESH_TOKEN_SECRET;

    if (!secret) {
        throw new Error("REFRESH_TOKEN_SECRET is not defined");
    }

    const signOptions: SignOptions = {
        expiresIn: Number(process.env.REFRESH_TOKEN_EXPIRY) || 604800
    };

    return jwt.sign(
        {
            _id: this._id,
            username: this.username,
        },
        secret,
        signOptions
    )
}


export const UserModel = mongoose.model<User>("User", userSchema);
