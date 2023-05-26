import { Composer } from "grammy";
import type { CustomContext } from "../context";

import { enter } from "./scenes/main-menu.scene";

const commands = new Composer<CustomContext>();

commands.command("start", async (ctx: CustomContext) => {
  return enter(ctx);
});

export default commands;
