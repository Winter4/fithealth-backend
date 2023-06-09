import { Router } from "express";
import pingController from "./ping.controller";

const ping = Router();

ping.get("/", pingController.get);

export default ping;
