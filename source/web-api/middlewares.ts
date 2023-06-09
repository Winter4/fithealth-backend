import { NextFunction } from "express";
import { pinoHttp } from "pino-http";
import { ApiClients } from "@api/types";
import { IncomingMessage, ServerResponse } from "http";

function logRequests(logger: ApiClients["logger"]) {
  return (
    req: IncomingMessage,
    res: ServerResponse<IncomingMessage>,
    next: NextFunction
  ) => {
    const expressLogger = pinoHttp({
      logger,
      serializers: {
        req: (req) => ({
          method: req.method,
          url: req.url,
        }),
      },
    });
    expressLogger(req, res);

    next();
  };
}

export function preMiddlewares(clients: ApiClients) {
  return [logRequests(clients.logger)];
}
