const downloadHandler = require("../handlers/downloadHandler");

module.exports = (bot) => {
  bot.onText(/\/dl (.+)/, async (msg, match) => {
    await downloadHandler(bot, msg.chat.id, match[1].trim(), msg.message_id);
  });
};
