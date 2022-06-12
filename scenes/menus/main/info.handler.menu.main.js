const { Composer, Markup } = require("telegraf");

// - - - - - - - - - - - - - - - - - - - - - - - - //

const action = {
  one: "ACTION_1",
  two: "ACTION_2",
  three: "ACTION_3",
  four: "ACTION_4",
  five: "ACTION_5",
  six: "ACTION_6",
  seven: "ACTION_7",
};

const text = {
  one: "1️⃣",
  two: "2️⃣",
  three: "3️⃣",
  four: "4️⃣",
  five: "5️⃣",
  six: "6️⃣",
  seven: "7️⃣",
};

const keyboard = Markup.inlineKeyboard([
  [
    Markup.button.callback(text.one, action.one),
    Markup.button.callback(text.two, action.two),
    Markup.button.callback(text.three, action.three),
    Markup.button.callback(text.four, action.four),
  ],
  [
    Markup.button.callback(text.five, action.five),
    Markup.button.callback(text.six, action.six),
    Markup.button.callback(text.seven, action.seven),
  ],
]);
module.exports.infoKeyboard = keyboard;

// - - - - - - - - - - - - - - - - - - - - - - - - //

const info = new Composer();

info.action(action.one, (ctx) => {
  try {
    ctx.answerCbQuery();
    return ctx.reply("Видео");
  } catch (e) {
    throw new Error(
      `Error in <action_one> middleware of <main.menu> scene --> ${e.message}`
    );
  }
});

info.action(action.two, (ctx) => {
  try {
    ctx.answerCbQuery();
    return ctx.replyWithHTML(require("./info.text.menu.main").breakfast);
  } catch (e) {
    throw new Error(
      `Error in <action_two> middleware of <main.menu> scene --> ${e.message}`
    );
  }
});

info.action(action.three, (ctx) => {
  try {
    ctx.answerCbQuery();
    return ctx.replyWithHTML(require("./info.text.menu.main").dinner);
  } catch (e) {
    throw new Error(
      `Error in <action_three> middleware of <main.menu> scene --> ${e.message}`
    );
  }
});

info.action(action.four, (ctx) => {
  try {
    ctx.answerCbQuery();
    return ctx.replyWithHTML(require("./info.text.menu.main").supper);
  } catch (e) {
    throw new Error(
      `Error in <action_four> middleware of <main.menu> scene --> ${e.message}`
    );
  }
});

info.action(action.five, (ctx) => {
  try {
    ctx.answerCbQuery();
    return ctx.replyWithHTML(require("./info.text.menu.main").lunch);
  } catch (e) {
    throw new Error(
      `Error in <action_five> middleware of <main.menu> scene --> ${e.message}`
    );
  }
});

info.action(action.six, (ctx) => {
  try {
    ctx.answerCbQuery();
    return ctx.replyWithHTML(require("./info.text.menu.main").eatAndCook);
  } catch (e) {
    throw new Error(
      `Error in <action_six> middleware of <main.menu> scene --> ${e.message}`
    );
  }
});

info.action(action.seven, (ctx) => {
  try {
    ctx.answerCbQuery();
    return ctx.replyWithHTML(require("./info.text.menu.main").dringAndVeg);
  } catch (e) {
    throw new Error(
      `Error in <action_seven> middleware of <main.menu> scene --> ${e.message}`
    );
  }
});

module.exports.middleware = info;
