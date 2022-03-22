const {Telegraf, Scenes, Markup, session} = require('telegraf');
const db = require('./database/database');

require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN);

// ______________________________________

// if u want to add a parameter and create a scene for its setting,
// u should update these:
/**
 * 1. scenes/scenes.js > ib & object
 * 2. complete necessary new_scene.js file
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
// TODO: parse main menu message

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

bot.start(async ctx => {
    const userID = ctx.message.from.id;
    
    if (await db.userExists(userID)) {
        ctx.session.setConfig = false;
        ctx.scene.enter(scenes.id.menu.main);
    }
    else {
        ctx.session.setConfig = true;
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
        
        await ctx.reply(
            'Приветcтвую! Это Ваш первый шаг к приобретению тела мечты. ' +
            'Команда тренеров нашего приложения рада видеть Вас здесь и сделает все, ' + 
            'чтобы помочь достигнуть лучшего результата!'
        );

        ctx.scene.enter(scenes.id.setter.name);
    }
});

bot.catch((err, ctx) => {
    ctx.reply('Error: ' + err.message);
});

bot.launch().then(async () => await db.connect());