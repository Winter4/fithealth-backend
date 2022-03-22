const { Markup } = require("telegraf");

const composeWizardScene = require('../factory/factory').composeWizardScene;

// ____________________________________________________________

// ATTENTION: if changing this, also change
//            same limits in models/user
// i couldn't make it run importing this const to the models/user
const limits = {
    min: 40,
    max: 200
};
module.exports.limits = limits;

// _________________________________________

const setTargetWeightScene = composeWizardScene(
    ctx => {
        ctx.replyWithHTML(`Введите <b><i>желаемый</i></b> вес числом (${limits.min}-${limits.max} кг):`, Markup.removeKeyboard());
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
            ctx.session.user.targetWeight = weight;
            return done();
        }
        else {
            ctx.reply('Пожалуйста, введите вес цифрами в текстовом формате');
            return;
        }
    }
);

module.exports.scene = setTargetWeightScene;