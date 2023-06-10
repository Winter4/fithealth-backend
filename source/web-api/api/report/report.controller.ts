import { ApiClients } from "@src/web-api/types";
import { Request, Response, NextFunction } from "express";

class ReportController {
  constructor(private db: ApiClients["database"]) {}

  private getCurrentDate() {
    const today = new Date();
    const dd = today.getDate();
    const mm = today.getMonth();
    const yyyy = today.getFullYear();

    const date = new Date(yyyy, mm, dd, 9);

    return date;
  }

  public async get(req: Request, res: Response) {
    const { uuid } = req.params;
    const reportUniqueKey = {
      user_uuid_date: {
        user_uuid: uuid,
        date: this.getCurrentDate(),
      },
    };

    // save user uuid to cookie
    res.cookie("user_uuid", uuid, { maxAge: 900000, httpOnly: true });

    const user = await this.db.user.findUnique({
      where: { uuid },
      select: { id: true, calories_limit: true },
    });
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
            date: this.getCurrentDate(),
          },
        });

    // send updated/created report
    res.json({ calories: todayReport.calories_limit, userId: user.id });
  }
}

export default ReportController;
