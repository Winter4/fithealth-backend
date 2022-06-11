const { Composer } = require("telegraf");

const User = require("../services/user.service");

const mainMenu = require("../scenes/menus/main/home.menu.main");
const setName = require("../scenes/setters/name.setter");

const command = new Composer();

// - - - - - - - - - - - - - - - - - - - - - - - - //

command.start(async (ctx) => {
  try {
    // if new user, push him to auth chain
    if (!ctx.user) {
      // insert a record
      await User.create(ctx.chat.id, ctx.chat.username);

      // send greet msg
      await ctx.reply(
        "Приветcтвую! Это Ваш первый шаг к приобретению тела мечты. " +
          "Команда тренеров нашего приложения рада видеть Вас здесь и сделает все, " +
          "чтобы помочь достигнуть лучшего результата!"
      );

      // push to scene
      return setName.enter(ctx);
    }

    // if user exists, push him to main menu
    return mainMenu.enter(ctx);
  } catch (e) {
    throw new Error(`Error in <start> command --> ${e.message}`);
  }
});

module.exports = command;
