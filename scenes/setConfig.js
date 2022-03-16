const {Scenes} = require('telegraf');

const scenes = require('./scenes');

module.exports = async ctx => {
    ctx.session.user = {
        name: '',
        sex: '',
        age: 0,
    }

    await ctx.scene.enter(scenes.ID['setName']);
    ctx.reply('set1');
    //await ctx.scene.enter(scenes.ID['setSex']);
    //ctx.scene.enter(scenes.ID.setAge);
}