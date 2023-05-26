import { Composer } from "grammy";
import mainMenu from "./main-menu.scene";
import { CustomContext } from "../../types";

const scenes = new Composer<CustomContext>();

scenes.use(mainMenu);

export default scenes;
