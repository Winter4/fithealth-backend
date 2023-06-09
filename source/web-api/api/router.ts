import { Router } from "express";
import { ApiClients } from "../types";

import ping from "./ping/ping.router";
import report from "./report/report.router";

export default function api(clients: ApiClients) {
  const api = Router();

  api.use("/ping", ping);
  api.use("/report", report(clients.database));

  return api;
}
