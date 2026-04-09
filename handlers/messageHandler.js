const { isVideoLink } = require("../utils/helpers");
const { BABY_TRIGGERS, RANDOM_REPLIES, replyMap, trackReply } = require("../utils/constants");
const downloadHandler = require("./downloadHandler");
const chatHandler = require("./chatHandler");

module.exports = async (bot, msg) => {
  const text = msg.text || "";
  if (!text || text.startsWith("/")) return;

  const lower = text.toLowerCase().trim();
  const urlMatch = text.match(/https?:\/\/[^\s]+/);

  // Video link check
  if (urlMatch && isVideoLink(urlMatch[0])) {
    await downloadHandler(bot, msg.chat.id, urlMatch[0], msg.message_id);
    return;
  }

  // Reply to bot message
  if (msg.reply_to_message && replyMap.has(msg.reply_to_message.message_id)) {
    await chatHandler(bot, msg.chat.id, lower || "meow", msg.message_id);
    return;
  }

  // Baby trigger word
  const matchedTrigger = BABY_TRIGGERS.find(w => lower.startsWith(w));
  if (matchedTrigger) {
    const afterTrigger = lower.substring(matchedTrigger.length).trim();
    if (!afterTrigger) {
      const reply = RANDOM_REPLIES[Math.floor(Math.random() * RANDOM_REPLIES.length)];
      const sent = await bot.sendMessage(msg.chat.id, reply, {
        reply_to_message_id: msg.message_id
      });
      trackReply(sent.message_id);
    } else {
      await chatHandler(bot, msg.chat.id, afterTrigger, msg.message_id);
    }
  }
};
