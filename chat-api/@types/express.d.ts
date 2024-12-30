import * as express from "express";

declare global {
  export interface IAuthUser {
    id: string;
    username: string;
  }
  namespace Express {
    interface Request {
      user?: IAuthUser;
    }
  }
}
