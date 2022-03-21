const { Scenes, Markup } = require("telegraf");

const composeWizardScene = require('../factory/factory').composeWizardScene;
const scenes = require('../scenes');

// ____________________________________________________________

const setWeightScene = composeWizardScene(
    ctx => {
        ctx.reply('Введите свой вес числом (40 - 200 кг):', Markup.removeKeyboard());
        ctx.wizard.next();
    },
    async (ctx, done) => {
        if (ctx.message.text) {
            let data =  ctx.message.text;
            let weight = Number.parseInt(ctx.message.text);

            if (Number.isNaN(data) || Number.isNaN(weight) || data.length > 3) {
                ctx.reply('Пожалуйста, введите вес цифрами');
                return;
            }
            else if (weight < 40 || weight > 200) {
                ctx.reply('Пожалуйста, введите корректный вес');
                return;
            }
            ctx.session.user.weight = weight;
            done();
        }
        else {
            ctx.reply('Пожалуйста, введите вес цифрами в текстовом формате');
            return;
        }
    }
)

module.exports = setWeightScene;