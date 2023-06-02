import pino from "pino";
import { PrismaClient } from "@prisma/client";
import { Redis } from "ioredis";

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

type RedisClient = ReturnType<typeof getRedisClient>;
function getRedisClient(config: BotConfig["redis"]) {
  const client = config.prefix
    ? new Redis(config.url, { keyPrefix: config.prefix })
    : new Redis(config.url);

  return client;
}

// - - - - - - - //

export type BotClients = {
  logger: LoggerClient;
  database: DatabaseClient;
  redis: RedisClient;
};
export async function getClients(config: BotConfig): Promise<BotClients> {
  const clients: BotClients = {
    logger: getLoggerClient(),
    database: getDatabaseClient(config.database),
    redis: getRedisClient(config.redis),
  };

  if (clients.logger) {
    clients.logger.info("✅ Logger client is ready");
  }
  if (await clients.database.$executeRaw`SELECT version()`) {
    clients.logger.info("✅ DB client is ready. Get a sunbeam through your prisma!");
  }

  // redis checks
  const tmp = "test";
  await clients.redis.set(tmp, tmp);
  if ((await clients.redis.get(tmp)) === tmp) {
    clients.logger.info("✅ Redis client is ready. Cache the whole world!");

    if (config.redis.prefix) {
      clients.logger.info(
        `ℹ️  Redis prefix is '${config.redis.prefix}'. Your records would be like <${config.redis.prefix}:key=value>`
      );
    } else {
      clients.logger.info(
        "❗️ Redis prefix is empty. Is it correct? Your records would be like <key=value>"
      );
    }
  }
  await clients.redis.del(tmp);

  return clients;
}
