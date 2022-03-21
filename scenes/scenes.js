module.exports.id = {
    setter: {
        name: "SET_NAME_SCENE",
        sex: "SET_SEX_SCENE",
        weight: 'SET_WEIGHT_SCENE',
        height: 'SET_HEIGHT_SCENE',
        age: "SET_AGE_SCENE",
        activity: 'SET_ACTIVITY_SCENE',

        measure: {
            chest: 'SET_CHEST_MEASURE_SCENE',
            waist: 'SET_WAIST_MEASURE_SCENE',
            hip: 'SET_HIP_MEASURE_SCENE',
        }
    },

    menu: {
        main: 'MAIN_MENU_SCENE',
        changeData: 'CHANGE_DATA_SCENE',
    },
};

// ______________________________________________

module.exports.object = {
    setter: {
        name: require('./setters/name'),
        sex: require('./setters/sex'),
        weight: require('./setters/weight').scene,
        height: require('./setters/height').scene,
        age: require('./setters/age').scene,
        activity: require('./setters/activity'),

        measure: {
            chest: require('./setters/measures/chest').scene,
            waist: require('./setters/measures/waist').scene,
            hip: require('./setters/measures/hip').scene,
        }
    },

    menu: {
        main: require('./menu/main'),
        changeData: require('./menu/changeData'),
    },
};