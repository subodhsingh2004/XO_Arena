import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser())

// Import routes
import userRouter from "./routes/user.route.js";

app.use("/api/user", userRouter);

app.use((err: any, req: Request, res: Response, next: any) => {
    // .error(err.stack); 
    res.status(err.statusCode || 500).json({ error: err.message })
});



export { app }