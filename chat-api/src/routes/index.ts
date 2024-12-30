import authenticationMiddleware from "@middlewares/authentication";
import authRouter from "@modules/auth/auth.route";
import conversationRouter from "@modules/conversation/conversation.route";
import userRouter from "@modules/user/user.route";
import { Express } from "express";

const initServerRoutes = async (server: Express) => {
  server.use("/auth", authenticationMiddleware, authRouter);
  server.use("/conversation", authenticationMiddleware, conversationRouter);
  server.use("/user", authenticationMiddleware, userRouter);
};

export default initServerRoutes;