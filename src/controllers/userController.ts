import { Request, Response } from "express";
import bcrypt from 'bcrypt';
import StatusCode from "../status/httpStatusCode";
import User from "../model/userModel";

const SALT_ROUNDS = 10;

// User Registration ==========================>
export const registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
      
        const { userEmail, password, userName } = req.body as { userEmail: string; password: string; userName: string };
        
        // Check if user already exists in the database
        const existingUser = await User.findOne({ email: userEmail });
        if (existingUser) {
            res.status(StatusCode.CONFLICT).json({ message: "User already exists." });
            return;
        }

        // Hash the password
        const hashedPass = await bcrypt.hash(password, SALT_ROUNDS);

        // Create a new user instance
        const newUser = await User.create({
            name : userName,
            email : userEmail,
            password: hashedPass,
        });

        // Save new user to the database
        await newUser.save();
        res.status(StatusCode.CREATED).json(newUser);
        return;
    } catch (error) {
        console.error("Registration error:", error);
        res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message: "An error occurred while registering the user." });
        return;
    }
}

// User Login ==========================> 
export const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userEmail, password } = req.body as { userEmail: string; password: string };
        console.log("Checking for user:", userEmail);

        // Find the user by email in the database
        const findUser = await User.findOne({ email: userEmail });
        console.log("user ->", findUser);
        if (!findUser) {
            res.status(StatusCode.NOT_FOUND).json({ message: "User not found." });
            return;
        }

        // Compare the password
        const comparedPass = await bcrypt.compare(password, findUser.password);
        if (!comparedPass) {
            res.status(StatusCode.BAD_REQUEST).json({ message: "Password incorrect." });
            return;
        }

        // Successful login
        res.status(StatusCode.OK).json({ message: "Login successful.", findUser });
        return;
    } catch (error) {
        console.error("Login error:", error);
        res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message: "An error occurred while logging in." });
        return;
    }
}
