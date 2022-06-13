const { Composer, Markup } = require("telegraf");
const User = require("../../../services/user.service");

const scene = new Composer();

const setTargetWeight = require("./target.weight.setter");
const setChestMeasure = require("../measures/chest.measure.setter");
const mainMenu = require("../../menus/main/home.menu.main");

const SCENE_ID = "SET_CURRENT_WEIGHT";

// - - - - - - - - - - - - - - - - - - - - - - - - //

const Limits = {
  min: 40,
  max: 200,
};

// - - - - - - - - - - - - - - - - - - - - - - - - //

async function enter(ctx) {
  try {
    // update user state
    await User.set.state(ctx.chat.id, SCENE_ID);

    // enter message
    return ctx.replyWithHTML(
      `Введите свой <b><i>текущий</i></b> вес числом (${Limits.min}-${Limits.max} кг):`,
      Markup.removeKeyboard()
    );
  } catch (e) {
    throw new Error(
      `Error in <enter> middleware of <current.weight.setter> scene --> ${e.message}`
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
        return ctx.reply("Пожалуйста, введите свои данные числом");
      }

      // validate for limits
      const data = Number.parseInt(ctx.message.text);
      if (data < Limits.min || data > Limits.max) {
        return ctx.reply("Пожалуйста, введите число в указанном диапазоне");
      }

      return next();
    } catch (e) {
      throw new Error(
        `Error in validation of <on_text> middleware of <current.weight.setter> scene --> ${e.message}`
      );
    }
  },

  // update data on validation success
  async (ctx, next) => {
    try {
      // update data
      await User.set.weight.current(ctx.chat.id, ctx.message.text);

      // set start weight if it is
      if (!(await User.get.registered(ctx.chat.id))) {
        await User.set.weight.start(ctx.chat.id, ctx.message.text);
      }

      return next();
    } catch (e) {
      throw new Error(
        `Error in data_update of <on_text> middleware of <current.weight.setter> scene --> ${e.message}`
      );
    }
  },

  // push to next scene
  async (ctx) => {
    try {
      // choose new scene to enter
      let enterNextScene = (await User.get.registered(ctx.chat.id))
        ? mainMenu.enter
        : setTargetWeight.enter;

      // if it is checking in
      if (ctx.user.registered && !(await User.get.checkedIn(ctx.chat.id))) {
        enterNextScene = setChestMeasure.enter;
      }

      // push to next scene
      return enterNextScene(ctx);
    } catch (e) {
      throw new Error(
        `Error in scene_push of <on_text> middleware of <current.weight.setter> scene --> ${e.message}`
      );
    }
  }
);

scene.on("message", (ctx) => {
  return ctx.reply("Пожалуйста, введите текущий вес числом");
});

// - - - - - - - - - - - - - - - - - - - - - - - - //

module.exports = {
  id: SCENE_ID,
  enter,
  middleware: scene,
};
