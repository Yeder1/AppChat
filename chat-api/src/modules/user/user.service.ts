import { UserSchema } from "@core/database/models";
import { HttpError, IResponse } from "@core/interfaces/http";
import PasswordUtils from "@core/utils/password";
import JwtUtils from "@core/utils/jwt";
import { StatusCodes } from "http-status-codes";
import { IGetUserRequest, IGetUserResponse } from "./user.interface";

const getUsers = async (req: IGetUserRequest): Promise<IGetUserResponse[]> => {
  try {
    const searchPattern = `.*${req.search}.*`;
    return await UserSchema.find({
      $or: [
        { displayName: { $regex: searchPattern } },
        { username: { $regex: searchPattern } },
      ],
    }, {
      _id: true,
      avatar: true,
      displayName: true,
      username: true
    });
  } catch (e) {
    throw new HttpError(e);
  }
}

const UserService = {
  getUsers
};

export default UserService;
