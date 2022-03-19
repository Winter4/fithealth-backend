const { Scenes, Markup } = require('telegraf');

const composeWizardScene = require('../factory/factory').composeWizardScene;
const scenes = require('../scenes');
const db = require('../requires').database;

// ____________________________________________________________

const setNameScene = composeWizardScene(
    ctx => {
        ctx.reply('Введите своё имя: ', Markup.removeKeyboard());
        ctx.wizard.next();
    },
    async (ctx, done) => {
        if (ctx.message.text) {
            ctx.session.user.name = ctx.message.text;
            return done();
        }
        else {
            ctx.reply('Пожалуйста, введите своё имя');
            return;
        }
    }
)

module.exports = setNameScene;