
module.exports.id = {
    setter: {
        name: "SET_NAME_SCENE",
        sex: "SET_SEX_SCENE",
        height: 'SET_HEIGHT_SCENE',
        age: "SET_AGE_SCENE",
        activity: 'SET_ACTIVITY_SCENE',

        weight: {
            current: 'SET_CURRENT_WEIGHT_SCENE',
            target: 'SET_TARGET_WEIGHT',
        },

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
        },
    },
};

// ______________________________________________

module.exports.object = {
    setter: {
        name: require('./setters/name'),
        sex: require('./setters/sex'),
        height: require('./setters/height').scene,
        age: require('./setters/age').scene,
        activity: require('./setters/activity'),

        weight: {
            current: require('./setters/weights/current').scene,
            target: require('./setters/weights/target').scene,
        },

        measure: {
            chest: require('./setters/measures/chest').scene,
            waist: require('./setters/measures/waist').scene,
            hip: require('./setters/measures/hip').scene,
        }
    },

    menu: {
        main: require('./menu/main/home'),
        changeData: {
            home: require('./menu/changeData/home'),
        }
    },
};