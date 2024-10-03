import { Request, Response } from 'express';
import StatusCode from '../status/httpStatusCode';
import PollMessage from '../model/message.model';
import mongoose from 'mongoose';
import { Server } from 'socket.io';

export const getMessages = async (req: Request, res: Response): Promise<void> => {
    try {
        const { pollId } = req.params;
        console.log("Id =>", pollId)

        if (!mongoose.Types.ObjectId.isValid(pollId)) {
            res.status(StatusCode.BAD_REQUEST).json({ message: 'Invalid poll ID' });
            return
        }


        const messages = await PollMessage.find({ poll: pollId }).sort({ createdAt: 1 });

        if (!messages || messages.length === 0) {
            console.log("no mes");

            res.status(StatusCode.NO_CONTENT).json({ message: 'No messages found for this poll' });
            return
        }

        res.status(StatusCode.OK).json({ messages });
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Server error' });
    }
};

export const sendMessage = async (req: Request, res: Response): Promise<void> => {
    try {
        const { pollId, userId } = req.params
        const { content, username } = req.body

        console.log("body =>", req.body, "para =>", req.params);


        if (!mongoose.Types.ObjectId.isValid(pollId)) {
            res.status(StatusCode.BAD_REQUEST).json({ message: 'Invalid poll ID' });
            return
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            res.status(StatusCode.BAD_REQUEST).json({ message: 'Invalid poll ID' });
            return
        }
        const newMessage = new PollMessage({
            content,
            sender: {
                _id: new mongoose.Types.ObjectId(userId),
                username: username,
            },
            poll: new mongoose.Types.ObjectId(pollId),
        });

        const savedMessage = await newMessage.save()
        console.log("msss =>", savedMessage);

        res.status(StatusCode.CREATED).json({
            message: 'Message created successfully',
            data: savedMessage,
        });
    } catch (error: any) {
        console.error('Error sending message:', error);
        res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
            message: 'Internal Server Error',
            error: error instanceof Error ? error.message : 'An error occurred',
        });
    }
}
