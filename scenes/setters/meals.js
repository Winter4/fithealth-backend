const { Markup, Scenes} = require('telegraf');

const db = require('../../database/database');
const User = require('../../models/user');
const scenes = require('../scenes');

// _________________________________

// ATTENTION: if changing this, also change
//            same enum in models/user
// i couldn't make it run importing this to the models/user
const Meals = {
    three: '3 раза в день (завтрак, обед, ужин)',
    four: '4 раза в день (завтрак, перекус, обед, ужин)',
    five: '5 раз в день (завтрак, перекус 1, обед, перекус 2, ужин)'
};

// __________________________________

const keyboard = Markup.keyboard(
    [
        Meals.three, Meals.four, Meals.five
    ]
).resize();

// __________________________________

const scene = new Scenes.BaseScene(scenes.id.setter.meals);

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
        
        db.setUserState(ctx.from.id, scenes.id.setter.meals);
        return ctx.reply('Выберите режим питания:', keyboard);
        
    } catch (e) {
        throw new Error(`Error in <enter> middleware of <scenes/setters/meals> file --> ${e.message}`);
    }
});

// sets new mealsPerDay value
const setMeals = async (id, meals) => {
    try {
        let user = await User.findOne({ _id: id });
        user.mealsPerDay = meals;
        user.registered = true;
        await user.save();

        return user;
    } catch (e) {
        throw new Error(`Error in <setMeals> func of <scenes/setters/meals> file --> ${e.message}`);
    }
}

// choose new scene to enter
const getNextScene = async user => {
    try {
        let sceneID = null;
        
        if (await db.userRegisteredByObject(user)) sceneID = scenes.id.menu.main;
        else sceneID = scenes.id.setter.height;

        return sceneID;
    } catch (e) {
        throw new Error(`Error in <getNextScene> func of <scenes/setters/meals> file --> ${e.message}`);
    }
};

scene.hears(Meals.three, async ctx => {
    try {
        let user = await setMeals(ctx.from.id, 3);
        return ctx.scene.enter(await getNextScene(user));
    } catch (e) {
        throw new Error(`Error in <hears_three> middleware of <scenes/setters/meals> file --> ${e.message}`);
    }
});

scene.hears(Meals.four, async ctx => {
    try {
        let user = await setMeals(ctx.from.id, 4);
        return ctx.scene.enter(await getNextScene(user));
    } catch (e) {
        throw new Error(`Error in <hears_four> middleware of <scenes/setters/meals> file --> ${e.message}`);
    }
});

scene.hears(Meals.five, async ctx => {
    try {
        let user = await setMeals(ctx.from.id, 5);
        return ctx.scene.enter(await getNextScene(user));
    } catch (e) {
        throw new Error(`Error in <hears_five> middleware of <scenes/setters/meals> file --> ${e.message}`);
    }
});

scene.on('message', ctx => ctx.reply('Пожалуйста, выберите свой режим питания'));

module.exports = scene;
