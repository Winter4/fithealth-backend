const mongoose = require('mongoose');

// _____________________________________

// ATTENTION: if changing this, also change
//            same limits in /scenes/setters/scene_name
// i couldn't make it run importing these const from the /scenes/setters/scene_name
const weightLimits = { min: 40, max: 200 };
const heightLimits = { min: 120, max: 230 };
const ageLimits = { min: 13, max: 80 };

const measureLimits = { min: 20, max: 200 };

// _____________________________________

const userSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    tgUsername: {
        type: String,
    },
    name: {
        type: String,
    },
    sex: {
        type: String,
        enum: [
            'Мужской',
            'Женский',
        ]
    },
    startWeight: {
        type: Number,
        min: weightLimits.min,
        max: weightLimits.max,
    },
    currentWeight: {
        type: Number,
        min: weightLimits.min,
        max: weightLimits.max,
    },
    targetWeight: {
        type: Number,
        min: weightLimits.min,
        max: weightLimits.max,
    },
    height: {
        type: Number,
        min: heightLimits.min,
        max: heightLimits.max,
    },
    age: {
        type: Number,
        min: ageLimits.min,
        max: ageLimits.max,
    },
    activity: {
        type: Number,
    },
    caloriesToLose: {
        type: Number,
    },
    chestMeasure: {
        type: Number,
        min: measureLimits.min,
        max: measureLimits.max,
    },
    waistMeasure: {
        type: Number,
        min: measureLimits.min,
        max: measureLimits.max,
    },
    hipMeasure: {
        type: Number,
        min: measureLimits.min,
        max: measureLimits.max,
    },

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
    checkedIn: Boolean,
    mealsPerDay: Number,

}, {versionKey: false, collection: 'users'} );

userSchema.pre('save', function() {
    this.updated = Date.now();
});

userSchema.methods.calcCalories = function() {
    try {
        const sexParam = this.sex == 'Мужской' ? 5 : -161;
        let basicCaloricIntake =
            10 * this.currentWeight +
            6.25 * this.height -
            5 * this.age +
            sexParam
        ;
        basicCaloricIntake *= this.activity;

        this.caloriesToLose = (basicCaloricIntake * 0.9).toFixed();
    } catch (e) {
        throw new Error(`Error in <userSchema.calcCalories> of <models/user> file --> ${e.message}`);
    }
};

module.exports = mongoose.model('user', userSchema);
