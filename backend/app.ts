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
import path from "path";

app.use("/api/user", userRouter);

app.use((err: any, req: Request, res: Response, next: any) => {
    // .error(err.stack); 
    res.status(err.statusCode || 500).json({ error: err.message })
});

// -----------------------------deployment------------------------------------

const __dirname1 = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/frontend/dist")))

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname1, "frontend", "dist", "index.html"))
  })
} else {
  app.get('/', (req, res) => {
    res.send("API is running :)")
  })
}

// -----------------------------deployment------------------------------------

export { app }