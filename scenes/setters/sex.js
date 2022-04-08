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
        throw new Error(`Error in <enter> middleware of <scenes/setters/sex> file --> ${e.message}`);
    }
});

const setSex = async (id, sex) => {
    try {
        let user = await User.findOne({ _id: id });
        user.sex = sex;
        await user.save();

        return user;
    } catch (e) {
        throw new Error(`Error in <setSex> func of <scenes/setters/sex> file --> ${e.message}`);
    }
}

const getNextScene = async user => {
    try {
        let sceneID = null;
        
        if (await db.userRegisteredByObject(user)) sceneID = scenes.id.menu.main;
        else sceneID = scenes.id.setter.height;

        return sceneID;
    } catch (e) {
        throw new Error(`Error in <getNextScene> func of <scenes/setters/sex> file --> ${e.message}`);
    }
};

scene.hears(Sex.male, async ctx => {
    try {
        let user = await setSex(ctx.from.id, Sex.male);
        return ctx.scene.enter(await getNextScene(user));
    } catch (e) {
        throw new Error(`Error in <hears_male> middleware of <scenes/setters/sex> file --> ${e.message}`);
    }
});

scene.hears(Sex.female, async ctx => {
    try {
        let user = await setSex(ctx.from.id, Sex.female);
        return ctx.scene.enter(await getNextScene(user));
    } catch (e) {
        throw new Error(`Error in <hears_female> middleware of <scenes/setters/sex> file --> ${e.message}`);
    }
});

module.exports = scene;
