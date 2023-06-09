import { Composer, NextFunction } from "grammy";
import type { CustomContext } from "@bot/types";
import { enter as enterEditMenu } from "../edit-menu.scene";
import { enter as enterHeightSetter } from "./height.setter.scene";
import { calcCaloriesMiddleware } from "../scene-tools";

export const sceneId = "SET_WEIGHT";

const limits = {
  min: 20,
  max: 200,
};

// - - - - - - - //

export async function enter(ctx: CustomContext) {
  await ctx.cache.update(ctx.from!.id.toString(), { scene: sceneId });
  return ctx.reply(`⚖️ Введите Ваш вес; ${limits.min}-${limits.max}кг; формат XX.YY`, {
    reply_markup: { remove_keyboard: true },
  });
}

// - - - - - - - //

const setWeight = new Composer<CustomContext>();

async function body(ctx: CustomContext, next: NextFunction) {
  const received = parseFloat(ctx.msg!.text!);

  // validation
  if (isNaN(received)) return ctx.reply("❌ Пожалуйста, введите число");
  if (received < limits.min || received > limits.max)
    return ctx.reply("❌ Пожалуйста, введите корректное число");

  // update db
  await ctx.db.user.update({
    where: { tg_id: ctx.from!.id.toString() },
    data: { weight: received },
  });

  return next();
}

function router(ctx: CustomContext) {
  if (ctx.state.registered) return enterEditMenu(ctx);
  else return enterHeightSetter(ctx);
}

setWeight.on("message:text", body, calcCaloriesMiddleware, router);

/*
setSex.hears(backKey, async (ctx: CustomContext) => {
  return ctx.reply("Назад");
});
*/

export default setWeight;
