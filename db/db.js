const mongoose = require('mongoose');
const { Context } = require('telegraf');
const User = require('./schemas').user;

module.exports.connect = async () => {
    await mongoose.connect(process.env.MONGO_URL, () => console.log('Connected to DB'));
}

module.exports.sendUser = (name, sex, age) => {
    const user = new User({name, sex, age});
    return user.save();
}