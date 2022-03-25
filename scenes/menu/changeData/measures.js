const { Scenes, Markup, session } = require("telegraf");
const scenes = require('../../scenes');
const db = require('../../../database/database');

// _______________________________________________

const keys = {
    chest: 'Обхват груди',
    waist: 'Обхват талии',
    hip: 'Обхват бёдер',
    back: 'Назад',
};

const settersID = scenes.id.setter.measure;

// ______________________________________

const measuresKeyboard = Markup.keyboard(
    [
        [keys.chest, keys.waist, keys.hip],
        [keys.back],
    ]
).resize();

// _________________________________________________________________________________

const changeMeasuresScene = new Scenes.BaseScene(scenes.id.menu.changeData.measures);

changeMeasuresScene.enter(ctx => {

    if (ctx.session.recoveryMode == true) {
        ctx.session.recoveryMode = false;
        return ctx.handleRecovery(changeMeasuresScene, ctx);
    }
    else {
        db.setUserState(ctx.from.id, scenes.id.menu.changeData.measures);
        return ctx.reply('Выберите замер, который хотите изменить', measuresKeyboard);
    }
});

changeMeasuresScene.use((ctx, next) => {
    ctx.session.setConfig = false;
    return next();
});

// ____________________________________________________

changeMeasuresScene.hears(keys.chest, ctx => {
    ctx.session.user = { measures: { chest: undefined }};
    return ctx.scene.enter(settersID.chest);
});

changeMeasuresScene.hears(keys.waist, ctx => {
    ctx.session.user = { measures: { waist: undefined }};
    return ctx.scene.enter(settersID.waist);
});

changeMeasuresScene.hears(keys.hip, ctx => {
    ctx.session.user = { measures: { hip: undefined }};
    return ctx.scene.enter(settersID.hip);
});

// ___________________________________________________

changeMeasuresScene.hears(keys.back, ctx => {
    return ctx.scene.enter(scenes.id.menu.changeData.home);
});

changeMeasuresScene.on('message', ctx => {
    return ctx.reply('Пожалуйста, используйте клавиатуру');
});

module.exports = changeMeasuresScene;