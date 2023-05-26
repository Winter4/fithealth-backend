import type { Bot, NextFunction } from "grammy";
import type { CustomContext } from "./types";
import type { BotClients } from "./clients";

function extendContext(clients: BotClients) {
  return (ctx: CustomContext, next: NextFunction) => {
    ctx.logger = clients.logger;
    ctx.db = clients.database;

    return next();
  };
}

function logUpdates(ctx: CustomContext, next: NextFunction) {
  ctx.logger.info(ctx.update);
  return next();
}

export default function middlewares(clients: BotClients) {
  return [extendContext(clients), logUpdates];
}
