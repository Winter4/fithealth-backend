import { Composer, Keyboard, NextFunction } from "grammy";
import type { CustomContext } from "@src/context";
import { enter as enterEditMenu } from "../edit-menu.scene";
import { enter as enterWeightSetter } from "./weight.setter.scene";
import { Gender } from "@prisma/client";
import { calcCaloriesMiddleware } from "../scene-tools";

export const sceneId = "SET_SEX";

// alias = value
enum setSexKeys {
  "Мужской" = "🚹 Мужской",
  "Женский" = "🚺 Женский",
}
const markup = {
  keys: setSexKeys,
  keyboard: new Keyboard()
    .text(setSexKeys.Мужской)
    .text(setSexKeys.Женский)
    .row()
    .resized(),
};

// - - - - - - - //

export async function enter(ctx: CustomContext) {
  await ctx.cache.update(ctx.from!.id.toString(), { scene: sceneId });
  return ctx.reply("🚻 Выберите Ваш пол", {
    reply_markup: markup.keyboard,
  });
}

// - - - - - - - //

const setSex = new Composer<CustomContext>();

function body(sex: Gender) {
  return async (ctx: CustomContext, next: NextFunction) => {
    // update db
    await ctx.db.user.update({
      where: { tg_id: ctx.from!.id.toString() },
      data: { sex },
    });

    return next();
  };
}

function router(ctx: CustomContext) {
  if (ctx.state.registered) return enterEditMenu(ctx);
  else return enterWeightSetter(ctx);
}

setSex.hears(setSexKeys["Мужской"], body("M"), calcCaloriesMiddleware, router);

setSex.hears(setSexKeys["Женский"], body("F"), calcCaloriesMiddleware, router);

/*
setSex.hears(backKey, async (ctx: CustomContext) => {
  return ctx.reply("Назад");
});
*/

export default setSex;
