const {Telegraf, Scenes, Stage, session} = require('telegraf');
const db = require('./database/database');

const User = require('./models/user');

const bot = new Telegraf(require('./env').BOT_TOKEN);

// ______________________________________

// if u want to add a parameter and create a scene for its setting,
// u should update these:
/**
 * 1. scenes/scenes.js > ib & object
 * 2. complete necessary new_scene.js file (don't forget to handle recovery mode)
 * 3. index.js > stage
 * 4. models/user.js > user model
 * 5. ..menu/changeData > add necessary buttons & its middleware
 * 
 * in some time, this sttructure may turn out to be bad & unproffesional,
 * but in the moment I'm writing it - this is the best of my skills :)
 */

// to be think of: wizards-setters, bas imports, saveUser refactor
// TODO: Beauify (comments, ">', straight the rows, Composers (changeData menu))
// TODO: mealPlan import Sex type
// TODO: !!!!! REFACTOR SAVEUSERFROMCONEXT !!!!!!

// _______________________________________________________________________

bot.use(session());

const scenes = require('./scenes/scenes');
const stage = new Scenes.Stage([

    scenes.object.setter.name,
    scenes.object.setter.sex,
    scenes.object.setter.height,
    scenes.object.setter.age,
    scenes.object.setter.activity,
    scenes.object.setter.weight.current,
    scenes.object.setter.weight.target,

    scenes.object.setter.measure.chest,
    scenes.object.setter.measure.waist,
    scenes.object.setter.measure.hip,

    scenes.object.setter.meals,

    scenes.object.menu.main,
    scenes.object.menu.changeData.home,
]);

stage.command('home', async ctx => {
    try {
        if (await db.userRegisteredByID(ctx.from.id))
            return ctx.scene.enter(scenes.id.menu.main);
        else
            return ctx.reply('Вы не завершили регистрацию');
    } catch (e) {
        throw new Error(`Error in <stage.command_home> of <index> file --> ${e.message}`);
    }
});

bot.use(stage.middleware());

// _______________________________________

bot.context.log = msg => {
    console.log(`${Date()}  |  ${msg}`);
};

bot.context.logObject = object => {
    console.log(object);
}

bot.context.logError = (ctx, err) => {
    console.log(`\n${Date()}  |  ↓↓↓↓ ERROR CATCHED ↓↓↓↓ 
        Update type: ${ctx.updateType} 
        Chat ID: ${ctx.chat.id}
        Message: ${err.message} \n${Date()}  |  ↑↑↑↑ ERROR CATCHED ↑↑↑↑ \n`
    );
};

bot.context.handleRecovery = async (scene, ctx) => {
    try {
        const handler = await scene.middleware();
        return await handler(ctx, Promise.resolve());
    } catch (e) {
        throw new Error(`Error in <bot.context.handleRecovery> of <index> file --> ${e.message}`);
    }
};

bot.telegram.setMyCommands([
    { command: '/home', description: 'takes you to the main menu'},
]);

// _________________________________________________

bot.start(async ctx => {

    try {
        let user = await User.findOne({ _id: ctx.from.id });

        if (user !== null) {
            ctx.log(`User ${ctx.chat.id} is back`);

            // if user hadn't registered before stopping the bot
            if (await db.userRegisteredByObject(user)) 
                return ctx.scene.enter(scenes.id.menu.main);
            else 
                return ctx.scene.enter(user.state);
        }
        else {
            user = new User({ _id: ctx.from.id });
            await user.save();
            
            ctx.log(`New ${ctx.chat.id} user`);
            await ctx.reply(
                'Приветcтвую! Это Ваш первый шаг к приобретению тела мечты. ' +
                'Команда тренеров нашего приложения рада видеть Вас здесь и сделает все, ' + 
                'чтобы помочь достигнуть лучшего результата!'
            );
    
            return ctx.scene.enter(scenes.id.setter.name);
        }
    } catch (e) {
        throw new Error(`Error in <bot.start> of <index.js> file --> ${e.message}`);
    }
});

bot.on('text', async (ctx, next) => {

    ctx.log(`User ${ctx.from.id} texted`);
    try {
        const user = await db.getUserByID(ctx.from.id);

        if (user !== null) {
            ctx.session.recoveryMode = true;
            ctx.log(`^^^^ Recovery mode: ${ctx.session.recoveryMode}`);
            return ctx.scene.enter(user.state);
        }
        ctx.log(`\t\tRecovery mode: ${ctx.session.recoveryMode}`);
        return next();
    } catch (e) {
        throw new Error(`Error in <bot.on_text> of <index> file --> ${e.message}`);
    }
});

bot.on('callback_query', async (ctx, next) => {

    ctx.log(`User ${ctx.from.id} quered callback (inline button)`);
    try {
        const user = await db.getUserByID(ctx.from.id);

        if (user !== null) {
            ctx.session.recoveryMode = true;
            ctx.log(`^^^^ Recovery mode: ${ctx.session.recoveryMode}`);
            return ctx.scene.enter(user.state);
        }
        ctx.log(`\t\tRecovery mode: ${ctx.session.recoveryMode}`);
        return next();
    } catch (e) {
        throw new Error(`Error in <bot.on_callback_query> of <index> file --> ${e.message}`);
    }
});

bot.on('my_chat_member', ctx => {
    try {
        const upd = ctx.update.my_chat_member;
        ctx.log(`Chat_member status mdlwre was triggered by ${ctx.chat.id}  [${upd.old_chat_member.status} -> ${upd.new_chat_member.status}]`);
        return;
    } catch (e) {
        throw new Error(`Error in <bot.on_my_chat_member> of <index> file --> ${e.message}`);
    }
});

bot.on('message', async ctx => {
    try {
        await ctx.telegram.sendMessage(require('./env').ADMIN_CHAT_ID, `Corruptive message by ${ctx.chat.id} user`);
        ctx.logObject(ctx.update);
        return ctx.reply('Пожалуйста, используйте текстовые команды. В случае нарушения работы Вы можете перезапустить бота /home');
    } catch (e) {
        throw new Error(`Error in <bot.on_message> of <index> file --> ${e.message}`);
    }
});

bot.use(ctx => {
    try {
        ctx.log(`Junkyard triggered by ${ctx.chat.id} user with update: `);
        ctx.logObject(ctx.update);

        return ctx.telegram.sendMessage(require('./env').ADMIN_CHAT_ID, 
            `Junkyard triggered by ${ctx.chat.id} user`);
    } catch (e) {
        throw new Error(`Error in <bot.use> of <index> file --> ${e.message}`);
    }
});

// _________________________________________________________

bot.catch((err, ctx) => {
    
    ctx.logError(ctx, err);
    return ctx.telegram.sendMessage(require('./env').ADMIN_CHAT_ID,
        `Ошибка 
        Update type: ${ctx.updateType} 
        Chat ID: ${ctx.chat.id}
        Message: ${err.message} 
        Время: ${Date()}`
    );
});  

bot.launch().then(async () => {
    try {
        await db.connect();
    } catch (e) {
        ctx.log('Failed to connect to MongoDB: ' + e.message);
    }
});
