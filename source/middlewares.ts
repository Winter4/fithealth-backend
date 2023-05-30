import type { BotError, NextFunction } from "grammy";
import type { CustomContext } from "./context";
import type { BotClients } from "./settings/clients";
import { UserCache } from "./cache";
import { sceneIds } from "./handlers/scenes/scenes";

function extendContext(clients: BotClients) {
  return (ctx: CustomContext, next: NextFunction) => {
    ctx.logger = clients.logger;
    ctx.db = clients.database;

    return next();
  };
}

function cache(userCache: UserCache) {
  return async (ctx: CustomContext, next: NextFunction) => {
    if (!ctx.from?.id) {
      throw new Error(
        `Empty <ctx.from?.id>; update ID = ${ctx.update.update_id}`
      );
    }
    const cache = await userCache.pull(ctx.from.id.toString());
    ctx.state = cache ? cache : { scene: sceneIds.none, registered: false };
    return next();
  };
}

function logUpdates(ctx: CustomContext, next: NextFunction) {
  ctx.logger.info({ ...ctx.update, state: { ...ctx.state } });
  return next();
}

export function preMiddlewares(clients: BotClients, userCache: UserCache) {
  return [extendContext(clients), cache(userCache), logUpdates];
}

export function errorHandler(logger: BotClients["logger"]) {
  return (error: BotError) => {
    logger.error(error.error);
  };
}
