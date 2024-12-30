import express from "express";
import { getUsers } from "./user.controller";

const userRouter = express.Router();

userRouter.get('/', getUsers);

export default userRouter;
