import { Request, Response } from "express";

export default {
  get: function (req: Request, res: Response) {
    res.json({ ok: true, msg: "im up" });
  },
};
