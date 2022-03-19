const { Scenes, Markup } = require("telegraf");

const composeWizardScene = require('../factory/factory').composeWizardScene;
const scenes = require('../scenes');

// ____________________________________________________________

const setAgeScene = composeWizardScene(
    ctx => {
        ctx.reply('Введите свой возраст числом (13-100 лет):', Markup.removeKeyboard());
        ctx.wizard.next();
    },
    async (ctx, done) => {
        if (ctx.message.text) {
            let data =  ctx.message.text;
            let age = Number.parseInt(ctx.message.text);

            if (Number.isNaN(data) || Number.isNaN(age) || data.length > 3) {
                ctx.reply('Пожалуйста, введите возраст цифрами');
                return;
            }
            else if (age < 13 || age > 100) {
                ctx.reply('Пожалуйста, введите корректный возраст');
                return;
            }
            ctx.session.user.age = age;
            done();
        }
        else {
            ctx.reply('Пожалуйста, введите возраст цифрами в текстовом формате');
            return;
        }
    }
)

module.exports = setAgeScene;