import { Composer, Keyboard, NextFunction } from "grammy";
import type { CustomContext } from "@src/context";
import { enter as enterEditMenu } from "../edit-menu.scene";
import { enter as enterMainMenu } from "../main-menu.scene";
import { Target } from "@prisma/client";
import { calcCaloriesMiddleware } from "../scene-tools";

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
  return ctx.reply("✴️ Выберите Вашу цель", {
    reply_markup: markup.keyboard,
  });
}

// - - - - - - - //

const setTarget = new Composer<CustomContext>();

function body(target: Target) {
  return async (ctx: CustomContext, next: NextFunction) => {
    await ctx.db.user.update({
      where: { tg_id: ctx.from!.id.toString() },
      data: { target },
    });

    // update state
    await ctx.cache.update(ctx.from!.id.toString(), { registered: true });

    return next();
  };
}

function router(ctx: CustomContext) {
  if (ctx.state.registered) return enterEditMenu(ctx);
  else return enterMainMenu(ctx);
}

setTarget.hears(setTargetKeys.Похудение, body("LOSE"), calcCaloriesMiddleware, router);

setTarget.hears(
  setTargetKeys["Удержание веса"],
  body("KEEP"),
  calcCaloriesMiddleware,
  router
);

setTarget.hears(
  setTargetKeys["Набор веса"],
  body("GAIN"),
  calcCaloriesMiddleware,
  router
);

/*
setSex.hears(backKey, async (ctx: CustomContext) => {
  return ctx.reply("Назад");
});
*/

export default setTarget;
