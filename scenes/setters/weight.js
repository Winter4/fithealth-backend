const { Scenes, Markup } = require("telegraf");

const composeWizardScene = require('../factory/factory').composeWizardScene;
const scenes = require('../scenes');

// ____________________________________________________________

const limits = {
    min: 40,
    max: 200
};
module.exports.limits = limits;

// _________________________________________

const setWeightScene = composeWizardScene(
    ctx => {
        ctx.reply('Введите свой вес числом (${limits.min}-${limits.max} кг):', Markup.removeKeyboard());
        return ctx.wizard.next();
    },
    (ctx, done) => {
        if (ctx.message.text) {
            let data =  ctx.message.text;
            let weight = Number.parseInt(ctx.message.text);

            // data.length > 3
            // if length == 4, then the value == 1000+, but it can't be
            if (Number.isNaN(data) || Number.isNaN(weight) || data.length > 3) {
                ctx.reply('Пожалуйста, введите вес цифрами');
                return;
            }
            else if (weight < limits.min || weight > limits.max) {
                ctx.reply('Пожалуйста, введите корректный вес');
                return;
            }
            ctx.session.user.weight = weight;
            return done();
        }
        else {
            ctx.reply('Пожалуйста, введите вес цифрами в текстовом формате');
            return;
        }
    }
);

module.exports.scene = setWeightScene;