import { Bot } from "grammy";

import type { CustomContext, BotClients, BotConfig } from "./types";
import { preMiddlewares, errorHandler } from "./middlewares";

import commands from "./handlers/commands";
import scenes from "./handlers/scenes/scenes";
import { UserCache } from "./cache";

async function startBot(clients: BotClients, config: BotConfig) {
  // init bot instance
  const bot = new Bot<CustomContext>(config.telegram.botToken);

  // init UserCache instance
  const userCache = new UserCache(clients.redis, clients.database);

  // apply pre-scenes middlewares
  bot.use(
    ...preMiddlewares(clients, userCache, {
      errorChatId: config.telegram.errorChatId,
      adminChatId: config.telegram.adminChatId,
      frontendUrl: config.deploy.frontendUrl,
    })
  );

  bot.use(commands);
  bot.use(scenes);

  // error handler
  bot.catch(errorHandler);

  // set menu
  await bot.api.setMyCommands([{ command: "start", description: "Главное меню" }]);

  // run bot
  bot.start();
  clients.logger.info("🍟 Bot is ready to handle some calories");
}

export default startBot;
