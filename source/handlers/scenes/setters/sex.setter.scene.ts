import { Composer, Keyboard } from "grammy";
import type { CustomContext } from "@src/context";

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
  await ctx.db.state.update({
    where: { user_tg_id: ctx.from!.id.toString() },
    data: { scene: sceneId },
  });
  return ctx.reply("Выберите Ваш пол", {
    reply_markup: markup.keyboard,
  });
}

// - - - - - - - //

const setSex = new Composer<CustomContext>();

setSex.hears(setSexKeys["Мужской"], async (ctx: CustomContext) => {
  return ctx.reply("Мужской");
});

setSex.hears(setSexKeys["Женский"], async (ctx: CustomContext) => {
  return ctx.reply("Женский");
});

/*
setSex.hears(backKey, async (ctx: CustomContext) => {
  return ctx.reply("Назад");
});
*/

export default setSex;
