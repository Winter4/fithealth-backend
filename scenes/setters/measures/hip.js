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

const setHipMeasureScene = composeWizardScene(
    ctx => {
        ctx.reply(`Введите обхват бёдер (${limits.min}-${limits.max} см):`, Markup.removeKeyboard());
        return ctx.wizard.next();
    },
    (ctx, done) => {
        try {
            if (ctx.message.text) {
                let data =  ctx.message.text;
                let length = Number.parseInt(ctx.message.text);

                // data.length > 3
                // if length == 4, then the value == 1000+, but it can't be
                if (Number.isNaN(data) || Number.isNaN(length) || data.length > 3) {
                    ctx.reply('Пожалуйста, введите обхват цифрами');
                    return;
                }
                else if (length < limits.min || length > limits.max) {
                    ctx.reply('Пожалуйста, введите корректный обхват');
                    return;
                }
                ctx.session.user.measures.hip = length;
                return done();
            }
            else {
                ctx.reply('Пожалуйста, введите обхват цифрами в текстовом формате');
                return;
            }
        } catch (e) {
            let newErr = new Error(`Error in <setters/hip> scene: ${e.message} \n`);
            ctx.logError(ctx, newErr, __dirname);
            throw newErr;
        }
    }
);

module.exports.scene = setHipMeasureScene;