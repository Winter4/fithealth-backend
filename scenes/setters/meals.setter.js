const { Composer, Markup } = require("telegraf");
const User = require("../../services/user.service");

const scene = new Composer();

const mainMenu = require("../menus/main/home.menu.main");
const SCENE_ID = "SET_MEALS";

// - - - - - - - - - - - - - - - - - - - - - - - - //

const Meals = {
  three: "3 раза в день (завтрак, обед, ужин)",
  four: "4 раза в день (завтрак, перекус, обед, ужин)",
  five: "5 раз в день (завтрак, перекус 1, обед, перекус 2, ужин)",
};

const keyboard = Markup.keyboard([
  Meals.three,
  Meals.four,
  Meals.five,
]).resize();

// - - - - - - - - - - - - - - - - - - - - - - - - //

async function enter(ctx) {
  try {
    await User.set.state(ctx.chat.id, SCENE_ID);
    return ctx.reply("Выберите режим питания: ", keyboard);
  } catch (e) {
    throw new Error(
      `Error in <enter> middleware of <meals.setter> scene --> ${e.message}`
    );
  }
}

scene.hears(
  [Meals.three, Meals.four, Meals.five],

  // update data
  async (ctx, next) => {
    try {
      // generate number from the answer
      let meals = null;
      switch (ctx.message.text) {
        case Meals.three:
          meals = 3;
          break;

        case Meals.four:
          meals = 4;
          break;

        case Meals.five:
          meals = 5;
          break;
      }

      // get user id
      const userID = ctx.chat.id;

      // save new data
      await User.set.meals(userID, meals);
      await User.set.registered(userID, true);

      return next();
    } catch (e) {
      throw new Error(
        `Error in data_update of <hears> middleware of <meals.setter> scene --> ${e.message}`
      );
    }
  },

  // push to next scene
  async (ctx) => {
    try {
      // choose new scene to enter
      const enterNextScene = mainMenu.enter;

      // push to next scene
      return enterNextScene(ctx);
    } catch (e) {
      throw new Error(
        `Error in scene_push of <hears> middleware of <meals.setter> scene --> ${e.message}`
      );
    }
  }
);

scene.on("message", (ctx) => {
  return ctx.reply("Пожалуйста, используйте клавиатуру");
});

// - - - - - - - - - - - - - - - - - - - - - - - - //

module.exports = {
  id: SCENE_ID,
  enter,
  middleware: scene,
};
