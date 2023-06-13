import { Activity, Target } from "@prisma/client";
import { CustomContext } from "@bot/types";
import { NextFunction } from "grammy";

function matchActivity(activity: Activity) {
  // prettier-ignore
  switch (activity) {
    case "ZERO":   return 1.2;
    case "LOW":    return 1.375;
    case "MIDDLE": return 1.55;
    case "HIGH":   return 1.95;
  }
}

function matchTarget(target: Target) {
  // prettier-ignore
  switch (target) {
    case "LOSE": return 0.9;
    case "KEEP": return 1;
    case "GAIN": return 1.1;
  }
}

export async function calcCaloriesMiddleware(ctx: CustomContext, next: NextFunction) {
  const user = await ctx.db.user.findUnique({
    where: { tg_id: ctx.from!.id.toString() },
  });
  if (!user) throw new Error(`Can't find User object; TG ID = ${ctx.from!.id}`);

  const { sex, weight, height, age, activity, target } = user;
  if (!sex || !weight || !height || !age || !activity || !target) return next();

  const sexParam = sex === "M" ? 5 : -161;
  const activityParam = matchActivity(activity);
  const targetParam = matchTarget(target);

  const caloriesLimit =
    (10 * weight + 6.25 * height - 5 * age + sexParam) * activityParam * targetParam;

  await ctx.db.user.update({
    where: { tg_id: ctx.from!.id.toString() },
    data: { calories_limit: Math.round(caloriesLimit) },
  });

  return next();
}

// - - - - - - - //

export const backButton = "⬅️ Назад";

// - - - - - - - //

export async function getUserInfo(ctx: CustomContext) {
  const userInfo = await ctx.db.user.findUnique({
    where: { tg_id: ctx.from!.id.toString() },
    select: {
      sex: true,
      weight: true,
      height: true,
      age: true,
      activity: true,
      target: true,
      calories_limit: true,
    },
  });
  if (!userInfo) throw new Error(`Can't find User object; TG ID = ${ctx.from!.id}`);

  const sexText = userInfo.sex === "M" ? "🚻 Пол: мужской" : "🚻 Пол: женский";

  let activityText = "🏸 Активность: ";
  switch (userInfo.activity) {
    case "ZERO":
      activityText += "нулевая";
      break;
    case "LOW":
      activityText += "маленькая";
      break;
    case "MIDDLE":
      activityText += "средняя";
      break;
    case "HIGH":
      activityText += "высокая";
      break;
  }

  let targetText = "✴️ Цель: ";
  switch (userInfo.target) {
    case "LOSE":
      targetText += "похудение";
      break;
    case "KEEP":
      targetText += "удержание веса";
      break;
    case "GAIN":
      targetText += "набор веса";
      break;
  }

  const text =
    `${sexText}\n` +
    `⚖️ Вес: ${userInfo.weight} кг\n` +
    `⏫ Рост: ${userInfo.height} см\n` +
    `🍼 Возраст: ${userInfo.age} лет\n` +
    `${activityText}\n` +
    `${targetText}\n\n` +
    `🦑 Суточная норма потребления: ${userInfo.calories_limit} ккал`;

  return text;
}

// - - - - - - - //

export const infoText = `
⭐️ Добро пожаловать в FitHealth - Ваш личный дневник питания. Этот бот поможет Вам отследить и улучшить свой рацион без труда

Сейчас вы находитесь в Главном меню. Вы всегда можете воспользоваться командой /start чтобы вернуться сюда

Для перехода в дневник питания и редактирования своего рациона - воспользуйтесь кнопкой "Моё питание". В ответ на её нажатие вы получите сообщение с URL-кнопкой; нажав её, Вы перейдёте в браузер и получите доступ к своему дневнику. Ваша ссылка - уникальна! Никому её не показывайте и не давайте, иначе это может привести к перехвату контроля над вашим дневником питания

Для редактирования Ваших физических данных, введённых в процессе регистрации, воспользуйтесь кнопкой "Изменить данные". С её помощью Вы попадёте в меню редактирования, где сможете нажатием на соответствующую кнопку перейти в форму ввода. Если Вы перешли в форму, и передумали менять значение, воспользуйтесь командой /start

Для перехода в меню анализа, воспользуйтесь кнопкой "Анализ питания". Вы получите краткое описание доступных вам функций, и сможете воспользоваться ими нажатием на соответствующую кнопку

Этот бот испольует формулу Миффлина – Сан Жеора для рассчёта необходимого количества калорий. На данный момент эта формула признана одной из самых точных, но лишь при условии, что ваш процент мышечной и жировой массы находится в рамках обычного здорового человека. Этот бот не сможет рассчитать корректное количество калорий, если Вы профессиональный спортсмен, культурист или бодибилдер. Также, эта формула будет некорректной, если Вам диагностировали ожирение любой стадии, или любое другое заболевание, связанное с питанием. В этом случае использование бота противопоказано. Вам стоит немедленно обратиться к врачу!

В остальном, Вы сможете получить достаточно точное количество калорий, необходимых Вашему организму в день. Комбинируйте здоровое питание и физическую активность, занятия спортом, и Вы непременно достигнете желаемого результата! Желаем Вам удачи в достижении высочайших результатов!
`;
