import express from "express";
import { app, server } from "./Socket/socket.js"
import dotenv from "dotenv";
import authRoutes from './routes/auth.routes.js'
import usersRoutes from './routes/users.routes.js'
import userRoutes from './routes/user.routes.js'
import chatRoutes from './routes/chat.routes.js'
import dateRequestRoutes from './routes/dateRequest.routes.js'
import badgeRoutes from './routes/badge.routes.js'
import connectToMongoDB from "./db/connectToMongodb.js";
import { verifyToken } from "./utils/verifyToken.js";


dotenv.config()

const PORT = process.env.PORT || 3000

app.use(express.json())
app.use('/uploads', express.static('uploads'));
app.use("/api/auth", authRoutes)
app.use("/api/random-users", verifyToken, usersRoutes)
app.use("/api/user", verifyToken, userRoutes)
app.use("/api/date-requests", verifyToken, dateRequestRoutes)
app.use("/api/chat", verifyToken, chatRoutes)
app.use("/api/badge", verifyToken, badgeRoutes)

server.listen(PORT, () => {
    connectToMongoDB()
    console.log(`server running on port ${PORT}`)
})