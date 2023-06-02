import { Composer } from "grammy";
import type { CustomContext } from "@src/context";

import mainMenu, {
  sceneId as mainMenuId,
  enter as enterMainMenu,
} from "./main-menu.scene";

import editMenu, {
  sceneId as editMenuId,
  enter as enterEditMenu,
} from "./edit-menu.scene";

import setSex, {
  sceneId as setSexId,
  enter as enterSexSetter,
} from "./setters/sex.setter.scene";

import setWeight, {
  sceneId as setWeightId,
  enter as enterWeightSetter,
} from "./setters/weight.setter.scene";

import setHeight, {
  sceneId as setHeightId,
  enter as enterHeightSetter,
} from "./setters/height.setter.scene";

import setAge, {
  sceneId as setAgeId,
  enter as enterAgeSetter,
} from "./setters/age.setter.scene";

import setActivity, {
  sceneId as setActivityId,
  enter as enterActivitySetter,
} from "./setters/activity.setter.scene";

import setTarget, {
  sceneId as setTargetId,
  enter as enterTargetSetter,
} from "./setters/target.setter.scene";

// - - - - - - - //

export const sceneIds = {
  none: "NONE",
  mainMenu: mainMenuId,
  editMenu: editMenuId,
  setSex: setSexId,
  setWeight: setWeightId,
  setHeight: setHeightId,
  setAge: setAgeId,
  setActivity: setActivityId,
  setTarget: setTargetId,
};

export function getSceneEntrance(sceneId: string) {
  // prettier-ignore
  switch (sceneId) {
    case "NONE": throw new Error("Detected 'NONE' scene ID in 'getSceneEntrance(sceneId: string)' ");

    case sceneIds.mainMenu:    return enterMainMenu;
    case sceneIds.editMenu:    return enterEditMenu;

    case sceneIds.setSex:      return enterSexSetter;
    case sceneIds.setWeight:   return enterWeightSetter;
    case sceneIds.setHeight:   return enterHeightSetter;
    case sceneIds.setAge:      return enterAgeSetter;
    case sceneIds.setActivity: return enterActivitySetter;
    case sceneIds.setTarget:   return enterTargetSetter;
  }

  throw new Error("Unknown scene ID in 'getSceneEntrance(sceneId: string)' ");
}

// - - - - - - - //

function route(ctx: CustomContext, sceneToCheck: string) {
  return ctx.state.scene === sceneToCheck;
}

const scenes = new Composer<CustomContext>();

scenes.filter((ctx: CustomContext) => route(ctx, mainMenuId), mainMenu);
scenes.filter((ctx: CustomContext) => route(ctx, editMenuId), editMenu);

scenes.filter((ctx: CustomContext) => route(ctx, setSexId), setSex);
scenes.filter((ctx: CustomContext) => route(ctx, setWeightId), setWeight);
scenes.filter((ctx: CustomContext) => route(ctx, setHeightId), setHeight);
scenes.filter((ctx: CustomContext) => route(ctx, setAgeId), setAge);
scenes.filter((ctx: CustomContext) => route(ctx, setActivityId), setActivity);
scenes.filter((ctx: CustomContext) => route(ctx, setTargetId), setTarget);

export default scenes;
