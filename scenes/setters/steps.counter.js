const { Composer, Markup } = require("telegraf");
const User = require("../../services/user.service");

const scene = new Composer();

const mainMenu = require("../menus/main/home.menu.main");

const SCENE_ID = "SET_STEPS";

// - - - - - - - - - - - - - - - - - - - - - - - - //

const Limits = {
  min: 1,
  max: 100000,
};

// - - - - - - - - - - - - - - - - - - - - - - - - //

async function enter(ctx) {
  try {
    // update user state
    await User.set.state(ctx.chat.id, SCENE_ID);
    // reply
    return ctx.reply(
      `Введите количество шагов за сегодня (${Limits.min} - ${Limits.max}): `,
      Markup.removeKeyboard()
    );
  } catch (e) {
    throw new Error(
      `Error in <enter> middleware of <steps.counter> scene --> ${e.message}`
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
        return ctx.reply("Пожалуйста, введите количество шагов числом");
      }

      // validate for limits
      const data = Number.parseInt(ctx.message.text);
      if (data < Limits.min || data > Limits.max) {
        return ctx.reply("Пожалуйста, введите число в указанном диапазоне");
      }

      return next();
    } catch (e) {
      throw new Error(
        `Error in validation of <on_text> middleware of <steps.counter> scene --> ${e.message}`
      );
    }
  },

  // reply to user
  async (ctx, next) => {
    // reply
    try {
      const steps = Number.parseInt(ctx.message.text);

      if (steps < 10000) {
        await ctx.reply(
          "Количество шагов в день должно быть не менее 10000. Это способствует скорейшему достижению результата"
        );
      } else if (steps < 15000) {
        await ctx.reply(
          "Cтремитесь проходить в день 15000 шагов и вы сможете быстрее добиться результата"
        );
      } else {
        await ctx.reply(
          "Вы отлично поработали сегодня, продолжайте в том же духе!"
        );
      }

      return next();
    } catch (e) {
      throw new Error(
        `Error in data_update of <on_text> middleware of <steps.counter> scene --> ${e.message}`
      );
    }
  },

  // push to next scene
  async (ctx) => {
    try {
      console.log(mainMenu);
      // choose new scene to enter
      const enterNextScene = mainMenu.enter;

      // push to next scene
      return enterNextScene(ctx);
    } catch (e) {
      throw new Error(
        `Error in scene_push of <on_text> middleware of <steps.counter> scene --> ${e.message}`
      );
    }
  }
);

scene.on("message", (ctx) => {
  return ctx.reply("Пожалуйста, введите количество шагов");
});

// - - - - - - - - - - - - - - - - - - - - - - - - //

module.exports = {
  id: SCENE_ID,
  enter,
  middleware: scene,
};
