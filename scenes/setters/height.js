const { Scenes, Markup } = require("telegraf");

const composeWizardScene = require('../factory/factory').composeWizardScene;
const scenes = require('../scenes');

// ____________________________________________________________

const limits = {
    min: 120,
    max: 230
};
module.exports.limits = limits;

// ________________________________________

const setHeightScene = composeWizardScene(
    ctx => {
        ctx.reply('Введите свой рост числом (${limits.min}-${limits.max} см):', Markup.removeKeyboard());
        return ctx.wizard.next();
    },
    (ctx, done) => {
        if (ctx.message.text) {
            let data =  ctx.message.text;
            let height = Number.parseInt(ctx.message.text);

            // data.length > 3
            // if length == 4, then the value == 1000+, but it can't be
            if (Number.isNaN(data) || Number.isNaN(height) || data.length > 3) {
                ctx.reply('Пожалуйста, введите рост цифрами');
                return;
            }
            else if (height < limits.min || height > limits.max) {
                ctx.reply('Пожалуйста, введите корректный рост');
                return;
            }
            ctx.session.user.height = height;
            return done();
        }
        else {
            ctx.reply('Пожалуйста, введите рост цифрами в текстовом формате');
            return;
        }
    }
);

module.exports.scene = setHeightScene;