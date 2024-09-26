import BadgeCount from '../models/badge.model.js';

// Function to update unread messages count
export const updateUnreadMessagesCount = async (userId) => {
    await BadgeCount.findOneAndUpdate(
        { user: userId },
        { $inc: { unreadMessagesCount: 1 } },
        { upsert: true }
    );
};

export const decreaseOneMessageBadgeCount = async (userId) => {
    
};

// Function to update unseen date requests count
export const decreaseMessageBadgeOne = async (userId) => {
    await BadgeCount.findOneAndUpdate(
        { user: userId },
        { $inc: { unseenDateRequestsCount: 1 } },
        { upsert: true }
    );
};

// Reset unread messages count
export const resetDateMessageBadgeCount = async (req, res) => {
    try {
        const userId = req.user.userId;
        await BadgeCount.findOneAndUpdate(
            { user: userId },
            { unreadMessagesCount: 0 }
        );

        res.status(200).json({ message: 'Unread messages count reset' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Reset unseen date requests count
export const resetDateRequestsBadgeCount = async (req, res) => {
    try {
        const userId = req.user.userId;
        await BadgeCount.findOneAndUpdate(
            { user: userId },
            { unseenDateRequestsCount: 0 }
        );

        res.status(200).json({ message: 'Unseen date requests count reset' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getBadgeCount = async (req, res) => {
    try {
        const userId = req.user.userId;
        const badgeCounts = await BadgeCount.findOne({ user: userId });

        if (!badgeCounts) {
            return res.status(200).json({
                unreadMessagesCount: 0,
                unseenDateRequestsCount: 0
            });
        }

        res.status(200).json(badgeCounts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateUnseenDateRequestsCount = async (userId) => {
    try {
        const badgeCounts = await BadgeCount.findOne({ user: userId });

        await BadgeCount.findOneAndUpdate(
            { user: userId },
            { $inc: { unseenDateRequestsCount: 1 } },
            { upsert: true }
        );

        //res.status(200).json(badgeCounts);
    } catch (error) {
        //res.status(500).json({ message: error.message });
    }
};
