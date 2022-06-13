const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    _id: {
      type: Number,
      required: true,
    },
    tgUsername: String,

    name: String,
    sex: String,

    startWeight: Number,
    currentWeight: Number,
    targetWeight: Number,

    height: Number,
    age: Number,
    activity: Number,

    caloriesToLose: Number,

    chestMeasure: Number,
    waistMeasure: Number,
    hipMeasure: Number,

    created: {
      type: Date,
      required: true,
      immutable: true,
      default: () => Date.now(),
    },
    updated: {
      type: Date,
      required: true,
      default: () => Date.now(),
    },

    state: String,
    registered: Boolean,

    paid: Boolean,
    checked: Number,

    mealsPerDay: Number,
    weeksCount: Number,
  },
  { versionKey: false, collection: "users" }
);

userSchema.pre("save", function () {
  this.updated = Date.now();
});

// calcs the calories number the user should eat
// per day to loose his weight
userSchema.methods.calcCalories = function () {
  try {
    const sexParam = this.sex == "Мужской" ? 5 : -161;
    let basicCaloricIntake =
      10 * this.currentWeight + 6.25 * this.height - 5 * this.age + sexParam;

    basicCaloricIntake *= this.activity;

    this.caloriesToLose = basicCaloricIntake * (1 - this.weeksCount * 0.1);
    this.caloriesToLose = this.caloriesToLose.toFixed();
  } catch (e) {
    throw new Error(
      `Error in <userSchema.calcCalories> of <models/user> file --> ${e.message}`
    );
  }
};

module.exports = mongoose.model("user", userSchema);
