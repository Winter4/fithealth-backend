const {Scenes, Markup} = require('telegraf');

const scenes = require('./scenes');

const actions = {
    'male':   "SEX_ACTION_MALE",
    'female': "SEX_ACTION_FEMALE"
};

const sexKeyboard = Markup.inlineKeyboard(
    [
        Markup.button.callback('Мужской', actions['male']),
        Markup.button.callback('Женский', actions['female'])
    ]
);

const setSexScene = new Scenes.BaseScene(scenes.ID['setSex']);

module.exports = setSexScene;
