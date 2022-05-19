const mongoose = require('mongoose');
const User = require('../models/user');
const { log } = require('../logger');

require('dotenv').config({ path: '../../.env' });

// ____________________________________________________________________________________

module.exports.connect = async () => {

    mongoose.connection.on('connecting', () => { 
        console.log('Connecting to MongoDB...');
        log.info('Connecting to MongoDB...');
    });
    mongoose.connection.on('error', err => { 
        console.log('Error on connecting to MongoDB', err);
        log.error('Connecting to MongoDB failed', { err });
    });
    mongoose.connection.on('connected', () => { 
        console.log('Connected to MongoDB');
        log.info('Connected to MongoDB');
    });

    const user = process.env.MONGO_USER;
    const pwd = process.env.MONGO_PWD;
    const host = process.env.MONGO_HOST;
    const db = process.env.MONGO_DB;
    const authSource = process.env.MONGO_AUTH_SOURCE;

    await mongoose.connect(`mongodb://${host}/${db}`, {
        authSource: authSource,
        user: user,
        pass: pwd,
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
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

module.exports.userPaid = async id => {
    try {
        const user = await User.findById(id);
        if (user && user.registered) return user.paid || false;
        else return true;
    } catch (e) {
        throw new Error(`Error in <userPaid> of <database> file --> ${e.message}`);
    }
};

module.exports.setUserPaid = async (id, value) => {
    try {
        await User.updateOne({ _id: id }, { paid: value });
    } catch (e) {
        throw new Error(`Error in <setUserPaid> of <database> file --> ${e.message}`);
    }
};