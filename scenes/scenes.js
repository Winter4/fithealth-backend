module.exports.ID = {
    'welcome':  "WELCOME_SCENE",
    'setName': "SET_NAME_SCENE",
    'setSex': "SET_SEX_SCENE",
    'setAge': "SET_AGE_SCENE",
};

module.exports.Object = {
    'welcome':  require('./welcome'),
    'setName': require('./setName'),
    'setSex': require('./setSex').scene,
    'setAge': require('./setAge'),
};