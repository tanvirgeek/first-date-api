// @ts-nocheck
import { Server } from "socket.io";
import http from "http"
import express from 'express';
import Message from '../models/message.model.js'

const app = express()

const server = http.createServer(app)

const userSocketMap = {}

export const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId]
}



const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"]
    }
})

io.sockets.on('connection', (socket) => {
    console.log("a user connected", socket.id)

    const userId = socket.handshake.auth.extraHeaders.userId;
    console.log(userId)
    if (userId != "undefined") userSocketMap[userId] = socket.id
    io.emit("getOnlineUsers", Object.keys(userSocketMap))

    socket.on("disconnect", () => {
        console.log("user disconnected", socket.id)
        delete userSocketMap[userId]
        io.emit("getOnlineUsers", Object.keys(userSocketMap))

    })

    socket.on('messageSeen', async (data) => {
        const { messageId, userId } = data;

        try {
            await Message.findByIdAndUpdate(messageId, { isSeen: true });

            const message = await Message.findById(messageId).populate('chat');
            const chat = message.chat;

            // Emit update to other participants in the chat
            chat.participants.forEach(participant => {
                if (participant.toString() !== userId) {
                    io.to(getReceiverSocketId(participant.toString())).emit('messageSeenUpdate', messageId);
                }
            });
        } catch (error) {
            console.error("Error updating message seen status:", error);
        }
    });

    socket.on('typing', (data) => {
        // Broadcast typing event to other users in the same chat room
        const { toUserId, chatId } = data
        const toSocketId = getReceiverSocketId(toUserId)
        io.to(toSocketId).emit('typing', { chatId });
    });

    // Handle stop typing event
    socket.on('stopTyping', (data) => {
        // Broadcast stop typing event to other users in the same chat room
        const { toUserId, chatId } = data
        const toSocketId = getReceiverSocketId(toUserId)
        io.to(toSocketId).emit('stopTyping', { chatId });
    });
})

export { app, io, server };