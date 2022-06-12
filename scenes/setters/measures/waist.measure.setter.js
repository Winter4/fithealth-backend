const { Composer, Markup } = require("telegraf");
const User = require("../../../services/user.service");

const scene = new Composer();

const setHipMeasure = require("./hip.measure.setter");
const mainMenu = require("../../menus/main/home.menu.main");

const SCENE_ID = "SET_WAIST_MEASURE";

// - - - - - - - - - - - - - - - - - - - - - - - - //

const Limits = {
  min: 20,
  max: 200,
};

// - - - - - - - - - - - - - - - - - - - - - - - - //

async function enter(ctx) {
  try {
    // get user ID
    const userID = ctx.chat.id;

    // update user state
    await User.set.state(userID, SCENE_ID);

    // get user object
    const user = await User.get.object(userID);

    // choose the picture
    const photo =
      user.sex === "Мужской" ? "man-measures.jpg" : "woman-measures.jpg";
    const photoSource = process.env.IMAGES_DIR + photo;

    // reply
    return ctx.replyWithPhoto(
      { source: photoSource },
      {
        caption: `Введите обхват талии (${Limits.min}-${Limits.max} см):`,
        keyboard: Markup.removeKeyboard(),
      }
    );
  } catch (e) {
    throw new Error(
      `Error in <enter> middleware of <waist.measure.setter> scene --> ${e.message}`
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
        `Error in validation of <on_text> middleware of <waist.measure.setter> scene --> ${e.message}`
      );
    }
  },

  // update data on validation success
  async (ctx, next) => {
    try {
      // update data
      await User.set.measure.waist(ctx.chat.id, ctx.message.text);

      return next();
    } catch (e) {
      throw new Error(
        `Error in data_update of <on_text> middleware of <waist.measure.setter> scene --> ${e.message}`
      );
    }
  },

  // push to next scene
  async (ctx) => {
    try {
      // choose new scene to enter
      const enterNextScene = (await User.get.registered(ctx.chat.id))
        ? mainMenu.enter
        : setHipMeasure.enter;

      // push to next scene
      return enterNextScene(ctx);
    } catch (e) {
      throw new Error(
        `Error in scene_push of <on_text> middleware of <waist.measure.setter> scene --> ${e.message}`
      );
    }
  }
);

scene.on("message", (ctx) => {
  return ctx.reply("Пожалуйста, ввеедите свои данные числом");
});

// - - - - - - - - - - - - - - - - - - - - - - - - //

module.exports = {
  id: SCENE_ID,
  enter,
  middleware: scene,
};
