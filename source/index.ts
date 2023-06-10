import { getClients } from "./settings/clients";
import { getConfig } from "./settings/config";

import startBot from "./telegram-bot/bot";
import startApi from "./web-api/app";

async function main() {
  const config = getConfig();
  const { deploy, telegram, express } = config;
  const clients = await getClients(config);
  const { database, redis, logger } = clients;

  await startBot(
    {
      database,
      redis,
      logger: logger.child({ source: "bot" }),
    },
    { telegram }
  );

  await startApi(
    { database, logger: logger.child({ source: "api" }) },
    { express, deploy }
  );
}

main();
