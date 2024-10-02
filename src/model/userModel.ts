import mongoose, { Schema, Document, Model } from "mongoose";

// Define an interface for the User document
export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
}

// Create the user schema
const userSchema: Schema<IUser> = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,

    },
    password: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

// Create the User model
const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

// Export the User model
export default User;
