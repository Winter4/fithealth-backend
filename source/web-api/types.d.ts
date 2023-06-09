import { AppClients } from "@src/settings/clients";
import { AppConfig } from "@src/settings/config";

export type ApiClients = {
  database: AppClients["database"];
  logger: AppClients["logger"];
};
export type ApiConfig = {
  express: AppConfig["express"];
};
