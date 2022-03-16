const {Scenes, Markup} = require('telegraf');

const composeWizardScene = require('./sceneFactory/sceneFactory').composeWizardScene;
const scenes = require('./scenes');
const text = require('../text');

const choice = {
    'now':   "Внести сейчас",
    'later': "Внести позже"  
}

// _______________________________________________________________

const welcomeKeyboard = Markup.keyboard(
    [
        choice.now, choice.later
    ]
).oneTime().resize();

const welcomeScene = composeWizardScene(
    async ctx => {
        await ctx.reply(text.greet);
        ctx.reply(text.wannaSetConfig, welcomeKeyboard);
        return ctx.wizard.next();
    },
    async (ctx, done) => {
        let answer = '';
        if (ctx.message.text == choice.now) {
            ctx.session.setConfig = true;
            answer = 'Отлично! Давайте приступим';
        } 
        else if (ctx.message.text == choice.later) {
            ctx.session.setConfig = false;
            answer = 'Как скажете. Перехожу в главное меню..';
        }
        else {
            ctx.reply('Пожалуйста, используйте клавиатуру');
            return;
        }
        await ctx.reply(answer, Markup.removeKeyboard());
        return done();
    }
);

module.exports = welcomeScene;