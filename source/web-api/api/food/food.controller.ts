import { NextFunction, Request, Response } from "express";
import { ApiClients } from "@api/types";

export default class FoodController {
  constructor(private db: ApiClients["database"]) {}

  public async get(req: Request, res: Response) {
    const healthy = await this.db.food.findMany({
      where: { healthy: true },
    });

    const unhealthy = await this.db.food.findMany({
      where: { healthy: false },
    });

    res.json({ healthy, unhealthy });
  }

  public async add(req: Request, res: Response, next: NextFunction) {
    const food = req.body;

    const created = await this.db.food.create({ data: food });

    res.json(created);
  }
}
