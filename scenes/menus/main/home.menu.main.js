const { Composer, Markup } = require("telegraf");
const User = require("../../../services/user.service");

const scene = new Composer();

// - - - - - - - - - - - - - - - - - - - - - - - - //

// Markup keyboard keys text
const keys = {
  makeReport: "📅 Сделать отчёт",
  mealPlan: "🥑 План питания",
  info: "❔ Справка",
  meals: "✏️ Изменить режим питания",
  data: "📃 Изменить данные",
};

// Markup keyboard keys iselves
const keyboard = Markup.keyboard([
  [keys.makeReport],
  [keys.mealPlan, keys.info],
  [keys.meals, keys.data],
]).resize();

const SCENE_ID = "MAIN_MENU";

// - - - - - - - - - - - - - - - - - - - - - - - - //

async function enter(ctx) {
  try {
    await User.set.state(ctx.chat.id, SCENE_ID);
    return ctx.reply("Entered main menu");
  } catch (e) {
    throw new Error(
      `Error in <enter> middleware of <main.menu> scene --> ${e.message}`
    );
  }
}

scene.on("message", (ctx) => {
  return ctx.reply("This is Main Menu");
});

module.exports = {
  id: SCENE_ID,
  enter,
  middleware: scene,
};
