const { Scenes, Markup, session } = require("telegraf");

const User = require('../requires').models.user;
const scenes = require('../scenes');

// ______________________________________________

const mainMenuKeyboard = Markup.keyboard(
    [
        ['Сделать отчёт'],
        ['План питания', 'Информация'],
        ['Изменить данные'],
    ]
).resize();

// _______________________________________________

const mainMenuScene = new Scenes.BaseScene(scenes.id.menu.main);

mainMenuScene.enter(ctx => {
    ctx.reply('Главное меню', mainMenuKeyboard);
});

mainMenuScene.on('message', ctx => {
    ctx.reply('Используйте клавиаутуру меню');
});

module.exports = mainMenuScene;