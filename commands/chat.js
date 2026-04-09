const chatHandler = require("../handlers/chatHandler");

module.exports = (bot) => {
  bot.onText(/\/chat (.+)/, async (msg, match) => {
    await chatHandler(bot, msg.chat.id, match[1].trim(), msg.message_id);
  });
};
