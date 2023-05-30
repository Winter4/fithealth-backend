// environment variables
import "dotenv/config";
import { Bot } from "grammy";

import { getConfig } from "./settings/config";
import { getClients } from "./settings/clients";

import type { CustomContext } from "./context";

import { preMiddlewares, errorHandler } from "./middlewares";

import commands from "./handlers/commands";
import scenes from "./handlers/scenes/scenes";
import { UserCache } from "./cache";

async function main() {
  // global app config
  const config = getConfig();
  // 3rd party clients, that should be inited
  const clients = await getClients(config);

  // init bot instance
  const bot = new Bot<CustomContext>(config.telegram.botToken);

  // init UserCache instance
  const userCache = new UserCache(clients.redis, clients.database);

  // apply pre-scenes middlewares
  bot.use(
    ...preMiddlewares(clients, userCache, {
      errorChatId: config.telegram.errorChatId,
      adminChatId: config.telegram.adminChatId,
    })
  );

  bot.use(commands);
  bot.use(scenes);

  // error handler
  bot.catch(errorHandler);

  // await is ommited, why not lol
  bot.api.setMyCommands([{ command: "start", description: "Главное меню" }]);

  // run bot
  bot.start();
  clients.logger.info("🍟 Bot is ready to handle some calories");
}

main();
