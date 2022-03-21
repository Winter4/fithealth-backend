const { Scenes, Markup } = require("telegraf");

const composeWizardScene = require('../factory/factory').composeWizardScene;
const scenes = require('../scenes');

// ____________________________________________________________

const setHeightScene = composeWizardScene(
    ctx => {
        ctx.reply('Введите свой рост числом (120 - 230 см):', Markup.removeKeyboard());
        ctx.wizard.next();
    },
    async (ctx, done) => {
        if (ctx.message.text) {
            let data =  ctx.message.text;
            let height = Number.parseInt(ctx.message.text);

            if (Number.isNaN(data) || Number.isNaN(height) || data.length > 3) {
                ctx.reply('Пожалуйста, введите рост цифрами');
                return;
            }
            else if (height < 120 || height > 230) {
                ctx.reply('Пожалуйста, введите корректный рост');
                return;
            }
            ctx.session.user.height = height;
            done();
        }
        else {
            ctx.reply('Пожалуйста, введите рост цифрами в текстовом формате');
            return;
        }
    }
)

module.exports = setHeightScene;