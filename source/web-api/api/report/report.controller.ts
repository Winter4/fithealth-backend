import { ApiClients } from "@src/web-api/types";
import { Request, Response } from "express";

class ReportController {
  constructor(private db: ApiClients["database"]) {}

  public async get(req: Request, res: Response) {
    const { uuid } = req.params;

    const todayReport = await this.db.report.findUnique({
      where: {
        user_uuid_date: {
          user_uuid: uuid,
          date: new Date(),
        },
      },
    });

    if (!todayReport) {
    }
  }
}

export default ReportController;
