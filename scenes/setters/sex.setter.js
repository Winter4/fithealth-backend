const { Composer, Markup } = require("telegraf");
const User = require("../../services/user.service");

const scene = new Composer();

const setHeight = require("./height.setter");
const mainMenu = require("../menus/main/home.menu.main");
const SCENE_ID = "SET_SEX";

// - - - - - - - - - - - - - - - - - - - - - - - - //

const Sex = {
  male: "Мужской",
  female: "Женский",
};

const keyboard = Markup.keyboard([[Sex.male, Sex.female]]).resize();

// - - - - - - - - - - - - - - - - - - - - - - - - //

async function enter(ctx) {
  try {
    await User.set.state(ctx.chat.id, SCENE_ID);
    return ctx.reply("Выберите свой пол: ", keyboard);
  } catch (e) {
    throw new Error(
      `Error in <enter> middleware of <sex.setter> scene --> ${e.message}`
    );
  }
}

scene.hears(
  [Sex.male, Sex.female],

  // update data
  async (ctx, next) => {
    try {
      // get user id
      const userID = ctx.chat.id;

      // save new data
      await User.set.sex(userID, ctx.message.text);

      return next();
    } catch (e) {
      throw new Error(
        `Error in data_update of <hears> middleware of <sex.setter> scene --> ${e.message}`
      );
    }
  },

  // push to next scene
  async (ctx) => {
    try {
      // choose new scene to enter
      const enterNextScene = (await User.get.registered(ctx.chat.id))
        ? mainMenu.enter
        : setHeight.enter;

      // push to next scene
      return enterNextScene(ctx);
    } catch (e) {
      throw new Error(
        `Error in scene_push of <hears> middleware of <sex.setter> scene --> ${e.message}`
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
