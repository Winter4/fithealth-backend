import { Composer } from "grammy";
import mainMenu, { sceneId as mainMenuId } from "./main-menu.scene";
import type { CustomContext } from "../../context";

// - - - - - - - //

export const sceneIds = {
  none: "NONE",
  mainMenu: mainMenuId,
};

// - - - - - - - //

const scenes = new Composer<CustomContext>();

scenes.use(mainMenu);

export default scenes;
