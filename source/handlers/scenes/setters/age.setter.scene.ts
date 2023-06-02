import { Composer, NextFunction } from "grammy";
import type { CustomContext } from "@src/context";
import { enter as enterEditMenu } from "../edit-menu.scene";
import { enter as enterActivitySetter } from "./activity.setter.scene";
import { calcCaloriesMiddleware } from "../scene-tools";

export const sceneId = "SET_AGE";

const limits = {
  min: 16,
  max: 100,
};

// - - - - - - - //

export async function enter(ctx: CustomContext) {
  await ctx.cache.update(ctx.from!.id.toString(), { scene: sceneId });
  return ctx.reply(
    `🍼 Введите Ваш возраст; ${limits.min}-${limits.max} полных лет; дробные числа будут округлены`,
    {
      reply_markup: { remove_keyboard: true },
    }
  );
}

// - - - - - - - //

const setAge = new Composer<CustomContext>();

async function body(ctx: CustomContext, next: NextFunction) {
  const received = parseInt(ctx.msg!.text!);

  // validation
  if (isNaN(received)) return ctx.reply("❌ Пожалуйста, введите число");
  if (received < limits.min || received > limits.max)
    return ctx.reply("❌ Пожалуйста, введите корректное число");

  // update db
  await ctx.db.user.update({
    where: { tg_id: ctx.from!.id.toString() },
    data: { age: received },
  });

  return next();
}

function router(ctx: CustomContext) {
  if (ctx.state.registered) return enterEditMenu(ctx);
  else return enterActivitySetter(ctx);
}

setAge.on("message:text", body, calcCaloriesMiddleware, router);

/*
setSex.hears(backKey, async (ctx: CustomContext) => {
  return ctx.reply("Назад");
});
*/

export default setAge;
