module.exports.ID = {
    welcome:  "WELCOME_SCENE",

    setter: {
        setName: "SET_NAME_SCENE",
        setSex: "SET_SEX_SCENE",
        setAge: "SET_AGE_SCENE",
    },

    menu: {
        main: 'MAIN_MENU_SCENE',
    },
};

module.exports.Object = {
    welcome:  require('./welcome'),

    setter: {
        setName: require('./setters/setName'),
        setSex: require('./setters/setSex').scene,
        setAge: require('./setters/setAge'),
    },

    menu: {
        main: require('./menu/main'),
    },
};