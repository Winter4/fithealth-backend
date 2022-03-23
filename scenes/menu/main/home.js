const { Scenes, Markup, session } = require("telegraf");

const scenes = require('../../scenes');
const db = require('../../../database/database');

// ______________________________________________

const keys = {
    makeReport: 'Сделать отчёт',
    mealPlan: 'План питания',
    info: 'Информация',
    changeData: 'Изменить данные',
};

const keyboard = Markup.keyboard(
    [
        [keys.makeReport],
        [keys.mealPlan, keys.info],
        [keys.changeData],
    ]
).resize();

const inlineKeyboard = require('./info').inlineKeyboard;

// ____________________________________________________________

const mainMenuScene = new Scenes.BaseScene(scenes.id.menu.main);

mainMenuScene.enter(async ctx => {

    const userID = ctx.message.from.id;
    const user = await db.getUserByID(userID);
    
    let text = 'Приветствую, ' + user.name + '!';
    let today = new Date();
    let days = [
        'воскресенье',
        'понедельник',
        'вторник',
        'среда',
        'четверг',
        'пятница',
        'суббота',
    ]
    text += '\nСегодня ' + days[today.getDay()];
    text += '\nМы верим, что у тебя всё получится! \nВсё твоих в руках, не сдавайся!';

    text += '\n\nСтартовый вес: ' + user.startWeight;
    text += '\nТекущий вес: ';
    text += '\nБлижайшая цель: ';
    text += '\nЖелаемый вес: ' + user.targetWeight;

    return ctx.reply(text, keyboard);
});

// ______________________________________________________________

mainMenuScene.hears(keys.mealPlan, ctx => {
    return ctx.reply('Meal plan test');
});

mainMenuScene.use(require('./info').composer);
mainMenuScene.hears(keys.info, ctx => {
    return ctx.reply('Inline: press the 1st btn', inlineKeyboard);
});

mainMenuScene.hears(keys.changeData, ctx => {
    return ctx.scene.enter(scenes.id.menu.changeData.home);
});

mainMenuScene.on('message', ctx => {
    return ctx.reply('Используйте клавиаутуру меню');
});

// __________________________________________________

module.exports = mainMenuScene;