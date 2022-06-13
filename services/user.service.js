const User = require("../models/User");
const log = require("../logger");

// - - - - - - - - - - - - - - - - - - - - - - - - //

// common get func for all methods here
async function get(id) {
  try {
    return await User.findById(id);
  } catch (e) {
    throw new Error(`Error in <get> method of <User> service --> ${e.message}`);
  }
}

// common save func for all methods here
async function save(user) {
  try {
    log.info("Saving user", { userID: user._id });
    await user.save();
  } catch (e) {
    throw new Error(
      `Error in <save> method of <User> service --> ${e.message}`
    );
  }
}

// - - - - - - - - - - - - - - - - - - - - - - - - //

async function findOne(id) {
  try {
    return await get(id);
  } catch (e) {
    throw new Error(
      `Error in <findOne> method of <User> service --> ${e.message}`
    );
  }
}

async function create(id, username) {
  try {
    const user = new User({
      _id: id,
      tgUsername: username,
      checked: Date.now(),
      weeksCount: 0,
      paid: false,
    });

    await save(user);
  } catch (e) {
    throw new Error(
      `Error in <create> method of <User> service --> ${e.message}`
    );
  }
}

async function getRegistered(id) {
  try {
    log.info("Getting user registered", { user: id });

    const user = await get(id);
    return user.registered;
  } catch (e) {
    throw new Error(
      `Error in <registered> method of <User> service --> ${e.message}`
    );
  }
}

async function getPaid(id) {
  try {
    log.info("Getting user paid", { user: id });

    const user = await get(id);
    return Boolean(user.paid);
  } catch (e) {
    throw new Error(
      `Error in <getPaid> method of <User> service --> ${e.message}`
    );
  }
}

// - - - - - - - - - - - - - - - - - - - - - - - - //

async function setRegistered(id, value) {
  try {
    log.info("Updating user registered", { user: id, value });

    const user = await get(id);
    user.registered = value;
    await save(user);
  } catch (e) {
    throw new Error(
      `Error in <setRegistered> method of <User> service --> ${e.message}`
    );
  }
}

async function setPaid(id, value) {
  try {
    log.info("Updating user paid", { user: id, value });

    const user = await get(id);
    user.paid = value;
    await save(user);
  } catch (e) {
    throw new Error(
      `Error in <setPaid> method of <User> service --> ${e.message}`
    );
  }
}

async function setState(id, state) {
  try {
    log.info("Updating user state", { user: id, state });

    const user = await get(id);
    user.state = state;
    await save(user);
  } catch (e) {
    throw new Error(
      `Error in <setState> method of <User> service --> ${e.message}`
    );
  }
}

// - - - - - - - - - - - - - - - - - - - - - - - - //

async function setName(id, name) {
  try {
    log.info("Updating user name", { user: id, name });

    const user = await get(id);
    user.name = name;
    await save(user);
  } catch (e) {
    throw new Error(
      `Error in <setName> method of <User> service --> ${e.message}`
    );
  }
}

async function setSex(id, sex) {
  try {
    log.info("Updating user sex", { user: id, sex });

    const user = await get(id);
    // check for changed value
    if (user.sex !== sex) {
      user.sex = sex;

      if (user.registered) {
        user.calcCalories();
      }

      await save(user);
    }
  } catch (e) {
    throw new Error(
      `Error in <setSex> method of <User> service --> ${e.message}`
    );
  }
}

async function setHeight(id, height) {
  try {
    log.info("Updating user height", { user: id, height });

    const user = await get(id);
    user.height = height;

    if (user.registered) {
      user.calcCalories();
    }

    await save(user);
  } catch (e) {
    throw new Error(
      `Error in <setHeight> method of <User> service --> ${e.message}`
    );
  }
}

async function setAge(id, age) {
  try {
    log.info("Updating user age", { user: id, age });

    const user = await get(id);
    user.age = age;

    if (user.registered) {
      user.calcCalories();
    }

    await save(user);
  } catch (e) {
    throw new Error(
      `Error in <setAge> method of <User> service --> ${e.message}`
    );
  }
}

async function setActivity(id, activity) {
  try {
    log.info("Updating user activity", { user: id, activity });

    const user = await get(id);
    // check for changed value
    if (user.activity !== activity) {
      user.activity = activity;

      if (user.registered) {
        user.calcCalories();
      }

      await save(user);
    }
  } catch (e) {
    throw new Error(
      `Error in <setActivity> method of <User> service --> ${e.message}`
    );
  }
}

// - - - - - - - - - - - - - - - - - - - - - - - - //

async function setStartWeight(id, weight) {
  try {
    log.info("Updating user start weight", { user: id, weight });

    const user = await get(id);
    user.startWeight = weight;
    await save(user);
  } catch (e) {
    throw new Error(
      `Error in <setStartWeight> method of <User> service --> ${e.message}`
    );
  }
}

async function setCurrentWeight(id, weight) {
  try {
    log.info("Updating user current weight", { user: id, weight });

    const user = await get(id);
    user.currentWeight = weight;

    user.calcCalories();
    await save(user);
  } catch (e) {
    throw new Error(
      `Error in <setCurrentWeight> method of <User> service --> ${e.message}`
    );
  }
}

async function setTargetWeight(id, weight) {
  try {
    log.info("Updating user target weight", { user: id, weight });

    const user = await get(id);
    user.targetWeight = weight;
    await save(user);
  } catch (e) {
    throw new Error(
      `Error in <setTargetWeight> method of <User> service --> ${e.message}`
    );
  }
}

// - - - - - - - - - - - - - - - - - - - - - - - - //

async function setChestMeasure(id, measure) {
  try {
    log.info("Updating user chest measure", { user: id, measure });

    const user = await get(id);
    user.chestMeasure = measure;
    await save(user);
  } catch (e) {
    throw new Error(
      `Error in <setChestMeasure> method of <User> service --> ${e.message}`
    );
  }
}

async function setWaistMeasure(id, measure) {
  try {
    log.info("Updating user waist measure", { user: id, measure });

    const user = await get(id);
    user.waistMeasure = measure;
    await save(user);
  } catch (e) {
    throw new Error(
      `Error in <setWaistMeasure> method of <User> service --> ${e.message}`
    );
  }
}

async function setHipMeasure(id, measure) {
  try {
    log.info("Updating user hip measure", { user: id, measure });

    const user = await get(id);
    user.hipMeasure = measure;
    await save(user);
  } catch (e) {
    throw new Error(
      `Error in <setHipMeasure> method of <User> service --> ${e.message}`
    );
  }
}

// - - - - - - - - - - - - - - - - - - - - - - - - //

async function setMeals(id, meals) {
  try {
    log.info("Updating user meals per day", { user: id, meals });

    const user = await get(id);
    user.mealsPerDay = meals;
    await save(user);
  } catch (e) {
    throw new Error(
      `Error in <setMeals> method of <User> service --> ${e.message}`
    );
  }
}

// - - - - - - - - - - - - - - - - - - - - - - - - //

module.exports = {
  create,

  get: {
    object: findOne,
    registered: getRegistered,
    paid: getPaid,
  },

  set: {
    registered: setRegistered,
    paid: setPaid,
    state: setState,

    name: setName,
    sex: setSex,
    height: setHeight,
    age: setAge,
    activity: setActivity,

    weight: {
      start: setStartWeight,
      current: setCurrentWeight,
      target: setTargetWeight,
    },

    measure: {
      chest: setChestMeasure,
      waist: setWaistMeasure,
      hip: setHipMeasure,
    },

    meals: setMeals,
  },
};
