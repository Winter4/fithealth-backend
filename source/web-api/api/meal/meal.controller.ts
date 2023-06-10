import { Mealtime } from "@prisma/client";
import { ApiClients } from "@src/web-api/types";
import { Request, Response } from "express";

export default class MealController {
  constructor(private db: ApiClients["database"]) {}

  private mealtimeNumberToEnum(numbered: number): Mealtime {
    // prettier-ignore
    switch (numbered) {
      case 0: return "BREAKFAST";
      case 1: return "FLUNCH";
      case 2: return "DINNER";
      case 3: return "SLUNCH";
      case 4: return "SUPPER";

      default: throw new Error("Invalid tab index");
    }
  }

  public async addHealthy(req: Request, res: Response) {
    const { report_id } = req.cookies;
    if (!Number(report_id)) throw new Error("Ошибка. Пожалуйста, перезагрузите страницу");

    const { weight, foodId, tab } = req.body;

    // fetch food info
    const food = await this.db.food.findUnique({
      where: { id: foodId },
      select: { calories: true, name: true },
    });

    // create new meal record
    const meal = await this.db.meal.create({
      data: {
        weight,
        food_id: foodId,
        report_id: Number(report_id),
        mealtime: this.mealtimeNumberToEnum(tab),
      },
    });

    // food isn't nullable because findUnique
    res.json({ ...meal, calories: weight * food!.calories, name: food!.name });
  }

  public async addUnhealthy(req: Request, res: Response) {
    const { report_id } = req.cookies;
    if (!Number(report_id)) throw new Error("Ошибка. Пожалуйста, перезагрузите страницу");

    const { weight, foodId } = req.body;

    // fetch food info
    const food = await this.db.food.findUnique({
      where: { id: foodId },
      select: { calories: true, name: true },
    });

    // create new meal record
    const meal = await this.db.meal.create({
      data: {
        weight,
        food_id: foodId,
        report_id: Number(report_id),
        mealtime: null,
      },
    });

    // food isn't nullable because findUnique
    res.json({ ...meal, calories: weight * food!.calories, name: food!.name });
  }

  public async getHealthy(req: Request, res: Response) {
    const { tab } = req.query;
    //if (!tab) throw new Error("Empty 'tab' query");

    const { report_id } = req.cookies;

    const meals = await this.db.meal.findMany({
      where: {
        report_id: Number(report_id),
        mealtime: this.mealtimeNumberToEnum(Number(tab)),
        food: { healthy: true },
      },
      include: { food: true },
    });

    res.json(
      meals.map((m) => {
        return {
          id: m.id,
          name: m.food.name,
          weight: m.weight,
          calories: m.weight * m.food.calories,
        };
      })
    );
  }

  public async getUnhealthy(req: Request, res: Response) {
    const { report_id } = req.cookies;

    const meals = await this.db.meal.findMany({
      where: {
        report_id: Number(report_id),
        mealtime: null,
      },
      include: { food: true },
    });

    res.json(
      meals.map((m) => {
        return {
          id: m.id,
          name: m.food.name,
          weight: m.weight,
          calories: m.weight * m.food.calories,
        };
      })
    );
  }

  public async update(req: Request, res: Response) {
    const { id, weight } = req.body;

    const meal = await this.db.meal.update({
      where: { id },
      data: { weight },
      include: { food: true },
    });

    res.json({
      id: meal.id,
      name: meal.food.name,
      weight: meal.weight,
      calories: meal.weight * meal.food.calories,
    });
  }

  public async delete(req: Request, res: Response) {
    const { id } = req.params;

    const meal = await this.db.meal.delete({ where: { id: Number(id) } });

    res.json({ id: meal.id });
  }
}
