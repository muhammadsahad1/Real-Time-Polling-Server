import { Request, Response } from "express";
import { users } from "../data/users";
import { IUser } from "../types";
import bcrypt from 'bcrypt';
import StatusCode from "../status/httpStatusCode";

const SALT_ROUNDS = 10;

// User Registration ==========================>
export const registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userEmail, password, userName } = req.body as { userEmail: string; password: string; userName: string };

        // Check if user already exists
        const existingUser = users.find(user => user.userEmail === userEmail);
        if (existingUser) {
            res.status(StatusCode.CONFLICT).json({ message: "User already exists." });
            return
        }

        // Hash the password
        const hashedPass = await bcrypt.hash(password, SALT_ROUNDS);
        const newUser: IUser = {
            id: users.length + 1,
            userEmail: userEmail,
            userName: userName,
            passwordHash: hashedPass,
        };

        // Save new user
        users.push(newUser);
        res.status(StatusCode.CREATED).json(newUser);
        return
    } catch (error) {
        console.error("Registration error:", error); // Log the error
        res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message: "An error occurred while registering the user." });
        return
    }
}

// User Login ==========================> 
export const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userEmail, password } = req.body as { userEmail: string; password: string };

        // Find the user by email
        const findUser = users.find(user => user.userEmail === userEmail);
        if (!findUser) {
            res.status(StatusCode.NOT_FOUND).json({ message: "User not found." });
            return
        }

        // Compare password
        const comparedPass = await bcrypt.compare(password, findUser.passwordHash);
        if (!comparedPass) {
            res.status(StatusCode.BAD_REQUEST).json({ message: "Password incorrect." });
            return
        }

        // Successful login
        res.status(StatusCode.OK).json({ message: "Login successful.", userId: findUser.id });
        return
    } catch (error) {
        console.error("Login error:", error);
        res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message: "An error occurred while logging in." });
        return
    }
}
