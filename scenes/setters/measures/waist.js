const { Markup } = require("telegraf");

const composeWizardScene = require('../../factory/factory').composeWizardScene;

// ____________________________________________________________

// ATTENTION: if changing this, also change
//            same limits in models/user
// i couldn't make it run importing this const to the models/user
const limits = {
    min: 20,
    max: 200
};
module.exports.limits = limits;

// _________________________________________

const setWaistMeasureScene = composeWizardScene(
    ctx => {
        ctx.reply(`Введите длину окружности талии (${limits.min}-${limits.max} см):`, Markup.removeKeyboard());
        return ctx.wizard.next();
    },
    (ctx, done) => {
        if (ctx.message.text) {
            let data =  ctx.message.text;
            let length = Number.parseInt(ctx.message.text);

            // data.length > 3
            // if length == 4, then the value == 1000+, but it can't be
            if (Number.isNaN(data) || Number.isNaN(length) || data.length > 3) {
                ctx.reply('Пожалуйста, введите длину цифрами');
                return;
            }
            else if (length < limits.min || length > limits.max) {
                ctx.reply('Пожалуйста, введите корректную длину');
                return;
            }
            ctx.session.user.measures.waist = length;
            return done();
        }
        else {
            ctx.reply('Пожалуйста, введите вес цифрами в текстовом формате');
            return;
        }
    }
);

module.exports.scene = setWaistMeasureScene;