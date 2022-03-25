const { Scenes, Markup, } = require("telegraf");
const scenes = require('../../scenes');
const db = require('../../../database/database');

// ________________________________

const keys = {
    name: 'Имя',
    sex: 'Пол',
    height: 'Рост',
    age: 'Возраст',
    activity: 'Активность',

    weight: 'Вес',
    measures: 'Замеры',

    back: 'Назад',
};

// ___________________________________________

const changeDataKeyboard = Markup.keyboard(
    [
        [ keys.name, keys.sex, keys.activity ],
        [ keys.age, keys.height ],
        [ keys.weight, keys.measures ],
        [ keys.back ],
    ]
).resize();

// ____________________________________________________________________

const changeDataScene = new Scenes.BaseScene(scenes.id.menu.changeData.home);

changeDataScene.enter(ctx => {

    if (ctx.session.recoveryMode == true) {
        ctx.session.recoveryMode = false;
        return ctx.handleRecovery(changeDataScene, ctx);
    }
    else {
        db.setUserState(ctx.message.from.id, scenes.id.menu.changeData.home);
        return ctx.reply('Выберите параметр, который хотите изменить:', changeDataKeyboard);
    }
});

changeDataScene.use((ctx, next) => {
    ctx.session.setConfig = false;
    return next();
});

// ____________________ SETTERS _______________________

changeDataScene.hears(keys.name, ctx => {
    ctx.session.user = { name: undefined };
    return ctx.scene.enter(scenes.id.setter.name);
});

changeDataScene.hears(keys.sex, ctx => {
    ctx.session.user = { sex: undefined };
    return ctx.scene.enter(scenes.id.setter.sex);
});

changeDataScene.hears(keys.height, ctx => {
    ctx.session.user = { height: undefined };
    return ctx.scene.enter(scenes.id.setter.height);
});

changeDataScene.hears(keys.age, ctx => {
    ctx.session.user = { age: undefined };
    return ctx.scene.enter(scenes.id.setter.age);
});

changeDataScene.hears(keys.activity, ctx => {
    ctx.session.user = { activity: undefined };
    return ctx.scene.enter(scenes.id.setter.activity);
});

// _____________________________________________________

changeDataScene.hears(keys.weight, ctx => {
    return ctx.scene.enter(scenes.id.menu.changeData.weights);
});

changeDataScene.hears(keys.measures, ctx => {
    return ctx.scene.enter(scenes.id.menu.changeData.measures);
});

// _________________________________________________________

changeDataScene.hears(keys.back, ctx => {
    return ctx.scene.enter(scenes.id.menu.main);
})

module.exports = changeDataScene;