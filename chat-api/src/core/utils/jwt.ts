import ENV from "@core/configs/env";
import jwt, { Jwt, VerifyCallback, VerifyOptions } from "jsonwebtoken";
import fs from "fs";

export interface ISignData {
  username: string;
}

const privateKey = fs.readFileSync("private.key", "utf8");
const publicKey = fs.readFileSync("public.key", "utf8");
const algorithm = "ES256";
const sign = (data: ISignData) => {
  return jwt.sign(data, privateKey, {
    algorithm,
    expiresIn: "7d",
  });
};

const decode = (token: string) => {
  return jwt.decode(token);
};

const verify = (token: string, callback?: VerifyCallback) => {
  if (!callback) {
    return jwt.verify(token, publicKey, { algorithms: [algorithm] });
  }
  return jwt.verify(token, publicKey, { algorithms: [algorithm] }, callback);
};

const JwtUtils = {
  sign,
  verify,
};

export default JwtUtils;
