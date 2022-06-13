const { Composer, Markup } = require("telegraf");
const path = require("path");

const User = require("../../../services/user.service");
const { getToday } = require("../../../utils/utils");
const stepsCounter = require("../../setters/steps.counter");

const scene = new Composer();

// - - - - - - - - - - - - - - - - - - - - - - - - //

// Markup keyboard keys text
const keys = {
  makeReport: "📅 Сделать отчёт",
  mealPlan: "🥑 План питания",
  info: "❔ Справка",
  meals: "✏️ Изменить режим питания",
  data: "📃 Изменить данные",
};

// Markup keyboard keys iselves
const keyboard = Markup.keyboard([
  [keys.makeReport],
  [keys.mealPlan, keys.info],
  [keys.meals, keys.data],
]).resize();

const SCENE_ID = "MAIN_MENU";

// - - - - - - - - - - - - - - - - - - - - - - - - //

function generateText(user) {
  let text = "";

  text += `Приветствую, ${user.name}! \n`;
  text += `Сегодня ${getToday()} \n`;
  text += `\nВаш пол: ${user.sex.toLowerCase()}`;
  text += `\nВаш возраст: ${user.age}`;
  text += `\nВаш рост: ${user.height} см`;

  text +=
    "\n\nМы верим, что у Вас всё получится! \nВсё в Ваших руках, не сдавайтесь!\n";

  text += `\nНачальный вес: ${user.startWeight} кг`;
  text += `\nТекущий вес: ${user.currentWeight} кг`;
  text += `\nЖелаемый вес: ${user.targetWeight} кг`;

  text += `\nЗамеры (Г/Т/Б): ${user.chestMeasure}/${user.waistMeasure}/${user.hipMeasure} см`;
  text += `\nРежим питания: ${user.mealsPerDay} р/день`;

  return text;
}

async function enter(ctx) {
  try {
    // update state
    await User.set.state(ctx.chat.id, SCENE_ID);

    const photoSource = path.join(process.env.IMAGES_DIR, "main-menu.jpg");
    return ctx.replyWithPhoto(
      { source: photoSource },
      {
        caption: generateText(await User.get.object(ctx.chat.id)),
        ...keyboard,
      }
    );
  } catch (e) {
    throw new Error(
      `Error in <enter> middleware of <main.menu> scene --> ${e.message}`
    );
  }
}

scene.hears(keys.makeReport, (ctx) => {
  const reportKeyboard = Markup.inlineKeyboard([
    [
      Markup.button.url(
        "Отчёт по питанию",
        `${process.env.WEB_APP_URL}?user=${ctx.from.id}`
      ),
    ],
    [Markup.button.callback("Отчёт по количеству шагов", "STEPS_ACTION")],
  ]);

  try {
    return ctx.reply(
      "Ежедневный контроль Вашего питания и физический активности неминуемо приведёт к достижению поставленных целей!",
      reportKeyboard
    );
  } catch (e) {
    throw new Error(
      `Error in <hears_makeReport> middleware of <main.menu> scene --> ${e.message}`
    );
  }
});
scene.action("STEPS_ACTION", (ctx) => {
  ctx.answerCbQuery();
  return stepsCounter.enter(ctx);
});

scene.use(require("./info.handler.menu.main").middleware);
const { infoKeyboard } = require("./info.handler.menu.main");
scene.hears(keys.info, (ctx) => {
  try {
    let text = "";
    text += "1️⃣ Как работать с приложением? \n\n";
    text += "2️⃣ Как составить завтрак? \n\n";
    text += "3️⃣ Как составить обед? \n\n";
    text += "4️⃣ Как составить ужин? \n\n";
    text += "5️⃣ Как составить перекус? \n\n";
    text += "6️⃣ Когда есть и как готовить? \n\n";
    text += "7️⃣ Как пить и что с овощами? \n\n";

    return ctx.reply(text, infoKeyboard);
  } catch (e) {
    throw new Error(
      `Error in <hears_info> middleware of <main.menu> scene --> ${e.message}`
    );
  }
});

const { generateMealPlan } = require("../../../utils/utils");
scene.hears(keys.mealPlan, async (ctx) => {
  try {
    const text = await generateMealPlan(ctx.chat.id);

    return ctx.replyWithHTML(text);
  } catch (e) {
    throw new Error(
      `Error in <hears_mealPlan> middleware of <main.menu> scene --> ${e.message}`
    );
  }
});

scene.on("message", (ctx) => {
  return ctx.reply("Возможно, вы хотели использовать клавиатуру?");
});

// - - - - - - - - - - - - - - - - - - - - - - - - //

module.exports = {
  id: SCENE_ID,
  enter,
  middleware: scene,
};
