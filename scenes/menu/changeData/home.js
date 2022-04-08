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

    back: 'Назад',
};

// ___________________________________________

const changeDataKeyboard = Markup.keyboard(
    [
        [ keys.name, keys.sex, keys.activity ],
        [ keys.age, keys.height ],
        [ keys.back ],
    ]
).resize();

// ____________________________________________________________________

const changeDataScene = new Scenes.BaseScene(scenes.id.menu.changeData.home);

changeDataScene.enter(async ctx => {

    try {
        if (ctx.session.recoveryMode == true) {
            try {
                ctx.session.recoveryMode = false;
                return ctx.handleRecovery(changeDataScene, ctx);
            } catch (e) {
                throw new Error(`Error on handling recovery: ${e.message} \n`);
            }
        }
        else {
            db.setUserState(ctx.message.from.id, scenes.id.menu.changeData.home);
            return ctx.reply('Выберите параметр, который хотите изменить:', changeDataKeyboard);
        }
    } catch (e) {
        throw new Error(`Error in <enter> middleware of <scenes/menu/changeData/home> file --> ${e.message}`);
    }
});

// ____________________ SETTERS _______________________

changeDataScene.hears(keys.name, ctx => {
    return ctx.scene.enter(scenes.id.setter.name);
});

changeDataScene.hears(keys.sex, ctx => {
    return ctx.scene.enter(scenes.id.setter.sex);
});

changeDataScene.hears(keys.height, ctx => {
    return ctx.scene.enter(scenes.id.setter.height);
});

changeDataScene.hears(keys.age, ctx => {
    return ctx.scene.enter(scenes.id.setter.age);
});

changeDataScene.hears(keys.activity, ctx => {
    return ctx.scene.enter(scenes.id.setter.activity);
});

// _________________________________________________________

changeDataScene.hears(keys.back, ctx => {
    return ctx.scene.enter(scenes.id.menu.main);
})

changeDataScene.on('message', ctx => {
    return ctx.reply('Используйте клавиаутуру меню');
});

module.exports = changeDataScene;