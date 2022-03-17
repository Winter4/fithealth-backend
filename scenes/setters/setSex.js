const {Scenes, Markup} = require('telegraf');

const composeWizardScene = require('../factory/factory').composeWizardScene;
const scenes = require('../scenes');

const Sex = {
    male: "Мужской",
    female: "Женский",
}
module.exports.sex = Sex;

// __________________________________

const sexKeyboard = Markup.keyboard(
    [
        Sex['male'],
        Sex['female'],
    ]
).oneTime().resize();

// __________________________________

const setSexScene = composeWizardScene(
    ctx => {
        ctx.reply('Выберите Ваш пол:', sexKeyboard);
        ctx.wizard.next();
    },
    async (ctx, done) => {
        if (ctx.message.text) {
            if (ctx.message.text == Sex.male) {
                ctx.session.user.sex = Sex.male;
            }
            else if (ctx.message.text == Sex.female) {
                ctx.session.user.sex = Sex.female;
            }
            else {
                ctx.reply('Пожалуйста, используйте клавиатуру');
                return;
            }
            await ctx.reply('Записал ваш пол как ' + ctx.session.user.sex.toLowerCase(), Markup.removeKeyboard());
            done();
        }
        else {
            ctx.reply('Пожалуйста, используйте клавиатуру');
            return;
        }
    }
)

module.exports.scene = setSexScene;
