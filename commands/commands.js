const { Composer } = require("telegraf");

const commands = new Composer();

commands.use(require("./start.command"));

module.exports.middleware = commands;
