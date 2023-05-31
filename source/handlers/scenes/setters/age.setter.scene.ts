import { Composer } from "grammy";
import type { CustomContext } from "@src/context";
import { enter as enterActivitySetter } from "./activity.setter.scene";

export const sceneId = "SET_AGE";

const limits = {
  min: 16,
  max: 100,
};

// - - - - - - - //

export async function enter(ctx: CustomContext) {
  await ctx.cache.update(ctx.from!.id.toString(), { scene: sceneId });
  return ctx.reply(
    `Введите Ваш возраст; ${limits.min}-${limits.max} полных лет`,
    {
      reply_markup: { remove_keyboard: true },
    }
  );
}

// - - - - - - - //

const setAge = new Composer<CustomContext>();

setAge.on("message:text", async (ctx: CustomContext) => {
  const received = parseInt(ctx.msg!.text!);

  // validation
  if (isNaN(received)) return ctx.reply("Пожалуйста, введите число");
  if (received < limits.min || received > limits.max)
    return ctx.reply("Пожалуйста, введите корректное число");

  await ctx.db.user.update({
    where: { tg_id: ctx.from!.id.toString() },
    data: { age: received },
  });

  return enterActivitySetter(ctx);
});

/*
setSex.hears(backKey, async (ctx: CustomContext) => {
  return ctx.reply("Назад");
});
*/

export default setAge;
