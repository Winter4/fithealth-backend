const {Telegraf, Scenes, Stage, session} = require('telegraf');
const db = require('./database/database');

require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN);

// ______________________________________

// if u want to add a parameter and create a scene for its setting,
// u should update these:
/**
 * 1. scenes/scenes.js > ib & object
 * 2. complete necessary new_scene.js file (don't forget to handle recovery mode)
 * 3. index.js > stage
 * 4. index.js > empty user in bot.start (new user init, else branch)
 * 5. models/user.js > user model
 * 6. database/database.js > saveUserFromContext function
 * 7. ..menu/changeData > add necessary buttons & its middleware
 * 
 * in some time, this sttructure may turn out to be bad & unproffesional,
 * but in the moment I'm writing it - this is the best of my skills :)
 */

// to be think of: wizards-setters, bas imports, saveUser refactor
// TODO: Beauify (comments, ">', straight the rows, Composers (changeData menu))
// TODO: mealPlan import Sex type
// TODO: !!!!! REFACTOR SAVEUSERFROMCONEXT !!!!!!

// _______________________________________________________________________

const scenes = require('./scenes/scenes');
const stage = new Scenes.Stage([

    scenes.object.setter.name(scenes.id.setter.name, ctx => ctx.session.setConfig ? scenes.id.setter.sex : db.saveUserFromContext(ctx)),
    scenes.object.setter.sex(scenes.id.setter.sex, ctx => ctx.session.setConfig ? scenes.id.setter.startWeight : db.saveUserFromContext(ctx)),
    scenes.object.setter.startWeight(scenes.id.setter.startWeight, ctx => ctx.session.setConfig ? scenes.id.setter.targetWeight : db.saveUserFromContext(ctx)),
    scenes.object.setter.targetWeight(scenes.id.setter.targetWeight, ctx => ctx.session.setConfig ? scenes.id.setter.height : db.saveUserFromContext(ctx)),
    scenes.object.setter.height(scenes.id.setter.height, ctx => ctx.session.setConfig ? scenes.id.setter.age : db.saveUserFromContext(ctx)),
    scenes.object.setter.age(scenes.id.setter.age, ctx => ctx.session.setConfig ? scenes.id.setter.activity : db.saveUserFromContext(ctx)),
    scenes.object.setter.activity(scenes.id.setter.activity, ctx => ctx.session.setConfig ? scenes.id.setter.measure.chest : db.saveUserFromContext(ctx)),

    scenes.object.setter.measure.chest(scenes.id.setter.measure.chest, ctx => ctx.session.setConfig ? scenes.id.setter.measure.waist : db.saveUserFromContext(ctx)),
    scenes.object.setter.measure.waist(scenes.id.setter.measure.waist, ctx => ctx.session.setConfig ? scenes.id.setter.measure.hip : db.saveUserFromContext(ctx)),
    scenes.object.setter.measure.hip(scenes.id.setter.measure.hip, ctx => db.saveUserFromContext(ctx)),

    scenes.object.menu.main,
    scenes.object.menu.changeData.home,
    scenes.object.menu.changeData.measures,
    scenes.object.menu.changeData.weights,
]);

bot.use(session());
bot.use(stage.middleware());

// _______________________________________

bot.context.log = msg => {
    console.log(`${Date()}  |  ${msg}`);
};

bot.context.logObject = object => {
    console.log(object);
    console.log('_________________END__OF__OBJECT____________________');
}

bot.context.logError = (ctx, err, dirname) => {
    console.log(`${Date()}  |  Error in ${dirname} 
        Update type: ${ctx.updateType} 
        Chat ID: ${ctx.chat.id}
        Message: ${err.message}
        Raw error: ${err}  \n`
    );
};

bot.context.handleRecovery = async (scene, ctx) => {
    try {
        const handler = await scene.middleware();
        return await handler(ctx, Promise.resolve());
    } catch (e) {
        ctx.logError(ctx, e, __dirname);
    }
};

// _________________________________________________

bot.start(async ctx => {

    try {
        if (await db.userExists(ctx.from.id)) {

            ctx.log(`User ${ctx.chat.id} is back`);

            ctx.session.setConfig = false;
            return ctx.scene.enter(scenes.id.menu.main);
        }
        else {
            ctx.session.user = {
                name: undefined,
                sex: undefined,age: undefined,
                startWeight: undefined,
                targetWeight: undefined,
                height: undefined,
                age: undefined,
                activity: undefined,
                
                measures: {
                    chest: undefined,
                    waist: undefined,
                    hip: undefined
                }
            }
            
            ctx.log(`New ${ctx.chat.id} user`);
            await ctx.reply(
                'Приветcтвую! Это Ваш первый шаг к приобретению тела мечты. ' +
                'Команда тренеров нашего приложения рада видеть Вас здесь и сделает все, ' + 
                'чтобы помочь достигнуть лучшего результата!'
            );
    
            ctx.session.setConfig = true;
            return ctx.scene.enter(scenes.id.setter.name);
        }
    } catch (e) {
        ctx.logError(ctx, e, __dirname);
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
        ctx.logError(ctx, e, __dirname);
    }
});

bot.on('my_chat_member', () => {
    return;
});

bot.use(ctx => {

    ctx.reply('Кажется, что-то пошло не так. Пожалуйста, перезапустите бота /start');

    ctx.log(`Junkyard triggered by ${ctx.chat.id} user with update: `);
    ctx.logObject(ctx.update);

    return ctx.telegram.sendMessage(process.env.ADMIN_CHAT_ID, 
        `Junkyard triggered by ${ctx.chat.id} user`);
});

// _________________________________________________________

bot.catch((err, ctx) => {
    ctx.log(`Catch triggered by ${ctx.chat.id} user`);
    return ctx.telegram.sendMessage(process.env.ADMIN_CHAT_ID,
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