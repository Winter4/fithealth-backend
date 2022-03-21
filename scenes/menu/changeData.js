const { Scenes, Markup, session } = require("telegraf");
const scenes = require('../scenes');
const db = require('../requires').database;

// ________________________________

const keyboardText = {
    name: 'Имя',
    sex: 'Пол',
    age: 'Возраст',
    back: 'Назад',
};

const enterDataAction = 'ENTER_DATA_ACTION';

// ___________________________________________

const changeDataKeyboard = Markup.keyboard(
    [
        [keyboardText.name, keyboardText.sex],
        [keyboardText.age],
        [keyboardText.back]
    ]
).resize();

const enterDataButton = Markup.inlineKeyboard(
    [
        Markup.button.callback('Ввести данные', enterDataAction)
    ]
)

// ____________________________________________________________________

const changeDataScene = new Scenes.BaseScene(scenes.id.menu.changeData);

changeDataScene.enter(async ctx => {

    return ctx.reply('Выберите действие', changeDataKeyboard);
});

changeDataScene.use((ctx, next) => {
    ctx.session.setConfig = false;
    return next();
});

changeDataScene.hears(keyboardText.name, ctx => {
    ctx.session.user = { name: undefined };
    return ctx.scene.enter(scenes.id.setter.name);
});

changeDataScene.hears(keyboardText.sex, ctx => {
    ctx.session.user = { sex: undefined };
    return ctx.scene.enter(scenes.id.setter.sex);
});

changeDataScene.hears(keyboardText.age, ctx => {
    ctx.session.user = { age: undefined };
    return ctx.scene.enter(scenes.id.setter.age);
});

changeDataScene.hears(keyboardText.back, ctx => {
    return ctx.scene.enter(scenes.id.menu.main);
})

module.exports = changeDataScene;