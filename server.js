import express from "express";
import dotenv from "dotenv";
import authRoutes from './routes/auth.routes.js'
import datesRoutes from './routes/date.routes.js'
import connectToMongoDB from "./db/connectToMongodb.js";
import { verifyToken } from "./utils/verifyToken.js";

const app = express();
dotenv.config()

const PORT = process.env.PORT || 3000

app.use(express.json())

app.use("/api/auth", authRoutes)

app.use("/api/dates", verifyToken, datesRoutes)

app.listen(PORT, () => {
    connectToMongoDB()
    console.log(`server running on port ${PORT}`)
})