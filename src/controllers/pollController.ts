import { Request, Response } from "express";
import StatusCode from "../status/httpStatusCode";
import Poll from "../model/pollModel";
import { CreatePollRequest } from "../types";
import mongoose from "mongoose";

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
                _id: creatorId, // Set the creator's ID
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