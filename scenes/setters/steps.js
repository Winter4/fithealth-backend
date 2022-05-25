const { Scenes, Markup } = require("telegraf");

const db = require('../../database/database');
const scenes = require('../scenes')

// ____________________________________________________________

const limits = {
    min: 1,
    max: 100000,
};

// _______________________________________

const scene = new Scenes.BaseScene(scenes.id.setter.steps);

scene.enter(ctx => {
    try {
        // if the bot was rebooted and the session is now empty
        if (ctx.session.recoveryMode) {
            try {
                ctx.session.recoveryMode = false;
                // handles the update according to scene mdlwres
                return ctx.handleRecovery(scene, ctx);
            } catch (e) {
                throw new Error(`Error on handling recovery: ${e.message} \n`);
            }
        }
        
        db.setUserState(ctx.from.id, scenes.id.setter.steps);
        return ctx.reply(`Введите количество шагов за сегодня (${limits.min} - ${limits.max}): `, Markup.removeKeyboard());
        
    } catch (e) {
        throw new Error(`Error in <enter> middleware of <scenes/setters/steps> file --> ${e.message}`);
    }
});

scene.on('text', async ctx => {

    try {
        let data =  ctx.message.text;
        let steps = Number.parseInt(ctx.message.text);

        // data.length > 6
        // if length == 7, then the value == 100 000+, but it can't be
        if (Number.isNaN(data) || Number.isNaN(steps) || data.length > 6) {
            return ctx.reply('Пожалуйста, введите количество цифрами');
        }
        else if (steps < limits.min || steps > limits.max) {
            return ctx.reply('Пожалуйста, введите корректное количество');
        }

        if (steps < 10000) await ctx.reply('Количество шагов в день должно быть не менее 10000. Это способствует скорейшему достижению результата');
        else if (steps < 15000) await ctx.reply('Cтремитесь проходить в день 15000 шагов и вы сможете быстрее добиться результата');
        else await ctx.reply('Вы отлично поработали сегодня, продолжайте в том же духе!');

        setTimeout(() => { return ctx.scene.enter(scenes.id.menu.main) }, 1000);
    } catch (e) {
        throw new Error(`Error in <on_text> middleware of <scenes/setters/age> file --> ${e.message}`);
    }
});

scene.on('message', ctx => ctx.reply('Пожалуйста, введите количество цифрами в текстовом формате'));

module.exports = scene;