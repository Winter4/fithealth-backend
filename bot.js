const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const { Telegraf, Markup } = require("telegraf");
const bot = new Telegraf(process.env.BOT_TOKEN);
module.exports.bot = bot;

const log = require("./logger");
const User = require("./services/user.service");

// - - - - - - - - - - - - - - - - - - - - - - - - //

// extend bot context
bot.context.log = (msg) => log.info(msg);

// log every new update
bot.use((ctx, next) => {
  log.info("New Update", { upd: ctx.update });
  return next();
});

// - - - - - - - - - middlewares - - - - - - - - - - //

// extending context with user data
bot.use(async (ctx, next) => {
  ctx.user = await User.get.object(ctx.chat.id);
  return next();
});

// pay middleware
bot.use(require("./middlewares/pay.middleware"));

// checkin middleware
bot.use(require("./middlewares/checkin.middleware"));

// - - - - - - - - - - - - - - - - - - - - - - - - //

// commands
bot.use(require("./commands/commands").middleware);

// scenes
bot.use(require("./scenes/scenes").middleware);

// - - - - - - - - - - - - - - - - - - - - - - - - //

bot.catch((err, ctx) => {
  log.error(err.message, {
    updType: ctx.updateType,
    updID: ctx.update.update_id,
    chatID: ctx.chat.id,
    username: ctx.chat.username,
  });

  return ctx.telegram.sendMessage(
    process.env.ADMIN_CHAT_ID,
    `Ошибка 
        Update type: ${ctx.updateType} 
        Update ID: ${ctx.update.update_id}
        Chat ID: ${ctx.chat.id}
        Username: ${ctx.chat.username}
        Message: ${err.message} 
        Время: ${Date()}`
  );
});

// - - - - - - - - - - - - - - - - - - - - - - - - //

// set bot commands list
bot.telegram.setMyCommands([
  { command: "/home", description: "вернуться в главное меню" },
  {
    command: "/notify",
    description: "включить\\выключить ежедневные уведомления",
  },
]);

const db = require("./database/mongoose");
async function start() {
  await db.connect();

  bot.launch();
  console.log("Bot started");
}

start();
