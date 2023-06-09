import { Composer, Keyboard } from "grammy";
import type { CustomContext } from "@bot/types";

import { enter as enterSexSetter } from "./setters/sex.setter.scene";
import { enter as enterActivitySetter } from "./setters/activity.setter.scene";
import { enter as enterTargetSetter } from "./setters/target.setter.scene";
import { enter as enterWeightSetter } from "./setters/weight.setter.scene";
import { enter as enterAgeSetter } from "./setters/age.setter.scene";
import { enter as enterHeightSetter } from "./setters/height.setter.scene";
import { enter as enterMainMenu } from "./main-menu.scene";
import { backButton } from "./scene-tools";

export const sceneId = "EDIT_MENU";

// alias = value
enum editMenuKeys {
  "Пол" = "🚻 Пол",
  "Активность" = "🏸 Активность",
  "Цель" = "✴️ Цель",
  "Вес" = "⚖️ Вес",
  "Возраст" = "🍼 Возраст",
  "Рост" = "⏫ Рост",
}
const markup = {
  keys: editMenuKeys,
  keyboard: new Keyboard()
    .text(editMenuKeys.Пол)
    .text(editMenuKeys.Активность)
    .text(editMenuKeys.Цель)
    .row()
    .text(editMenuKeys.Вес)
    .text(editMenuKeys.Возраст)
    .text(editMenuKeys.Рост)
    .row()
    .text(backButton)
    .row()
    .resized(),
};

// - - - - - - - //

export async function enter(ctx: CustomContext) {
  await ctx.cache.update(ctx.from!.id.toString(), { scene: sceneId });

  return ctx.reply("🗒 Меню редактирования", {
    reply_markup: markup.keyboard,
  });
}

// - - - - - - - //

const editMenu = new Composer<CustomContext>();

editMenu.hears(editMenuKeys.Пол, async (ctx: CustomContext) => enterSexSetter(ctx));
editMenu.hears(editMenuKeys.Активность, async (ctx: CustomContext) =>
  enterActivitySetter(ctx)
);
editMenu.hears(editMenuKeys.Цель, async (ctx: CustomContext) => enterTargetSetter(ctx));
editMenu.hears(editMenuKeys.Вес, async (ctx: CustomContext) => enterWeightSetter(ctx));
editMenu.hears(editMenuKeys.Возраст, async (ctx: CustomContext) => enterAgeSetter(ctx));
editMenu.hears(editMenuKeys.Рост, async (ctx: CustomContext) => enterHeightSetter(ctx));

editMenu.hears(backButton, (ctx: CustomContext) => enterMainMenu(ctx));

export default editMenu;
