const mongoose = require('mongoose');
const User = require('../models/user');

const scenes = require('../scenes/scenes');

// ____________________________________________________________________________________

module.exports.connect = async () => {
    await mongoose.connect(process.env.MONGO_URL, () => console.log('Connected to DB'));
}

// saves new/updates existing user
module.exports.saveUserFromContext = async ctx => {
    try {
        const userID = ctx.message.from.id;
        let user = {};

        if (ctx.session.setConfig) {
            user = new User({
                _id: userID,
                name: ctx.session.user.name,
                sex: ctx.session.user.sex,
                weight: ctx.session.user.weight,
                height: ctx.session.user.height,
                age: ctx.session.user.age,
            });
        }
        else {
            user = await this.getUserByID(userID);

            if (ctx.session.user.name) {    
                user.name = ctx.session.user.name;
            }
            if (ctx.session.user.sex) {
                user.sex = ctx.session.user.sex;
            }
            if (ctx.session.user.weight) {
                user.weight = ctx.session.user.weight;
            }
            if (ctx.session.user.height) {
                user.height = ctx.session.user.height;
            }
            if (ctx.session.user.age) {
                user.age = ctx.session.user.age;
            }
        }

        await user.save();
        ctx.scene.enter(scenes.id.menu.main);
    } catch (e) {
        console.log('Error on saving user from context: ' + e.message);
    }
};

module.exports.updateUser = async (id, name) => {

    try {
        let user = await this.getUserByID(id);
        user.name = name;
        user.save();
    } catch (e) {
        console.log(e.message);
    }
};

module.exports.getUserByID = async id => {
    try {
        return await User.findById(id);
    } catch (e) {
        console.log('Error on getting user data: ' + e.message);
    }
};

module.exports.userExists = async id => {
    try {
        return Boolean(await User.exists({_id: id}));
    } catch (e) {
        console.log(e.message);
    }
}