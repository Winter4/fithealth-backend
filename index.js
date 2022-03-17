const {Telegraf, Scenes, Markup, session} = require('telegraf');
const { Stage } = require('telegraf');
require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN);

// ______________________________________

const scenes = require('./scenes/scenes');
const stage = new Scenes.Stage([
    scenes.Object.welcome(scenes.ID.welcome, ctx => ctx.session.setConfig ? scenes.ID.setter.setName : ctx.scene.enter(scenes.ID.menu.main)),
    scenes.Object.setter.setName(scenes.ID.setter.setName, ctx => ctx.session.setConfig ? scenes.ID.setter.setSex : ctx.scene.enter(scenes.ID.menu.main)),
    scenes.Object.setter.setSex(scenes.ID.setter.setSex, ctx => ctx.session.setConfig ? scenes.ID.setter.setAge : ctx.scene.enter(scenes.ID.menu.main)),
    scenes.Object.setter.setAge(scenes.ID.setter.setAge, ctx => ctx.scene.enter(scenes.ID.menu.main)),

    scenes.Object.menu.main
]);

bot.use(session());
bot.use(stage.middleware());

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

bot.catch((err, ctx) => {
    ctx.reply('Error: ' + err);
});

bot.launch();
