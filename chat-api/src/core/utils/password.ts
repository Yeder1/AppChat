import * as bcrypt from "bcrypt";

const ROUND = 10;
const salt = bcrypt.genSaltSync(ROUND);

const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, salt);
};

const validatePassword = async (password: string, hashedPassword: string) => {
  return await bcrypt.compare(password, hashedPassword);
}

const PasswordUtils = {
  hashPassword,
  validatePassword
};

export default PasswordUtils;
