const { Composer } = require("telegraf");

const mainMenu = require("../scenes/menus/main/home.menu.main");

const command = new Composer();

// - - - - - - - - - - - - - - - - - - - - - - - - //

command.command("home", async (ctx) => {
  try {
    return mainMenu.enter(ctx);
  } catch (e) {
    throw new Error(`Error in <home> command --> ${e.message}`);
  }
});

module.exports = command;
