// get today's day of week
module.exports.getToday = () => {
  let days = [
    "воскресенье",
    "понедельник",
    "вторник",
    "среда",
    "четверг",
    "пятница",
    "суббота",
  ];

  const today = new Date();
  return days[today.getDay()];
};

// - - - - - - - - - - - - - - - - - - - - - - - - //

const axios = require("axios").default;
const Meal = require("../services/meal.service");

module.exports.generateMealPlan = async (userID) => {
  const groupAtoi = {
    proteins: 0,
    fats: 1,
    carbons: 2,
  };

  try {
    // get the report object from web-app
    const response = await axios.get(
      `http://${process.env.WEB_APP_URL}?user=${userID}&bot=1`
    );
    if (response.status !== 200) {
      throw new Error(
        `Error on fetching report from web-app: ${response.statusText}`
      );
    }
    const report = response.data;

    // get all the meals from DB
    const mealsData = await Meal.getHealthyMeals();

    // generate text
    let text = `Ваша калорийность на этой неделе составляет <b>${report.calories.target} кал</b> \n\n`;
    text +=
      "Примерный план питания показывает определённый набор продуктов, в которых содержится сбалансированное количество нутриентов (БЖУ). " +
      "При подборе рациона используйте данный перечень как образец; в каждом из продуктов указана порция в граммах, рассчитанная на основании Ваших показателей. \n\n";

    // push tabs to array
    // we always have breakfadt
    let tabs = [report.tabs[0]];

    // if mealsPerDay == 4, we have to add lunch 1 to plan
    if (report.mealsPerDay > 3) tabs.push(report.tabs[1]);
    else tabs.push(null);

    // we always have dinner
    tabs.push(report.tabs[2]);

    // if mealsPerDay == 5, we have to add lunch 2 to plan
    if (report.mealsPerDay == 5) tabs.push(report.tabs[3]);
    else tabs.push(null);

    // we always have supper
    tabs.push(report.tabs[4]);

    // generating tabs text
    const tabNames = ["Завтрак", "Перекус 1", "Обед", "Перекус 2", "Ужин"];
    for (let i in tabs) {
      // skip the empty tab
      if (!tabs[i]) continue;

      // header
      text += `\n<b><u>${tabNames[i]}</u></b>` + "\n";

      // these arrays will be later added to tab text
      const groupsText = {
        proteins: [],
        fats: [],
        carbons: [],
      };

      // for all the meals
      for (let food of mealsData) {
        // if this food included to tab, calc and add
        if (food.plan[i]) {
          // this food's nutrient object
          const nutrient = tabs[i].nutrients[groupAtoi[food.group]];
          // weight to be eaten
          const weight = nutrient.calories.target / food.calories;

          let tmpText = `• <i>${food.name}</i> — `;

          // EGGS EGGS: if this food is egg, should be added count but not weight
          // count 1 egg equal 100g
          if (`${food._id.toString()}` == "62698bacaec76b49a8b91712") {
            tmpText += `${(weight / 100).toFixed()} шт | ${(
              food.calories * 100
            ).toFixed()} кал на 1 шт`;
          } else {
            tmpText += `${weight.toFixed()}г | ${(
              food.calories * 100
            ).toFixed()} кал на 100г`;
          }

          tmpText += "\n";

          // pushing new group string to its group array
          groupsText[food.group].push(tmpText);
        }
      }

      text += "   <b>Белки:</b> \n";
      text += groupsText.proteins.join("");

      text += "\n   <b>Жиры:</b> \n";
      text += groupsText.fats.join("");

      text += "\n   <b>Углеводы:</b> \n";
      text += groupsText.carbons.join("");

      text += "\n";
    }

    return text;
  } catch (e) {
    throw new Error(
      `Error in <generate_mealPlan> tool of <hears_mealPlan> middleware of <main.menu> scene --> ${e.message}`
    );
  }
};
