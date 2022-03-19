module.exports.id = {
    setter: {
        name: "SET_NAME_SCENE",
        sex: "SET_SEX_SCENE",
        age: "SET_AGE_SCENE",
    },

    menu: {
        main: 'MAIN_MENU_SCENE',
        changeData: 'CHANGE_DATA_SCENE',
    },
};

module.exports.object = {
    setter: {
        name: require('./setters/name'),
        sex: require('./setters/sex'),
        age: require('./setters/age'),
    },

    menu: {
        main: require('./menu/main'),
        changeData: require('./menu/changeData'),
    },
};