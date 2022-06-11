const { Composer, Markup } = require("telegraf");
const User = require("../../services/user.service");

const scene = new Composer();

const mainMenu = require("../menus/main/home.menu.main");
const SCENE_ID = "SET_NAME";

// - - - - - - - - - - - - - - - - - - - - - - - - //

async function enter(ctx) {
  try {
    await User.set.state(ctx.chat.id, SCENE_ID);
    return ctx.reply("Введите своё имя: ", Markup.removeKeyboard());
  } catch (e) {
    throw new Error(
      `Error in <enter> middleware of <name.setter> scene --> ${e.message}`
    );
  }
}

scene.on("text", async (ctx) => {
  try {
    console.log("name setter ontext");
    // get user id
    const userID = ctx.chat.id;

    // save new data
    await User.set.name(userID, ctx.message.text);

    // choose new scene to enter
    const enterNextScene = (await User.registered(userID))
      ? mainMenu.enter
      : mainMenu.enter;
    return enterNextScene(ctx);
  } catch (e) {
    throw new Error(
      `Error in <on_text> middleware of <name.setter> scene --> ${e.message}`
    );
  }
});

module.exports = {
  id: SCENE_ID,
  enter,
  middleware: scene,
};
