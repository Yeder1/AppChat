import express, { Express } from "express";
import ENV from "@core/configs/env";
import bodyParser from "body-parser";
import initServerRoutes from "@routes";
import initMongoConnection from "@core/database";
import authenticationMiddleware from "@middlewares/authentication";
import errorHandler from "@middlewares/error-handler";

const server: Express = express();
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false }));
const initServerAsyncTask = async () => {
  initServerRoutes(server);
  server.use(authenticationMiddleware);
  server.use(errorHandler);
  
  await initMongoConnection();
};

initServerAsyncTask()
  .then(() => {
    const port = ENV.PORT;
    server.listen(port, () => {
      console.log(`[server]: Server is running at http://localhost:${port}`);
    });
  })
  .catch((e) => {
    console.log(e);
  });
