import mongoose from "mongoose";

const sessionUsersSchema = new mongoose.Schema({
    sessionId: String,
    excludedUserIds: [mongoose.Schema.Types.ObjectId] // Array of user IDs
});

const SessionUsers = mongoose.model('SessionUsers', sessionUsersSchema);

export default SessionUsers;