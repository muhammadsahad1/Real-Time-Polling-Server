import mongoose, { Schema, Document } from 'mongoose';

// Interface for Message
interface IMessage extends Document {
    content: string;
    sender: {
        _id: mongoose.Types.ObjectId;
        username: string;
    };
    poll: mongoose.Types.ObjectId;
    createdAt: Date;
}


const messageSchema = new Schema<IMessage>(
    {
        content: {
            type: String,
            required: true,
        },
        sender: {
            _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
            username: { type: String, required: true },
        },
        poll: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Poll',
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        }
    }
);

const PollMessage = mongoose.model<IMessage>('PollMessage', messageSchema);

export default PollMessage;
