const { Composer, Markup } = require("telegraf");
const User = require("../../services/user.service");

const scene = new Composer();

const setAge = require("./age.setter");
const mainMenu = require("../menus/main/home.menu.main");

const SCENE_ID = "SET_HEIGHT";

// - - - - - - - - - - - - - - - - - - - - - - - - //

const Limits = {
  min: 120,
  max: 230,
};

// - - - - - - - - - - - - - - - - - - - - - - - - //

async function enter(ctx) {
  try {
    // update user state
    await User.set.state(ctx.chat.id, SCENE_ID);
    // reply
    return ctx.reply(
      `Введите свой рост числом (${Limits.min}-${Limits.max} см):`,
      Markup.removeKeyboard()
    );
  } catch (e) {
    throw new Error(
      `Error in <enter> middleware of <height.setter> scene --> ${e.message}`
    );
  }
}

scene.on(
  "text",

  // validate input
  async (ctx, next) => {
    try {
      // input.test() will return true if any non-numeric symbol's provided
      const input = /\D/;

      // validate for numbers-only
      if (input.test(ctx.message.text)) {
        return ctx.reply("Пожалуйста, введите свой рост числом");
      }

      // validate for limits
      const data = Number.parseInt(ctx.message.text);
      if (data < Limits.min || data > Limits.max) {
        return ctx.reply("Пожалуйста, введите число в указанном диапазоне");
      }

      return next();
    } catch (e) {
      throw new Error(
        `Error in validation of <on_text> middleware of <height.setter> scene --> ${e.message}`
      );
    }
  },

  // update data on validation success
  async (ctx, next) => {
    try {
      // update data
      await User.set.height(ctx.chat.id, ctx.message.text);

      return next();
    } catch (e) {
      throw new Error(
        `Error in data_update of <on_text> middleware of <height.setter> scene --> ${e.message}`
      );
    }
  },

  // push to next scene
  async (ctx) => {
    try {
      // choose new scene to enter
      const enterNextScene = (await User.get.registered(ctx.chat.id))
        ? mainMenu.enter
        : setAge.enter;

      // push to next scene
      return enterNextScene(ctx);
    } catch (e) {
      throw new Error(
        `Error in scene_push of <on_text> middleware of <height.setter> scene --> ${e.message}`
      );
    }
  }
);

scene.on("message", (ctx) => {
  return ctx.reply("Пожалуйста, введите свой рост числом");
});

// - - - - - - - - - - - - - - - - - - - - - - - - //

module.exports = {
  id: SCENE_ID,
  enter,
  middleware: scene,
};
