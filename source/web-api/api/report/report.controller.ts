import { ApiClients } from "@src/web-api/types";
import { Request, Response, NextFunction } from "express";

class ReportController {
  constructor(private db: ApiClients["database"]) {}

  public async get(req: Request, res: Response) {
    const { uuid } = req.params;
    const reportUniqueKey = {
      user_uuid_date: {
        user_uuid: uuid,
        date: new Date(),
      },
    };

    const user = await this.db.user.findUnique({ where: { uuid } });
    if (!user) throw new Error(`Can't find User with uuid = ${uuid}`);
    if (!user!.calories_limit) {
      throw new Error(`User.calories_limit = ${user!.calories_limit}`);
    }

    // check if there is a report for today
    const todayReportCount = await this.db.report.count({
      where: reportUniqueKey.user_uuid_date,
    });

    // update the existing report
    const todayReport = todayReportCount
      ? await this.db.report.update({
          where: reportUniqueKey,
          data: {
            calories_limit: user.calories_limit,
          },
        })
      : // or create a new one
        await this.db.report.create({
          data: {
            user_uuid: uuid,
            calories_limit: user.calories_limit,
            date: new Date(),
          },
        });

    // send updated/created report
    res.json(todayReport);
  }
}

export default ReportController;
