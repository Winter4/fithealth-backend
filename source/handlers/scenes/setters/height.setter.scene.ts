import { Composer, NextFunction } from "grammy";
import type { CustomContext } from "@src/context";
import { enter as enterEditMenu } from "../edit-menu.scene";
import { enter as enterAgeSetter } from "./age.setter.scene";
import { calcCaloriesMiddleware } from "../scene-tools";

export const sceneId = "SET_HEIGHT";

const limits = {
  min: 60,
  max: 250,
};

// - - - - - - - //

export async function enter(ctx: CustomContext) {
  await ctx.cache.update(ctx.from!.id.toString(), { scene: sceneId });
  return ctx.reply(
    `⏫ Введите Ваш рост; ${limits.min}-${limits.max}см; дробные числа будут округлены`,
    {
      reply_markup: { remove_keyboard: true },
    }
  );
}

// - - - - - - - //

const setHeight = new Composer<CustomContext>();

async function body(ctx: CustomContext, next: NextFunction) {
  const received = parseInt(ctx.msg!.text!);

  // validation
  if (isNaN(received)) return ctx.reply("❌ Пожалуйста, введите число");
  if (received < limits.min || received > limits.max)
    return ctx.reply("❌ Пожалуйста, введите корректное число");

  // update db
  await ctx.db.user.update({
    where: { tg_id: ctx.from!.id.toString() },
    data: { height: received },
  });

  return next();
}

function router(ctx: CustomContext) {
  if (ctx.state.registered) return enterEditMenu(ctx);
  else return enterAgeSetter(ctx);
}

setHeight.on("message:text", body, calcCaloriesMiddleware, router);

/*
setSex.hears(backKey, async (ctx: CustomContext) => {
  return ctx.reply("Назад");
});
*/

export default setHeight;
