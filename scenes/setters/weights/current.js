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

const scene = new Scenes.BaseScene(scenes.id.setter.weight.current);

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
        
        db.setUserState(ctx.from.id, scenes.id.setter.weight.current);
        return ctx.replyWithHTML(`Введите свой <b><i>текущий</i></b> вес числом (${limits.min}-${limits.max} кг):`, Markup.removeKeyboard());
        
    } catch (e) {
        let newErr = new Error(`Error in <enter> middleware of <setters/weight/current> scene: ${e.message} \n`);
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
    user.currentWeight = weight;

    const registered = await db.userRegisteredByObject(user);
    if (!(registered)) user.startWeight = user.currentWeight;

    await user.save();

    let sceneID = null;
    if (registered) sceneID = scenes.id.menu.main;
    else sceneID = scenes.id.setter.weight.target;

    return ctx.scene.enter(sceneID);

    /* const user = await db.getUserByID(ctx.from.id);
            
    const sexParam = user.sex == 'Мужской' ? 5 : -161;
    let basicCaloricIntake = 
        10 * user.startWeight + 
        6.25 * user.height -
        5 * user.age +
        sexParam
    ;
    basicCaloricIntake *= user.activity;
    basicCaloricIntake = basicCaloricIntake.toFixed();

    const lessCaloricIntake = (basicCaloricIntake * 0.8).toFixed();
    const moreCaloricIntake = (basicCaloricIntake * 1.2).toFixed();

    let text = 'Ваша дневная норма калорий в зависимости от желаемого результата: \n'
    text += `- <b><i>Поддержание</i></b> веса: ${basicCaloricIntake} \n`;
    text += `- <b><i>Снижение</i></b> веса: ${lessCaloricIntake} \n`;
    text += `- <b><i>Набора</i></b> веса: ${moreCaloricIntake} \n`; */
});

scene.on('message', ctx => ctx.reply('Пожалуйста, введите вес цифрами в текстовом формате'));

module.exports.scene = scene;