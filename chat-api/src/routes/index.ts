import authenticationMiddleware from "@middlewares/authentication";
import authRouter from "@modules/auth/auth.route";
import { Express } from "express";

const initServerRoutes = async (server: Express) => {
  server.use("/auth", authenticationMiddleware, authRouter);
};

export default initServerRoutes;