const { Scenes } = require("telegraf");

const composeWizardScene = require('./sceneFactory/sceneFactory').composeWizardScene;
const scenes = require('./scenes');

// ________________________________________________________

/*
const setAgeScene = new Scenes.BaseScene(scenes.ID.setAge);

setAgeScene.enter(ctx => {
    ctx.reply('Пожалуйста, введите свой возраст числом:');
});

setAgeScene.on('text', (ctx, next) => {
    let text = Number(ctx.message.text);
    ctx.reply(text);
});
*/

const setAgeScene = composeWizardScene(
    ctx => {
        ctx.reply('Введите свой возраст числом (13-100 лет):');
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
            await ctx.reply('Записал Ваш возраст как ' + ctx.session.user.age);
            done();
        }
        else {
            ctx.reply('Пожалуйста, введите возраст цифрами в текстовом формате');
            return;
        }
    }
)

module.exports = setAgeScene;