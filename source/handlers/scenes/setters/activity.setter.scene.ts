import { Composer, Keyboard, NextFunction } from "grammy";
import type { CustomContext } from "@src/context";
import { enter as enterEditMenu } from "../edit-menu.scene";
import { enter as enterTargetSetter } from "./target.setter.scene";
import { Activity } from "@prisma/client";
import { calcCaloriesMiddleware } from "../scene-tools";

export const sceneId = "SET_ACTIVITY";

// alias = value
enum setActivityKeys {
  "Нулевая" = "0️⃣ Нулевая",
  "Маленькая" = "1️⃣ Маленькая",
  "Средняя" = "2️⃣ Средняя",
  "Высокая" = "3️⃣ Высокая",
}
const markup = {
  keys: setActivityKeys,
  keyboard: new Keyboard()
    .text(setActivityKeys.Нулевая)
    .text(setActivityKeys.Маленькая)
    .row()
    .text(setActivityKeys.Средняя)
    .text(setActivityKeys.Высокая)
    .resized(),
};

// - - - - - - - //

export async function enter(ctx: CustomContext) {
  await ctx.cache.update(ctx.from!.id.toString(), { scene: sceneId });
  return ctx.reply("Выберите Вашу активность", {
    reply_markup: markup.keyboard,
  });
}

// - - - - - - - //

const setActivity = new Composer<CustomContext>();

function body(activity: Activity) {
  return async (ctx: CustomContext, next: NextFunction) => {
    await ctx.db.user.update({
      where: { tg_id: ctx.from!.id.toString() },
      data: { activity },
    });

    return next();
  };
}

function router(ctx: CustomContext) {
  if (ctx.state.registered) return enterEditMenu(ctx);
  else return enterTargetSetter(ctx);
}

setActivity.hears(setActivityKeys.Нулевая, body("ZERO"), calcCaloriesMiddleware, router);

setActivity.hears(setActivityKeys.Маленькая, body("LOW"), calcCaloriesMiddleware, router);

setActivity.hears(
  setActivityKeys.Средняя,
  body("MIDDLE"),
  calcCaloriesMiddleware,
  router
);

setActivity.hears(setActivityKeys.Высокая, body("HIGH"), calcCaloriesMiddleware, router);

/*
setSex.hears(backKey, async (ctx: CustomContext) => {
  return ctx.reply("Назад");
});
*/

export default setActivity;
