import { Composer, Keyboard } from "grammy";
import type { CustomContext } from "@src/context";

export const sceneId = "MAIN_MENU";

// alias = value
enum mainMenuKeys {
  "Моё питание" = "🥦 Моё питание",
  "Изменить данные" = "🗒 Изменить данные",
  "Справка" = "ℹ️ Справка",
}
const mainMenuMarkup = {
  keys: mainMenuKeys,
  keyboard: new Keyboard()
    .text(mainMenuKeys["Моё питание"])
    .row()
    .text(mainMenuKeys["Справка"])
    .text(mainMenuKeys["Изменить данные"])
    .row()
    .resized(),
};

// - - - - - - - //

export async function enter(ctx: CustomContext) {
  //await ctx.db.state.update({ where: {  }})
  return ctx.reply("Главное меню", { reply_markup: mainMenuMarkup.keyboard });
}

// - - - - - - - //

const mainMenu = new Composer<CustomContext>();

mainMenu.hears(mainMenuKeys["Моё питание"], async (ctx: CustomContext) => {
  return ctx.reply("Ваше питание");
});

mainMenu.hears(mainMenuKeys["Изменить данные"], async (ctx: CustomContext) => {
  return ctx.reply("Изменение данных");
});

mainMenu.hears(mainMenuKeys["Справка"], async (ctx: CustomContext) => {
  return ctx.reply("Справка");
});

export default mainMenu;
