import { Router } from "express";
import { ApiClients } from "@api/types";
import MealController from "./meal.controller";
import wrap from "../async-wrapper";

export default function meal(dbClient: ApiClients["database"]) {
  const controller = new MealController(dbClient);
  const c = controller;

  const meal = Router();

  meal.get("/calories", wrap(c.getCalories.bind(c)));

  meal
    .route("/healthy")
    .post(wrap(c.addHealthy.bind(c)))
    .get(wrap(c.getHealthy.bind(c)));

  meal
    .route("/unhealthy")
    .post(wrap(c.addUnhealthy.bind(c)))
    .get(wrap(c.getUnhealthy.bind(c)));

  meal.patch("/:id", wrap(c.update.bind(c)));

  meal.delete("/:id", wrap(c.delete.bind(c)));

  return meal;
}
