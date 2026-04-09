module.exports = (bot) => {
  bot.onText(/\/info/, (msg) => {
    const name = msg.from.first_name || "ᴜsᴇʀ";
    const userId = msg.from.id;
    const username = msg.from.username ? `@${msg.from.username}` : "ɴ/ᴀ";
    const lang = msg.from.language_code || "ɴ/ᴀ";

    bot.sendMessage(msg.chat.id,
`╔═════ 👤 ᴜsᴇʀ ɪɴғᴏ ═════╗

  ┃  👤 ɴᴀᴍᴇ     : ${name}
  ┃  🆔 ᴜsᴇʀ ɪᴅ  : ${userId}
  ┃  🌐 ᴜsᴇʀɴᴀᴍᴇ : ${username}
  ┃  🗣️ ʟᴀɴɢ     : ${lang}

╚═════════════════════╝
       ⚡ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴛᴀᴍɪᴹ`
    );
  });
};
