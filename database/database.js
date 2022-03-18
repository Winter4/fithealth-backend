const mongoose = require('mongoose');
const User = require('../models/user');

module.exports.connect = async () => {
    await mongoose.connect(process.env.MONGO_URL, () => console.log('Connected to DB'));
}

// saves new user
module.exports.saveUser = async (id, name, sex, age) => {
    try {
        const newUser = new User({
            _id: id,
            name: name, 
            sex: sex, 
            age: age,
        });
        await newUser.save();
    } catch (e) {
        console.log('Error on saving user: ' + e);
    }
};