const { Composer, Markup } = require("telegraf");
const User = require("../../services/user.service");

const scene = new Composer();

const setSex = require("./sex.setter");
const mainMenu = require("../menus/main/home.menu.main");

const SCENE_ID = "SET_NAME";
module.exports.id = SCENE_ID;

// - - - - - - - - - - - - - - - - - - - - - - - - //

module.exports.enter = async (ctx) => {
  try {
    await User.set.state(ctx.chat.id, SCENE_ID);
    return ctx.reply("Введите своё имя: ", Markup.removeKeyboard());
  } catch (e) {
    throw new Error(
      `Error in <enter> middleware of <name.setter> scene --> ${e.message}`
    );
  }
};

scene.on(
  "text",

  // update data
  async (ctx, next) => {
    try {
      // get user id
      const userID = ctx.chat.id;

      // save new data
      await User.set.name(userID, ctx.message.text);

      return next();
    } catch (e) {
      throw new Error(
        `Error in update_data of <on_text> middleware of <name.setter> scene --> ${e.message}`
      );
    }
  },

  // push to next scene
  async (ctx) => {
    try {
      // choose new scene to enter
      const enterNextScene = (await User.get.registered(ctx.chat.id))
        ? mainMenu.enter
        : setSex.enter;

      return enterNextScene(ctx);
    } catch (e) {
      throw new Error(
        `Error in scene_push of <on_text> middleware of <name.setter> scene --> ${e.message}`
      );
    }
  }
);

scene.on("message", (ctx) => {
  return ctx.reply("Пожалуйста, введите имя буквами");
});

// - - - - - - - - - - - - - - - - - - - - - - - - //

module.exports.middleware = scene;
