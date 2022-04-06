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
        type: String,
        required: true,
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

}, {versionKey: false, collection: 'users'} );



module.exports = mongoose.model('user', userSchema);