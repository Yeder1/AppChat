import { NextFunction, Request, Response } from "express";
import UserService from "./user.service";
import { StatusCodes } from "http-status-codes";

const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {s} = req.query;
    const users = await UserService.getUsers({
      search: s?.toString() ?? '',
      authUser: req.user!,
    });
    res.status(StatusCodes.OK).send(users);
  } catch (e) {
    next(e);
  }
};

export { getUsers };
