const mongoose = require('mongoose');

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
    weight: {
        type: Number,
        required: true,
        min: require('../scenes/setters/weight').limits.min,
        max: require('../scenes/setters/weight').limits.max,
    },
    height: {
        type: Number,
        required: true,
        min: require('../scenes/setters/height').limits.min,
        max: require('../scenes/setters/height').limits.max,
    },
    age: {
        type: Number,
        required: true,
        min: require('../scenes/setters/age').limits.min,
        max: require('../scenes/setters/age').limits.max,
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
    }
}, {versionKey: false, collection: 'users'} );

module.exports = mongoose.model('users', userSchema);