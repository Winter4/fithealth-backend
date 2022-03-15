const { Scenes, Markup, session } = require('telegraf');

const scenes = require('./scenes');
const text = require('../text');

const setNameScene = new Scenes.BaseScene(scenes.ID['setName']);

setNameScene.enter(ctx => {
    ctx.reply('Под каким именем хотите быть в системе?');
});

setNameScene.on('text', (ctx, next) => {
    ctx.reply(msg['text']);
});

setNameScene.on('message', ctx => {
    ctx.reply('Пожалуйста, введите своё имя');
});

module.exports = setNameScene;