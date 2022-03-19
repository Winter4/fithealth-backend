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
    age: {
        type: Number,
        required: true,
        min: 13,
        max: 100
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