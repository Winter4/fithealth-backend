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
    one: '1️⃣',
    two: '2️⃣',
    three: '3️⃣',
    four: '4️⃣',
    five: '5️⃣',
    six: '6️⃣',
    seven: '7️⃣',
    eight: '8️⃣',
    nine: '9️⃣',
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

info.action(action.two, ctx => {
    ctx.answerCbQuery();
    return ctx.reply('inline two');
});

info.action(action.three, ctx => {
    ctx.answerCbQuery();
    return ctx.reply('inline three');
});

info.action(action.four, ctx => {
    ctx.answerCbQuery();
    return ctx.reply('inline four');
});

info.action(action.five, ctx => {
    ctx.answerCbQuery();
    return ctx.reply('inline five');
});

info.action(action.six, ctx => {
    ctx.answerCbQuery();
    return ctx.reply('inline six');
});

info.action(action.seven, ctx => {
    ctx.answerCbQuery();
    return ctx.reply('inline seven');
});

info.action(action.eight, ctx => {
    ctx.answerCbQuery();
    return ctx.reply('inline eight');
});

info.action(action.nine, ctx => {
    ctx.answerCbQuery();
    return ctx.reply('inline nine');
});

module.exports.composer = info;