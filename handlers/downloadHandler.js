const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { pipeline } = require("stream");
const { promisify } = require("util");
const streamPipeline = promisify(pipeline);
const botConfig = require("../config/botConfig");
const { detectPlatform, isVideoLink } = require("../utils/helpers");

module.exports = async (bot, chatId, url, replyToId) => {
  if (!isVideoLink(url)) {
    return bot.sendMessage(chatId,
      `❌ ᴜɴsᴜᴘᴘᴏʀᴛᴇᴅ ʟɪɴᴋ!\nᴘʟᴀᴛғᴏʀᴍs: ʏᴏᴜᴛᴜʙᴇ, ғᴀᴄᴇʙᴏᴏᴋ, ᴛɪᴋᴛᴏᴋ, ɪɴsᴛᴀɢʀᴀᴍ, ᴛᴡɪᴛᴛᴇʀ, sᴘᴏᴛɪғʏ & ᴍᴏʀᴇ`,
      { reply_to_message_id: replyToId }
    );
  }

  const platform = detectPlatform(url);
  const loading = await bot.sendMessage(chatId,
    `♻️ ᴅᴏᴡɴʟᴏᴀᴅɪɴɢ...\nᴘʟᴀᴛғᴏʀᴍ: ${platform}`,
    { reply_to_message_id: replyToId }
  );

  const isAudio = url.includes("spotify") || url.includes("soundcloud");
  const ext = isAudio ? "mp3" : "mp4";
  const filePath = path.join("/tmp", `tamim_${Date.now()}.${ext}`);

  try {
    const apiRes = await axios.get(botConfig.DOWNLOAD_API, {
      params: { url },
      timeout: 30000,
      headers: { "User-Agent": "Mozilla/5.0" }
    });
    const data = apiRes.data;

    let mediaURL = data.high_quality || data.url || 
                   (data.result && data.result.url) || 
                   (data.data && data.data.url) ||
                   data.media || data.video || data.audio || data.link;

    if (!mediaURL && data.formats && Array.isArray(data.formats)) {
      const best = data.formats.find(f => f.quality === "high" || f.quality === "hd") || data.formats[0];
      if (best) mediaURL = best.url;
    }

    if (!mediaURL) {
      await bot.deleteMessage(chatId, loading.message_id).catch(() => {});
      return bot.sendMessage(chatId, `⚠️ ᴄᴏᴜʟᴅ ɴᴏᴛ ᴇxᴛʀᴀᴄᴛ ᴜʀʟ!`);
    }

    const fileRes = await axios({
      method: "get",
      url: mediaURL,
      responseType: "stream",
      headers: { "User-Agent": "Mozilla/5.0" },
      timeout: 120000
    });

    const writer = fs.createWriteStream(filePath);
    await streamPipeline(fileRes.data, writer);

    const title = data.title || data.caption || data.name || platform;
    const filesize = (fs.statSync(filePath).size / (1024 * 1024)).toFixed(2);

    await bot.deleteMessage(chatId, loading.message_id).catch(() => {});

    const caption =
`╭─ 🎀 ᴅᴏᴡɴʟᴏᴀᴅ ᴄᴏᴍᴘʟᴇᴛᴇ ─╮
│
│ 📌 ᴛɪᴛʟᴇ    : ${title}
│ 🌐 ᴘʟᴀᴛғᴏʀᴍ : ${platform}
│ 📦 ᴛʏᴘᴇ     : ${isAudio ? "ᴀᴜᴅɪᴏ 🎧" : "ᴠɪᴅᴇᴏ 🎬"}
│ 💾 sɪᴢᴇ     : ${filesize} ᴍʙ
│ ✅ sᴛᴀᴛᴜs   : sᴜᴄᴄᴇss
│
│ ✨ ᴇɴᴊᴏʏ ʏᴏᴜʀ ᴍᴇᴅɪᴀ ʙᴀʙʏ 🐥
│
╰─────────────────────╯
♡— ᴛᴀᴍɪᴍ ⸙`;

    const sendOptions = { caption, reply_to_message_id: replyToId };

    if (isAudio) {
      await bot.sendAudio(chatId, filePath, sendOptions);
    } else {
      await bot.sendVideo(chatId, filePath, { ...sendOptions, supports_streaming: true });
    }

    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

  } catch (err) {
    console.error("Download error:", err.message);
    await bot.deleteMessage(chatId, loading.message_id).catch(() => {});
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    bot.sendMessage(chatId, `❌ ᴅᴏᴡɴʟᴏᴀᴅ ғᴀɪʟᴇᴅ!\n${err.message.slice(0, 200)}`, { reply_to_message_id: replyToId });
  }
};
