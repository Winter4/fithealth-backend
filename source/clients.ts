import pino from "pino";
import { PrismaClient } from "@prisma/client";

import type { BotConfig } from "./config";

// - - - - - - - //

type LoggerClient = ReturnType<typeof pino>;
function getLoggerClient(): LoggerClient {
  return pino({});
}

// - - - - - - - //

type DatabaseClient = ReturnType<typeof getDatabaseClient>;
function getDatabaseClient(config: BotConfig["database"]) {
  const client = config.logging
    ? new PrismaClient({ log: ["query"] })
    : new PrismaClient();

  return client;
}

// - - - - - - - //

export type BotClients = {
  logger: LoggerClient;
  database: DatabaseClient;
};
export async function getClients(config: BotConfig): Promise<BotClients> {
  const clients: BotClients = {
    logger: getLoggerClient(),
    database: getDatabaseClient(config.database),
  };

  if (clients.logger) {
    clients.logger.info("✅ Logger client is ready");
  }
  if (await clients.database.$executeRaw`SELECT version()`) {
    clients.logger.info(
      "✅ DB client is ready. Get a sunbeam through your prisma!"
    );
  }

  return clients;
}
