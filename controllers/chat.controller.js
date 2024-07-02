import mongoose from 'mongoose';
import Chat from '../models/chat.model.js';
import Message from '../models/message.model.js';

// Save a new chat message
export const saveChat = async (req, res) => {
    const { chatId, content, toId } = req.body;
    const senderId = req.user.userId

    if (!chatId || !content || !senderId || !toId) {
        return res.status(400).json({ error: "chatId, content, senderId, toId are required" })
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
        }

        const message = new Message({
            chat: chatId,
            sender: senderId,
            content
        });

        await message.save();
        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ error: error.message, exactError: error })
    }


};

// Get paginated chat messages for a specific chat
export const getChats = async (req, res) => {
    const { page = 1, limit = 10, chatId } = req.query;

    if (!chatId) {
        res.status(400).json({ error: "chatId is required" });
    }

    try {
        const messages = await Message.find({ chat: chatId })
            .sort({ timestamp: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message, exactError: error })
    }
};

// Get paginated list of people the user has chatted with, including the latest message
export const getChatPeople = async (req, res) => {
    const userId = req.user.userId;
    const { page = 1, limit = 10 } = req.query;

    try {
        const chats = await Chat.find({ participants: userId })
            .populate('participants', 'fullname profilePic')
            .exec();

        // Aggregate unique participants
        const uniqueParticipants = [];
        const latestMessagesPromises = [];

        console.log(chats.length, "Chats", userId)

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
