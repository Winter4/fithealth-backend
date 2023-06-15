import { Router } from "express";
import { ApiClients } from "@api/types";
import FoodController from "./food.controller";
import wrap from "../async-wrapper";

export default function food(dbClient: ApiClients["database"]) {
  const controller = new FoodController(dbClient);
  const c = controller;

  const food = Router();

  food.get("/", wrap(c.get.bind(c)));
  food.post("/", wrap(c.add.bind(c)));
  food.patch("/:id", wrap(c.update.bind(c)));
  food.delete("/:id", wrap(c.delete.bind(c)));

  return food;
}
