import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { ApiClients, ApiConfig } from "./types";
import { preMiddlewares } from "./middlewares";
import api from "./api/router";

async function startApi(clients: ApiClients, config: ApiConfig) {
  // init app instance
  const app = express();

  // enable cors if dev env
  if (config.deploy.nodeEnv === "development") app.use(cors());

  // parse body to json
  app.use(express.json());
  // parse cookies
  app.use(cookieParser());

  // apply pre-route middlewares
  app.use(preMiddlewares(clients));

  // apply api routing
  app.use("/api", api(clients));

  // run app
  app.listen(config.express.port);
  clients.logger.info("🧭 App is ready to handle some requests");
}

export default startApi;
