module.exports.id = {
    welcome:  "WELCOME_SCENE",
    database: 'DATABASE_SCENE',

    setter: {
        setName: "SET_NAME_SCENE",
        setSex: "SET_SEX_SCENE",
        setAge: "SET_AGE_SCENE",
    },

    menu: {
        main: 'MAIN_MENU_SCENE',
    },
};

module.exports.object = {
    welcome:  require('./welcome'),
    database: require('./database'),

    setter: {
        setName: require('./setters/setName'),
        setSex: require('./setters/setSex'),
        setAge: require('./setters/setAge'),
    },

    menu: {
        main: require('./menu/main'),
    },
};