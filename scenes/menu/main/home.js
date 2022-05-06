const { Scenes, Markup, session } = require("telegraf");

const scenes = require('../../scenes');
const db = require('../../../database/database');

const User = require('../../../models/user');
const Meal = require('../../../models/meal');

// ______________________________________________

// Markup keyboard keys text
const keys = {
    makeReport: 'Сделать отчёт',
    mealPlan: 'План питания',
    info: 'Справка',
    meals: 'Изменить режим питания',
    data: 'Изменить данные',
};

// Markup keyboard keys iselves
const keyboard = Markup.keyboard(
    [
        [ keys.makeReport ],
        [ keys.mealPlan, keys.info ],
        [ keys.meals, keys.data ],
    ]
).resize();

const infoKeyboard = require('./info').inlineKeyboard;

// ____________________________________________________________

const scene = new Scenes.BaseScene(scenes.id.menu.main);

scene.hears(keys.meals, ctx => {
    return ctx.scene.enter(scenes.id.setter.meals);
})

scene.hears(keys.data, ctx => {
    return ctx.scene.enter(scenes.id.menu.changeData.home);
});

// - - - - - - - - - - - - - - - - - - - - -

// sending checkIn request if it's time
scene.on('message', async (ctx, next) => {

    const user = await User.findById(ctx.from.id);

    const markup = Markup.inlineKeyboard(
        [
            Markup.button.callback('Обновить данные', `CHECK_IN_ACTION`),
        ],
    );

    if (!(user.checked.bool)) {
        setTimeout(() => ctx.reply('Мы хотим проверить ваши результаты за неделю. Обновите свой текущий вес и замеры.',
            markup), 800);
    }

    return next();
});

// - - - - - - - - - - - - - - - - - - - - -

scene.enter(async ctx => {

    try {
        // if the bot was rebooted and the session is now empty
        if (ctx.session.recoveryMode == true) {
            try {
                // handles the update according to scene mdlwres
                ctx.session.recoveryMode = false;
                return ctx.handleRecovery(scene, ctx);
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

scene.hears(keys.makeReport, ctx => {
    const reportKeybord = Markup.inlineKeyboard(
        [
            Markup.button.url('Перейти в калькулятор', `coldysuit.xyz?user=${ctx.from.id}`),
        ],
    );
    
    try {
        return ctx.reply('Чтобы узнать, сколько калорий вы потребили, сколько нужно и сколько осталось - воспользуйтесь нашим калькулятором', 
        reportKeybord);
    } catch (e) {
        throw new Error(`Error in <hears_makeReport> middleware of <scenes/menu/main/home> file --> ${e.message}`);
    }
});

scene.hears(keys.mealPlan, async ctx => {
    try {
        // get all the meals from DB
        const data = await Meal.find({ $or: [ { group: 'proteins' }, { group: 'fats' }, { group: 'carbons' } ] });

        // init objects 
        let meals = { 'proteins': [], 'fats': [], 'carbons': [] };

        // get the data to the object by its groups
        for (let food of data) {
            meals[food.group].push(food);
        }

        // generate text
        let text = 'Продукты, рекомендованные к потреблению. Содержание калорий и нутриентов на 100г пищи';

        // proteins
        text += '\n\n    <b>Белки:</b> \n';
        for (let food of meals.proteins) {
            text += `<i>${food.name}</i> - ${(food.calories * 100).toFixed(1)} кал |  ` +
                `Б/Ж/У  ${(food.proteins * 100).toFixed()}г / ${(food.fats * 100).toFixed(1)}г / ${(food.carbons * 100).toFixed(1)}г` + '\n';
        }

        // fats
        text += '\n\n    <b>Жиры</b>: \n';
        for (let food of meals.fats) {
            text += `<i>${food.name}</i> - ${(food.calories * 100).toFixed(1)} кал |  ` +
                `Б/Ж/У  ${(food.proteins * 100).toFixed(1)}г / ${(food.fats * 100).toFixed(1)}г / ${(food.carbons * 100).toFixed(1)}г` + '\n';
        }

        // carbons
        text += '\n\n    <b>Углеводы</b>: \n';
        for (let food of meals.carbons) {
            text += `<i>${food.name}</i> - ${(food.calories * 100).toFixed(1)} кал |  ` +
                `Б/Ж/У  ${(food.proteins * 100).toFixed(1)}г / ${(food.fats * 100).toFixed(1)}г / ${(food.carbons * 100).toFixed(1)}г` + '\n';
        }

        return ctx.replyWithHTML(text);
    } catch (e) {
        throw new Error(`Error in <hears_mealPlan> middleware of <scenes/menu/main/home> file --> ${e.message}`);
    }
});

scene.use(require('./info').composer);
scene.hears(keys.info, ctx => {

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

scene.on('message', ctx => {
    return ctx.reply('Используйте клавиаутуру меню');
});

// __________________________________________________

module.exports = scene;
