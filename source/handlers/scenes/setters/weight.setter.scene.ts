import { Composer, Keyboard } from "grammy";
import type { CustomContext } from "@src/context";
import { enter as enterHeightSetter } from "./height.setter.scene";

export const sceneId = "SET_WEIGHT";

const limits = {
  min: 20,
  max: 200,
};

// - - - - - - - //

export async function enter(ctx: CustomContext) {
  await ctx.cache.update(ctx.from!.id.toString(), { scene: sceneId });
  return ctx.reply(`Введите Ваш вес; ${limits.min}-${limits.max}кг`, {
    reply_markup: { remove_keyboard: true },
  });
}

// - - - - - - - //

const setWeight = new Composer<CustomContext>();

setWeight.on("message:text", async (ctx: CustomContext) => {
  const received = parseFloat(ctx.msg!.text!);
  ctx.logger.warn("received " + received);

  // validation
  if (isNaN(received)) return ctx.reply("Пожалуйста, введите число");
  if (received < limits.min || received > limits.max)
    return ctx.reply("Пожалуйста, введите корректное число");

  await ctx.db.user.update({
    where: { tg_id: ctx.from!.id.toString() },
    data: { weight: received },
  });

  return enterHeightSetter(ctx);
});

/*
setSex.hears(backKey, async (ctx: CustomContext) => {
  return ctx.reply("Назад");
});
*/

export default setWeight;
