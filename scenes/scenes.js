const { requires } = require('./setters/require-belt');

module.exports.id = {
    setter: {
        name: "SET_NAME_SCENE",
        sex: "SET_SEX_SCENE",
        startWeight: 'SET_START_WEIGHT_SCENE',
        targetWeight: 'SET_TARGET_WEIGHT',
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
        changeData: {
            home:'CHANGE_DATA_SCENE',
            measures: 'CHANGE_MEASURES_SCENE',
            weights: 'CHANGE_WEIGHTS_SCENE',
        },
    },
};

// ______________________________________________

module.exports.object = {
    setter: {
        name: require('./setters/name'),
        sex: require('./setters/sex'),
        startWeight: require('./setters/startWeight').scene,
        targetWeight: require('./setters/targetWeight').scene,
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
        changeData: {
            home: require('./menu/changeData/home'),
            measures: require('./menu/changeData/measures'),
            weights: require('./menu/changeData/weights'),
        }
    },
};