const {Scenes, Markup} = require('telegraf');

const composeWizardScene = require('./sceneFactory/sceneFactory').composeWizardScene;
const scenes = require('./scenes');

const Sex = {
    'male': "Мужской",
    'female': "Женский",
}
module.exports.sex = Sex;

// __________________________________


const sexKeyboard = Markup.keyboard(
    [
        Sex['male'],
        Sex['female'],
    ]
).oneTime().resize();

/*
const setSexScene = new Scenes.BaseScene(scenes.ID['setSex']);

setSexScene.enter(ctx => {
    ctx.reply('Выберите Ваш пол:', sexKeyboard);
});

setSexScene.hears(Sex['male'], ctx => {
    ctx.session.user.sex = Sex['male'];
    ctx.reply(ctx.session.user.sex);
    ctx.scene.leave();
});

setSexScene.hears(Sex['female'], ctx => {
    ctx.session.user.sex = Sex['female'];
    ctx.scene.leave();
});

setSexScene.on('message', ctx => {
    ctx.reply('Пожалуйста, используйте клавиатуру, или введите свой пол так, как это написано на кнопках');
});
*/

// _________________________________________________

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
