import DateRequest from "../models/dateRequest.model.js";
import mongoose from "mongoose";

export const postDateRequest = async (req, res) => {
    try {
        const { dateSpot, dateInitiator, date } = req.body;

        // Validate the input data here if needed
        if (!dateSpot || !dateInitiator || !date) {
            return res.status(400).json({ error: "Bad Request!" })
        }

        const dateRequest = new DateRequest({
            dateSpot,
            dateInitiator,
            date
        });

        await dateRequest.save();
        res.status(201).json({ dateRequest });
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
        res.status(500).json({ message: error.message });
    }
};
