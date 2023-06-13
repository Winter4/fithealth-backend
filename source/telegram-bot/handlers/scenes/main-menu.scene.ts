import { Composer, InlineKeyboard, Keyboard } from "grammy";
import type { CustomContext } from "@bot/types";
import { enter as enterEditMenu } from "./edit-menu.scene";
import { getUserInfo, infoText } from "./scene-tools";

export const sceneId = "MAIN_MENU";

// alias = value
enum mainMenuKeys {
  "Моё питание" = "🥦 Моё питание",
  "Анализ питания" = "📊 Анализ питания",
  "Изменить данные" = "🗒 Изменить данные",
  "Справка" = "ℹ️ Справка",
}
const mainMenuMarkup = {
  keys: mainMenuKeys,
  keyboard: new Keyboard()
    .text(mainMenuKeys["Моё питание"])
    .text(mainMenuKeys["Анализ питания"])
    .row()
    .text(mainMenuKeys["Справка"])
    .text(mainMenuKeys["Изменить данные"])
    .row()
    .resized(),
};

// - - - - - - - //

export async function enter(ctx: CustomContext) {
  await ctx.cache.update(ctx.from!.id.toString(), { scene: sceneId });

  const userInfo = await getUserInfo(ctx);

  return ctx.reply("⛩ Главное меню \n\n" + userInfo, {
    reply_markup: mainMenuMarkup.keyboard,
  });
}

// - - - - - - - //

const mainMenu = new Composer<CustomContext>();

mainMenu.hears(mainMenuKeys["Моё питание"], async (ctx: CustomContext) => {
  const user = await ctx.db.user.findUnique({
    where: { tg_id: ctx.from!.id.toString() },
    select: { uuid: true },
  });
  if (!user) throw new Error(`Can't find User TG ID = ${ctx.from!.id}`);

  return ctx.reply("Перейти в дневник питания можно нажатием на кнопку ⬇️", {
    reply_markup: new InlineKeyboard().url(
      "Дневник питания",
      `${ctx.config.frontendUrl}/user/${user.uuid}`
    ),
  });
});

mainMenu.hears(mainMenuKeys["Анализ питания"], async (ctx: CustomContext) => {
  return ctx.reply("Анализ питания");
});

mainMenu.hears(mainMenuKeys["Изменить данные"], async (ctx: CustomContext) => {
  return enterEditMenu(ctx);
});

mainMenu.hears(mainMenuKeys["Справка"], async (ctx: CustomContext) => {
  return ctx.reply(infoText);
});

export default mainMenu;
