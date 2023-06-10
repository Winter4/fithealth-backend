import { Router } from "express";
import ReportController from "./report.controller";
import { ApiClients } from "@src/web-api/types";
import wrap from "../async-wrapper";

export default function report(dbClient: ApiClients["database"]) {
  const controller = new ReportController(dbClient);
  const c = controller;

  const report = Router();

  report.get("/:uuid", wrap(c.get.bind(c)));

  return report;
}
