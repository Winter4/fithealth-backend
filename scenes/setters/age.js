const { Scenes, Markup } = require("telegraf");

const composeWizardScene = require('../factory/factory').composeWizardScene;

// ____________________________________________________________

// ATTENTION: if changing this, also change
//            same limits in models/user
// i couldn't make it run importing this const to the models/user
const limits = {
    min: 13,
    max: 80
};
module.exports.limits = limits;

// _______________________________________

const setAgeScene = composeWizardScene(
    ctx => {
        ctx.reply(`Введите свой возраст числом (${limits.min}-${limits.max} лет):`, Markup.removeKeyboard());
        return ctx.wizard.next();
    },
    (ctx, done) => {
        try {
            if (ctx.message.text) {
                let data =  ctx.message.text;
                let age = Number.parseInt(ctx.message.text);
    
                // data.length > 3
                // if length == 4, then the value == 1000+, but it can't be
                if (Number.isNaN(data) || Number.isNaN(age) || data.length > 3) {
                    ctx.reply('Пожалуйста, введите возраст цифрами');
                    return;
                }
                else if (age < limits.min || age > limits.max) {
                    ctx.reply('Пожалуйста, введите корректный возраст');
                    return;
                }
                ctx.session.user.age = age;
                return done();
            }
            else {
                ctx.reply('Пожалуйста, введите возраст цифрами в текстовом формате');
                return;
            }
        } catch (e) {
            let newErr = new Error(`Error in <setters/age> scene: ${e.message} \n`);
            ctx.logError(ctx, newErr, __dirname);
            throw newErr;
        }
    }
);

module.exports.scene = setAgeScene;