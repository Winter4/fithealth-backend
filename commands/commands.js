const { Composer } = require("telegraf");

const finishScene = require("../scenes/finish.scene");

const commands = new Composer();

commands.command(["start", "home", "notify"], (ctx, next) => {
  try {
    if (ctx.user && ctx.user.state === finishScene.id) {
      return finishScene.enter(ctx);
    }

    if (ctx.user && !ctx.user.registered) {
      return ctx.reply("Вы не завершили регистрацию");
    }

    return next();
  } catch (e) {
    throw new Error(
      `Error in <command_*> middleware of <commands> --> ${e.message}`
    );
  }
});

commands.use(require("./start.command"));
commands.use(require("./home.command"));
commands.use(require("./notify.command"));

module.exports.middleware = commands;
