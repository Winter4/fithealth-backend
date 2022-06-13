const { Composer } = require("telegraf");

const setName = require("./setters/name.setter");
const setSex = require("./setters/sex.setter");
const setHeight = require("./setters/height.setter");
const setAge = require("./setters/age.setter");
const setActivity = require("./setters/activity.setter");

const setCurrentWeight = require("./setters/weights/current.weight.setter");
const setTargetWeight = require("./setters/weights/target.weight.setter");

const setChestMeasure = require("./setters/measures/chest.measure.setter");
const setWaistMeasure = require("./setters/measures/waist.measure.setter");
const setHipMeasure = require("./setters/measures/hip.measure.setter");

const setMeals = require("./setters/meals.setter");

const mainMenu = require("./menus/main/home.menu.main");
const stepsCounter = require("./setters/steps.counter");

const changeDataMenu = require("./menus/change-data/home.menu.change-data");

const finish = require("./finish.scene");

// - - - - - - - - - - - - - - - - - - - - - - - - //

function route(ctx, state) {
  return ctx.user.state === state;
}

// - - - - - - - - - - - - - - - - - - - - - - - - //

const scenes = new Composer();

// name setter middleware
scenes.use(
  Composer.optional((ctx) => route(ctx, setName.id), setName.middleware)
);
// sex setter middleware
scenes.use(
  Composer.optional((ctx) => route(ctx, setSex.id), setSex.middleware)
);
// height setter middleware
scenes.use(
  Composer.optional((ctx) => route(ctx, setHeight.id), setHeight.middleware)
);
// age setter middleware
scenes.use(
  Composer.optional((ctx) => route(ctx, setAge.id), setAge.middleware)
);
// activity setter middleware
scenes.use(
  Composer.optional((ctx) => route(ctx, setActivity.id), setActivity.middleware)
);

// current weight setter middleware
scenes.use(
  Composer.optional(
    (ctx) => route(ctx, setCurrentWeight.id),
    setCurrentWeight.middleware
  )
);
// target weight setter middleware
scenes.use(
  Composer.optional(
    (ctx) => route(ctx, setTargetWeight.id),
    setTargetWeight.middleware
  )
);

// chest measure setter middleware
scenes.use(
  Composer.optional(
    (ctx) => route(ctx, setChestMeasure.id),
    setChestMeasure.middleware
  )
);
// waist measure setter middleware
scenes.use(
  Composer.optional(
    (ctx) => route(ctx, setWaistMeasure.id),
    setWaistMeasure.middleware
  )
);
// hip measure setter middleware
scenes.use(
  Composer.optional(
    (ctx) => route(ctx, setHipMeasure.id),
    setHipMeasure.middleware
  )
);
// meals per day setter middleware
scenes.use(
  Composer.optional((ctx) => route(ctx, setMeals.id), setMeals.middleware)
);

// main menu middleware
scenes.use(
  Composer.optional((ctx) => route(ctx, mainMenu.id), mainMenu.middleware)
);
// steps counter middleware
scenes.use(
  Composer.optional(
    (ctx) => route(ctx, stepsCounter.id),
    stepsCounter.middleware
  )
);

// change data menu middleware
scenes.use(
  Composer.optional(
    (ctx) => route(ctx, changeDataMenu.id),
    changeDataMenu.middleware
  )
);

// finish scene middleware
scenes.use(
  Composer.optional((ctx) => route(ctx, finish.id), finish.middleware)
);

module.exports.middleware = scenes;
