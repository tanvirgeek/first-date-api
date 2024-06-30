import DateRequest from "../models/dateRequest.model.js";
import mongoose from "mongoose";

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
        res.status(201).json({ message: "Date request is created." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getMydates = async (req, res) => {
    try {

        const userId = new mongoose.Types.ObjectId(req.user.userId);
        const myDates = await DateRequest.find({
            $or: [
                { dateInitiator: userId },
                { date: userId }
            ]
        }).populate('dateInitiator date');

        res.status(200).json(myDates);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message });
    }
};

export const updateDateStatus = async (req, res) => {
    const { id, dateStatus } = req.body; // Get the new dateStatus from the request body

    if (!['Pending', 'Accepted', 'Rejected'].includes(dateStatus)) {
        return res.status(400).json({ error: 'Invalid dateStatus value' });
    }

    try {
        const dateRequest = await DateRequest.findByIdAndUpdate(
            id,
            { dateStatus },
            { new: true, runValidators: true }
        )//.populate('dateInitiator date'); // Populating the dateInitiator and date fields

        if (!dateRequest) {
            return res.status(404).json({ error: 'DateRequest not found' });
        }

        res.json({ message: "Date request update success" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
