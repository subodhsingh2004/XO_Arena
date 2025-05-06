import mongoose from "mongoose";
import { app } from "./app.js";
import connectDB from "./db/index.js";
import { createServer } from "http";
import { setupSocketIO } from "./socket/socketio-setup.js";
import { registerSocketHandlers } from "./socket/socketHandler.js";

const PORT = process.env.PORT || 3000

connectDB()
    .then(() => {
        const server = createServer(app)
        const io = setupSocketIO(server)

        registerSocketHandlers(io)

        server.listen(PORT, () => {
            console.log(`server is running on port ${PORT}`)
        })
    })
    .catch((error: mongoose.Error | string) => {
        console.log("monogodb connection failed", error)
    })