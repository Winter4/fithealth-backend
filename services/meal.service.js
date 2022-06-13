const Meal = require("../models/Meal");
const log = require("../logger");

// - - - - - - - - - - - - - - - - - - - - - - - - //

async function getHealthyMeals() {
  try {
    log.info("Getting healhy meals");
    return await Meal.find({
      $or: [{ group: "proteins" }, { group: "fats" }, { group: "carbons" }],
    });
  } catch (e) {
    throw new Error(
      `Error in <getHealthyMeals> method of <Meal> service --> ${e.message}`
    );
  }
}

module.exports = {
  getHealthyMeals,
};
