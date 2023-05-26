// environment variables
import "dotenv/config";
import { Bot } from "grammy";

import { getConfig } from "./config";
import { BotClients, getClients } from "./clients";

import { CustomContext } from "./types";

import middlewares from "./middlewares";
import errorHandler from "./error-handler";

import commands from "./handlers/commands";
import scenes from "./handlers/scenes/scenes";

async function main() {
  // global app config
  const config = getConfig();
  // 3rd party clients, that should be inited
  const clients = await getClients(config);

  // init bot instance
  const bot = new Bot<CustomContext>(config.telegram.botToken);

  // apply pre-scenes middlewares
  bot.use(...middlewares(clients));

  bot.use(commands);
  bot.use(scenes);

  // error handler
  bot.catch(errorHandler(clients.logger));

  // await is ommited, why not lol
  bot.api.setMyCommands([{ command: "start", description: "Главное меню" }]);

  // run bot
  bot.start();
  clients.logger.info("🍟 Bot is ready to handle some calories");

  awa;
}

main();
