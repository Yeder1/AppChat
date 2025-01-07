import "dotenv/config";

const {
  PORT = 8080,
  DB_HOST = "localhost",
  DB_PORT = "27017",
  DB_USERNAME = "username",
  DB_PASSWORD = "password",
  DB_DATABASE = "",
  JWT_PRIVATE_KEY = "",
  ALLOWED_ORIGINS = "http://localhost:3000",
  ALLOWED_METHODS = "GET,POST,PUT,DELETE",
} = process.env;

const _convertToArray = (str: string) => {
  return str.split(",").map((item) => item.trim());
}

const ENV = {
  PORT,
  DB_HOST,
  DB_PORT,
  DB_USERNAME,
  DB_PASSWORD,
  DB_DATABASE,
  JWT_PRIVATE_KEY,
  ALLOWED_ORIGINS: _convertToArray(ALLOWED_ORIGINS),
  ALLOWED_METHODS: _convertToArray(ALLOWED_METHODS),
};

export default ENV;
