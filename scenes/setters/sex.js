const { Markup, Scenes} = require('telegraf');

const db = require('../../database/database');
const User = require('../../models/user');
const scenes = require('../scenes');

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

const scene = new Scenes.BaseScene(scenes.id.setter.sex);

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
        
        db.setUserState(ctx.from.id, scenes.id.setter.sex);
        return ctx.reply('Выберите Ваш пол:', sexKeyboard);
        
    } catch (e) {
        let newErr = new Error(`Error in <enter> middleware of <setters/sex> scene: ${e.message} \n`);
        ctx.logError(ctx, newErr, __dirname);
        throw newErr;
    }
});

const setSex = async (id, sex) => {
    let user = await User.findOne({ _id: id });
    user.sex = sex;
    await user.save();

    return user;
}

const getNextScene = async user => {
    let sceneID = null;
    
    if (await db.userRegisteredByObject(user)) sceneID = scenes.id.menu.main;
    else sceneID = scenes.id.setter.height;

    return sceneID;
};

scene.hears(Sex.male, async ctx => {
    let user = await setSex(ctx.from.id, Sex.male);
    return ctx.scene.enter(await getNextScene(user));
});

scene.hears(Sex.female, async ctx => {
    let user = await setSex(ctx.from.id, Sex.female);
    return ctx.scene.enter(await getNextScene(user));
});

module.exports = scene;
