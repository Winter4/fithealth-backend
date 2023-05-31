import { Composer } from "grammy";
import type { CustomContext } from "@src/context";
import { enter as enterAgeSetter } from "./age.setter.scene";

export const sceneId = "SET_HEIGHT";

const limits = {
  min: 60,
  max: 250,
};

// - - - - - - - //

export async function enter(ctx: CustomContext) {
  await ctx.cache.update(ctx.from!.id.toString(), { scene: sceneId });
  return ctx.reply(`Введите Ваш рост; ${limits.min}-${limits.max}см`, {
    reply_markup: { remove_keyboard: true },
  });
}

// - - - - - - - //

const setHeight = new Composer<CustomContext>();

setHeight.on("message:text", async (ctx: CustomContext) => {
  const received = parseInt(ctx.msg!.text!);

  // validation
  if (isNaN(received)) return ctx.reply("Пожалуйста, введите число");
  if (received < limits.min || received > limits.max)
    return ctx.reply("Пожалуйста, введите корректное число");

  await ctx.db.user.update({
    where: { tg_id: ctx.from!.id.toString() },
    data: { height: received },
  });

  return enterAgeSetter(ctx);
});

/*
setSex.hears(backKey, async (ctx: CustomContext) => {
  return ctx.reply("Назад");
});
*/

export default setHeight;
