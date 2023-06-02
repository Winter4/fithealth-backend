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

// - - - - - - - //

export const backButton = "⬅️ Назад";

// - - - - - - - //

export async function getUserInfo(ctx: CustomContext) {
  const userInfo = await ctx.db.user.findUnique({
    where: { tg_id: ctx.from!.id.toString() },
    select: {
      sex: true,
      weight: true,
      height: true,
      age: true,
      activity: true,
      target: true,
      calories_limit: true,
    },
  });
  if (!userInfo) throw new Error(`Can't find User object; TG ID = ${ctx.from!.id}`);

  const sexText = userInfo.sex === "M" ? "🚻 Пол: мужской" : "🚻 Пол: женский";

  let activityText = "🏸 Активность: ";
  switch (userInfo.activity) {
    case "ZERO":
      activityText += "нулевая";
      break;
    case "LOW":
      activityText += "маленькая";
      break;
    case "MIDDLE":
      activityText += "средняя";
      break;
    case "HIGH":
      activityText += "высокая";
      break;
  }

  let targetText = "✴️ Цель: ";
  switch (userInfo.target) {
    case "LOSE":
      targetText += "похудение";
      break;
    case "KEEP":
      targetText += "удержание веса";
      break;
    case "GAIN":
      targetText += "набор веса";
      break;
  }

  const text =
    `${sexText}\n` +
    `⚖️ Вес: ${userInfo.weight} кг\n` +
    `⏫ Рост: ${userInfo.height} см\n` +
    `🍼 Возраст: ${userInfo.age} лет\n` +
    `${activityText}\n` +
    `${targetText}\n\n` +
    `🦑 Суточная норма потребления: ${userInfo.calories_limit} ккал`;

  return text;
}
