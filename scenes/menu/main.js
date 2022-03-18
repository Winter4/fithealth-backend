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

const mainMenuScene = new Scenes.BaseScene(scenes.ID.menu.main);

mainMenuScene.enter(ctx => {
    ctx.reply('Главное меню', mainMenuKeyboard);
});

mainMenuScene.command('send', async ctx => {

    try {
    const newUser = new User({
        _id: ctx.session.user._id,
        name: ctx.session.user.name, 
        sex: ctx.session.user.sex, 
        age: ctx.session.user.age,
    });
    await newUser.save();
    } catch (e) {
        console.log('Error on saving user: ' + e);
    }

});

mainMenuScene.command('session', ctx => {
    ctx.reply(ctx.session);
});

mainMenuScene.on('message', ctx => {
    ctx.reply('Используйте клавиаутуру меню');
});

module.exports = mainMenuScene;