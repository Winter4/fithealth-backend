const { Markup, Scenes } = require('telegraf');

const db = require('../../../database/database');
const User = require('../../../models/user');
const scenes = require("../../scenes");

// ____________________________________________________________

// ATTENTION: if changing this, also change
//            same limits in models/user
// i couldn't make it run importing this const to the models/user
const limits = {
    min: 20,
    max: 200
};
module.exports.limits = limits;

// _________________________________________

const scene = new Scenes.BaseScene(scenes.id.setter.measure.chest);

scene.enter(async ctx => {
    try {
        if (ctx.session.recoveryMode) {
            try {
                ctx.session.recoveryMode = false;
                return ctx.handleRecovery(scene, ctx);
            } catch (e) {
                throw new Error(`Error on handling recovery: ${e.message} \n`);
            }
        }
        
        db.setUserState(ctx.from.id, scenes.id.setter.measure.chest);

        const user = await db.getUserByID(ctx.from.id);

        const photoSource = user.sex == 'Мужской' ? './images/man-measures.jpg' : './images/woman-measures.jpg';
        await ctx.replyWithPhoto({ source: photoSource });

        return ctx.reply(`Введите обхват груди (${limits.min}-${limits.max} см):`, Markup.removeKeyboard());     

    } catch (e) {
        let newErr = new Error(`Error in <enter> middleware of <setters/measure/chest> scene: ${e.message} \n`);
        ctx.logError(ctx, newErr, __dirname);
        throw newErr;
    }
});

scene.on('text', async ctx => {
    let data =  ctx.message.text;
    let length = Number.parseInt(ctx.message.text);

    // data.length > 3
    // if length == 4, then the value == 1000+, but it can't be
    if (Number.isNaN(data) || Number.isNaN(length) || data.length > 3) {
        ctx.reply('Пожалуйста, введите обхват цифрами');
        return;
    }
    else if (length < limits.min || length > limits.max) {
        ctx.reply('Пожалуйста, введите корректный обхват');
        return;
    }

    let user = await User.findOne({ _id: ctx.from.id });
    user.chestMeasure = length;
    await user.save();

    let sceneID = null;
    if (await db.userRegisteredByObject(user)) sceneID = scenes.id.menu.main;
    else sceneID = scenes.id.setter.measure.waist;

    return ctx.scene.enter(sceneID);
});

scene.on('message', ctx => ctx.reply('Пожалуйста, введите обхват цифрами в текстовом формате'));

module.exports.scene = scene;