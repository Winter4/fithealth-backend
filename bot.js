const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const { Telegraf } = require('telegraf');
const bot = new Telegraf(process.env.BOT_TOKEN);

const log = require('./logger');

// - - - - - - - - - - - - - - - - - - - - - - - - //

// extend bot context
bot.context.log = msg => log.info(msg);

// log every new update
bot.use((ctx, next) => {
    log.info('New Update', { upd: ctx.update });
    return next();
});

// - - - - - - - - - - - - - - - - - - - - - - - - //

bot.on('message', ctx => {
  console.log('test');
  return ctx.reply(ctx.message.text, { reply_to_message_id: ctx.message.message_id });
});

// - - - - - - - - - - - - - - - - - - - - - - - - //

// set bot commands list
bot.telegram.setMyCommands([
    { command: '/home', description: 'takes you to the main menu'},
]);

bot.launch();
console.log('Bot started');