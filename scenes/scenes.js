const { Composer } = require("telegraf");

const mainMenu = require("./menus/main/home.menu.main");

const setName = require("./setters/name.setter");

// - - - - - - - - - - - - - - - - - - - - - - - - //

function route(ctx, state) {
  return ctx.user.state === state;
}

const scenes = new Composer();

// name setter middleware
scenes.use(
  Composer.optional((ctx) => route(ctx, setName.id), setName.middleware)
);

// main menu middleware
scenes.use(
  Composer.optional((ctx) => route(ctx, mainMenu.id), mainMenu.middleware)
);

module.exports.middleware = scenes;
