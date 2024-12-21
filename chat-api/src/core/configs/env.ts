import "dotenv/config";

const {
  PORT = 8080,
  DB_HOST = "localhost",
  DB_PORT = "27017",
  DB_USERNAME = "username",
  DB_PASSWORD = "password",
  DB_DATABASE = "",
  JWT_PRIVATE_KEY = ""
} = process.env;

const ENV = {
  PORT,
  DB_HOST,
  DB_PORT,
  DB_USERNAME,
  DB_PASSWORD,
  DB_DATABASE,
  JWT_PRIVATE_KEY
};

export default ENV;
