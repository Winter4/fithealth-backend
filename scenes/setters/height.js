const { Scenes, Markup } = require("telegraf");

const composeWizardScene = require('../factory/factory').composeWizardScene;

// ____________________________________________________________

// ATTENTION: if changing this, also change
//            same limits in models/user
// i couldn't make it run importing this const to the models/user
const limits = {
    min: 120,
    max: 230
};
module.exports.limits = limits;

// ________________________________________

const setHeightScene = composeWizardScene(
    ctx => {
        ctx.reply(`Введите свой рост числом (${limits.min}-${limits.max} см):`, Markup.removeKeyboard());
        return ctx.wizard.next();
    },
    (ctx, done) => {
        try {
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
        } catch (e) {
            let newErr = new Error(`Error in <setters/height> scene: ${e.message} \n`);
            ctx.logError(ctx, newErr, __dirname);
            throw newErr;
        }
    }
);

module.exports.scene = setHeightScene;