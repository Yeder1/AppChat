import { UserSchema } from "@core/database/models";
import { HttpError } from "@core/interfaces/http";
import JwtUtils, { ISignData } from "@core/utils/jwt";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

const ignoredEndpoints = [
  { method: "GET", path: "/public" },
  { method: "POST", path: "/login" },
  { method: "POST", path: "/register" },
];

function authenticationMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {

  const shouldIgnore = ignoredEndpoints.some(
    (endpoint) => endpoint.method === req.method && endpoint.path === req.path
  );

  if (shouldIgnore) {
    next();
    return;
  }

  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(StatusCodes.UNAUTHORIZED).json({ error: "No token provided" });
    return;
  }

  JwtUtils.verify(token, async (err, user) => {
    if (err) {
      return res.status(StatusCodes.FORBIDDEN).json({ error: "Invalid token" });
    }

    const foundUser = await UserSchema.findOne({
      username: (user as ISignData).username,
    }, {
        username: true,
    });

    if (!foundUser) {
      throw new HttpError("user not found", 401);
    }

    req.user = {
      id: foundUser.id,
      username: foundUser.username,
    };
    next();
  });
}

export default authenticationMiddleware;
