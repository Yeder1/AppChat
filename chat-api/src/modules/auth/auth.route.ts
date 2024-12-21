import express from "express";
import { getInfo, login, register } from "./auth.controller";
import { validateData } from "@middlewares/validation";
import { loginSchema, registerSchema } from "./auth.interface";

const authRouter = express.Router();

authRouter.get("/info", getInfo);

authRouter.post("/login", validateData(loginSchema), login);

authRouter.post("/register", validateData(registerSchema), register);

export default authRouter;
