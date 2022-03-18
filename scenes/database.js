const { Scenes } = require("telegraf");
const scenes = require('./scenes');
const db = require('../database/database');

const databaseScene = new Scenes.BaseScene(scenes.id.database);

databaseScene.enter(ctx => {

    if (ctx.session.setConfig) 
        db.saveUser(
            ctx.session.user._id,
            ctx.session.user.name,
            ctx.session.user.sex,
            ctx.session.user.age,
        );

    return ctx.scene.enter(scenes.id.menu.main);
});

module.exports = databaseScene;