const { Composer, Markup } = require("telegraf");

const mainMenu = require("../scenes/menus/main/home.menu.main");
const setCurrentWeight = require("../scenes/setters/weights/current.weight.setter");
const User = require("../services/user.service");

const middleware = new Composer();

// - - - - - - - - - - - - - - - - - - - - - - - - //

const ACTION = "CHECK_IN_ACTION";

const keyboard = Markup.inlineKeyboard([
  Markup.button.callback("Обновить данные", ACTION),
]);

// handling checkin action
middleware.action(ACTION, async (ctx) => {
  ctx.answerCbQuery();

  return setCurrentWeight.enter(ctx);
});

middleware.on("message", async (ctx, next) => {
  await next();

  if (ctx.user.registered && !(await User.get.checkedIn(ctx.chat.id))) {
    if ((await User.get.state(ctx.chat.id)) === mainMenu.id) {
      return ctx.reply(
        "Мы хотим проверить Ваши результаты за неделю. Укажите свой текущий вес и замеры",
        keyboard
      );
    }
  }
});

// - - - - - - - - - - - - - - - - - - - - - - - - //

module.exports = middleware;
