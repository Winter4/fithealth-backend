import { Activity, Target } from "@prisma/client";
import { CustomContext } from "@src/context";
import { NextFunction } from "grammy";

function matchActivity(activity: Activity) {
  // prettier-ignore
  switch (activity) {
    case "ZERO":   return 1.2;
    case "LOW":    return 1.375;
    case "MIDDLE": return 1.55;
    case "HIGH":   return 1.95;
  }
}

function matchTarget(target: Target) {
  // prettier-ignore
  switch (target) {
    case "LOSE": return 0.9;
    case "KEEP": return 1;
    case "GAIN": return 1.1;
  }
}

export async function calcCaloriesMiddleware(ctx: CustomContext, next: NextFunction) {
  const user = await ctx.db.user.findUnique({
    where: { tg_id: ctx.from!.id.toString() },
  });
  if (!user) throw new Error(`Can't find User object; TG ID = ${ctx.from!.id}`);

  const { sex, weight, height, age, activity, target } = user;
  if (!sex || !weight || !height || !age || !activity || !target) return next();

  const sexParam = sex === "M" ? 5 : -161;
  const activityParam = matchActivity(activity);
  const targetParam = matchTarget(target);

  const caloriesLimit =
    (10 * weight + 6.25 * height - 5 * age + sexParam) * activityParam * targetParam;

  await ctx.db.user.update({
    where: { tg_id: ctx.from!.id.toString() },
    data: { calories_limit: Math.round(caloriesLimit) },
  });

  return next();
}
