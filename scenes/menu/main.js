const { Scenes, Markup, session } = require("telegraf");

const db = require('../scenes').db;
const scenes = require('../scenes');

// ______________________________________________

const mainMenuKeyboard = Markup.keyboard(
    [
        ['Сделать отчёт'],
        ['План питания', 'Информация'],
        ['Изменить данные'],
    ]
).resize();

const mainMenuScene = new Scenes.BaseScene(scenes.ID.menu.main);

mainMenuScene.enter(ctx => {
    ctx.reply('Главное меню', mainMenuKeyboard);
});

mainMenuScene.command('send', async ctx => {
    await db.sendUser(ctx.session.user.name, ctx.session.user.sex, ctx.session.user.age)
    ctx.reply('Записал в базу');
});

mainMenuScene.command('session', ctx => {
    ctx.reply(ctx.session);
});

mainMenuScene.on('message', ctx => {
    ctx.reply('Используйте клавиаутуру меню');
});

module.exports = mainMenuScene;