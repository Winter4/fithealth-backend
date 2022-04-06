const { Markup, Scenes } = require('telegraf');

const db = require('../../../database/database');
const User = require('../../../models/user');
const scenes = require("../../scenes");

// ____________________________________________________________

// ATTENTION: if changing this, also change
//            same limits in models/user
// i couldn't make it run importing this const to the models/user
const limits = {
    min: 40,
    max: 200
};
module.exports.limits = limits;

// _________________________________________

const scene = new Scenes.BaseScene(scenes.id.setter.weight.target);

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
        
        db.setUserState(ctx.from.id, scenes.id.setter.weight.target);
        return ctx.replyWithHTML(`Введите свой <b><i>желаемый</i></b> вес числом (${limits.min}-${limits.max} кг):`, Markup.removeKeyboard());
        
    } catch (e) {
        let newErr = new Error(`Error in <enter> middleware of <setters/weight/target> scene: ${e.message} \n`);
        ctx.logError(ctx, newErr, __dirname);
        throw newErr;
    }
});

scene.on('text', async ctx => {
    let data =  ctx.message.text;
    let weight = Number.parseInt(ctx.message.text);

    // data.length > 3
    // if length == 4, then the value == 1000+, but it can't be
    if (Number.isNaN(data) || Number.isNaN(weight) || data.length > 3) 
        return ctx.reply('Пожалуйста, введите вес цифрами');
    else if (weight < limits.min || weight > limits.max) 
        return ctx.reply('Пожалуйста, введите корректный вес');

    let user = await User.findOne({ _id: ctx.from.id });
    user.targetWeight = weight;
    await user.save();

    let sceneID = null;
    if (await db.userRegisteredByObject(user)) sceneID = scenes.id.menu.main;
    else sceneID = scenes.id.setter.measure.chest;

    return ctx.scene.enter(sceneID);
});

scene.on('message', ctx => ctx.reply('Пожалуйста, введите вес цифрами в текстовом формате'));

module.exports.scene = scene;