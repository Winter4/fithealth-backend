const { Composer, Markup } = require("telegraf");

const User = require("../../../services/user.service");

const scene = new Composer();

const SCENE_ID = "CHANGE_DATA_MENU";
module.exports.id = SCENE_ID;

// - - - - - - - - - - - - - - - - - - - - - - - - //

// Markup keyboard keys text
const keys = {
  name: "🗣 Имя",
  sex: "🚻 Пол",
  height: "👤 Рост",
  age: "📆 Возраст",
  activity: "📈 Активность",

  back: "🔙 Назад",
};

// Markup keyboard keys iselves
const keyboard = Markup.keyboard([
  [keys.name, keys.sex, keys.activity],
  [keys.age, keys.height],
  [keys.back],
]).resize();

// - - - - - - - - - - - - - - - - - - - - - - - - //

module.exports.enter = async (ctx) => {
  try {
    // update state
    await User.set.state(ctx.chat.id, SCENE_ID);

    // reply
    return ctx.reply("Выберите параметр, который хотите изменить:", keyboard);
  } catch (e) {
    throw new Error(
      `Error in <enter> middleware of <change-data.menu> scene --> ${e.message}`
    );
  }
};

// - - - - - - - - - - - - - - - - - - - - - - - - //

const setName = require("../../setters/name.setter");
scene.hears(keys.name, (ctx) => {
  return setName.enter(ctx);
});

const setSex = require("../../setters/sex.setter");
scene.hears(keys.sex, (ctx) => {
  return setSex.enter(ctx);
});

const setHeight = require("../../setters/height.setter");
scene.hears(keys.height, (ctx) => {
  return setHeight.enter(ctx);
});

const setAge = require("../../setters/age.setter");
scene.hears(keys.age, (ctx) => {
  return setAge.enter(ctx);
});

const setActivity = require("../../setters/activity.setter");
scene.hears(keys.activity, (ctx) => {
  return setActivity.enter(ctx);
});

const mainMenu = require("../main/home.menu.main");
scene.hears(keys.back, (ctx) => {
  return mainMenu.enter(ctx);
});

// - - - - - - - - - - - - - - - - - - - - - - - - //

module.exports.middleware = scene;
