import { getReceiverSocketId, io } from "../Socket/socket.js";
import DateRequest from "../models/dateRequest.model.js";
import mongoose from "mongoose";
import Message from "../models/message.model.js";
import { updateUnseenDateRequestsCount } from "./badge.controller.js";

export const postDateRequest = async (req, res) => {
    try {
        const { dateSpot, dateInitiator, date, dateStatus, dateNote } = req.body;

        // Validate the input data here if needed
        if (!dateSpot || !dateInitiator || !date) {
            return res.status(400).json({ error: "Bad Request!" })
        }

        const dateRequest = new DateRequest({
            dateSpot,
            dateInitiator,
            date,
            dateStatus,
            dateNote
        });

        await dateRequest.save();

        const createdDateRequest = await DateRequest.findById(dateRequest.id).populate('dateInitiator date')
        // Socket Notify
        const socketId = getReceiverSocketId(date)
        if (socketId) {
            io.to(socketId).emit('newDateRequest', createdDateRequest);
        } else {
            updateUnseenDateRequestsCount(date)
        }
        res.status(201).json({ message: "Date request is created." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


export const getMydates = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user.userId);
        const page = parseInt(req.query.page) || 1; // Get the page number from query parameters, default to 1 if not provided
        const limit = 10; // Number of items per page
        const skip = (page - 1) * limit; // Calculate the number of items to skip

        const myDates = await DateRequest.find({
            $or: [
                { dateInitiator: userId },
                { date: userId }
            ]
        })
            .populate('dateInitiator date')
            .sort({ updatedAt: -1 })
            .limit(limit)
            .skip(skip);

        const totalDates = await DateRequest.countDocuments({
            $or: [
                { dateInitiator: userId },
                { date: userId }
            ]
        });

        res.status(200).json({
            myDates,
            currentPage: page,
            totalPages: Math.ceil(totalDates / limit),
            totalDates
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};


export const updateDateStatus = async (req, res) => {
    const { id, dateStatus } = req.body; // Get the new dateStatus from the request body

    if (!['Pending', 'Accepted', 'Rejected', 'Canceled'].includes(dateStatus)) {
        return res.status(400).json({ error: 'Invalid dateStatus value' });
    }

    try {
        const dateRequest = await DateRequest.findByIdAndUpdate(
            id,
            { dateStatus },
            { new: true, runValidators: true }
        ).populate('dateInitiator date dateSpot'); // Populating the dateInitiator and date fields

        if (!dateRequest) {
            return res.status(404).json({ error: 'DateRequest not found' });
        }

        const toId = dateRequest.dateInitiator._id.toString() == req.user.userId ? dateRequest.date._id.toString() : dateRequest.dateInitiator._id.toString()

        // Notify the other user
        const socketId = getReceiverSocketId(toId)
        if (socketId) {
            io.to(socketId).emit('dateRequestStatusUpdate', dateRequest);
        } else {
            if (dateRequest.dateStatus == "Accepted") {
                updateUnseenDateRequestsCount(toId)
            }
        }
        res.json({ message: "Date request update success" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/*
export const getMyMatches = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user.userId);
        const { page = 1, limit = 10 } = req.query; // Default to page 1, limit 10

        const myMatches = await DateRequest.find({
            $or: [
                { dateInitiator: userId },
                { date: userId }
            ],
            dateStatus: "Accepted"
        })
            .populate('dateInitiator date')
            .sort({ updatedAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));
        res.status(200).json(myMatches);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};
*/

export const getMyMatches = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user.userId);
        const { page = 1, limit = 10 } = req.query; // Default to page 1, limit 10

        // Find the accepted date requests
        const myMatches = await DateRequest.find({
            $or: [
                { dateInitiator: userId },
                { date: userId }
            ],
            dateStatus: "Accepted"
        })
            .populate('dateInitiator date')
            .sort({ updatedAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        // Fetch the most recent message for each date request
        const myMatchesWithMessages = await Promise.all(myMatches.map(async (dateRequest) => {
            const recentMessage = await Message.findOne({
                chat: dateRequest.chatId
            }).sort({ timestamp: -1 }).exec();

            let isSeen = false;

            // @ts-ignore
            if (recentMessage && recentMessage.sender.toString() !== userId.toString()) {
                // If the message sender is not the current user, check if it is seen
                isSeen = recentMessage.isSeen;
            }

            return {
                ...dateRequest.toObject(),
                recentMessage: recentMessage ? {
                    ...recentMessage.toObject(),
                    // @ts-ignore
                    isSeen: recentMessage.sender.toString() === userId.toString() ? true : isSeen
                } : null
            };
        }));

        res.status(200).json(myMatchesWithMessages);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};


export const updateIsSeen = async (req, res) => {
    const { id } = req.query; // Assuming the ID of the date request is passed as a URL parameter

    try {
        const dateRequest = await DateRequest.findByIdAndUpdate(id, { isSeen: true }, { new: true });
        if (!dateRequest) {
            return res.status(404).json({ error: "Date request not found" });
        }
        res.status(200).json(dateRequest);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Controller to fetch DateRequest by dateInitiator and date IDs
export const getDateRequestByIds = async (req, res) => {
    const { id1, id2 } = req.query;

    if (!id1 || !id2) {
        return res.status(400).json({ message: "Both IDs are required" });
    }

    try {
        const dateRequest = await DateRequest.findOne({
            $or: [
                { dateInitiator: id1, date: id2 },
                { dateInitiator: id2, date: id1 }
            ]
        })
            .populate('dateInitiator date'); // Populate dateInitiator and date fields

        if (!dateRequest) {
            return res.status(404).json({ message: "DateRequest not found" });
        }

        res.status(200).json(dateRequest);
    } catch (error) {
        console.error("Error fetching DateRequest:", error);
        res.status(500).json({ message: "Server error" });
    }
};

