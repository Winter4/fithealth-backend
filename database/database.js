const mongoose = require('mongoose');
const User = require('../models/user');

const scenes = require('../scenes/scenes');

// ____________________________________________________________________________________

module.exports.connect = async () => {
    await mongoose.connect(process.env.MONGO_URL, () => console.log('Connected to DB'));
}

// __________________________________________________________________

// returns false, if db-record doesn't have all the necessary data
module.exports.userRegisteredByID = async id => {
    try {
        const user = await User.findById(id);

        return Boolean(user.registered);

    } catch (e) {
        let newErr = new Error(`Error in userRegistered: ${e.message}`);
        throw newErr;
    }
};

module.exports.userRegisteredByObject = async user => {
    try {
        return Boolean(user.registered);

    } catch (e) {
        let newErr = new Error(`Error in userRegistered: ${e.message}`);
        throw newErr;
    }
};

module.exports.setUserState = async (id, state) => {
    try {
        await User.updateOne({ _id: id}, { state: state });
    } catch (e) {
        let newErr = new Error(`Error in setUserState: ${e.message}`);
        throw newErr;
    }
};

module.exports.getUserByID = async id => {
    try {
        return await User.findById(id);
    } catch (e) {
        let newErr = new Error(`Error in getUserByID: ${e.message}`);
        throw newErr;
    }
};

module.exports.userExists = async id => {
    try {
        return Boolean(await User.exists({_id: id}));
    } catch (e) {
        let newErr = new Error(`Error in userExists: ${e.message}`);
        throw newErr;
    }
}