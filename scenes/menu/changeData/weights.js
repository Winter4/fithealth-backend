const { Scenes, Markup, session } = require("telegraf");
const scenes = require('../../scenes');
const db = require('../../../database/database');

// _______________________________________________

const settersID = scenes.id.setter;

const keys = {
    startWeight: 'Начальный вес',
    targetWeight: 'Желаемый вес',
    back: 'Назад',
};

// ______________________________________

const keyboard = Markup.keyboard(
    [
        [ keys.startWeight, keys.targetWeight ],
        [ keys.back ],
    ]
).resize();

// _________________________________________________________________________________

const changeWeightsScene = new Scenes.BaseScene(scenes.id.menu.changeData.weights);

changeWeightsScene.enter(ctx => {

    if (ctx.session.recoveryMode == true) {
        ctx.session.recoveryMode = false;
        return ctx.handleRecovery(changeWeightsScene, ctx);
    }
    else {
        db.setUserState(ctx.from.id, scenes.id.menu.changeData.weights);
        return ctx.reply('Выберите вес, который хотите изменить', keyboard);
    }
});

changeWeightsScene.use((ctx, next) => {
    ctx.session.setConfig = false;
    return next();
});

// ___________________________________________

changeWeightsScene.hears(keys.startWeight, ctx => {
    ctx.session.user = { startWeight: undefined };
    return ctx.scene.enter(settersID.startWeight);
});

changeWeightsScene.hears(keys.targetWeight, ctx => {
    ctx.session.user = { targetWeight: undefined };
    return ctx.scene.enter(settersID.targetWeight);
});

// ___________________________________________________

changeWeightsScene.hears(keys.back, ctx => {
    return ctx.scene.enter(scenes.id.menu.changeData.home);
});

changeWeightsScene.on('message', ctx => {
    return ctx.reply('Пожалуйста, используйте клавиатуру');
});

module.exports = changeWeightsScene;

