import { Request, Response } from "express";
import StatusCode from "../status/httpStatusCode";
import Poll from "../model/pollModel";
import { CreatePollRequest } from "../types";
import mongoose from "mongoose";
import { Server } from "socket.io";

export const createPoll = async (req: Request<{}, {}, CreatePollRequest>, res: Response): Promise<void> => {
    try {
        const { title, options, creator, userName, endDate, isActive } = req.body;
        console.log("body =>", req.body);

        // Validate creator ID
        const creatorId = new mongoose.Types.ObjectId(creator);

        // Create a new poll
        const newPoll = await Poll.create({
            title,
            options,
            creator: {
                _id: creatorId,
                username: userName,
            },
            endDate,
            isActive,
        });


        res.status(StatusCode.CREATED).json({
            message: "Poll created successfully",
            data: newPoll,
        });
    } catch (error) {
        console.error("Error creating poll:", error);

        res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
            message: "Internal Server Error",
            error: error instanceof Error ? error.message : "An error occurred",
        });
    }
};



export const getPolls = async (req: Request, res: Response): Promise<void> => {
    try {
        const polls = await Poll.find({ isActive: true }).sort({ createdAt: -1 });
        res.status(StatusCode.OK).json({
            message: "Polls fetched successfully",
            data: polls
        });
    } catch (error) {
        console.error("Error fetching polls:", error);
        res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
            message: "Internal Server Error",
            error: error instanceof Error ? error.message : "An error occurred",
        });
    }
};


export const voting = async (req: Request, res: Response, io: Server): Promise<void> => {
    try {
        const { pollId, userId } = req.params;
        const { optionIndex } = req.body;
        const userID = new mongoose.Types.ObjectId(userId);

        // Check if poll exists
        const poll = await Poll.findById(pollId);
        if (!poll) {
            res.status(StatusCode.NOT_FOUND).json({ message: "Poll not found" });
            return;
        }

        // Check if user has voted before
        const prevVoteOption = poll.options.findIndex(option => option.votedBy.includes(userID));

        // If the user has voted before, update the previous vote
        if (prevVoteOption !== -1) {
            poll.options[prevVoteOption].votes -= 1;
            poll.options[prevVoteOption].votedBy = poll.options[prevVoteOption].votedBy.filter(id => !id.equals(userID));
        }

        poll.options[optionIndex].votes += 1;
        poll.options[optionIndex].votedBy.push(userID);


        poll.totalVotes = poll.options.reduce((acc, option) => acc + option.votes, 0);
    
        await poll.save();

        res.status(StatusCode.OK).json({
            message: "Vote counted successfully",
            data: poll,
        });
        
    } catch (error) {
        res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
            message: "Internal Server Error",
            error: error instanceof Error ? error.message : "An error occurred",
        });
    }
};
