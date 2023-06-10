import { Request, Response, NextFunction } from "express";
import { pinoHttp } from "pino-http";
import { ApiClients } from "@api/types";

function logRequests(logger: ApiClients["logger"]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const expressLogger = pinoHttp({
      logger,
      serializers: {
        req: (req: Request) => ({
          method: req.method,
          url: req.url,
        }),
      },
    });
    expressLogger(req, res);

    next();
  };
}

function logBody(req: Request, res: Response, next: NextFunction) {
  req.log.debug({ body: req.body, check: req.body === undefined });
  next();
}

export function preMiddlewares(clients: ApiClients) {
  return [logRequests(clients.logger), logBody];
}

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  req.log.error(err);
  res.status(500).json({ ok: false, msg: "error" });
}
