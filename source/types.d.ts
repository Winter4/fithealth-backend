import type { Context } from "grammy";
import type { BotClients } from "./clients";
import type { PrismaClient } from "@prisma/client";

// declare custom context type
export type CustomContext = Context & {
  logger: BotClients["logger"];
  db: BotClients["database"];
};
