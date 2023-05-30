import type { BotError, NextFunction } from "grammy";
import type { CustomContext } from "./context";
import type { BotClients } from "./settings/clients";
import { refreshCacheFunction, updateCacheFunction, UserCache } from "./cache";
import { sceneIds } from "./handlers/scenes/scenes";

function extendContext(
  clients: BotClients,
  refreshCache: refreshCacheFunction,
  updateCache: updateCacheFunction,
  config: { errorChatId: string; adminChatId: string }
) {
  return (ctx: CustomContext, next: NextFunction) => {
    ctx.logger = clients.logger;
    ctx.db = clients.database;
    ctx.cache = {
      refresh: refreshCache,
      update: updateCache,
    };
    ctx.config = config;

    return next();
  };
}

function cache(refreshCache: refreshCacheFunction) {
  return async (ctx: CustomContext, next: NextFunction) => {
    if (!ctx.from?.id) {
      throw new Error(
        `Empty <ctx.from?.id>; update ID = ${ctx.update.update_id}`
      );
    }
    const cache = await refreshCache(ctx.from.id.toString());
    ctx.state = cache ? cache : { scene: sceneIds.none, registered: false };
    return next();
  };
}

function logUpdates(ctx: CustomContext, next: NextFunction) {
  ctx.logger.info({ ...ctx.update, state: { ...ctx.state } });
  return next();
}

export function preMiddlewares(
  clients: BotClients,
  userCache: UserCache,
  config: { errorChatId: string; adminChatId: string }
) {
  return [
    extendContext(
      clients,
      userCache.pull.bind(userCache),
      userCache.push.bind(userCache),
      config
    ),
    cache(userCache.pull.bind(userCache)),
    logUpdates,
  ];
}

// - - - - - - - //

export function errorHandler(error: BotError<CustomContext>) {
  const { ctx, message, stack } = error;
  ctx.logger.error(error.error);
  return ctx.api.sendMessage(
    ctx.config.errorChatId,
    `Message: \n<code>${message}</code> \n\n\nStack: \n<code>${stack}</code>`,
    { parse_mode: "HTML" }
  );
}
