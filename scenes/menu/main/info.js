const { Composer, Markup } = require("telegraf");

// ______________________________________

const action = {
    one: 'ACTION_1',
    two: 'ACTION_2',
    three: 'ACTION_3',
    four: 'ACTION_4',
    five: 'ACTION_5',
    six: 'ACTION_6',
    seven: 'ACTION_7',
    eight: 'ACTION_8',
    nine: 'ACTION_9',
}

const text = {
    one: 'one',
    two: 'two',
    three: 'three',
    four: 'four',
    five: 'five',
    six: 'six',
    seven: 'seven',
    eight: 'eight',
    nine: 'nine',
}

const inlineInfo = Markup.inlineKeyboard([
    [ 
        Markup.button.callback(text.one, action.one),
        Markup.button.callback(text.two, action.two),
        Markup.button.callback(text.three, action.three),
    ],
    [ 
        Markup.button.callback(text.four, action.four),
        Markup.button.callback(text.five, action.five),
        Markup.button.callback(text.six, action.six),
    ],
    [ 
        Markup.button.callback(text.seven, action.seven),
        Markup.button.callback(text.eight, action.eight),
        Markup.button.callback(text.nine, action.nine),
    ],
]);
module.exports.inlineKeyboard = inlineInfo;

// ______________________________________

const info = new Composer();

info.action(action.one, ctx => {
    ctx.answerCbQuery();
    return ctx.reply('inline one');
});

module.exports.composer = info;