import { Router } from "express";
import ReportController from "./report.controller";
import { ApiClients } from "@src/web-api/types";

export default function report(dbClient: ApiClients["database"]) {
  const controller = new ReportController(dbClient);

  const report = Router();

  report.get("/:uuid", controller.get.bind(controller));

  return report;
}
