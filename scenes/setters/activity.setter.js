const { Composer, Markup } = require("telegraf");
const User = require("../../services/user.service");

const scene = new Composer();

const setCurrentWeight = require("./weights/current.weight.setter");
const mainMenu = require("../menus/main/home.menu.main");
const SCENE_ID = "SET_ACTIVITY";

// - - - - - - - - - - - - - - - - - - - - - - - - //

const Activity = {
  zero: "1. Почти нет",
  low: "2. Небольшая",
  middle: "3. Умеренная",
  high: "4. Высокая",
};

const keyboard = Markup.keyboard([
  [Activity.zero, Activity.low],
  [Activity.middle, Activity.high],
]).resize();

// - - - - - - - - - - - - - - - - - - - - - - - - //

async function enter(ctx) {
  try {
    await User.set.state(ctx.chat.id, SCENE_ID);
    return ctx.reply(
      "Выберите Вашу активность: \n\n" +
        "1 - Почти нет активности - сидячий образ жизни, отсутствие тренировок \n" +
        "2 - Небольшая активность - малая физ. нагрузка, тренировки 1-3 раза/нед \n" +
        "3 - Умеренная активность - большая физ. нагрузка, тренировки  3-4 раза/нед \n" +
        "4 - Высокая активность - большая физ. нагрузка, тренировки 5-6 раз/нед",
      keyboard
    );
  } catch (e) {
    throw new Error(
      `Error in <enter> middleware of <activity.setter> scene --> ${e.message}`
    );
  }
}

scene.hears(
  [Activity.zero, Activity.low, Activity.middle, Activity.high],

  // update data
  async (ctx, next) => {
    try {
      // get user id
      const userID = ctx.chat.id;

      // generate number from the answer
      let activity = null;
      switch (ctx.message.text) {
        case Activity.zero:
          activity = 1.2;
          break;

        case Activity.low:
          activity = 1.375;
          break;

        case Activity.middle:
          activity = 1.55;
          break;

        case Activity.high:
          activity = 1.95;
          break;
      }

      // save new data
      await User.set.activity(userID, activity);

      return next();
    } catch (e) {
      throw new Error(
        `Error in data_update of <hears> middleware of <activity.setter> scene --> ${e.message}`
      );
    }
  },

  // push to next scene
  async (ctx) => {
    try {
      // choose new scene to enter
      const enterNextScene = (await User.get.registered(ctx.chat.id))
        ? mainMenu.enter
        : setCurrentWeight.enter;

      return enterNextScene(ctx);
    } catch (e) {
      throw new Error(
        `Error in scene_push of <hears> middleware of <activity.setter> scene --> ${e.message}`
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
