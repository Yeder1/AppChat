import express, { Express } from "express";
import ENV from "@core/configs/env";
import bodyParser from "body-parser";
import initServerRoutes from "@routes";
import initMongoConnection from "@core/database";
import authenticationMiddleware from "@middlewares/authentication";
import errorHandler from "@middlewares/error-handler";
import { createServer } from "http";
import cors from 'cors'
import SocketService from "@modules/socket/socket.service";
const app: Express = express();
const server = createServer(app);

const startUp = async () => {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  
  app.use(cors({
    origin: ENV.ALLOWED_ORIGINS,
    methods: ENV.ALLOWED_METHODS,
    credentials: true
  }))
  initServerRoutes(app);
  app.use(authenticationMiddleware);
  app.use(errorHandler);

  await initMongoConnection();

  await SocketService.initSocket(server);
};

startUp()
  .then(() => {
    const port = ENV.PORT;
    server.listen(port, () => {
      console.log(`[server]: Server is running at http://localhost:${port}`);
    });
  })
  .catch((e) => {
    console.log(e);
  });
