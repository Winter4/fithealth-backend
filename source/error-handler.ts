import { BotError } from "grammy";
import type { BotClients } from "./clients";

export default function errorHandler(logger: BotClients["logger"]) {
  return (error: BotError) => {
    logger.error(error.error);
  };
}
