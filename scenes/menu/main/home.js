const { Scenes, Markup, session } = require("telegraf");

const scenes = require('../../scenes');
const db = require('../../../database/database');

// ______________________________________________

const keys = {
    makeReport: 'Сделать отчёт',
    mealPlan: 'План питания',
    info: 'Информация',
    myData: 'Мои данные',
    changeData: 'Изменить данные',
};

const keyboard = Markup.keyboard(
    [
        [ keys.makeReport ],
        [ keys.mealPlan, keys.info ],
        [ keys.myData, keys.changeData ],
    ]
).resize();

const inlineKeyboard = require('./info').inlineKeyboard;

// ____________________________________________________________

const mainMenuScene = new Scenes.BaseScene(scenes.id.menu.main);

mainMenuScene.enter(async ctx => {

    const userID = ctx.message.from.id;

    db.setUserState(userID, scenes.id.menu.main);
    
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

    text += `\n\nСтартовый вес: ${user.startWeight}`;
    text += `\nТекущий вес:  кг`;
    text += `\nБлижайшая цель:  кг`;
    text += `\nЖелаемый вес: ${user.targetWeight} кг`;

    return ctx.replyWithPhoto(
        { source: 'images/main-menu.jpg' },
        {
            caption: text,
            ...keyboard,
        },
    );
});

// ______________________________________________________________

mainMenuScene.hears(keys.mealPlan, ctx => {
    return ctx.reply('Meal plan test');
});

mainMenuScene.use(require('./info').composer);
mainMenuScene.hears(keys.info, ctx => {
    let text = '';
    text += '1️⃣ Как работать с приложением? \n\n';
    text += '2️⃣ Как составить завтрак? \n\n';
    text += '3️⃣ Как составить обед? \n\n';
    text += '4️⃣ Как составить ужин и перекус? \n\n';
    text += '5️⃣ Когда есть и как готовить? \n\n';
    text += '6️⃣ Как пить и что с овощами? \n\n';
    text += '7️⃣ Как делать отчет о питании и активности? \n\n';
    text += '8️⃣ Как делать повторные замеры? \n\n';
    text += '9️⃣ Как использовать читмил? \n\n';

    return ctx.reply(text, inlineKeyboard);
});

mainMenuScene.hears(keys.myData, async ctx => {

    const user = await db.getUserByID(ctx.from.id);
    return ctx.reply(
        `Имя: ${user.name}` + 
        `\nПол: ${user.sex}` + 
        `\nРост: ${user.height} см` + 
        `\nВозраст: ${user.age}` + 
        //`\nАктивность: ${user.activity}` + 
        '\nЗамеры (Г/Т/Б): ' + 
        `${user.measures.chest}/${user.measures.waist}/${user.measures.hip} см`
    );
});

mainMenuScene.hears(keys.changeData, ctx => {
    return ctx.scene.enter(scenes.id.menu.changeData.home);
});

mainMenuScene.on('message', ctx => {
    return ctx.reply('Используйте клавиаутуру меню');
});

// __________________________________________________

module.exports = mainMenuScene;