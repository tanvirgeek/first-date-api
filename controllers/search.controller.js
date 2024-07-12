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

// Helper function to build the query object
const buildQuery = (body) => {
    const query = {};

    if (body.fullname) {
        query.fullname = { $regex: body.fullname, $options: 'i' }; // Case-insensitive
    }
    if (body.attachmentStyle) {
        query.attachmentStyle = body.attachmentStyle;
    }
    if (body.country) {
        query.country = { $regex: body.country, $options: 'i' };
    }
    if (body.city) {
        query.city = { $regex: body.city, $options: 'i' };
    }
    if (body.bio) {
        query.bio = { $regex: body.bio, $options: 'i' };
    }
    if (body.partnersBio) {
        query.partnersBio = { $regex: body.partnersBio, $options: 'i' };
    }
    if (body.minAge && body.maxAge) {
        const minBirthDate = new Date();
        minBirthDate.setFullYear(minBirthDate.getFullYear() - body.maxAge);

        const maxBirthDate = new Date();
        maxBirthDate.setFullYear(maxBirthDate.getFullYear() - body.minAge);

        query.birthDate = { $gte: minBirthDate, $lte: maxBirthDate };
    }
    if (body.yearlyIncomeMin) {
        query.yearlyIncome = { $gte: body.yearlyIncomeMin };
    }

    return query;
};


export const searchUsers = async (req, res) => {
    try {
        const query = buildQuery(req.body);

        // Check if at least one field is provided
        if (Object.keys(query).length === 0) {
            return res.status(400).json({ message: 'At least one search parameter is required' });
        }

        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;

        const totalProfiles = await User.countDocuments(query);
        const userProfiles = await User.find(query).limit(limit).skip(skip);

        res.json({
            userProfiles,
            currentPage: page,
            totalPages: Math.ceil(totalProfiles / limit),
            totalProfiles
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


