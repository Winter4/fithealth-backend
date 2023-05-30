import { Composer } from "grammy";
import type { CustomContext } from "@src/context";

import { enter as enterMainMenu } from "./scenes/main-menu.scene";

const commands = new Composer<CustomContext>();

commands.command("start", async (ctx: CustomContext) => {
  if (ctx.state.registered) {
    return enterMainMenu(ctx);
  } else {
    await ctx.reply(
      `Приветствую! Я - бот FitHealth, и я помогу Вам контроллировать и анализировать ваше питание!
      \nПожалуйста, введите свои данные для регистрации ✍️`
    );
  }
});

export default commands;
