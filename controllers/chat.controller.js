import mongoose from 'mongoose';
import Chat from '../models/chat.model.js';
import Message from '../models/message.model.js';
import DateRequest from '../models/dateRequest.model.js';
import { getReceiverSocketId, io } from '../Socket/socket.js';
import { updateUnreadMessagesCount } from './badge.controller.js';

// Save a new chat message
export const saveChat = async (req, res) => {
    const { id, chatId, content, toId, dateRequestId } = req.body;
    const senderId = req.user.userId

    if (!id || !chatId || !content || !senderId || !toId) {
        return res.status(400).json({ error: "id chatId, content, senderId, toId are required" })
    }

    try {
        // find chatId fromChatSchem

        const chat = await Chat.findById(chatId)
        if (!chat) {
            const newChat = new Chat({
                _id: new mongoose.Types.ObjectId(chatId),
                participants: [new mongoose.Types.ObjectId(senderId), new mongoose.Types.ObjectId(toId)]
            })
            await newChat.save()
            const updatedDateRequest = await DateRequest.findByIdAndUpdate(
                dateRequestId,
                { $set: { chatId: newChat.id } },
                { new: true }  // This option returns the updated document
            );

            if (updatedDateRequest) {
                console.log('Update was successful:', updatedDateRequest);
                // Perform further actions if necessary
            } else {
                console.log('Update failed: No document found with the given id');
                // Handle the case where the document was not found
            }
        } else {
            // Update the updatedAt field to the current time
            await Chat.findByIdAndUpdate(chatId, { $set: { updatedAt: new Date() } });
        }

        const message = new Message({
            _id: new mongoose.Types.ObjectId(id),
            chat: chatId,
            sender: senderId,
            content
        });

        await message.save();

        // Emit the message to the specific user (toId)
        const socketId = getReceiverSocketId(toId)
        io.to(socketId).emit('newMessage', message);
        updateUnreadMessagesCount(toId)

        res.status(201).json(message);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message, exactError: error })
    }


};

// Get paginated chat messages for a specific chat
export const getChats = async (req, res) => {
    const { page = 1, limit = 10, chatId } = req.query;

    if (!chatId) {
        return res.status(400).json({ error: "chatId is required" });
    }

    try {
        const totalMessages = await Message.countDocuments({ chat: chatId });
        const totalPages = Math.ceil(totalMessages / limit);

        // Calculate the correct skip value for paginating from the most recent message
        const skip = (page - 1) * limit;

        const messages = await Message.find({ chat: chatId })
            .sort({ timestamp: -1 }) // Most recent messages first
            .skip(skip)
            .limit(parseInt(limit));

        // Reverse the order of messages to return the oldest first within the page
        res.json(messages.reverse());
    } catch (error) {
        res.status(500).json({ error: error.message, exactError: error });
    }
};

/*
// Get paginated chat messages for a specific chat
export const getChats = async (req, res) => {
    const { page = 1, limit = 10, chatId } = req.query;

    if (!chatId) {
        return res.status(400).json({ error: "chatId is required" });
    }

    try {
        const totalMessages = await Message.countDocuments({ chat: chatId });
        const totalPages = Math.ceil(totalMessages / limit);
        console.log(totalPages, " totalPages", totalMessages,"totalMessages")

        // Calculate the correct skip value for paginating from the most recent message
        const skip = (totalPages - page) * limit;
        console.log(skip, " skip")
        const messages = await Message.find({ chat: chatId })
            .sort({ timestamp: 1 }) // Most recent messages first
            .skip(skip)
            .limit(parseInt(limit));
        console.log(messages.length)
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message, exactError: error });
    }
};
*/
// Get paginated list of people the user has chatted with, including the latest message
export const getChatPeople = async (req, res) => {
    const userId = req.user.userId;
    const { page = 1, limit = 10 } = req.query;

    try {
        const chats = await Chat.find({ participants: userId })
            .populate('participants', 'fullname profilePic')
            .sort({ updatedAt: -1 })
            .exec();

        // Aggregate unique participants
        const uniqueParticipants = [];
        const latestMessagesPromises = [];

        //console.log(chats.length, "Chats", userId)

        chats.forEach(chat => {
            chat.participants.forEach(participant => {
                // @ts-ignore
                if (participant._id.toString() !== userId && !uniqueParticipants.some(p => p.participant._id.toString() === participant._id.toString())) {
                    uniqueParticipants.push({ participant, chatId: chat._id });
                }
            });
        });

        uniqueParticipants.forEach(({ participant, chatId }) => {
            latestMessagesPromises.push(
                Message.findOne({ chat: chatId, $or: [{ sender: userId }, { sender: participant._id }] })
                    .sort({ timestamp: -1 })
                    .limit(1)
                    .exec()
                    .then(message => ({ participant, latestMessage: message }))
            );
        });

        const peopleWithLatestMessages = await Promise.all(latestMessagesPromises);

        // Paginate the results
        const paginatedResults = peopleWithLatestMessages.slice((page - 1) * limit, page * limit);

        res.json(paginatedResults);
    } catch (error) {
        res.status(500).json({ error: error.message, exactError: error })
    }

};


export const markMessageAsSeen = async (req, res) => {
    try {
        const { messageId } = req.body; // Get messageId from request parameters

        if (!messageId) {
            return res.status(400).json({ error: "messageId is required" });
        }

        // Find the message by ID and update its isSeen status to true
        const updatedMessage = await Message.findByIdAndUpdate(
            messageId,
            { $set: { isSeen: true } },
            { new: true } // Return the updated document
        );

        if (!updatedMessage) {
            console.log("Update Failed")
            return res.status(404).json({ error: "Message not found" });
        }
        console.log("Update Succes")
        res.status(200).json({ message: "Message marked as seen" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};
