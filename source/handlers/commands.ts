import { Composer } from "grammy";
import type { CustomContext } from "@src/context";

import { getSceneEntrance, sceneIds } from "./scenes/scenes";
import { enter as enterMainMenu } from "./scenes/main-menu.scene";
import { enter as enterSexSetter } from "./scenes/setters/sex.setter.scene";

const commands = new Composer<CustomContext>();

commands.command("start", async (ctx: CustomContext) => {
  if (ctx.state.registered) {
    return enterMainMenu(ctx);
  } else {
    if (ctx.state.scene === sceneIds.none) {
      await ctx.reply(
        `Приветствую! Я - бот FitHealth, и я помогу Вам контроллировать и анализировать ваше питание!
      \nПожалуйста, введите свои данные для регистрации ✍️`
      );

      // create models
      await ctx.db.user.create({ data: { tg_id: ctx.from!.id.toString() } });
      await ctx.db.state.create({
        data: { user_tg_id: ctx.from!.id.toString() },
      });

      return enterSexSetter(ctx);
    } else {
      await ctx.reply("Пожалуйста, завершите регистрацию!");
      const sceneEntrance = getSceneEntrance(ctx.state.scene);

      return sceneEntrance(ctx);
    }
  }
});

export default commands;
