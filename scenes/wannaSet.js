const {Scenes, Markup} = require('telegraf');

const scenes = require('./scenes');
const text = require('../text');

const choice = {
    'now':   "Внести сейчас",
    'later': "Внести позже"  
}

// _______________________________________________________________

const wannaSetKeyboard = Markup.keyboard(
    [
        choice['now'], choice['later']
    ]
).resize();

const wannaSetScene = new Scenes.BaseScene(scenes.ID['wannaSet']);

wannaSetScene.enter(async ctx => {
    await ctx.reply(text.greet);
    ctx.reply(text.wannaSetConfig, wannaSetKeyboard);
});

wannaSetScene.hears(choice['now'], async ctx => {

    await ctx.reply('Отлично! Давайте приступим', Markup.removeKeyboard());
    // returns the function
    require('./setConfig')(ctx);

    return ctx.scene.leave();
});

wannaSetScene.hears(choice['later'], ctx => {
    return ctx.scene.leave();
});

wannaSetScene.on('message', ctx => {
    ctx.reply('Пожалуйста, используйте клавиатуру');
});

module.exports = wannaSetScene;