import mongoose from 'mongoose';
const { Schema } = mongoose;

const ChatSchema = new Schema({
    participants: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

const Chat = mongoose.model('Chat', ChatSchema);
export default Chat;
