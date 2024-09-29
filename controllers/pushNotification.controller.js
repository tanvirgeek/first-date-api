import admin from '../utils/firebaseAdmin.js';
import User from '../models/user.model.js';

// Send notification to multiple tokens one by one
export const sendNotification = async (req, res) => {
    try {
        const { userId, title, body } = req.body;

        // Find the user by userId
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Extract tokens from user
        const tokens = user.deviceTokens; // Ensure this is populated with valid tokens
        if (!tokens || tokens.length === 0) {
            return res.status(404).json({ message: 'No device tokens found for this user' });
        }

        // Filter valid tokens (if needed)
        const validTokens = tokens.filter(token => typeof token === 'string' && token.trim() !== '');
        if (validTokens.length === 0) {
            return res.status(404).json({ message: 'No valid device tokens found' });
        }

        const responses = []; // To store responses from each notification
        for (const token of validTokens) {
            const message = {
                token: token,
                notification: {
                    title: title || "Default Title",
                    body: body || "Default body text.",
                },
            };

            try {
                const response = await admin.messaging().send(message);
                console.log(`Successfully sent message to token ${token}:`, response);
                responses.push({ token, success: true, response });
            } catch (error) {
                console.error(`Error sending notification to token ${token}:`, error);
                responses.push({ token, success: false, error: error.message });
            }
        }

        res.status(200).json({ message: 'Notifications sent', responses });
    } catch (error) {
        console.error("NOTIFICATION SENT ERROR", error);
        res.status(500).json({ message: error.message });
    }
};



/*
// Send notification
// Send notification
// Send notification to a single token for debugging
export const sendNotification = async (req, res) => {
    try {
        const { userId, title, body } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Assuming we want to use the first token for testing
        const tokens = user.deviceTokens; // Ensure this is populated with valid tokens
        if (!tokens || tokens.length === 0) {
            return res.status(404).json({ message: 'No device tokens found for this user' });
        }

        const singleToken = "fKMoicb7yk02nK2UtgoDkG:APA91bEd7RjqmVD8dbWWvR3g8V5G4OuTBFiIppzp6o9EXQBxgVwFA89mohTi_Zo5FU8iX-pguMELYcY_tWXuUqjiK1V10QZQK5nSLmgcRN0OwteD-Ba60kv2p_J9h8NLy0PHVazNkj-c"; // Get the first token for testing

        const message = {
            token: singleToken,
            notification: {
                title: title || "Test Title",
                body: body || "This is a test notification.",
            },
        };

        const response = await admin.messaging().send(message);

        console.log("Successfully sent message:", response);
        res.status(200).json({ message: 'Notification sent successfully', response });
    } catch (error) {
        console.error("Error sending notification:", error);
        if (error.response) {
            console.error("Error response:", error.response);
        }
        res.status(500).json({ message: error.message });
    }
};



// Send notification

/*
export const sendNotification = async (req, res) => {
    const token = "fKMoicb7yk02nK2UtgoDkG:APA91bEd7RjqmVD8dbWWvR3g8V5G4OuTBFiIppzp6o9EXQBxgVwFA89mohTi_Zo5FU8iX-pguMELYcY_tWXuUqjiK1V10QZQK5nSLmgcRN0OwteD-Ba60kv2p_J9h8NLy0PHVazNkj-c"; // Replace with the actual device token

    const message = {
        token: token,
        notification: {
            title: "Test Title",
            body: "This is a test notification.",
        },
    };

    try {
        const response = await admin.messaging().send(message);
        console.log("Successfully sent message:", response);
        res.status(200).json({ message: 'Notification sent successfully', response });
    } catch (error) {
        console.error("Error sending notification:", error);
        if (error.response) {
            console.error("Error response:", error.response);
        }
        res.status(500).json({ message: error.message });
    }
};
*/