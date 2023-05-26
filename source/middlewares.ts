import type { BotError, NextFunction } from "grammy";
import type { CustomContext } from "./context";
import type { BotClients } from "./settings/clients";

function extendContext(clients: BotClients) {
  return (ctx: CustomContext, next: NextFunction) => {
    ctx.logger = clients.logger;
    ctx.db = clients.database;

    return next();
  };
}

function cache(ctx: CustomContext, next: NextFunction) {
  return next();
}

function logUpdates(ctx: CustomContext, next: NextFunction) {
  ctx.logger.info(ctx.update);
  return next();
}

export function preMiddlewares(clients: BotClients) {
  return [extendContext(clients), cache, logUpdates];
}

export function errorHandler(logger: BotClients["logger"]) {
  return (error: BotError) => {
    logger.error(error.error);
  };
}
