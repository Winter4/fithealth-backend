const {Telegraf, Scenes, Markup, session} = require('telegraf');
const { Stage } = require('telegraf');
require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN);

// ______________________________________

const scenes = require('./scenes/scenes');
const welcomeStage = new Scenes.Stage([
    scenes.Object.welcome(scenes.ID.welcome, ctx => ctx.session.setConfig ? scenes.ID.setName : ctx.scene.leave()),
    scenes.Object.setName(scenes.ID.setName, ctx => ctx.session.setConfig ? scenes.ID.setSex : ctx.scene.leave()),
    scenes.Object.setSex(scenes.ID.setSex, ctx => ctx.session.setConfig ? scenes.ID.setAge : ctx.scene.leave()),
    scenes.Object.setAge(scenes.ID.setAge, ctx => ctx.scene.leave()),
]);

bot.use(session());
bot.use(welcomeStage.middleware());

// _______________________________________

bot.start(ctx => {
    ctx.session.user = {
        name: null,
        sex: null,
        age: null,
    }
    ctx.session.setConfig = null;
    ctx.scene.enter(scenes.ID.welcome);
});

bot.help(ctx => {
    ctx.reply('help');
});

bot.command('session', ctx => {
    ctx.reply(ctx.session);
});

bot.on('message', ctx => {
    ctx.reply('I\'m in main');
});

bot.catch((err, ctx) => {
    ctx.reply('Error: ' + err);
});

bot.launch();
