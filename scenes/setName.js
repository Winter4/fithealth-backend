const { Scenes, Markup } = require('telegraf');

const composeWizardScene = require('./sceneFactory/sceneFactory').composeWizardScene;
const scenes = require('./scenes');
const text = require('../text');

// ____________________________________________________________

/*
const setNameScene = new Scenes.BaseScene(scenes.ID['setName']);

setNameScene.enter(ctx => {
    ctx.reply('Под каким именем хотите быть в системе?');
});

setNameScene.on('text', ctx => {
    ctx.session.user.name = ctx.message['text'];
    ctx.reply(ctx.session.user.name);
    ctx.scene.leave();
});

setNameScene.on('message', ctx => {
    ctx.reply('Пожалуйста, введите своё имя');
});
*/

// ____________________________________________________________

const setNameScene = composeWizardScene(
    ctx => {
        ctx.reply('Введите своё имя: ');
        ctx.wizard.next();
    },
    async (ctx, done) => {
        if (ctx.message.text) {
            ctx.session.user.name = ctx.message.text;
            await ctx.reply('Записал Ваше имя как ' + ctx.session.user.name);
            return done();
        }
        else {
            ctx.reply('Пожалуйста, введите своё имя');
            return;
        }
    }
)

module.exports = setNameScene;