import User from "../models/user.model.js";
import SessionUsers from "../models/usersSession.model.js";

export const getPaginatedUsersFromCity = async (req, res) => {
    try {
        const { city, sessionId } = req.query;

        // Get excludedUserIds for current session
        let sessionUsers = await SessionUsers.findOne({ sessionId });
        if (!sessionUsers) {
            // If sessionUsers not found, create a new one
            sessionUsers = new SessionUsers({ sessionId, excludedUserIds: [] });
        }

        // Query for random users not in excludedUserIds
        const randomUsers = await User.aggregate([
            { $match: { city, _id: { $nin: sessionUsers.excludedUserIds } } },
            { $sample: { size: 6 } }
        ]);

        if (randomUsers.length === 0) {
            return res.status(404).json({ message: "No users found matching the criteria." });
        }

        // Extract user IDs from randomUsers
        const randomUserIds = randomUsers.map(user => user._id);

        // Update sessionUsers to include current user IDs in excludedUserIds
        sessionUsers.excludedUserIds = [...sessionUsers.excludedUserIds, ...randomUserIds];
        await sessionUsers.save();

        res.json(randomUsers);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
}

export const deleteSessionUsers = async (req, res) => {
    try {
        const { sessionId } = req.query;

        // Delete SessionUsers document based on session ID
        await SessionUsers.findOneAndDelete({ sessionId });

        res.json({ message: "SessionUsers deleted successfully." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
}