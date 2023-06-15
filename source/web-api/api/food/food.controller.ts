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

  public async add(req: Request, res: Response) {
    const food = req.body;

    const created = await this.db.food.create({ data: food });

    res.json(created);
  }

  public async update(req: Request, res: Response) {
    const id = Number(req.params.id);
    const { body } = req;

    const updated = await this.db.food.update({ where: { id }, data: body });

    res.json(updated);
  }

  public async delete(req: Request, res: Response) {
    const id = Number(req.params.id);

    const deleted = await this.db.food.delete({ where: { id }, select: { id: true } });

    res.json(deleted);
  }
}
