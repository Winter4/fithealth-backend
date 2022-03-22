const { Scenes, Markup } = require('telegraf');

const composeWizardScene = require('../factory/factory').composeWizardScene;

// ____________________________________________________________

const setNameScene = composeWizardScene(
    ctx => {
        ctx.reply('Введите своё имя: ', Markup.removeKeyboard());
        return ctx.wizard.next();
    },
    (ctx, done) => {
        if (ctx.message.text) {
            ctx.session.user.name = ctx.message.text;
            return done();
        }
        else {
            ctx.reply('Пожалуйста, введите своё имя');
            return;
        }
    }
);

module.exports = setNameScene;