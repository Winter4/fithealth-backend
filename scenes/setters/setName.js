const { Scenes, Markup } = require('telegraf');

const composeWizardScene = require('../factory/factory').composeWizardScene;
const scenes = require('../scenes');
const text = require('../text');

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