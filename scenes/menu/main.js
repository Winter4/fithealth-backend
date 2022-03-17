const { Scenes, Markup } = require("telegraf");

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

mainMenuScene.on('message', ctx => {
    ctx.reply('Используйте клавиаутуру меню');
});

module.exports = mainMenuScene;