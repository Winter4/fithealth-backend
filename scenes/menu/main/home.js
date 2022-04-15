const { Scenes, Markup, session } = require("telegraf");

const scenes = require('../../scenes');
const db = require('../../../database/database');

// ______________________________________________

const keys = {
    makeReport: 'Сделать отчёт',
    mealPlan: 'План питания',
    info: 'Справка',
    meals: 'Изменить режим питания',
    data: 'Изменить данные',
};

const keyboard = Markup.keyboard(
    [
        [ keys.makeReport ],
        [ keys.mealPlan, keys.info ],
        [ keys.meals, keys.data ],
    ]
).resize();

const infoKeyboard = require('./info').inlineKeyboard;

// ____________________________________________________________

const mainMenuScene = new Scenes.BaseScene(scenes.id.menu.main);

mainMenuScene.enter(async ctx => {

    try {
        if (ctx.session.recoveryMode == true) {
            try {
                ctx.session.recoveryMode = false;
                return ctx.handleRecovery(mainMenuScene, ctx);
            } catch (e) {
                throw new Error(`Error on handling recovery: ${e.message} \n`);
            }
        }
        const userID = ctx.from.id;
        db.setUserState(userID, scenes.id.menu.main);
        
        const user = await db.getUserByID(userID);
        
        let text = `Приветствую, ${user.name}!`;
        let today = new Date();
        let days = [
            'воскресенье',
            'понедельник',
            'вторник',
            'среда',
            'четверг',
            'пятница',
            'суббота',
        ]
        text += `\nСегодня ${days[today.getDay()]}`;

        text += `\nВаш пол: ${user.sex.toLowerCase()}`;
        text += `\nВаш возраст: ${user.age}`; 
        text += `\nВаш рост: ${user.height}`;

        text += '\n\nМы верим, что у Вас всё получится! \nВсё в Ваших руках, не сдавайтесь!\n';

        text += `\nНачальный вес: ${user.startWeight} кг`;
        text += `\nТекущий вес: ${user.currentWeight} кг`;
        text += `\nЖелаемый вес: ${user.targetWeight} кг`;

        text += `\nЗамеры (Г/Т/Б): ${user.chestMeasure}/${user.waistMeasure}/${user.hipMeasure} см`;
        text += `\nРежим питания: ${user.mealsPerDay} р/день`;

        return ctx.replyWithPhoto(
            { source: 'images/main-menu.jpg' },
            {
                caption: text,
                ...keyboard,
            },
        );
    } catch (e) {
        throw new Error(`Error in <enter> middleware of <scenes/menu/main/home> file --> ${e.message}`);
    }
});

// ______________________________________________________________

mainMenuScene.hears(keys.makeReport, ctx => {
    const reportKeybord = Markup.inlineKeyboard(
        [
            Markup.button.url('Перейти в калькулятор', `coldysuit.xyz?id=${ctx.from.id}`),
        ],
    );
    
    try {
        return ctx.reply('Чтобы узнать, сколько калорий вы потребили, сколько нужно и сколько осталось - воспользуйтесь нашим калькулятором', 
        reportKeybord);
    } catch (e) {
        throw new Error(`Error in <hears_makeReport> middleware of <scenes/menu/main/home> file --> ${e.message}`);
    }
});

mainMenuScene.hears(keys.mealPlan, async ctx => {

    try {
        const user = await db.getUserByID(ctx.from.id);

        const sexParam = user.sex == 'Мужской' ? 5 : -161;
        let basicCaloricIntake = 
            10 * user.startWeight + 
            6.25 * user.height -
            5 * user.age +
            sexParam
        ;
        basicCaloricIntake *= user.activity;
        basicCaloricIntake = basicCaloricIntake.toFixed();

        const lessCaloricIntake = (basicCaloricIntake * 0.8).toFixed();
        const moreCaloricIntake = (basicCaloricIntake * 1.2).toFixed();

        let text = 'Ваша дневная норма калорий в зависимости от желаемого результата: \n'
        text += `- <b><i>Поддержание</i></b> веса: ${basicCaloricIntake} \n`;
        text += `- <b><i>Снижение</i></b> веса: ${lessCaloricIntake} \n`;
        text += `- <b><i>Набора</i></b> веса: ${moreCaloricIntake} \n`;

        return ctx.replyWithHTML(text);
    } catch (e) {
        throw new Error(`Error in <hears_mealPlan> middleware of <scenes/menu/main/home> file --> ${e.message}`);
    }
});

mainMenuScene.use(require('./info').composer);
mainMenuScene.hears(keys.info, ctx => {

    try {
        let text = '';
        text += '1️⃣ Как работать с приложением? \n\n';
        text += '2️⃣ Как составить завтрак? \n\n';
        text += '3️⃣ Как составить обед? \n\n';
        text += '4️⃣ Как составить ужин и перекус? \n\n';
        text += '5️⃣ Когда есть и как готовить? \n\n';
        text += '6️⃣ Как пить и что с овощами? \n\n';
        text += '7️⃣ Как делать отчет о питании и активности? \n\n';
        text += '8️⃣ Как делать повторные замеры? \n\n';
        text += '9️⃣ Как использовать читмил? \n\n';

        return ctx.reply(text, infoKeyboard);
    } catch (e) {
        throw new Error(`Error in <hears_info> middleware of <scenes/menu/main/home> file --> ${e.message}`);
    }
});

mainMenuScene.hears(keys.meals, ctx => {
    return ctx.scene.enter(scenes.id.setter.meals);
})

mainMenuScene.hears(keys.data, ctx => {
    return ctx.scene.enter(scenes.id.menu.changeData.home);
});

mainMenuScene.on('message', ctx => {
    return ctx.reply('Используйте клавиаутуру меню');
});

// __________________________________________________

module.exports = mainMenuScene;
