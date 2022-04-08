const mongoose = require('mongoose');
const User = require('../models/user');

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
        throw new Error(`Error in <userRegisteredByID> of <database> file --> ${e.message}`);
    }
};

module.exports.userRegisteredByObject = async user => {
    try {
        return Boolean(user.registered);
    } catch (e) {
        throw new Error(`Error in <userRegisteredByObject> of <database> file --> ${e.message}`);
    }
};

module.exports.setUserState = async (id, state) => {
    try {
        await User.updateOne({ _id: id}, { state: state });
    } catch (e) {
        throw new Error(`Error in <setUserState> of <database> file --> ${e.message}`);
    }
};

module.exports.getUserByID = async id => {
    try {
        return await User.findById(id);
    } catch (e) {
        throw new Error(`Error in <getUserByID> of <database> file --> ${e.message}`);
    }
};

module.exports.userExists = async id => {
    try {
        return Boolean(await User.exists({_id: id}));
    } catch (e) {
        throw new Error(`Error in <userExists> of <database> file --> ${e.message}`);
    }
}