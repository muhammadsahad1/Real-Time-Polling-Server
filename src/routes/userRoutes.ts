import express, { Router } from 'express';
import { registerUser, loginUser } from "../controllers/userController";

const userRoute: Router = express.Router();

userRoute.post('/register', registerUser);
userRoute.post('/login', loginUser);

export default userRoute;