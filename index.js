const {Telegraf, Scenes, Markup, session} = require('telegraf');
const db = require('./database/database');

require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN);

// ______________________________________

const scenes = require('./scenes/scenes');
const stage = new Scenes.Stage([
    scenes.object.welcome(scenes.id.welcome, ctx => ctx.session.setConfig ? scenes.id.setter.setName : scenes.id.menu.main),
    scenes.object.setter.setName(scenes.id.setter.setName, ctx => ctx.session.setConfig ? scenes.id.setter.setSex : scenes.id.database),
    scenes.object.setter.setSex(scenes.id.setter.setSex, ctx => ctx.session.setConfig ? scenes.id.setter.setAge : scenes.id.database),
    scenes.object.setter.setAge(scenes.id.setter.setAge, ctx => scenes.id.database),

    scenes.object.database,
    scenes.object.menu.main,
]);

bot.use(session());
bot.use(stage.middleware());

// _______________________________________

bot.start(ctx => {
    db.connect();

    ctx.session.user = {
        _id: ctx.message.from.id,
        name: null,
        sex: null,
        age: null,
    }
    ctx.session.setConfig = null;
    ctx.scene.enter(scenes.id.welcome);
});

bot.catch((err, ctx) => {
    ctx.reply('Error: ' + err);
});

bot.launch();
