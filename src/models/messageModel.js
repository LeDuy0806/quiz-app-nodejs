import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
    {
        name: { type: String },

        image: { type: String },

        message: { type: String }
    },

    {
        timestamps: true
    }
);

const Message = mongoose.model('Message', messageSchema);
export default Message;
