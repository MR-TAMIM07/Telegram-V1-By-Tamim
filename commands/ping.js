module.exports = (bot) => {
  bot.onText(/\/ping/, async (msg) => {
    const start = Date.now();
    const sent = await bot.sendMessage(msg.chat.id, `🏓 ᴘɪɴɢɪɴɢ...`);
    const ping = Date.now() - start;
    await bot.editMessageText(
`╔═════ 🏓 ᴘɪɴɢ ═════╗

  ┃  ⚡ sᴘᴇᴇᴅ  : ${ping}ᴍs
  ┃  ✅ sᴛᴀᴛᴜs : ᴏɴʟɪɴᴇ

╚══════════════════╝
       ᴛᴀᴍɪᴍ ʙᴏᴛ 🌸`,
      { chat_id: msg.chat.id, message_id: sent.message_id }
    );
  });
};
