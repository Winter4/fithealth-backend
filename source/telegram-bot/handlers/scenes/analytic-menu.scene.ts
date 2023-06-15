import { Composer, InputFile, Keyboard } from "grammy";
import type { CustomContext } from "@bot/types";
import { enter as enterMainMenu } from "./main-menu.scene";

import { backButton } from "./scene-tools";
import { getChartStream } from "./chart";

export const sceneId = "ANALYTIC_MENU";

// alias = value
enum editMenuKeys {
  "Базовый анализ" = "🐭 Базовый анализ",
}
const markup = {
  keys: editMenuKeys,
  keyboard: new Keyboard()
    .text(editMenuKeys["Базовый анализ"])
    .row()
    .text(backButton)
    .row()
    .resized(),
};

// - - - - - - - //

export async function enter(ctx: CustomContext) {
  await ctx.cache.update(ctx.from!.id.toString(), { scene: sceneId });

  return ctx.reply(
    "📊 Меню анализа питания \n\n🐭 Базовый анализ - процент заполнения дневника, отклонение от нормы калорий",
    {
      reply_markup: markup.keyboard,
    }
  );
}

// - - - - - - - //

const analyticMenu = new Composer<CustomContext>();

analyticMenu.hears(editMenuKeys["Базовый анализ"], async (ctx: CustomContext) => {
  /*
  const streams = await getChartStream();

  await ctx.replyWithPhoto(new InputFile(streams.followPercent), {
    caption: "📊 График процента следования норме калорий за последние 6 месяцев",
  });

  return ctx.replyWithPhoto(new InputFile(streams.followPercent), {
    caption: "📊 График дневной нормы калорий за последние 6 месяцев",
  });
  */

  return ctx.reply("Базовый анализ");
});

analyticMenu.hears(backButton, (ctx: CustomContext) => enterMainMenu(ctx));

export default analyticMenu;
