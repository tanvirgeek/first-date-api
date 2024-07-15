import mongoose, { Mongoose } from "mongoose";

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    interestedIn: {
        type: String,
        required: true,
        enum: ["Male", "Female"]
    },
    attachmentStyle: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true,
        enum: ["Male", "Female"]
    },
    birthDate: {
        type: Date,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    bio: {
        type: String,
        required: true
    },
    partnersBio: {
        type: String,
        required: true
    },
    yearlyIncome: {
        type: Number,
        required: true
    },
    profilePic: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

const User = mongoose.model("User", userSchema)
export default User