import mongoose, { Connection } from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}`)
        console.log("Database Connected")
    } catch (error: mongoose.Error | any) {
        console.log("Error in connecting to Database", error.message)
        process.exit(1)
    }
}

export default connectDB