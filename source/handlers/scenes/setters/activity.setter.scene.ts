import { Composer, Keyboard } from "grammy";
import type { CustomContext } from "@src/context";
import { enter as enterTargetSetter } from "./target.setter.scene";

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

setActivity.hears(setActivityKeys.Нулевая, async (ctx: CustomContext) => {
  await ctx.db.user.update({
    where: { tg_id: ctx.from!.id.toString() },
    data: { activity: "ZERO" },
  });

  return enterTargetSetter(ctx);
});

setActivity.hears(setActivityKeys.Маленькая, async (ctx: CustomContext) => {
  await ctx.db.user.update({
    where: { tg_id: ctx.from!.id.toString() },
    data: { activity: "LOW" },
  });

  return enterTargetSetter(ctx);
});

setActivity.hears(setActivityKeys.Средняя, async (ctx: CustomContext) => {
  await ctx.db.user.update({
    where: { tg_id: ctx.from!.id.toString() },
    data: { activity: "MIDDLE" },
  });

  return enterTargetSetter(ctx);
});

setActivity.hears(setActivityKeys.Высокая, async (ctx: CustomContext) => {
  await ctx.db.user.update({
    where: { tg_id: ctx.from!.id.toString() },
    data: { activity: "HIGH" },
  });

  return enterTargetSetter(ctx);
});

/*
setSex.hears(backKey, async (ctx: CustomContext) => {
  return ctx.reply("Назад");
});
*/

export default setActivity;
