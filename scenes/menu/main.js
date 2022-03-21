const { Scenes, Markup, session } = require("telegraf");

const User = require('../requires').models.user;
const scenes = require('../scenes');
const db = require('../requires').database;

// ______________________________________________

const keyboardText = {
    makeReport: 'Сделать отчёт',
    foodPlan: 'План питания',
    info: 'Информация',
    changeData: 'Изменить данные',
}

const mainMenuKeyboard = Markup.keyboard(
    [
        [keyboardText.makeReport],
        [keyboardText.foodPlan, keyboardText.info],
        [keyboardText.changeData],
    ]
).resize();

// _______________________________________________

const mainMenuScene = new Scenes.BaseScene(scenes.id.menu.main);

mainMenuScene.enter(async ctx => {

    const userID = ctx.message.from.id;
    let text = await db.getUserByID(userID);

    return ctx.reply('Главное меню \n' + text, mainMenuKeyboard);
});

mainMenuScene.hears(keyboardText.changeData, ctx => {
    return ctx.scene.enter(scenes.id.menu.changeData);
});

mainMenuScene.on('message', ctx => {
    return ctx.reply('Используйте клавиаутуру меню');
});

module.exports = mainMenuScene;