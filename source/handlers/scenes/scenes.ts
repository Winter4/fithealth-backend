import { Composer } from "grammy";
import mainMenu from "./main-menu.scene";
import type { CustomContext } from "../../context";

const scenes = new Composer<CustomContext>();

scenes.use(mainMenu);

export default scenes;
