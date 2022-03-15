const {Scenes} = require('telegraf');

const scenes = require('./scenes');

module.exports = ctx => {
    ctx.scene.enter(scenes.ID['setName']);
    ctx.scene.enter(scenes.ID['setSex']);
}