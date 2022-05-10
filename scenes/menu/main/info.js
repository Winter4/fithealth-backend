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
}

const text = {
    one: '1️⃣',
    two: '2️⃣',
    three: '3️⃣',
    four: '4️⃣',
    five: '5️⃣',
    six: '6️⃣',
    seven: '7️⃣',
}

const inlineInfo = Markup.inlineKeyboard([
    [ 
        Markup.button.callback(text.one, action.one),
        Markup.button.callback(text.two, action.two),
        Markup.button.callback(text.three, action.three),
        Markup.button.callback(text.four, action.four),
    ],
    [ 
        Markup.button.callback(text.five, action.five),
        Markup.button.callback(text.six, action.six),
        Markup.button.callback(text.seven, action.seven),
    ],
]);
module.exports.inlineKeyboard = inlineInfo;

// ______________________________________

const info = new Composer();

info.action(action.one, ctx => {
    try {
        ctx.answerCbQuery();
        return ctx.reply('Видео');
    } catch (e) {
        throw new Error(`Error in <action_one> middleware of <scenes/menu/main/info> file --> ${e.message}`);
    }
});

info.action(action.two, ctx => {
    try {
        ctx.answerCbQuery();
        return ctx.replyWithHTML(require('./text').breakfast);
    } catch (e) {
        throw new Error(`Error in <action_two> middleware of <scenes/menu/main/info> file --> ${e.message}`);
    }
});

info.action(action.three, ctx => {
    try {
        ctx.answerCbQuery();
        return ctx.replyWithHTML(require('./text').dinner);
    } catch (e) {
        throw new Error(`Error in <action_three> middleware of <scenes/menu/main/info> file --> ${e.message}`);
    }
});

info.action(action.four, ctx => {
    try {
        ctx.answerCbQuery();
        return ctx.replyWithHTML(require('./text').supper);
    } catch(e) {
        throw new Error(`Error in <action_four> middleware of <scenes/menu/main/info> file --> ${e.message}`);
    }
});

info.action(action.five, ctx => {
    try {
        ctx.answerCbQuery();
        return ctx.replyWithHTML(require('./text').lunch);
    } catch (e) {
        throw new Error(`Error in <action_five> middleware of <scenes/menu/main/info> file --> ${e.message}`);
    }
});

info.action(action.six, ctx => {
    try {
        ctx.answerCbQuery();
        return ctx.replyWithHTML(require('./text').eatAndCook);
    } catch (e) {
        throw new Error(`Error in <action_six> middleware of <scenes/menu/main/info> file --> ${e.message}`);
    }
});

info.action(action.seven, ctx => {
    try {
        ctx.answerCbQuery();
        return ctx.replyWithHTML(require('./text').dringAndVeg);
    } catch (e) {
        throw new Error(`Error in <action_seven> middleware of <scenes/menu/main/info> file --> ${e.message}`);
    }
});

module.exports.composer = info;