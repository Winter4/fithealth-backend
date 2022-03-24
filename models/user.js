const mongoose = require('mongoose');

// _____________________________________

// ATTENTION: if changing this, also change
//            same limits in /scenes/setters/scene_name
// i couldn't make it run importing these const from the /scenes/setters/scene_name
const weightLimits = { min: 40, max: 200 };
const heightLimits = { min: 120, max: 230 };
const ageLimits = { min: 13, max: 100 };

const measureLimits = { min: 20, max: 200 };

// _____________________________________

const userSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    sex: {
        type: String,
        required: true,
        enum: [
            'Мужской',
            'Женский',
        ]
    },
    startWeight: {
        type: Number,
        required: true,
        min: weightLimits.min,
        max: weightLimits.max,
    },
    targetWeight: {
        type: Number,
        required: true,
        min: weightLimits.min,
        max: weightLimits.max,
    },
    height: {
        type: Number,
        required: true,
        min: heightLimits.min,
        max: heightLimits.max,
    },
    age: {
        type: Number,
        required: true,
        min: ageLimits.min,
        max: ageLimits.max,
    },
    activity: {
        type: Number,
        required: true,
    },
    measures: {
        chest: {
            type: Number,
            required: true,
            min: measureLimits.min,
            max: measureLimits.max,
        },
        waist: {
            type: Number,
            required: true,
            min: measureLimits.min,
            max: measureLimits.max,
        },
        hip: {
            type: Number,
            required: true,
            min: measureLimits.min,
            max: measureLimits.max,
        },
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
}, {versionKey: false, collection: 'users'} );

module.exports = mongoose.model('users', userSchema);