import { NextFunction, Request, Response } from "express";
import AuthService from "./auth.service";
import { StatusCodes } from "http-status-codes";

const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const message = await AuthService.register(req.body);
    res.status(StatusCodes.CREATED).send(message);
  } catch (e) {
    next(e);
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const message = await AuthService.login(req.body);
    res.status(StatusCodes.CREATED).send(message);
  } catch (e) {
    next(e);
  }
};

const getInfo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const message = await AuthService.getInfo(req.user!);
    res.status(StatusCodes.CREATED).send(message);
  } catch (e) {
    next(e);
  }
};

export { register, login, getInfo };
