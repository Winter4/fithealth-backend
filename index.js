const {Telegraf, Scenes, Markup, session} = require('telegraf');
require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN);

const scenes = require('./scenes/scenes');
const stage = new Scenes.Stage([
    scenes.Object['wannaSet'], 
    scenes.Object['setName'],
    scenes.Object['setSex'],
    //scenes.Object['setAge'],
]);

bot.use(session());
bot.use(stage.middleware());

// _______________________________________

bot.start(ctx => {
   ctx.scene.enter(scenes.ID['wannaSet']); 
});

bot.help(ctx => {
    ctx.reply('help');
});

bot.on('message', ctx => {
    ctx.reply('I\'m in main');
});

bot.launch();
