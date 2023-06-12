import { Request, Response, NextFunction } from "express";

export function checkCookie(req: Request, res: Response, next: NextFunction) {
  const { user_uuid, report_id } = req.cookies;

  const uuidRegex =
    /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/;

  if (!uuidRegex.test(user_uuid))
    next(new Error("Invalid user uuid in cookies. Value = " + user_uuid));
  if (!Number.isInteger(Number(report_id)))
    next(new Error("Inalid report_id in cookies"));

  next();
}
