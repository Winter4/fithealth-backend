import { Composer } from "grammy";
import mainMenu, {
  sceneId as mainMenuId,
  enter as enterMainMenu,
} from "./main-menu.scene";
import setSex, {
  sceneId as setSexId,
  enter as enterSexSetter,
} from "./setters/sex.setter.scene";
import type { CustomContext } from "@src/context";

// - - - - - - - //

export const sceneIds = {
  none: "NONE",
  mainMenu: mainMenuId,
  setSex: setSexId,
};

export function getSceneEntrance(sceneId: string) {
  switch (sceneId) {
    case "NONE":
      throw new Error(
        "Detected 'NONE' scene ID in 'getSceneEntrance(sceneId: string)' "
      );
    case sceneIds.mainMenu:
      return enterMainMenu;
    case sceneIds.setSex:
      return enterSexSetter;
  }

  throw new Error("Unknown scene ID in 'getSceneEntrance(sceneId: string)' ");
}

// - - - - - - - //

function route(ctx: CustomContext, sceneToCheck: string) {
  return ctx.state.scene === sceneToCheck;
}

const scenes = new Composer<CustomContext>();

scenes.filter((ctx: CustomContext) => route(ctx, mainMenuId), mainMenu);
scenes.filter((ctx: CustomContext) => route(ctx, setSexId), setSex);

export default scenes;
