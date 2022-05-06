const { Scenes, Markup } = require("telegraf");

const db = require('../../database/database');
const User = require('../../models/user');
const scenes = require('../scenes');

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

const scene = new Scenes.BaseScene(scenes.id.setter.height);

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
        
        db.setUserState(ctx.from.id, scenes.id.setter.height);
        return ctx.reply(`Введите свой рост числом (${limits.min}-${limits.max} см):`, Markup.removeKeyboard());
        
    } catch (e) {
        throw new Error(`Error in <enter> middleware of <scenes/setters/height> file --> ${e.message}`);
    }
});

scene.on('text', async ctx => {
    try {
        let data =  ctx.message.text;
        let height = Number.parseInt(ctx.message.text);

        // data.length > 3
        // if length == 4, then the value == 1000+, but it can't be
        if (Number.isNaN(data) || Number.isNaN(height) || data.length > 3) 
            return ctx.reply('Пожалуйста, введите рост цифрами');
        else if (height < limits.min || height > limits.max) 
            return ctx.reply('Пожалуйста, введите корректный рост');

        // saving new data
        let user = await User.findOne({ _id: ctx.from.id });
        user.height = height;
        await user.save();

        // choosing new scene to enter
        let sceneID = null;
        if (await db.userRegisteredByObject(user)) sceneID = scenes.id.menu.main;
        else sceneID = scenes.id.setter.age;

        return ctx.scene.enter(sceneID);
    } catch (e) {
        throw new Error(`Error in <on_text> middleware of <scenes/setters/height> file --> ${e.message}`);
    }
});

scene.on('message', ctx => ctx.reply('Пожалуйста, введите рост цифрами в текстовом формате'));

module.exports.scene = scene;