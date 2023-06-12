type DeployConfig = {
  nodeEnv: string;
  frontendUrl: string;
};
function getDeployConfig(): DeployConfig {
  const config: DeployConfig = {
    nodeEnv: process.env.NODE_ENV ?? "",
    frontendUrl: process.env.FRONTEND_URL ?? "",
  };

  if (!(config.nodeEnv === "development" || config.nodeEnv === "production"))
    throw new Error("Invalid NODE_ENV variable");
  if (!config.frontendUrl) throw new Error("Invalid frontend URL");

  return config;
}

// - - - - - - - //

type TelegramConfig = {
  botToken: string;
  adminChatId: string;
  errorChatId: string;
};
function getTelegramConfig(): TelegramConfig {
  const config: TelegramConfig = {
    botToken: process.env.TG_BOT_TOKEN ?? "",
    adminChatId: process.env.ADMIN_CHAT_ID ?? "",
    errorChatId: process.env.ERROR_CHAT_ID ?? "",
  };

  if (!config.botToken) throw new Error("Empty TG bot token");
  if (!config.adminChatId) throw new Error("Empty admin chat ID");
  if (!config.errorChatId) throw new Error("Empty error chat ID");

  return config;
}

// - - - - - - - //

type ExpressConfig = {
  port: number;
};
function getExpressConfig(): ExpressConfig {
  const config: ExpressConfig = {
    port: Number(process.env.EXPRESS_PORT),
  };

  if (!config.port) throw new Error("Empty Express port");

  return config;
}

// - - - - - - - //

type DatabaseConfig = {
  url: string;
  logging: boolean;
};
function getDatabaseConfig(): DatabaseConfig {
  const config: DatabaseConfig = {
    url: process.env.DB_URL ?? "",
    logging: Boolean(Number(process.env.DB_LOGS)) ?? false,
  };

  if (!config.url) throw new Error("Empty DB URL");

  return config;
}

// - - - - - - - //

type RedisConfig = {
  url: string;
  prefix?: string;
};
function getRedisConfig(): RedisConfig {
  const config: RedisConfig = {
    url: process.env.REDIS_URL ?? "",
    prefix: process.env.PROJECT_NAME,
  };

  if (!config.url) throw new Error("Empty Redis URL");

  return config;
}

// - - - - - - - //

export type AppConfig = {
  deploy: DeployConfig;
  telegram: TelegramConfig;
  express: ExpressConfig;
  database: DatabaseConfig;
  redis: RedisConfig;
};
export function getConfig(): AppConfig {
  return {
    deploy: getDeployConfig(),
    telegram: getTelegramConfig(),
    express: getExpressConfig(),
    database: getDatabaseConfig(),
    redis: getRedisConfig(),
  };
}
