import mongoose from 'mongoose';
const { Schema } = mongoose;

const badgeCountSchema = new mongoose.Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    unreadMessagesCount: { type: Number, default: 0 },
    unseenDateRequestsCount: { type: Number, default: 0 }
}, { timestamps: true });

const BadgeCount = mongoose.model('BadgeCount', badgeCountSchema);
export default BadgeCount
