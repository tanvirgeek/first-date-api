import mongoose from "mongoose";
import DateRequest from "../models/dateRequest.model.js";
import User from "../models/user.model.js";
import SessionUsers from "../models/usersSession.model.js";

// export const getPaginatedUsersFromCity = async (req, res) => {
//     try {
//         const { city, country, sessionId, gender, interestedIn } = req.query;

//         // Get excludedUserIds for current session
//         let sessionUsers = await SessionUsers.findOne({ sessionId });

//         if (!sessionUsers) {
//             // If sessionUsers not found, create a new one
//             // find already sent or recieved dates
//             const myDates = await DateRequest.find({
//                 $or: [
//                     { dateInitiator: req.user.userId },
//                     { date: req.user.userId }
//                 ]
//             })

//             const alreadySentIds = myDates.map(item => item._id);

//             console.log(alreadySentIds)

//             sessionUsers = new SessionUsers({ sessionId, excludedUserIds: [req.user.userId, ...alreadySentIds] });
//         }


//         // Query for random users not in excludedUserIds
//         const randomUsers = await User.aggregate([
//             {
//                 $match: {
//                     city,
//                     gender,
//                     interestedIn,
//                     _id: { $nin: sessionUsers.excludedUserIds }
//                 }
//             },
//             { $sample: { size: 3 } }
//         ]);

//         if (randomUsers.length === 0) {
//             const randomUsersCountry = await User.aggregate([
//                 {
//                     $match:
//                     {
//                         country,
//                         gender,
//                         interestedIn,
//                         _id: { $nin: sessionUsers.excludedUserIds }
//                     }
//                 },
//                 { $sample: { size: 3 } }
//             ]);

//             if (randomUsersCountry.length === 0) {
//                 const randomUsersWorld = await User.aggregate([
//                     {
//                         $match: {
//                             gender,
//                             interestedIn,
//                             _id: { $nin: sessionUsers.excludedUserIds }
//                         }
//                     },
//                     { $sample: { size: 3 } }
//                 ]);
//                 if (randomUsersWorld.length == 0) {
//                     return res.status(404).json({ message: "No users found matching the criteria." });
//                 } else {
//                     // Extract user IDs from randomUsers
//                     const randomUserIds = randomUsersWorld.map(user => user._id);

//                     // Update sessionUsers to include current user IDs in excludedUserIds
//                     sessionUsers.excludedUserIds = [...sessionUsers.excludedUserIds, ...randomUserIds];
//                     await sessionUsers.save();

//                     res.json(randomUsersWorld);
//                 }
//             } else {
//                 // Extract user IDs from randomUsers
//                 const randomUserIds = randomUsersCountry.map(user => user._id);

//                 // Update sessionUsers to include current user IDs in excludedUserIds
//                 sessionUsers.excludedUserIds = [...sessionUsers.excludedUserIds, ...randomUserIds];
//                 await sessionUsers.save();

//                 res.json(randomUsersCountry);
//             }
//         } else {
//             // Extract user IDs from randomUsers
//             const randomUserIds = randomUsers.map(user => user._id);

//             // Update sessionUsers to include current user IDs in excludedUserIds
//             sessionUsers.excludedUserIds = [...sessionUsers.excludedUserIds, ...randomUserIds];
//             await sessionUsers.save();

//             res.json(randomUsers);
//         }


//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: "Server Error" });
//     }
// }

export const getPaginatedUsersFromCity = async (req, res) => {
    try {
        const { city, country, sessionId, gender, interestedIn } = req.query;

        // Get excludedUserIds for current session
        let sessionUsers = await SessionUsers.findOne({ sessionId });

        if (!sessionUsers) {
            // If sessionUsers not found, create a new one
            // find already sent or received dates
            const myDates = await DateRequest.find({
                $or: [
                    { dateInitiator: req.user.userId },
                    { date: req.user.userId }
                ]
            });

            // Convert IDs to ObjectId if needed
            const alreadySentInitiatorIds = [...myDates.map(item => new mongoose.Types.ObjectId(item.dateInitiator._id))];
            const alreadySentDateIds = [...myDates.map(item => new mongoose.Types.ObjectId(item.date._id))]
            const alreadySentIds = [...new Set([...alreadySentInitiatorIds, ...alreadySentDateIds])]


            sessionUsers = new SessionUsers({ sessionId, excludedUserIds: [new mongoose.Types.ObjectId(req.user.userId), ...alreadySentIds] });
            await sessionUsers.save();
        }

        // Log the query before execution
        const matchQuery = {
            city,
            gender,
            interestedIn,
            _id: { $nin: sessionUsers.excludedUserIds }
        };

        // Query for random users not in excludedUserIds
        const randomUsers = await User.aggregate([
            { $match: matchQuery },
            { $sample: { size: 3 } }
        ]);

        if (randomUsers.length === 0) {
            const matchQueryCountry = {
                country,
                gender,
                interestedIn,
                _id: { $nin: sessionUsers.excludedUserIds }
            };

            const randomUsersCountry = await User.aggregate([
                { $match: matchQueryCountry },
                { $sample: { size: 3 } }
            ]);

            if (randomUsersCountry.length === 0) {
                const matchQueryWorld = {
                    gender,
                    interestedIn,
                    _id: { $nin: sessionUsers.excludedUserIds }
                };

                const randomUsersWorld = await User.aggregate([
                    { $match: matchQueryWorld },
                    { $sample: { size: 3 } }
                ]);


                if (randomUsersWorld.length == 0) {
                    return res.status(404).json({ message: "No users found matching the criteria." });
                } else {
                    // Extract user IDs from randomUsers
                    const randomUserIds = randomUsersWorld.map(user => user._id);

                    // Update sessionUsers to include current user IDs in excludedUserIds
                    sessionUsers.excludedUserIds = [...sessionUsers.excludedUserIds, ...randomUserIds];
                    await sessionUsers.save();

                    res.json(randomUsersWorld);
                }
            } else {
                // Extract user IDs from randomUsers
                const randomUserIds = randomUsersCountry.map(user => user._id);

                // Update sessionUsers to include current user IDs in excludedUserIds
                sessionUsers.excludedUserIds = [...sessionUsers.excludedUserIds, ...randomUserIds];
                await sessionUsers.save();

                res.json(randomUsersCountry);
            }
        } else {
            // Extract user IDs from randomUsers
            const randomUserIds = randomUsers.map(user => user._id);

            // Update sessionUsers to include current user IDs in excludedUserIds
            sessionUsers.excludedUserIds = [...sessionUsers.excludedUserIds, ...randomUserIds];
            await sessionUsers.save();

            res.json(randomUsers);
        }

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
};

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