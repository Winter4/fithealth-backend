const {Scenes, Markup} = require('telegraf');

const composeWizardScene = require('../factory/factory').composeWizardScene;

// _________________________________

// ATTENTION: if changing this, also change
//            same enum in models/user
// i couldn't make it run importing this to the models/user
const Sex = {
    male: "Мужской",
    female: "Женский",
};

// __________________________________

const sexKeyboard = Markup.keyboard(
    [
        Sex.male,
        Sex.female,
    ]
).resize();

// __________________________________

const setSexScene = composeWizardScene(
    ctx => {
        ctx.reply('Выберите Ваш пол:', sexKeyboard);
        return ctx.wizard.next();
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
            return done();
        }
        else {
            ctx.reply('Пожалуйста, используйте клавиатуру');
            return;
        }
    }
);

module.exports = setSexScene;
