import { Composer, Keyboard } from "grammy";
import type { CustomContext } from "@src/context";

export const sceneId = "EDIT_MENU";

// alias = value
enum editMenuKeys {
  "Моё питание" = "🥦 Моё питание",
  "Изменить данные" = "🗒 Изменить данные",
  "Справка" = "ℹ️ Справка",
}
const editMenuMarkup = {
  keys: editMenuKeys,
  keyboard: new Keyboard()
    .text(editMenuKeys["Моё питание"])
    .row()
    .text(editMenuKeys["Справка"])
    .text(editMenuKeys["Изменить данные"])
    .row()
    .resized(),
};

// - - - - - - - //

export async function enter(ctx: CustomContext) {
  await ctx.cache.update(ctx.from!.id.toString(), { scene: sceneId });
  return ctx.reply("Меню редактирования", {
    reply_markup: editMenuMarkup.keyboard,
  });
}

// - - - - - - - //

const editMenu = new Composer<CustomContext>();

export default editMenu;
