import mongoose, { Schema, Document } from 'mongoose';


interface PollOption {
    text: string;
    votedBy: mongoose.Types.ObjectId[];
    votes: number;
}

export interface PollDocument extends Document {
    title: string;
    options: PollOption[];
    creator: {
        _id: mongoose.Types.ObjectId;
        username: string;
    };
    endDate: Date;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    totalVotes: number;
}


const pollOptionSchema = new Schema<PollOption>({
    text: { type: String, required: true },
    votedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], 
    votes: { type: Number, default: 0 },
});

const pollSchema = new Schema<PollDocument>(
    {
        title: { type: String, required: true },
        options: [pollOptionSchema],
        creator: {
            _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Reference to User model
            username: { type: String, required: true },
        },
        endDate: { type: Date, required: true },
        isActive: { type: Boolean, default: true },
        totalVotes: { type: Number, default: 0 },
    },
    { timestamps: true }
);


const Poll = mongoose.model<PollDocument>('Poll', pollSchema);
export default Poll;
