import { Composer, Keyboard } from "grammy";
import type { CustomContext } from "@src/context";
import { enter as enterMainMenu } from "../main-menu.scene";

export const sceneId = "SET_TARGET";

// alias = value
enum setTargetKeys {
  "Похудение" = "🔽 Похудение",
  "Удержание веса" = "🔄 Удержание веса",
  "Набор веса" = "🔼 Набор веса",
}
const markup = {
  keys: setTargetKeys,
  keyboard: new Keyboard()
    .text(setTargetKeys.Похудение)
    .text(setTargetKeys["Удержание веса"])
    .text(setTargetKeys["Набор веса"])
    .row()
    .resized(),
};

// - - - - - - - //

export async function enter(ctx: CustomContext) {
  await ctx.cache.update(ctx.from!.id.toString(), { scene: sceneId });
  return ctx.reply("Выберите Вашу цель", {
    reply_markup: markup.keyboard,
  });
}

// - - - - - - - //

const setTarget = new Composer<CustomContext>();

setTarget.hears(setTargetKeys.Похудение, async (ctx: CustomContext) => {
  await ctx.db.user.update({
    where: { tg_id: ctx.from!.id.toString() },
    data: { target: "LOSE" },
  });

  return enterMainMenu(ctx);
});

setTarget.hears(setTargetKeys["Удержание веса"], async (ctx: CustomContext) => {
  await ctx.db.user.update({
    where: { tg_id: ctx.from!.id.toString() },
    data: { target: "KEEP" },
  });

  return enterMainMenu(ctx);
});

setTarget.hears(setTargetKeys["Набор веса"], async (ctx: CustomContext) => {
  await ctx.db.user.update({
    where: { tg_id: ctx.from!.id.toString() },
    data: { target: "GAIN" },
  });

  return enterMainMenu(ctx);
});

/*
setSex.hears(backKey, async (ctx: CustomContext) => {
  return ctx.reply("Назад");
});
*/

export default setTarget;
