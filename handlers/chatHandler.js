const axios = require("axios");
const { getBaseApiUrl } = require("../utils/api");
const { RANDOM_REPLIES, trackReply } = require("../utils/constants");

module.exports = async (bot, chatId, text, replyToId) => {
  try {
    const baseUrl = await getBaseApiUrl();
    
    const res = await axios.post(`${baseUrl}/api/hinata`, {
      text: text,
      style: 3,
      attachments: []
    }, { 
      timeout: 30000,
      headers: { "Content-Type": "application/json" }
    });
    
    const reply = res.data?.message || res.data?.reply || res.data?.response;
    if (!reply) {
      return bot.sendMessage(chatId, "ᴇʀʀᴏʀ ᴊᴀɴᴜ 🥹", { reply_to_message_id: replyToId });
    }

    const opts = replyToId ? { reply_to_message_id: replyToId } : {};
    const sent = await bot.sendMessage(chatId, reply, opts);
    trackReply(sent.message_id);

  } catch (err) {
    console.error("Chat error:", err.message);
    const opts = replyToId ? { reply_to_message_id: replyToId } : {};
    const fallback = RANDOM_REPLIES[Math.floor(Math.random() * RANDOM_REPLIES.length)];
    bot.sendMessage(chatId, fallback, opts);
  }
};
