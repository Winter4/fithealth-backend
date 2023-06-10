import { Router } from "express";
import { ApiClients } from "@api/types";
import MealController from "./meal.controller";
import wrap from "../async-wrapper";

export default function meal(dbClient: ApiClients["database"]) {
  const controller = new MealController(dbClient);
  const c = controller;

  const meal = Router();

  meal
    .route("/healthy")
    .get(wrap(c.getHealthy.bind(c)))
    .post(wrap(c.addHealthy.bind(c)));

  meal
    .route("/unhealthy")
    .get(wrap(c.getUnhealthy.bind(c)))
    .post(wrap(c.addUnhealthy.bind(c)));

  meal.delete("/:id", wrap(c.delete.bind(c)));

  return meal;
}
