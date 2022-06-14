const { Composer } = require("telegraf");

const User = require("../services/user.service");

const command = new Composer();

// - - - - - - - - - - - - - - - - - - - - - - - - //

command.command("notify", async (ctx) => {
  try {
    const value = await User.notify(ctx.chat.id);
    let text = "Статус уведомлений: ";
    text += value ? "<b>включено</b>" : "<b>выключено</b>";

    return ctx.replyWithHTML(text);
  } catch (e) {
    throw new Error(`Error in <notify> command --> ${e.message}`);
  }
});

module.exports = command;
