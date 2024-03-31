import mongoose from "mongoose";

const connectToMongoDB = async () => {
    try {
        if (process.env.MONGO_URL) {
            await mongoose.connect(process.env.MONGO_URL)
            console.log("Connected to mongodb")
        }
    } catch {
        console.log("Error Connecting to mongodb")
    }
}

export default connectToMongoDB