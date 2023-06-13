import type { Context } from "grammy";
import type { PrismaClient } from "@prisma/client";
import { refreshCacheFunction, updateCacheFunction } from "./cache";
import type { AppClients } from "@src/settings/clients";
import type { AppConfig } from "@src/settings/config";

// declare bot requirements
export type BotClients = AppClients;
export type BotConfig = {
  deploy: AppConfig["deploy"];
  telegram: AppConfig["telegram"];
};

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
    frontendUrl: string;
  };
};
