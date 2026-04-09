module.exports = (bot) => {
  bot.onText(/\/start/, async (msg) => {
    const name = msg.from.first_name || "ᴜsᴇʀ";
    const userId = msg.from.id;
    const username = msg.from.username ? `@${msg.from.username}` : "ɴ/ᴀ";

    const welcomeMsg = 
`╭━━━━❰ ᴛᴀᴍɪᴍ ʙᴏᴛ ❱━━━━➣
┃
┃  👋 ʜᴇʟʟᴏ, ${name}!
┃  ᴡᴇʟᴄᴏᴍᴇ ᴛᴏ ᴛʜᴇ ᴍᴏsᴛ
┃  ᴘᴏᴡᴇʀғᴜʟ ᴍᴇᴅɪᴀ ʙᴏᴛ.
┃
┃  ┏━━━━━━━━━━━━━━━━━━┓
┃  ┃  👤 ᴜsᴇʀ: ${name}
┃  ┃  🆔 ɪᴅ: ${userId}
┃  ┃  🌐 ᴜsᴇʀɴᴀᴍᴇ: ${username}
┃  ┗━━━━━━━━━━━━━━━━━━┛
┃
┃  ✨ ɪ ᴄᴀɴ ᴅᴏᴡɴʟᴏᴀᴅ ᴠɪᴅᴇᴏs ғʀᴏᴍ
┃  ғᴀᴄᴇʙᴏᴏᴋ, ʏᴛ, ᴛɪᴋᴛᴏᴋ & ᴍᴏʀᴇ!
┃
┃  💬 ᴀʟsᴏ, ɪ ᴄᴀɴ ᴄʜᴀᴛ ʟɪᴋᴇ ᴀ ʙᴀʙʏ.
┃  ᴛʏᴘᴇ /help ᴛᴏ sᴇᴇ ᴍʏ ᴘᴏᴡᴇʀ.
┃
┃  🔗 ᴛ.ᴍᴇ/ɪᴛsᴍᴇᴛᴀᴍɪᴍ404
╰━━━━━━━━━━━━━━━━━━━━━➣
       © ᴍᴀᴅᴇ ʙʏ ᴛᴀᴍɪᴍ`;

    await bot.sendMessage(msg.chat.id, welcomeMsg);
  });
};
