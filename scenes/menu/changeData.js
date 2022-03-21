const { Scenes, Markup, } = require("telegraf");
const scenes = require('../scenes');

// ________________________________

const keyboardText = {
    name: 'Имя',
    sex: 'Пол',
    weight: 'Вес',
    height: 'Рост',
    age: 'Возраст',
    activity: 'Активность',

    measures: {
        chest: 'Замер груди',
        waist: 'Замер талии',
        hip: 'Замер бёдер',
    },
    back: 'Назад',
};

// ___________________________________________

const changeDataKeyboard = Markup.keyboard(
    [
        [keyboardText.name, keyboardText.sex, keyboardText.activity],
        [keyboardText.age, keyboardText.weight, keyboardText.height],
        [keyboardText.measures.chest, keyboardText.measures.waist, keyboardText.measures.hip],
        [keyboardText.back],
    ]
).resize();

// ____________________________________________________________________

const changeDataScene = new Scenes.BaseScene(scenes.id.menu.changeData);

changeDataScene.enter(async ctx => {

    return ctx.reply('Выберите параметр, который хотите изменить:', changeDataKeyboard);
});

changeDataScene.use((ctx, next) => {
    ctx.session.setConfig = false;
    return next();
});

// ____________________ SETTERS _______________________

changeDataScene.hears(keyboardText.name, ctx => {
    ctx.session.user = { name: undefined };
    return ctx.scene.enter(scenes.id.setter.name);
});

changeDataScene.hears(keyboardText.sex, ctx => {
    ctx.session.user = { sex: undefined };
    return ctx.scene.enter(scenes.id.setter.sex);
});

changeDataScene.hears(keyboardText.weight, ctx => {
    ctx.session.user = { weight: undefined };
    return ctx.scene.enter(scenes.id.setter.weight);
});

changeDataScene.hears(keyboardText.height, ctx => {
    ctx.session.user = { height: undefined };
    return ctx.scene.enter(scenes.id.setter.height);
});

changeDataScene.hears(keyboardText.age, ctx => {
    ctx.session.user = { age: undefined };
    return ctx.scene.enter(scenes.id.setter.age);
});

changeDataScene.hears(keyboardText.activity, ctx => {
    ctx.session.user = { activity: undefined };
    return ctx.scene.enter(scenes.id.setter.activity);
});

// _____________________ MEASURES _________________________

changeDataScene.hears(keyboardText.measures.chest, ctx => {
    ctx.session.user = { measures: { chest: undefined }};
    return ctx.scene.enter(scenes.id.setter.measure.chest);
});

changeDataScene.hears(keyboardText.measures.waist, ctx => {
    ctx.session.user = { measures: { waist: undefined }};
    return ctx.scene.enter(scenes.id.setter.measure.waist);
});

changeDataScene.hears(keyboardText.measures.hip, ctx => {
    ctx.session.user = { measures: { hip: undefined }};
    return ctx.scene.enter(scenes.id.setter.measure.hip);
});

// _________________________________________________________

changeDataScene.hears(keyboardText.back, ctx => {
    return ctx.scene.enter(scenes.id.menu.main);
})

module.exports = changeDataScene;