import mongoose from "mongoose";
import User from "../models/user.model.js";

export const getSearchResult = async (req, res) => {
    try {
        const userId = req.user.userId; // Assuming req.user contains the authenticated user's information
        const { fieldName, value, page = 1, gender, interestedIn } = req.query;

        if (!fieldName || !value) {
            return res.status(400).json({ error: "fieldName and value are required query parameters" });
        }

        const searchQuery = {
            _id: { $ne: new mongoose.Types.ObjectId(userId) },
            gender: { $eq: gender }, // Match gender
            interestedIn: { $eq: interestedIn }, // Match interestedIn// Exclude the requesting user's ID
            [fieldName]: { $regex: value, $options: 'i' } // Case-insensitive search
        };

        const limit = 10;
        const skip = (page - 1) * limit;

        const userProfiles = await User.find(searchQuery)
            .skip(skip)
            .limit(limit);

        const totalProfiles = await User.countDocuments(searchQuery);

        res.status(200).json({
            userProfiles,
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalProfiles / limit),
            totalProfiles
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};