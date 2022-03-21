const {Telegraf, Scenes, Markup, session} = require('telegraf');
const db = require('./database/database');

require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN);

// ______________________________________

const scenes = require('./scenes/scenes');
const stage = new Scenes.Stage([

    scenes.object.setter.name(scenes.id.setter.name, ctx => ctx.session.setConfig ? scenes.id.setter.sex : db.saveUserFromContext(ctx)),
    scenes.object.setter.sex(scenes.id.setter.sex, ctx => ctx.session.setConfig ? scenes.id.setter.weight : db.saveUserFromContext(ctx)),
    scenes.object.setter.weight(scenes.id.setter.weight, ctx => ctx.session.setConfig ? scenes.id.setter.height : db.saveUserFromContext(ctx)),
    scenes.object.setter.height(scenes.id.setter.height, ctx => ctx.session.setConfig ? scenes.id.setter.age : db.saveUserFromContext(ctx)),
    scenes.object.setter.age(scenes.id.setter.age, ctx => db.saveUserFromContext(ctx)),

    scenes.object.menu.main,
    scenes.object.menu.changeData,
]);

bot.use(session());
bot.use(stage.middleware());

// _______________________________________

bot.start(async ctx => {
    const userID = ctx.message.from.id;
    
    if (await db.userExists(userID)) {
        ctx.session.setConfig = false;
        ctx.scene.enter(scenes.id.menu.main);
    }
    else {
        ctx.session.setConfig = true;
        ctx.session.user = {
            name: undefined,
            sex: undefined,age: undefined,
            weight: undefined,
            height: undefined,
            age: undefined,
        }
        
        await ctx.reply(
            'Приветcтвую! Это Ваш первый шаг к приобретению тела мечты. ' +
            'Команда тренеров нашего приложения рада видеть Вас здесь и сделает все, ' + 
            'чтобы помочь достигнуть лучшего результата!'
        );

        ctx.scene.enter(scenes.id.setter.name);
    }
});

bot.catch((err, ctx) => {
    ctx.reply('Error: ' + err.message);
});

bot.launch().then(async () => await db.connect());