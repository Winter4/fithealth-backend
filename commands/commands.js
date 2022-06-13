const { Composer } = require("telegraf");

const commands = new Composer();

commands.use(require("./start.command"));
commands.use(require("./home.command"));

module.exports.middleware = commands;
