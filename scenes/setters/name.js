const { Markup, Scenes } = require('telegraf');

const db = require('../../database/database');
const User = require('../../models/user');
const scenes = require('../scenes');

// ____________________________________________________________

const scene = new Scenes.BaseScene(scenes.id.setter.name);

scene.enter(ctx => {
    
    try {
        if (ctx.session.recoveryMode) {
            try {
                ctx.session.recoveryMode = false;
                return ctx.handleRecovery(scene, ctx);
            } catch (e) {
                throw new Error(`Error on handling recovery: ${e.message} \n`);
            }
        }
        
        db.setUserState(ctx.from.id, scenes.id.setter.name);
        ctx.reply('Введите своё имя: ', Markup.removeKeyboard());
        
    } catch (e) {
        throw new Error(`Error in <enter> middleware of <scenes/setters/name> file --> ${e.message}`);
    }
});

scene.on('text', async ctx => {
    try {
        let user = await User.findOne({ _id: ctx.from.id });
        user.name = ctx.message.text;
        await user.save();

        let sceneID = null;
        if (await db.userRegisteredByObject(user)) sceneID = scenes.id.menu.main;
        else sceneID = scenes.id.setter.sex;

        return ctx.scene.enter(sceneID);
    } catch (e) {
        throw new Error(`Error in <on_text> middleware of <scenes/setters/name> file --> ${e.message}`);
    }
});

scene.on('message', ctx => ctx.reply('Пожалуйста, введите своё имя'));

module.exports = scene;