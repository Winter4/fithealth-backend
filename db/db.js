const mongoose = require('mongoose');
const User = require('../models/user').user;

module.exports.connect = async () => {
    await mongoose.connect(process.env.MONGO_URL, () => console.log('Connected to DB'));
}