import ENV from "@core/configs/env";
import mongoose from "mongoose";

const initMongoConnection = async () => {
  const CONNECTION_STRING = `mongodb://${ENV.DB_HOST}:${ENV.DB_PORT}/${ENV.DB_DATABASE}`;

  await mongoose.connect(CONNECTION_STRING, {
    auth: {
      username: ENV.DB_USERNAME,
      password: ENV.DB_PASSWORD,
    },
    authSource: "admin",
  });
};

export default initMongoConnection;
