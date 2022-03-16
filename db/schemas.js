const mongoose = require('mongoose');

const Sex = require('../scenes/setSex').sex;

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    sex: {
        type: Sex,
        required: true,
    },
});