const {Scenes, Markup} = require('telegraf');

const composeWizardScene = require('../factory/factory').composeWizardScene;

// _________________________________

const Activity = {
    zero: '1. Почти нет',
    low: '2. Небольшая',
    middle: '3. Умеренная',
    high: '4. Высокая'
};

// __________________________________

const activityKeyboard = Markup.keyboard(
    [
        [Activity.zero, Activity.low],
        [Activity.middle, Activity.high]
    ]
).resize();

// __________________________________

const setActivityScene = composeWizardScene(
    ctx => {
        ctx.reply(
            'Выберите Вашу активность: \n\n' +
             '1 - Почти нет активности - сидячий образ жизни, отсутствие тренировок \n' +
             '2 - Небольшая активность - малая физ. нагрузка, тренировки 1-3 раза/нед \n' +
             '3 - Умеренная активность - большая физ. нагрузка, тренировки  3-4 раза/нед \n' +
             '4 - Высокая активность - большая физ. нагрузка, тренировки 5-6 раз/нед', 
            activityKeyboard);

        return ctx.wizard.next();
    },
    async (ctx, done) => {
        if (ctx.message.text) {

            let rate = 0;

            switch (ctx.message.text) {
                case Activity.zero:
                    rate = 1.2;
                    break;
                    
                case Activity.low:
                    rate = 1.375;
                    break;

                case Activity.middle:
                    rate = 1.55;
                    break;

                case Activity.high:
                    rate = 1.95;
                    break;
                
                default:
                    return ctx.reply('Пожалуйста, используйте клавиатуру');
            }

            ctx.session.user.activity = rate;
            return done();
        }
        else {
            return ctx.reply('Пожалуйста, используйте клавиатуру');            
        }
    }
);

module.exports = setActivityScene;