const { Composer } = require("telegraf");

const finishScene = require("../scenes/finish.scene");

const commands = new Composer();

commands.on("message", (ctx, next) => {
  if (ctx.user.state === finishScene.id) {
    return finishScene.enter(ctx);
  }

  return next();
});

commands.use(require("./start.command"));
commands.use(require("./home.command"));

module.exports.middleware = commands;
