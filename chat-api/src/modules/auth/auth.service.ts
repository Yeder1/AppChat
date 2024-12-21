import UserSchema from "@core/database/models/UserSchema";
import {
  IGetInfoRequest,
  ILoginRequest,
  ILoginResponse,
  IRegisterRequest,
} from "./auth.interface";
import { HttpError, IResponse } from "@core/interfaces/http";
import PasswordUtils from "@core/utils/password";
import JwtUtils from "@core/utils/jwt";
import { StatusCodes } from "http-status-codes";

const register = async (req: IRegisterRequest): Promise<IResponse<string>> => {
  const existingUser = await UserSchema.findOne({
    username: req.username,
  });

  if (existingUser && existingUser.id) {
    throw new HttpError("username already exists", StatusCodes.BAD_REQUEST);
  }

  const session = await UserSchema.startSession();
  session.startTransaction();
  try {
    const hashedPassword = await PasswordUtils.hashPassword(req.password);
    await UserSchema.create({
      username: req.username,
      password: hashedPassword,
    });

    return {
      message: "Create user successfully!",
    };
  } catch (e) {
    session.abortTransaction();

    throw new HttpError(e);
  } finally {
    session.endSession();
  }
};

const login = async (req: ILoginRequest): Promise<ILoginResponse> => {
  try {
    const foundUser = await UserSchema.findOne({
      username: req.username,
    });

    if (!foundUser) {
      throw new HttpError("username not exists", StatusCodes.BAD_REQUEST);
    }

    const passwordIsMatch = PasswordUtils.validatePassword(
      req.password,
      foundUser.password
    );

    if (!passwordIsMatch) {
      throw new HttpError("password not match", StatusCodes.BAD_REQUEST);
    }

    return {
      jwtToken: JwtUtils.sign({
        username: foundUser.username,
      }),
    };
  } catch (e) {
    throw new HttpError(e);
  }
};

const getInfo = async (req: IGetInfoRequest) => {
  return await UserSchema.findOne(
    {
      username: req.username,
    },
    {
      _id: false,
      avatar: true,
      displayName: true,
      username: true,
    }
  );
};

const AuthService = {
  register,
  login,
  getInfo
};

export default AuthService;
