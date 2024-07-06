import mongoose from 'mongoose';
const { Schema } = mongoose;

const MessageSchema = new Schema({
    chat: { type: Schema.Types.ObjectId, ref: 'Chat' },
    sender: { type: Schema.Types.ObjectId, ref: 'User' },
    content: String,
    isSeen: { type: Boolean, default: false },
    timestamp: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', MessageSchema);
export default Message;