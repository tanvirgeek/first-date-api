import express from "express";
import dotenv from "dotenv";
import authRoutes from './routes/auth.routes.js'
import connectToMongoDB from "./db/connectToMongodb.js";

const app = express();
dotenv.config()

const PORT = process.env.PORT || 3000

app.use(express.json())

app.use("/api/auth", authRoutes)

app.listen(PORT, () => {
    connectToMongoDB()
    console.log(`server running on port ${PORT}`)
})