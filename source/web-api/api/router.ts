import { Router } from "express";
import { ApiClients } from "../types";
import { checkCookie } from "./validation";

import ping from "./ping/ping.router";
import report from "./report/report.router";
import food from "./food/food.router";
import meal from "./meal/meal.router";

export default function api(clients: ApiClients) {
  const api = Router();

  api.use("/ping", ping);

  api.use("/report", report(clients.database));
  api.use("/food", food(clients.database));
  api.use("/meal", checkCookie, meal(clients.database));

  return api;
}
