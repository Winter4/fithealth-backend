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
                startWeight: ctx.session.user.startWeight,
                targetWeight: ctx.session.user.targetWeight,
                height: ctx.session.user.height,
                age: ctx.session.user.age,
                activity: ctx.session.user.activity,

                measures: {
                    chest: ctx.session.user.measures.chest,
                    waist: ctx.session.user.measures.waist,
                    hip: ctx.session.user.measures.hip,
                }
            });
        }
        else {
            user = await this.getUserByID(userID);

            if (ctx.session.user.name) {    
                user.name = ctx.session.user.name;
            }
            else if (ctx.session.user.sex) {
                user.sex = ctx.session.user.sex;
            }
            else if (ctx.session.user.startWeight) {
                user.startWeight = ctx.session.user.startWeight;
            }
            else if (ctx.session.user.targetWeight) {
                user.targetWeight = ctx.session.user.targetWeight;
            }
            else if (ctx.session.user.height) {
                user.height = ctx.session.user.height;
            }
            else if (ctx.session.user.age) {
                user.age = ctx.session.user.age;
            }
            else if (ctx.session.user.activity) {
                user.activity = ctx.session.user.activity;
            }

            else if (ctx.session.user.measures) {

                if (ctx.session.user.measures.chest) {
                    user.measures.chest = ctx.session.user.measures.chest;
                }
                else if (ctx.session.user.measures.waist) {
                    user.measures.waist = ctx.session.user.measures.waist;
                }
                else if (ctx.session.user.measures.hip) {
                    user.measures.hip = ctx.session.user.measures.hip;
                }
            }
        }

        await user.save();
        ctx.scene.enter(scenes.id.menu.main);

    } catch (e) {
        console.log('Error on saving user from context: ' + e.message);
    }
};

module.exports.setUserState = async (id, state) => {
    await User.updateOne({ _id: id}, { state: state });
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