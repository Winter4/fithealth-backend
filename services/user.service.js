const mongoose = require("mongoose");
const User = require("../models/User");
const log = require("../logger");

// - - - - - - - - - - - - - - - - - - - - - - - - //

async function get(id) {
  try {
    log.info("Finding one user", { user: id });
    return await User.findById(id);
  } catch (e) {
    throw new Error(`Error in <get> method of <User> service --> ${e.message}`);
  }
}

async function save(user) {
  try {
    log.info("Saving user", { userID: user._id });
    await user.save();
  } catch (e) {
    throw new Error(
      `Error in <save> method of <User> service --> ${e.message}`
    );
  }
}

// - - - - - - - - - - - - - - - - - - - - - - - - //

async function findOne(id) {
  try {
    return await get(id);
  } catch (e) {
    throw new Error(
      `Error in <findOne> method of <User> service --> ${e.message}`
    );
  }
}

async function create(id, username) {
  try {
    const user = new User({
      _id: id,
      tgUsername: username,
      checked: Date.now(),
      weeksCount: 0,
    });

    await save(user);
  } catch (e) {
    throw new Error(
      `Error in <create> method of <User> service --> ${e.message}`
    );
  }
}

async function registered(id) {
  try {
    log.info("Getting user registered", { user: id });

    const user = await get(id);
    return user.registered;
  } catch (e) {
    throw new Error(
      `Error in <registered> method of <User> service --> ${e.message}`
    );
  }
}

async function setState(id, state) {
  try {
    log.info("Updating user state", { user: id, state });

    const user = await get(id);
    user.state = state;
    await save(user);
  } catch (e) {
    throw new Error(
      `Error in <setState> method of <User> service --> ${e.message}`
    );
  }
}

async function setName(id, name) {
  try {
    log.info("Updating user name", { user: id, name });

    const user = await get(id);
    user.name = name;
    await save(user);
  } catch (e) {
    throw new Error(
      `Error in <setName> method of <User> service --> ${e.message}`
    );
  }
}

module.exports = {
  findOne,
  create,
  registered,

  set: {
    state: setState,
    name: setName,
  },
};
