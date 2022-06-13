const { Composer, Markup } = require("telegraf");

const User = require("../services/user.service");

const scene = new Composer();

const SCENE_ID = "FINISH";

// - - - - - - - - - - - - - - - - - - - - - - - - //

const ACTION = "RESTART";
const keyboard = Markup.inlineKeyboard([
  Markup.button.callback("🔄 Начать новый цикл", ACTION),
]);

async function enter(ctx) {
  try {
    await User.set.state(ctx.chat.id, SCENE_ID);

    let text = null;
    const name = ctx.user.name;

    const dif = ctx.user.startWeight - ctx.user.currentWeight;
    if (dif < 0) {
      text = `${name}, Вы показали стремление и силу воли, однако этого оказалось недостаточно для достижения результата! Мы уверены, что в следующем цикле у Вас точно всё получится!`;
    } else if (dif >= 3) {
      text =
        `${name}, поздравляем, вы похудели на ${dif} кг! Это отличный результат, мы гордимся Вами!` +
        `Мы будем очень рады поработать с вами в следующем 4х-недельном цикле трансформации Вашего тела. Мы уверены, что Вы можете ещё лучше, у Вас отличная самоорганизации и вы чётко выполняете все рекомендации!`;
    } else {
      text = `${name}, поздравляем Вас с завершением 4х-недельного цикла! Ждём Вас в следующем цикле трансформации Вашего тела!`;
    }

    return ctx.reply(text, keyboard);
  } catch (e) {
    throw new Error(
      `Error in <enter> middleware of <finish> scene --> ${e.message}`
    );
  }
}

scene.action(ACTION, (ctx) => {
  ctx.answerCbQuery();

  return ctx.reply("new cycle");
});

scene.on("message", (ctx) => {
  return ctx.reply(
    "Ваш 4х-недельный цикл подошёл к концу. Чтобы начать новый цикл, воспользуйтесь кнопкой",
    keyboard
  );
});

// - - - - - - - - - - - - - - - - - - - - - - - - //

module.exports = {
  id: SCENE_ID,
  enter,
  middleware: scene,
};
