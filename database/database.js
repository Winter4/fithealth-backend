const mongoose = require('mongoose');
const User = require('../models/user');
const { log } = require('../logger');

require('dotenv').config({ path: '../../.env' });

// ____________________________________________________________________________________

module.exports.connect = async () => {
    await mongoose.connect(process.env.MONGO_URL, () => { console.log('Connected to DB'); log.info('Connected to DB') });
}

// __________________________________________________________________

// returns false, if db-record doesn't have all the necessary data
module.exports.userRegisteredByID = async id => {
    try {
        const user = await User.findById(id);
        return Boolean(user && user.registered);
    } catch (e) {
        throw new Error(`Error in <userRegisteredByID> of <database> file --> ${e.message}`);
    }
};

// returns false, if db-record doesn't have all the necessary data
module.exports.userRegisteredByObject = user => {
    try {
        return Boolean(user.registered);
    } catch (e) {
        throw new Error(`Error in <userRegisteredByObject> of <database> file --> ${e.message}`);
    }
};

// set user state (scene)
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
};

// updates the user 'checked' field, if it's the time
// to update his data 
module.exports.userCheckedIn = async id => {
    try {
        const user = await User.findById(id);
        if (!user) return;
        if (!user.registered) return;

        let interval = process.env.CHECKIN_INTERVAL;
        // statement is false means it's the time to checkIn and user isn't checked -> return false
        if (Date.now() - user.checked.date > interval) 
            user.checked.bool = false;

        await user.save();
    } catch (e) {
        throw new Error(`Error in <userCheckedIn> of <database> file --> ${e.message}`);
    }
};