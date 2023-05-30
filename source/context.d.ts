import type { Context } from "grammy";
import type { BotClients } from "./settings/clients";
import type { PrismaClient } from "@prisma/client";
import { refreshCacheFunction, updateCacheFunction } from "./cache";

// declare custom context type
export type CustomContext = Context & {
  logger: BotClients["logger"];
  db: BotClients["database"];
  cache: {
    refresh: refreshCacheFunction;
    update: updateCacheFunction;
  };
  state: { scene: string; registered: boolean };
  config: {
    errorChatId: string;
    adminChatId: string;
  };
};
